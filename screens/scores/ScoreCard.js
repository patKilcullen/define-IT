import React, { useEffect, useContext, useState } from "react";
import { View, Text, ScrollView, StyleSheet, Pressable } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { UserContext } from "../../UserContext";
import Buttons from "../../Buttons";

// STORE
import {
  selectAllScores,
  fetchAllGameScores,
  fetchPlayerRequests,
  selectPlayerRequests,
  deletePlayerRequests,
} from "../../redux/scores";

import { RealTimeDB } from "../../Firebase/FirebaseConfig";
import { ref, push, onValue, set, off } from "firebase/database";

const ScoreCard = ({
  userId,
  userScore,
  game,
  handleAskJoin,
  handleStartGame,
  handleDeclineRequest,
  handleAcceptRequest,
  playerTurnName,
  handleRemovePlayer,
  playerName,
  hideScoreCard,
  getInfo,
}) => {
  const { user } = useContext(UserContext);
  const dispatch = useDispatch();
  const scores = useSelector(selectAllScores);
  const playerRequests = useSelector(selectPlayerRequests);
  const [collapsed, setCollapsed] = useState(game.started ? true : false);

  // console.log("USERSCORE: ", userScore)
  useEffect(() => {
    if (hideScoreCard) {
      setCollapsed(true);
    }
    // Reference to join requests event in Firebase
    const joinRequestsRef = ref(RealTimeDB, `games/${game.id}/join_requests`);

    const joinRequestsListener = onValue(joinRequestsRef, (snapshot) => {
      const requests = snapshot.val();
      if (requests) {
        getInfo({ game, user });
        // Loop over the requests and handle each one
        Object.values(requests).forEach((request) => {
          if (request.room === game.name) {
            dispatch(fetchPlayerRequests(game.id));
          }
        });
      }
    });

    return () => {
      off(joinRequestsRef, joinRequestsListener);
    };
  }, [game.name, game.id, dispatch, hideScoreCard]);

  const handleToggleCollapse = () => {
    setCollapsed((prev) => !prev);
  };

  return (
    <>
      {collapsed ? (
        <Buttons
          name={"Score Card"}
          func={() => handleToggleCollapse()}
          small={true}
        />
      ) : (
        <View style={styles.container}>
          <Pressable
            style={styles.closeButton}
            onPress={() => handleToggleCollapse()}
          >
            <Text style={styles.closeButtonText}>X</Text>
          </Pressable>
          {/* Game Name */}
          <View style={styles.header}>
            <Text style={styles.gameName}>{game.name}</Text>
            <View style={styles.divider}></View>
            <Text style={styles.gameName}>{playerName}</Text>
          </View>

          {/* User's Score and Rounds Left */}
          <View style={styles.scoresContainer}>
            {game && game.rounds && game.roundsLeft && (
              <View style={styles.roundSection}>
                <Text style={styles.label}>Round:</Text>
                <Text style={styles.round}>
                  {game.rounds + 1 - game.roundsLeft}/{game.rounds}
                </Text>
              </View>
            )}
          </View>

          {/* Players' Scores */}
          <ScrollView style={styles.playersContainer}>
            <Text style={styles.sectionTitle}>Players:</Text>
            {scores &&
              scores
                .filter(
                  (score) =>
                    score !== undefined && score !== null && score.accepted
                )
                .map((user) => (
                  <View key={user?.user?.id} style={styles.playerScore}>
                    <Text style={styles.playerName}>
                      {user?.displayName ||
                        user?.userName ||
                        user?.email ||
                        "unknown"}
                      :
                    </Text>

                    <Text style={styles.playerScoreValue}>{user.score}</Text>
                    <Text style={styles.points}>
                      {user.score === 1 ? "pt" : "pts"}
                    </Text>

                    {user.id !== userScore?.id &&
                      !game.started &&
                      userScore?.turn && (
                        <Buttons
                          name={"Remove Player"}
                          //   func={() => user?.user?.id}
                          func={() => handleRemovePlayer(user.id)}
                          small={true}
                        />
                      )}
                  </View>
                ))}
          </ScrollView>

          {/* PLAYER REQUESTS */}
          {game.ownerId === userId && !game.started && (
            <View style={styles.requestsContainer}>
              {playerRequests.length > 0 && (
                <Text style={styles.sectionTitle}>Player Requests: </Text>
              )}
              {playerRequests &&
                playerRequests
                  .filter((request) => request.accepted === false)
                  .map((request, index) => (
                    <View
                      key={request?.userId || index}
                      style={styles.playerRequest}
                    >
                      <Text style={styles.requestPlayerName}>
                        {request.userName || "Unnamed"}:
                      </Text>

                      <Buttons
                        name={"Accept"}
                        func={() =>
                          handleAcceptRequest({
                            requestId: request.id,
                            userId: userId,
                            scoreId: request.scoreId,
                          })
                        }
                        small={true}
                      />
                      <Buttons
                        name={"Decline"}
                        func={() => handleDeclineRequest(request.scoreId)}
                        small={true}
                      />
                    </View>
                  ))}
            </View>
          )}

          {/* If Not Game Owner and Game Not Started: Ask to Join */}

          {game.ownerId !== userId && !game.started && !userScore ? (
            // Display "Ask to join game" button when userScore is undefined
            <Buttons
              name={"Ask to join game"}
              func={handleAskJoin}
              pulse={"pulse"}
            />
          ) : game.ownerId !== userId &&
            !game.started &&
            userScore &&
            !userScore.accepted ? (
            // Display message if request has been sent but not accepted yet
            <Text style={styles.requestSent}>REQUEST SENT</Text>
          ) : game.ownerId !== userId &&
            !game.started &&
            userScore &&
            userScore.accepted ? (
            // Display if the user has been accepted
            <Text style={styles.requestSent}>You haved joined the game.</Text>
          ) : null}

          {/* Start Game Button (Only if Owner and More Than One Player) */}
          {game.ownerId === userId && game.numPlayers > 1 && !game.started && (
            <Buttons
              name={"Start Game"}
              func={handleStartGame}
              pulse={"pulse"}
            />
          )}
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#e6e8dc",
    borderWidth: 2,
    borderColor: "#571122",
    borderRadius: 10,
  },
  header: {
    alignItems: "center",
  },
  gameName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#571122",
  },
  divider: {
    height: 2,
    width: "95%",
    backgroundColor: "#571122",
    marginTop: 5,
  },
  scoresContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 15,
  },
  scoreSection: {
    alignItems: "center",
  },
  roundSection: {
    alignItems: "center",
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
  },
  score: {
    fontSize: 30,
    color: "red",
  },
  points: {
    fontSize: 20,
    color: "#000",
  },
  round: {
    fontSize: 24,
    color: "red",
  },
  playersContainer: {
    flex: 1,
    marginVertical: 15,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  playerScore: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  playerName: {
    fontSize: 20,
    fontWeight: "bold",
  },
  playerScoreValue: {
    fontSize: 24,
    color: "red",
  },
  requestsContainer: {
    marginTop: 20,
  },
  playerRequest: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  requestPlayerName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  requestSent: {
    fontSize: 24,
    color: "green",
    textAlign: "center",
    marginTop: 10,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#571122",
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default ScoreCard;
