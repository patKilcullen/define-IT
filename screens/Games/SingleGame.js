import React, { useEffect, useContext, useState, useRef, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRoute, useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";

// SLICES/STATE REDUCERS
import {
  selectSingleGame,
  fetchSingleGame,
  editGame,
} from "../../redux/singleGame";
import {
  selectAllScores,
  fetchAllGameScores,
  editScore,
  deleteScore,
  createScore,
  acceptJoinRequestByScoreId,
  fetchPlayerRequests,
  selectPlayerRequests,
  clearScores,
  clearPlayerRequests,
  getUserScore,
} from "../../redux/scores";

import {
  selectTempScoreCardMessages,
  clearTempScoreCardMessages,
  selectWord,
  selectRealDefinition,
  startGame,
} from "../../redux/gameplay";

// SOCKET
import { SocketContext } from "../../socketProvider";
import { UserContext } from "../../UserContext";

// COMPONENTS
import GamePlay from "./GampePlay";
import TempScoreCard from "../scores/TempScoreCard";
import ScoreCard from "../scores/ScoreCard";
import FinalCard from "../scores/FinalCard";
import CardFront from "../Cards/CardBack";

import { RealTimeDB } from "../../Firebase/FirebaseConfig";
import { ref, push, onValue, set, off, update } from "firebase/database";

const SingleGame = () => {
  // COMPONENT STATE
  const [showFinalCard, setShowFinalCard] = useState(false);
  const [tempScoreCard, setTempScoreCard] = useState("");
  const [showTempScoreCard, setShowTempScoreCard] = useState(false);
  const [showTiedGame, setShowTiedGame] = useState(false);
  const [reloadFlip, setReloadFlip] = useState(false);
  const { user } = useContext(UserContext);

  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();

  const gameId = route.params.id; // Get gameId from route parameters
  //   const userId = useSelector((state) => state.auth.me.id);

  const username = useSelector((state) => state.auth.me.username);
  const game = useSelector(selectSingleGame);
  const scores = useSelector(selectAllScores);
  const tempScoreCardTurn = useSelector(selectTempScoreCardMessages);

  const [state, setState] = useState(false);
  const playerRequests = useSelector(selectPlayerRequests);
  useEffect(() => {
    setState((state) => !state);
  }, [playerRequests]);
  // SOCKET



   

  const userScore = scores.find((score) => score?.userId === user?.uid);

  const word = useSelector(selectWord);
  const definition = useSelector(selectRealDefinition);

  // If there are 0 rounds left, render the FinalCard
  useEffect(() => {
    game.roundsLeft === 0 ? setShowFinalCard(true) : setShowFinalCard(false);
  }, [game.roundsLeft]);

  // Fetch game and associated scores when gameId changes
  useEffect(() => {
    dispatch(fetchSingleGame(gameId));

    dispatch(fetchAllGameScores(gameId));
  }, [gameId]);

  const reloadScores = () => {
    dispatch(fetchAllGameScores(gameId));
    setShowTempScoreCard(true);
  };

  const gameTurn = game.turn;
  const prevGameTurn = useRef("");

  useEffect(() => {
    prevGameTurn.current = gameTurn;
  }, [showTempScoreCard]);

  // Accept request to join the game
  const handleAcceptRequest = ({ scoreId, userId, requestId }) => {
    console.log("HELP: game: ", game);
    dispatch(
      editGame({
        ...game,
        userId: userId,
        numPlayers: game.numPlayers + 1,
        addPlayers: true,
      })
      //   editGame({ id: game.id, numPlayers: game.numPlayers + 1, userId: userId, addPlayers: true })
    ).then((res) => {
      dispatch(
        editScore({
          scoreId: scoreId,
          //  userId: userId,
          turnNum: res.payload.numPlayers,
          gameId: game.id,
          accepted: true,
        })
      ).then(async (editScoreRes) => {
 
        dispatch(acceptJoinRequestByScoreId({ game, scoreId }));

        dispatch(fetchSingleGame(gameId));
        dispatch(fetchAllGameScores(gameId));
        dispatch(fetchPlayerRequests(gameId));
      });
    });
  };

  // Decline request to play
  const handleDeclineRequest = (id) => {
    dispatch(deleteScore({ userId: id, gameId: game.id }));
    dispatch(fetchSingleGame(gameId));
    dispatch(fetchAllGameScores(gameId));
  };

  const handleAskJoin = () => {
    dispatch(
      createScore({
        score: 0,
        accepted: false,
        turn: false,
        turnNum: null,
        gameId: gameId,
        userId: user?.uid,
        displayName: user.displayName,
      })
    ).then((res) => {
      console.log("SCORE RES: ", res.payload);
      // TODO ROOM NOT NECESSARY???
      const joinRequestsRef = ref(RealTimeDB, `games/${game.id}/join_requests`);
      push(joinRequestsRef, {
        room: game.name,
        userName: user.displayName,
        accepted: false,
        scoreId: res.payload.id,
      })
        //   push(joinRequestsRef, )
        .then(() => {
          console.log("Join request successfully sent to Firebase.");
        })
        .catch((error) => {
          console.error("Error sending join request to Firebase:", error);
        });
    });
  };

  // Start the game
  const handleStartGame = () => {
    dispatch(editGame({ id: game.id, started: true }))
      .then(() => {
        console.log("HERE 1 ");
        dispatch(fetchSingleGame(gameId));
      })
      .then(() => {
        console.log("HERE 2 ");
        dispatch(startGame({ game, user }));
      });

    // clientSocket.emit("send_start_game", {
    //   room: game.name,
    //   userName: user.displayName,
    // });
  };

  // Set tempScoreCard when tempScoreCardTurn changes
  useEffect(() => {
    if (tempScoreCardTurn) {
      setTempScoreCard(tempScoreCardTurn);
    }
  }, [tempScoreCardTurn]);

  useEffect(() => {
    // Reference to score card event in Firebase
    const scoreCardRef = ref(RealTimeDB, `games/${game.name}/score_card`);

    const scoreCardListener = onValue(scoreCardRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setTempScoreCard(data.tempScoreCardMessages);
      }
    });

    // Reference to start game event in Firebase
    const startGameRef = ref(RealTimeDB, `games/${game.id}/start_game`);

    const startGameListener = onValue(startGameRef, (snapshot) => {
      const data = snapshot.val();
 
      if (data && data.room === game.name) {
        dispatch(fetchSingleGame(game.id));
      }
    });

    // Reference to join requests event in Firebase
    //   const joinRequestsRef = ref(RealTimeDB, `games/${game.name}/join_requests`);

    //   const joinRequestsListener = onValue(joinRequestsRef, (snapshot) => {
    //     const requests = snapshot.val();
    //     if (requests) {
    //       // Loop over the requests and handle each one
    //       Object.values(requests).forEach((request) => {
    //         if (request.room === game.name) {
    //           dispatch(fetchAllGameScores(gameId));
    //         }
    //       });
    //     }
    //   });

    // Reference to play again event in Firebase
    const playAgainRef = ref(RealTimeDB, `games/${game.name}/play_again`);

    const playAgainListener = onValue(playAgainRef, (snapshot) => {
      const data = snapshot.val();
      if (data && data.room === game.name) {
        dispatch(fetchSingleGame(data.gameId));
      }
    });

    //Unsubscribe from all Firebase listeners
    return () => {
      off(scoreCardRef, scoreCardListener);
      off(startGameRef, startGameListener);
      // off(joinRequestsRef, joinRequestsListener);
      off(playAgainRef, playAgainListener);
    };
  }, [game.name, gameId, dispatch]);

  // Tied game check
  const checkIfTied = () => {
    setShowTiedGame(true);
  };

  useEffect(() => {
    // Cleanup function that runs when the component is unmounted
    return () => {
      dispatch(clearScores()); // Clear scores from Redux store
      dispatch(clearPlayerRequests()); // Clear player requests from Redux store
      // Alternatively, use dispatch(clearAll()) to clear both in one go
    };
  }, [dispatch]);

  return (
    <View style={styles.card}>
      <ScrollView>
        {/* {showTempScoreCard && (
          <TempScoreCard
            reloadScores={reloadScores}
            prevGameTurn={prevGameTurn}
            userScore={userScore}
            game={game}
            gameName={game.name}
            setShowTempScoreCard={setShowTempScoreCard}
            setReloadFlip={setReloadFlip}
            word={word}
            definition={definition}
            tempScoreCard={tempScoreCard}
            showTiedGame={showTiedGame}
          />
        )} */}

        {showFinalCard && <FinalCard game={game} userScore={userScore} />}

        <ScoreCard
          userId={user?.uid}
          userScore={userScore}
          game={game}
          handleAskJoin={handleAskJoin}
          handleStartGame={handleStartGame}
          handleDeclineRequest={handleDeclineRequest}
          handleAcceptRequest={handleAcceptRequest}
        />

        {(game.started === true && game.ownerId === user?.uid) ||
        (game.started === true && userScore) ? (
          <GamePlay
            setShowTempScoreCard={setShowTempScoreCard} //
            setReloadFlip={setReloadFlip} //
            reloadFlip={reloadFlip}
            userId={user?.uid}
            game={game}
            userScore={userScore}
            reloadScores={reloadScores}
            checkIfTied={checkIfTied}
          />
        ) : null}

        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          <Text style={styles.homeButton}>Home</Text>
        </TouchableOpacity>
      </ScrollView>
      {state}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    padding: 20,
    borderColor: "#000",
    borderWidth: 1,
    borderRadius: 10,
  },
  homeButton: {
    color: "blue",
    textDecorationLine: "underline",
    fontWeight: "bold",
    fontSize: 18,
    marginTop: 20,
  },
});

export default SingleGame;
