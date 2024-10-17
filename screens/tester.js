import{View, Text, StyleSheet} from 'react-native'

export default function Tester(){
 return (
   <View style={styles.container}>
     <Text style={styles.text}>WURRRD</Text>
   </View>
 );}

const styles = StyleSheet.create({

    container:{
flex: 1,
    backgroundColor: "red"
},
text:{
   color: "black",
   marginTop: 100
}

})
