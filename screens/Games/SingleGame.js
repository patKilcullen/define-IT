import React, { useEffect, useContext, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRoute, useNavigation } from "@react-navigation/native";
import { View, Text, TouchableOpacity, StyleSheet , ScrollView} from "react-native";

// SLICES/STATE REDUCERS
import { selectSingleGame, fetchSingleGame, editGame } from "../../redux/singleGame";
import {
  selectAllScores,
  fetchAllGameScores,
  editScore,
  deleteScore,
  createScore,
} from "../../redux/scores";

import {
  selectTempScoreCardMessages,
  clearTempScoreCardMessages,
  selectWord,
  selectRealDefinition,
} from "../../redux/gameplay";

// SOCKET
import { SocketContext } from "../../socketProvider";
import { UserContext } from "../../UserContext";

// COMPONENTS
import GamePlay from "./GampePlay";
import TempScoreCard from "../scores/TempScoreCard";
 import ScoreCard from "../scores/ScoreCard";
 import FinalCard from "../scores/FinalCard";
 import CardFront from "../CardFront";

const SingleGame = () => {
  // COMPONENT STATE
  const [showFinalCard, setShowFinalCard] = useState(false);
  const [tempScoreCard, setTempScoreCard] = useState("");
  const [showTempScoreCard, setShowTempScoreCard] = useState(false);
  const [showTiedGame, setShowTiedGame] = useState(false);
  const [reloadFlip, setReloadFlip] = useState(false);

  // SOCKET
  const clientSocket = useContext(SocketContext);

  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();

  const gameId = route.params.id; // Get gameId from route parameters
//   const userId = useSelector((state) => state.auth.me.id);
const { user } = useContext(UserContext); 
  const username = useSelector((state) => state.auth.me.username);
  const game = useSelector(selectSingleGame);
  const scores = useSelector(selectAllScores);
  const tempScoreCardTurn = useSelector(selectTempScoreCardMessages);
  const userScore = scores.find((score) => score?.userId === user?.uid);
  console.log("USER SCORE: ", userScore)
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
  const handleAcceptRequest = ({scoreId, userId}) => {
    console.log("ACCCEPPPTPTPPTPPTPTPTt: ", scoreId, userId);
    dispatch(
      editGame({ id: game.id, numPlayers: game.numPlayers + 1, userId })
    ).then((res) => {
        console.log("NEXTTTTTTT: ")
      dispatch(
        editScore({
            scoreId: scoreId,
          userId: userId,
          turnNum: res.payload.numPlayers,
          gameId: game.id,
          accepted: true,
        })
        // editScore()
      ).then((editScoreRes) => {
        clientSocket.emit("send_ask_to_join", {
          room: game.name,
          userName: username,
        });
        dispatch(fetchSingleGame(gameId));
        dispatch(fetchAllGameScores(gameId));
      });
    });
  };

  // Decline request to play
  const handleDeclineRequest = (id) => {
    dispatch(deleteScore({ userId: id, gameId: game.id }));
    dispatch(fetchSingleGame(gameId));
    dispatch(fetchAllGameScores(gameId));
  };

  // Ask to join the game
  const handleAskJoin = () => {
    console.log("THIS USERR create askkkk: ", user.displayName, user);
    dispatch(
      createScore({
        score: 0,
        accepted: false,
        turn: false,
        turnNum: null,
        gameId: gameId,
        userId: user?.uid,
        displayName: user.displayName
      })
    );
    clientSocket.emit("send_ask_to_join", {
      room: game.name,
      userName: username,
    });
  };

  // Start the game
  const handleStartGame = () => {
    dispatch(editGame({ id: game.id, started: true })).then(() => {
      dispatch(fetchSingleGame(gameId));
    });
    clientSocket.emit("send_start_game", {
      room: game.name,
      userName: username,
    });
  };

  // Set tempScoreCard when tempScoreCardTurn changes
  useEffect(() => {
    if (tempScoreCardTurn) {
      setTempScoreCard(tempScoreCardTurn);
    }
  }, [tempScoreCardTurn]);
//   useEffect(() => {
//     setTempScoreCard(tempScoreCardTurn);
//   }, [tempScoreCardTurn]);

  // SOCKET: Receive and emit events
  useEffect(() => {
    clientSocket.on("receive_score_card", ({ tempScoreCardMessages }) => {
      setTempScoreCard(tempScoreCardMessages);
    });

    clientSocket.on("receive_start_game", ({ room, userName }) => {
      dispatch(fetchSingleGame(gameId));
    });

    clientSocket.on("recieve_ask_to_join", (room) => {
      if (room === game.name) {
        dispatch(fetchAllGameScores(gameId));
      }
    });

    clientSocket.on("receive_play_again", ({ room, gameId }) => {
      if (room === game.name) {
        dispatch(fetchSingleGame(gameId));
      }
    });

    return () => {
      clientSocket.off("receive_score_card");
      clientSocket.off("receive_start_game");
      clientSocket.off("recieve_ask_to_join");
      clientSocket.off("receive_play_again");
    };
  }, [clientSocket, game, gameId]);

  // Join the room when the game or userScore changes
  useEffect(() => {
    if (userScore) {
      clientSocket.emit("join_room", { room: game.name, userName: username });
    }
  }, [game, userScore]);

  // Tied game check
  const checkIfTied = () => {
    setShowTiedGame(true);
  };

  return (
    <View style={styles.card}>
      <ScrollView>
        {showTempScoreCard && (
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
        )}

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
            setShowTempScoreCard={setShowTempScoreCard}
            setReloadFlip={setReloadFlip}
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
