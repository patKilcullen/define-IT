import React, { useEffect, useState, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";

// SLICES/STATE REDUCERS
import {
  getWord,
  setWordState,
  getDefinition,
  getFakeWords,
  clearFakeDefs,
  clearFakeWords,
  addDefinition,
  clearTempScoreCardMessages,
  addRealDefinition,
} from "../../redux/gameplay.js";
import { addNewWord } from "../../redux/words";
import { selectMe } from "../../redux/auth";
import { selectSingleGame } from "../../redux/singleGame.js";
// import { testAIFunc } from "./openAISlice";

// Components
import Timer from "./Timer";
import CardFront from "../CardFront.js";
import Buttons from "../../Buttons.js";

// SOCKET
import { SocketContext } from "../../socketProvider";
import { UserContext } from "../../UserContext.js";

import { ref, set, onValue } from "firebase/database";
import { RealTimeDB } from "../../Firebase/FirebaseConfig.js";

import { balderdashWords } from "../../Words.js";

const GamePlay = ({
  setReloadFlip,
  reloadFlip,
  userId,
  game,
  userScore,
  reloadScores,
  checkIfTied,
}) => {
  const dispatch = useDispatch();
  const me = useSelector(selectMe);

  const gameName = game.name;
  const { user } = useContext(UserContext);
  const username = user.displayName;

  // Component state
  const [word, setWord] = useState("");
  const [definition, setDefinition] = useState("");
  const [timer, setTimer] = useState(false);
  const [choseWord, setChoseWord] = useState(false);
  const [playerTurn, setPlayerTurn] = useState("");
  const [playerTurnName, setPlayerTurnName] = useState("");
  const [flip, setFlip] = useState(false);
  const [wordToDb, setWordToDb] = useState(false);
  const [moveOffScreen, setMoveOffScreen] = useState(false);
  const [flipSide, setFlipSide] = useState("back");

//   GET PLAYERS TURN NUMBER
  useEffect(() => {
    if (game && game.scores) {
      setPlayerTurn(game.scores.filter((score) => score.turnNum === game.turn));
    }
    if (playerTurn) {
      setPlayerTurnName(playerTurn[0].user.username);
    }
  }, []);

// GET WORD
  const handleGetWord = () => {
    word ? setMoveOffScreen(true) : null;
    word ? setFlip(false) : null;

    setTimeout(
      () => {
        word ? setMoveOffScreen(false) : null;
        setFlipSide("back");

        setTimeout(
          () => {
            setFlip(true);
            setFlipSide("front");
          },
          word ? 500 : 0
        );
      },
      word ? 1000 : 0
    );

    dispatch(clearFakeDefs());
    dispatch(clearTempScoreCardMessages());

    let newWord =
      balderdashWords[Math.floor(Math.random() * balderdashWords.length)];

    setWord(newWord?.word);
    setDefinition(newWord.definition);
    dispatch(addDefinition({ real: newWord.definition }));
    setFlipSide("front");
    setWordToDb(false);
  };

  // GET FAKE WORDS   called in handleChooseWord function,
  // clears fake words from last round, then gets 5 fake words
  const handleGetFakeWords = () => {
    dispatch(clearFakeWords());
    let count = 0;
    while (count < 5) {
      dispatch(getFakeWords());
      count++;
    }
  };


  const handleChooseWord = () => {
    dispatch(addRealDefinition(definition));
    handleGetFakeWords();
    set(ref(RealTimeDB, `games/${gameName}/word`), {
      word: word,
      definition: definition,
      room: game.name,
      playerTurnName: user.displayName,
    });
    setTimer(true);
    setChoseWord(true);
  };

  useEffect(() => {
    const wordRef = ref(RealTimeDB, `games/${gameName}/word`);
    const countdownRef = ref(RealTimeDB, `games/${gameName}/countdown`);
    const fakeDefRef = ref(
      RealTimeDB,
      `games/${gameName}/fake_player_definition`
    );

    //   const dispatch = useDispatch();

    // Listen for word data (receive_word)
    const wordListener = onValue(wordRef, (snapshot) => {
      const data = snapshot.val();

      if (data && data.playerTurnName !== username && data.room === gameName) {
        dispatch(setWordState(data?.word || ""));
        dispatch(addRealDefinition(data.definition));
        setPlayerTurnName(data.playerTurnName);
        setWord(data.word);
        setFlip(true);
        setFlipSide("front");
      }
    });

    // Listen for countdown start (receive_start_countdown)
    const countdownListener = onValue(countdownRef, (snapshot) => {
      const room = snapshot.val();
      console.log("CountDOEN: ", room, gameName);
      setTimer(room === gameName);
    });

    // Listen for player fake definitions (receive_player_fake_def)
    const fakeDefListener = onValue(fakeDefRef, (snapshot) => {
      const data = snapshot.val();

      if (data && data.room === gameName && data.playerTurnName === username) {
        dispatch(addDefinition({ [data.userId]: data.playerDef }));
      }
    });

    // Cleanup function to unsubscribe listeners on unmount
    return () => {
      wordListener();
      countdownListener();
      fakeDefListener();
    };
  }, [
    gameName,
    username,
    dispatch,
    setPlayerTurnName,
    setWord,
    setFlip,
    setFlipSide,
    setTimer,
  ]);

  const [bottomCard, setBottomCard] = useState(
    game && userScore && game.turn === userScore.turnNum ? false : true
  );

  useEffect(() => {
    game && userScore && game.turn === userScore.turnNum
      ? setBottomCard(false)
      : setBottomCard(true);
  }, [reloadScores]);

  useEffect(() => {
    !word ? setFlipSide("back") : null;
    !word ? setFlip(false) : null;
    setReloadFlip(false);
  }, [reloadFlip]);

  const handleTestFuncCall = () => {
    // dispatch(testAIFunc({ word, definition })).then((res) => {});
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Get Word Button - only visible if it's the player's turn */}
        {game && userScore && game.turn === userScore.turnNum ? (
          <Buttons
            name={!word ? "Get Word" : "Get Another Word"}
            func={handleGetWord}
            pulse={!word || !word.length ? "pulse" : null}
          />
        ) : null}

        {/* Main Card Component */}
        <View style={styles.cardContainer}>
          {/* <CardFront notReverse={true} side={"back"} baseCard={true} /> */}

          {/* Card Flipping Info */}
          {/* <CardFront
            moveOffScreen={moveOffScreen}
            flip={!flip}
            side={"back"}
            bottomCard={bottomCard}
          top={null}
          /> */}
          {/* <CardFront
            moveOffScreen={moveOffScreen}
            checkIfTied={checkIfTied}
            top={word || ""}
            bottom={definition}
            side={flipSide}
            flip={flip}
            timer={timer}
            game={game}
            username={username}
            userId={userId}
            userScore={userScore}
            gameName={gameName}
            gameId={game.id}
            playerTurnName={playerTurnName}
            definition={definition}
            reloadScores={reloadScores}
            setDefinition={setDefinition}
            setWord={setWord}
            setTimer={setTimer}
            setChoseWord={setChoseWord}
            flippable={true}
            //
            def={definition}
            handleChooseWord={handleChooseWord}
          /> */}
          <CardFront
            title={{first: "Balder", second: "Dash"}}
          />
        </View>

        {/* Choose Word Button */}
        {definition && !choseWord ? (
          <Buttons
            name={"Choose Word"}
            func={handleChooseWord}
            pulse={"pulse"}
          />
        ) : null}

        {/* Add New Word/Definition to Database */}
        {/* {definition && !choseWord && wordToDb === false ? (
          <Buttons
            name={"Add word to database"}
            func={handleAddNewWord}
            pulse={"pulse"}
          />
        ) : null}

        {definition && !choseWord ? (
          <Buttons
            name={"TEST OPENAI FUNC CALL"}
            func={handleTestFuncCall}
            pulse={"pulse"}
          />
        ) : null} */}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cardContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
});

export default GamePlay;
