// import React from "react";
// import {
//   View,
//   Text,
//   ScrollView,
//   StyleSheet,
// } from "react-native";
// import { useSelector } from "react-redux";
// import Buttons from "../../Buttons";

// // STORE
// import { selectAllScores } from "../../redux/scores";

// const ScoreCard = ({
//   userId,
//   userScore,
//   game,
//   handleAskJoin,
//   handleStartGame,
//   handleDeclineRequest,
//   handleAcceptRequest,
// }) => {
//   const scores = useSelector(selectAllScores);


//   console.log(
//     "game.ownerId !== userId && !game.started && userScore === undefined : ",
//     game.ownerId, userId, !game.started, userScore === undefined
//   );
//   return (
//     <View style={styles.container}>
//       {/* Game Name */}
//       <View style={styles.header}>
//         <Text style={styles.gameName}>{game.name}</Text>
//         <View style={styles.divider}></View>
//       </View>

//       {/* User's Score and Rounds Left */}
//       <View style={styles.scoresContainer}>
//         {userScore && (
//           <View style={styles.scoreSection}>
//             <Text style={styles.label}>Score:</Text>
//             <Text style={styles.score}>{userScore.score}</Text>
//             <Text style={styles.points}>
//               {userScore.score === 1 ? "pt" : "pts"}
//             </Text>
//           </View>
//         )}

//         {game && game.rounds && game.roundsLeft && (
//           <View style={styles.roundSection}>
//             <Text style={styles.label}>Round:</Text>
//             <Text style={styles.round}>
//               {game.rounds + 1 - game.roundsLeft}/{game.rounds}
//             </Text>
//           </View>
//         )}
//       </View>

//       {/* Other Players' Scores */}
//       <ScrollView style={styles.playersContainer}>
//         <Text style={styles.sectionTitle}>Players</Text>
//         {scores &&
//           scores
//             .filter(
//               (score) =>
//                 score !== undefined &&
//                 score !== null &&
//                 score.accepted &&
//                 score.userId !== userId
//             ) // Filt
//             .map((user) => (
//               <View key={user?.user?.id} style={styles.playerScore}>
//                 <Text style={styles.playerName}>{user?.user?.username}:</Text>
//                 <Text style={styles.playerScoreValue}>{user.score}</Text>
//                 <Text style={styles.points}>
//                   {user.score === 1 ? "pt" : "pts"}
//                 </Text>
//                 {user?.user?.id !== userId &&
//                   userId === game.ownerId &&
//                   !game.started && (
//                     <Buttons
//                       name={"Remove Player"}
//                       func={() => handleDeclineRequest(user?.user?.id)}
//                       small={true}
//                     />
//                   )}
//               </View>
//             ))}
//       </ScrollView>

//       {/* If Game Owner and Game Not Started: Player Requests */}
//       {game.ownerId === userId && !game.started && (
//         <View style={styles.requestsContainer}>
//           <Text style={styles.sectionTitle}>Player Requests</Text>
//           {scores &&
//             scores
//               .filter((score) => score !== undefined && !score.accepted)
//               .map((score, index) => (
//                 <View
//                   key={score?.user?.id || index}
//                   style={styles.playerRequest}
//                 >
//                   <Text style={styles.requestPlayerName}>
//                     {score?.displayName}:
//                   </Text>
//                   <Buttons
//                     name={"Accept"}
//                     // func={() => handleAcceptRequest(score?.user?.id)}
//                     func={() =>
//                       handleAcceptRequest({
//                         scoreId: score.id,
//                         userId: score?.userId,
//                       })
//                     }
//                     small={true}
//                   />
//                   <Buttons
//                     name={"Decline"}
//                     func={() => handleDeclineRequest(score?.user?.id)}
//                     small={true}
//                   />
//                 </View>
//               ))}
//         </View>
//       )}

//       {/* If Not Game Owner and Game Not Started: Ask to Join */}

//       {game.ownerId !== userId && !game.started && !userScore ? (
//         // Display "Ask to join game" button when userScore is undefined
//         <Buttons
//           name={"Ask to join game"}
//           func={handleAskJoin}
//           pulse={"pulse"}
//         />
//       ) : game.ownerId !== userId &&
//         !game.started &&
//         userScore &&
//         !userScore.accepted ? (
//         // Display message if request has been sent but not accepted yet
//         <Text style={styles.requestSent}>REQUEST SENT</Text>
//       ) : game.ownerId !== userId &&
//         !game.started &&
//         userScore &&
//         userScore.accepted ? (
//         // Display if the user has been accepted
//         <Text style={styles.requestSent}>You haved joined the game.</Text>
//       ) : null}

//       {/* Start Game Button (Only if Owner and More Than One Player) */}
//       {game.ownerId === userId && game.numPlayers > 1 && !game.started && (
//         <Buttons name={"Start Game"} func={handleStartGame} pulse={"pulse"} />
//       )}
//     </View>
//   );
// };




// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 15,
//     backgroundColor: "#e6e8dc",
//     borderWidth: 2,
//     borderColor: "#571122",
//     borderRadius: 10,
//   },
//   header: {
//     alignItems: "center",
//   },
//   gameName: {
//     fontSize: 24,
//     fontWeight: "bold",
//     color: "#571122",
//   },
//   divider: {
//     height: 2,
//     width: "95%",
//     backgroundColor: "#571122",
//     marginTop: 5,
//   },
//   scoresContainer: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     marginVertical: 15,
//   },
//   scoreSection: {
//     alignItems: "center",
//   },
//   roundSection: {
//     alignItems: "center",
//   },
//   label: {
//     fontSize: 18,
//     fontWeight: "bold",
//   },
//   score: {
//     fontSize: 30,
//     color: "red",
//   },
//   points: {
//     fontSize: 20,
//     color: "#000",
//   },
//   round: {
//     fontSize: 24,
//     color: "red",
//   },
//   playersContainer: {
//     flex: 1,
//     marginVertical: 15,
//   },
//   sectionTitle: {
//     fontSize: 22,
//     fontWeight: "bold",
//     marginBottom: 10,
//   },
//   playerScore: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     marginBottom: 5,
//   },
//   playerName: {
//     fontSize: 20,
//     fontWeight: "bold",
//   },
//   playerScoreValue: {
//     fontSize: 24,
//     color: "red",
//   },
//   requestsContainer: {
//     marginTop: 20,
//   },
//   playerRequest: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   requestPlayerName: {
//     fontSize: 18,
//     fontWeight: "bold",
//   },
//   requestSent: {
//     fontSize: 24,
//     color: "green",
//     textAlign: "center",
//     marginTop: 10,
//   },
// });

// export default ScoreCard;



import React, {useEffect} from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

import Buttons from "../../Buttons";

// STORE
import {
  selectAllScores,
  fetchAllGameScores,
  fetchPlayerRequests,
  selectPlayerRequests
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
}) => {
      const dispatch = useDispatch();
  const scores = useSelector(selectAllScores);
const playerRequests = useSelector(selectPlayerRequests);
useEffect(()=>{
console.log("THESE SCORES: ", scores)
}, [scores])

  useEffect(() => {
    // Reference to score card event in Firebase
    // const scoreCardRef = ref(RealTimeDB, `games/${game.name}/score_card`);

    // const scoreCardListener = onValue(scoreCardRef, (snapshot) => {
    //   const data = snapshot.val();
    //   if (data) {
    //     setTempScoreCard(data.tempScoreCardMessages);
    //   }
    // });

    // Reference to start game event in Firebase
    // const startGameRef = ref(RealTimeDB, `games/${game.name}/start_game`);

    // const startGameListener = onValue(startGameRef, (snapshot) => {
    //   const data = snapshot.val();
    //   if (data && data.room === game.name) {
    //     dispatch(fetchSingleGame(gameId));
    //   }
    // });

    // Reference to join requests event in Firebase
    const joinRequestsRef = ref(RealTimeDB, `games/${game.name}/join_requests`);

    const joinRequestsListener = onValue(joinRequestsRef, (snapshot) => {
      const requests = snapshot.val();
      console.log("REQUESRSSS: ", requests)
      if (requests) {
        // Loop over the requests and handle each one
        Object.values(requests).forEach((request) => {
          if (request.room === game.name) {
              console.log("dispatch");
            // dispatch(fetchAllGameScores(game.id));
               dispatch(fetchPlayerRequests(game.id));
          }
        });
      }
    });

    // Reference to play again event in Firebase
    // const playAgainRef = ref(RealTimeDB, `games/${game.name}/play_again`);

    // const playAgainListener = onValue(playAgainRef, (snapshot) => {
    //   const data = snapshot.val();
    //   if (data && data.room === game.name) {
    //     dispatch(fetchSingleGame(data.gameId));
    //   }
    // });

    //Unsubscribe from all Firebase listeners
    return () => {
    //   off(scoreCardRef, scoreCardListener);
    //   off(startGameRef, startGameListener);
      off(joinRequestsRef, joinRequestsListener);
    //   off(playAgainRef, playAgainListener);
    };
  }, [game.name, game.id, dispatch]);


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
            .filter(
              (score) =>
                score !== undefined &&
                score !== null &&
                score.accepted &&
                score.userId !== userId
            ) // Filt
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
      <View>
        {playerRequests &&
          playerRequests.map((request) => (
            <View key={request.id}>
              <Text>{request.user.username}</Text>
              <Buttons
                name="Accept"
                func={() => handleAcceptRequest(request.userId)}
                small={true}
              />
              <Buttons
                name="Decline"
                func={() => handleDeclineRequest(request.userId)}
                small={true}
              />
            </View>
          ))}
      </View>

      {/* If Game Owner and Game Not Started: Player Requests */}
      {game.ownerId === userId && !game.started && (
        <View style={styles.requestsContainer}>
          <Text style={styles.sectionTitle}>Player Requests</Text>
          {scores &&
            scores
              .filter((score) => score !== undefined && !score.accepted)
              .map((score, index) => (
                <View
                  key={score?.user?.id || index}
                  style={styles.playerRequest}
                >
                  <Text style={styles.requestPlayerName}>
                    {score?.displayName}:
                  </Text>
                  <Buttons
                    name={"Accept"}
                    // func={() => handleAcceptRequest(score?.user?.id)}
                    func={() =>
                      handleAcceptRequest({
                        scoreId: score.id,
                        userId: score?.userId,
                      })
                    }
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
