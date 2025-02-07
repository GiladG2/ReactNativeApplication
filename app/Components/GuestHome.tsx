import { View, Text, TouchableOpacity,StyleSheet,Animated } from 'react-native'
import React, { useContext } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import AuthContext from '../Context/AppContext'
interface GuestHomeProp{
    handleLogOut : () => void;
    handleButtonPress: () => void;
    fadeAnim : Animated.Value;
}
function GuestHome({handleLogOut,handleButtonPress,fadeAnim} : GuestHomeProp) {
    const{user,setUser} = useContext(AuthContext)!
  return (
    <View style={styles.overlay}>
            <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
              <Text style={styles.headerText}>
                Welcome to OneLife! Log your workouts on the fly!
                <Text>Username: {user?.username}</Text>
              </Text>
              <Text style={styles.subHeaderText}>
                Stay consistent, track your progress, and reach your goals!
              </Text>
              <Text onPress={() => handleLogOut()}>Log out</Text>
              <TouchableOpacity style={styles.button} onPress={handleButtonPress}>
                <Text style={styles.buttonText}>Start Logging</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
  )
}

export default GuestHome
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:"#00aed1"
  },
  background: {
    flex: 1,
    justifyContent: "center",
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent overlay
  },
  content: {
    alignItems: "center",
    marginHorizontal: 20,
  },
  headerText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  subHeaderText: {
    fontSize: 18,
    color: "#ddd",
    textAlign: "center",
    marginBottom: 30,
    paddingHorizontal: 30,
  },
  button: {
    backgroundColor: "#00aed1",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
