import React, { useEffect, useContext, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRoute, useNavigation } from "@react-navigation/native";
import { View, StyleSheet, ScrollView, Dimensions } from "react-native";

// Redux State and Actions
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
  clearScores,
  clearPlayerRequests,
  getInfo,
  deletePlayerRequests,
} from "../../redux/scores";
import {
  selectTempScoreCardMessages,
  selectWord,
  selectRealDefinition,
  startGame,
  addTempScoreCardMessage,
} from "../../redux/gameplay";

// Contexts
import { UserContext } from "../../UserContext";

// Components
import GamePlay from "./GampePlay";
import TempScoreCard from "../scores/TempScoreCard";
import ScoreCard from "../scores/ScoreCard";
import FinalCard from "../scores/FinalCard";

// Firebase
import { RealTimeDB } from "../../Firebase/FirebaseConfig";
import { ref, push, onValue, off } from "firebase/database";

const SingleGame = () => {
  // COMPONENT STATE
  const [showFinalCard, setShowFinalCard] = useState(false);
  const [tempScoreCard, setTempScoreCard] = useState("");
  const [showTempScoreCard, setShowTempScoreCard] = useState(false);
  const [showTiedGame, setShowTiedGame] = useState(false);
  const [reloadFlip, setReloadFlip] = useState(false);
  const [playerTurnName, setPlayerTurnName] = useState("");
  const [hideScoreCard, setHideScoreCard] = useState(false);

  const { user } = useContext(UserContext);

  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();

  // Retrieve gameId from route parameters
  const gameId = route.params.id;
  const game = useSelector(selectSingleGame);
  const scores = useSelector(selectAllScores);
  const tempScoreCardTurn = useSelector(selectTempScoreCardMessages);
  const word = useSelector(selectWord);
  const definition = useSelector(selectRealDefinition);

  const { width, height } = Dimensions.get("window");
  const cardWidth = width;
  const cardHeight = height;

  // Find the user’s score in the game
  const userScore = scores.find((score) => score?.userId === user?.uid);

  // Update the state for the final card display when rounds are over
  useEffect(() => {
    setShowFinalCard(game.roundsLeft === 0);
  }, [game.roundsLeft]);

  // Fetch game and associated scores when gameId changes
  useEffect(() => {
    dispatch(fetchSingleGame(gameId));
    dispatch(fetchAllGameScores(gameId));
  }, [gameId]);

  // Function to reload scores and show temporary score card
  const reloadScores = () => {
    dispatch(fetchAllGameScores(gameId));
    setShowTempScoreCard(true);
  };

  // Track the previous game turn
  const gameTurn = game.turn;
  const prevGameTurn = useRef("");
  useEffect(() => {
    prevGameTurn.current = gameTurn;
  }, [showTempScoreCard]);

  const handleAcceptRequest = ({ scoreId, userId }) => {
    dispatch(
      editGame({
        ...game,
        userId,
        numPlayers: game.numPlayers + 1,
        addPlayers: true,
      })
    )
      .then((res) => {
        console.log("res.payload.numPlayers: ", res.payload.numPlayers);

        dispatch(
          editScore({
            scoreId,
            turnNum: res.payload.numPlayers,
            gameId: game.id,
            accepted: true,
          })
        ).then(() => {
          console.log("Calling getInfo...");
          getInfo({ game, user })
            .then(() => {
              dispatch(acceptJoinRequestByScoreId({ game, scoreId }));

              dispatch(deletePlayerRequests({ game, scoreId }))
                .then(() => {
                  dispatch(fetchSingleGame(gameId));
                  dispatch(fetchAllGameScores(gameId));
                  dispatch(fetchPlayerRequests(gameId));
                })
                .catch((error) => {
                  console.error("Error deleting player request:", error);
                });
            })
            .catch((error) => {
              console.error("Error in getInfo:", user.displayName, error);
            });
        });
      })
      .catch((error) => {
        console.error("Error in handleAcceptRequest:", error);
      });
  };

  // Decline a join request for the game
  const handleDeclineRequest = (id) => {
    dispatch(deletePlayerRequests({ game, scoreId: id }));
    dispatch(deleteScore({ userId: id, gameId: game.id })).then((res) => {
      dispatch(fetchSingleGame(gameId));
      dispatch(fetchAllGameScores(gameId));
      dispatch(fetchPlayerRequests(gameId));
    });
  };
  const handleRemovePlayer = (id) => {
    dispatch(deleteScore(id)).then((res) => {
      dispatch(fetchSingleGame(gameId));
      dispatch(fetchAllGameScores(gameId));
      dispatch(fetchPlayerRequests(gameId));
    });
  };

  // Handle join request creation
  const handleAskJoin = () => {
    console.log("handleAskJoi, ", user.displayName);
    dispatch(
      createScore({
        score: 0,
        accepted: false,
        turn: false,
        turnNum: null,
        gameId,
        userId: user?.uid,
        displayName: user.displayName,
      })
    ).then((res) => {
      const joinRequestsRef = ref(RealTimeDB, `games/${game.id}/join_requests`);
      push(joinRequestsRef, {
        room: game.name,
        userName: user.displayName,
        accepted: false,
        scoreId: res.payload.id,
      })
        .then(() => console.log("Join request successfully sent to Firebase."))
        .catch((error) => console.error("Error sending join request:", error));
    });
  };

  // Start the game by editing the game state
  const handleStartGame = () => {
    dispatch(editGame({ id: game.id, started: true }))
      .then(() => dispatch(fetchSingleGame(gameId)))
      .then(() => dispatch(startGame({ game, user })));
    handleHideScoreCard();
  };
  // hide score card when game starts
  const handleHideScoreCard = () => {
    setHideScoreCard(true);
  };

  // Update tempScoreCard when tempScoreCardTurn changes
  useEffect(() => {
    if (tempScoreCardTurn) setTempScoreCard(tempScoreCardTurn);
  }, [tempScoreCardTurn]);

  // Firebase listeners to sync game state
  useEffect(() => {
    // Set up Firebase references
    const startGameRef = ref(RealTimeDB, `games/${game.id}/start_game`);
    const playAgainRef = ref(RealTimeDB, `games/${game.name}/play_again`);

    const getInfoRef = ref(RealTimeDB, `games/${game.id}/get_info`);

    // Listener for game start event
    const startGameListener = onValue(startGameRef, (snapshot) => {
      const data = snapshot.val();
      if (data && data.room === game.name) {
        dispatch(fetchSingleGame(game.id));
        handleHideScoreCard();
        getInfo({ game, user });
      }
    });
    // Listener for game start event
    const getInfoListener = onValue(getInfoRef, (snapshot) => {
      const data = snapshot.val();

      if (data && data.room === game.name) {
        dispatch(fetchSingleGame(gameId));
        dispatch(fetchAllGameScores(gameId));
      }
    });

    // Listener for "play again" event
    const playAgainListener = onValue(playAgainRef, (snapshot) => {
      const data = snapshot.val();
      if (data && data.room === game.name)
        dispatch(fetchSingleGame(data.gameId));
    });

    // Cleanup function to remove Firebase listeners on component unmount
    return () => {
      off(startGameRef, startGameListener);
      off(playAgainRef, playAgainListener);
      off(getInfoRef, getInfoListener);
    };
  }, [game.name, gameId, dispatch]);

  // Display tied game status
  const checkIfTied = () => setShowTiedGame(true);

  // Cleanup function for clearing scores and player requests on unmount
  useEffect(() => {
    return () => {
      dispatch(clearScores());
      dispatch(clearPlayerRequests());
    };
  }, [dispatch]);

  return (
    <View style={[styles.card, { height: cardHeight }]}>
      <ScrollView style={styles.card}>
        {/* Display TempScoreCard if active, otherwise show ScoreCard */}
        {showTempScoreCard ? (
          <TempScoreCard
            reloadScores={reloadScores}
            userScore={userScore}
            game={game}
            gameName={game.name}
            setShowTempScoreCard={setShowTempScoreCard}
            word={word}
            definition={definition.definition}
            tempScoreCard={tempScoreCard}
          />
        ) : !hideScoreCard ? (
          <ScoreCard
            userId={user?.uid}
            userScore={userScore}
            game={game}
            handleAskJoin={handleAskJoin}
            handleStartGame={handleStartGame}
            handleDeclineRequest={handleDeclineRequest}
            handleAcceptRequest={handleAcceptRequest}
            playerTurnName={playerTurnName}
            handleRemovePlayer={handleRemovePlayer}
            playerName={user.displayName}
            hideScoreCard={hideScoreCard}
            getInfo={getInfo}
          />
        ) : null}

        {/* Render FinalCard if game rounds are complete */}
        {showFinalCard && <FinalCard game={game} userScore={userScore} />}

        {/* Display gameplay component if game has started and user has a score */}
        {game.started && (game.ownerId === user?.uid || userScore) && (
          <GamePlay
            setShowTempScoreCard={setShowTempScoreCard}
            setReloadFlip={setReloadFlip}
            reloadFlip={reloadFlip}
            userId={user?.uid}
            game={game}
            userScore={userScore}
            reloadScores={reloadScores}
            checkIfTied={checkIfTied}
            setPlayerTurnName={setPlayerTurnName}
            handleHideScoreCard={handleHideScoreCard}
            setHideScoreCard={setHideScoreCard}
          />
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
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
