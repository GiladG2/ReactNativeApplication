import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Animated,
  Platform,
} from "react-native";
import axios from "axios";
axios.defaults.withCredentials = true;
import AuthContext from "../Context/AppContext";
import GuestHome from "../Components/GuestHome";
import LoggedHome from "../Components/LoggedHome";

export default function HomeScreen() {
  const [fadeAnim] = useState(new Animated.Value(0)); // Initial fade value
  const { user, setUser, baseURL } = useContext(AuthContext)!;
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // Fade-in animation for the welcome text
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);
  useEffect(() => {
    axios
      .get(baseURL + "api/UsersAPI/CheckSession")
      .then((response) => {
        if (response.data.isAuthenticated) {
          setUser({
            username: response.data.username,
            accesskey: response.data.accesskey,
          });
        }
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  });

  const handleButtonPress = () => {
    // Handle the button press (e.g., navigating to the workout logging screen)
  };
  const handleLogOut = () => {
    var url = baseURL + "api/UsersAPI/Logout";
    axios.post(url).then((response) => {
      console.log(response.data.message);
    });
  };
  return (
    
    <SafeAreaView style={styles.container}>
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
    </SafeAreaView>
  );
}

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
