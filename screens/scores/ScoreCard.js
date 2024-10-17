import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useSelector } from "react-redux";
import Buttons from "../../Buttons";

// STORE
import { selectAllScores } from "../../redux/scores";
import { selectSingleGame } from "../../redux/singleGame";

const ScoreCard = ({
  userId,
  userScore,
  game,
  handleAskJoin,
  handleStartGame,
  handleDeclineRequest,
  handleAcceptRequest,
}) => {
  const scores = useSelector(selectAllScores);

  return (
    <View style={styles.container}>
      {/* Game Name */}
      <View style={styles.header}>
        <Text style={styles.gameName}>{game.name}</Text>
        <View style={styles.divider}></View>
      </View>

      {/* User's Score and Rounds Left */}
      <View style={styles.scoresContainer}>
        {userScore && (
          <View style={styles.scoreSection}>
            <Text style={styles.label}>Score:</Text>
            <Text style={styles.score}>{userScore.score}</Text>
            <Text style={styles.points}>
              {userScore.score === 1 ? "pt" : "pts"}
            </Text>
          </View>
        )}

        {game && game.rounds && game.roundsLeft && (
          <View style={styles.roundSection}>
            <Text style={styles.label}>Round:</Text>
            <Text style={styles.round}>
              {game.rounds + 1 - game.roundsLeft}/{game.rounds}
            </Text>
          </View>
        )}
      </View>

      {/* Other Players' Scores */}
      <ScrollView style={styles.playersContainer}>
        <Text style={styles.sectionTitle}>Players</Text>
        {scores &&
          scores
            .filter((score) => score.accepted && score.userId !== userId)
            .map((user) => (
              <View key={user?.user?.id} style={styles.playerScore}>
                <Text style={styles.playerName}>{user?.user?.username}:</Text>
                <Text style={styles.playerScoreValue}>{user.score}</Text>
                <Text style={styles.points}>
                  {user.score === 1 ? "pt" : "pts"}
                </Text>
                {user?.user?.id !== userId &&
                  userId === game.ownerId &&
                  !game.started && (
                    <Buttons
                      name={"Remove Player"}
                      func={() => handleDeclineRequest(user?.user?.id)}
                      small={true}
                    />
                  )}
              </View>
            ))}
      </ScrollView>

      {/* If Game Owner and Game Not Started: Player Requests */}
      {game.ownerId === userId && !game.started && (
        <View style={styles.requestsContainer}>
          <Text style={styles.sectionTitle}>Player Requests</Text>
          {scores &&
            scores
              .filter((score) => !score.accepted)
              .map((score) => (
                <View key={score?.user?.id} style={styles.playerRequest}>
                  <Text style={styles.requestPlayerName}>
                    {score?.user?.username}:
                  </Text>
                  <Buttons
                    name={"Accept"}
                    func={() => handleAcceptRequest(score?.user?.id)}
                    small={true}
                  />
                  <Buttons
                    name={"Decline"}
                    func={() => handleDeclineRequest(score?.user?.id)}
                    small={true}
                  />
                </View>
              ))}
        </View>
      )}

      {/* If Not Game Owner and Game Not Started: Ask to Join */}
      {game.ownerId !== userId && !game.started && !userScore ? (
        <Buttons
          name={"Ask to join game"}
          func={handleAskJoin}
          pulse={"pulse"}
        />
      ) : game.ownerId !== userId && !game.started && userScore ? (
        <Text style={styles.requestSent}>REQUEST SENT</Text>
      ) : null}

      {/* Start Game Button (Only if Owner and More Than One Player) */}
      {game.ownerId === userId && game.numPlayers > 1 && !game.started && (
        <Buttons name={"Start Game"} func={handleStartGame} pulse={"pulse"} />
      )}
    </View>
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
});

export default ScoreCard;
