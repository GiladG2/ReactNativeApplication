import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Animated,
} from "react-native";
import axios from "axios";
axios.defaults.withCredentials = true;
import AuthContext from "../Context/AppContext";
import { useNavigation } from "expo-router";

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

  // Session logic remains unchanged
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

  const handleStartLogging = () => {
    const navigation = useNavigation();
    if (user) navigation.navigate('Training log');
    else navigation.navigate('Get started');
  };

  const handleLogOut = () => {
    var url = baseURL + "api/UsersAPI/Logout";
    axios.post(url).then((response) => {
      console.log(response.data.message);
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentWrapper}>
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          <Text style={styles.headerText}>Welcome to OneLife!</Text>
          <Text style={styles.taglineText}>Log your workouts on the fly!</Text>
          <Text style={styles.usernameText}>
            Hello {user ? user?.username : "guest"}
          </Text>
          <Text style={styles.subHeaderText}>
            Stay consistent, track your progress, and reach your goals!
          </Text>
          {user && (
            <Text style={styles.logoutText} onPress={handleLogOut}>
              Log out
            </Text>
          )}
          <TouchableOpacity style={styles.button} onPress={handleStartLogging}>
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
    backgroundColor: "#ffffff",
  },
  contentWrapper: {
    flex: 1,
    margin: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    alignItems: "center",
  },
  headerText: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 5,
  },
  taglineText: {
    fontSize: 18,
    color: "#555",
    textAlign: "center",
    marginBottom: 10,
  },
  usernameText: {
    fontSize: 16,
    fontWeight: "normal",
    color: "#777",
    marginBottom: 15,
  },
  subHeaderText: {
    fontSize: 18,
    fontStyle: "italic",
    color: "#444",
    textAlign: "center",
    marginVertical: 15,
    lineHeight: 24,
  },
  logoutText: {
    fontSize: 14,
    color: "#007BFF",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#007BFF",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
