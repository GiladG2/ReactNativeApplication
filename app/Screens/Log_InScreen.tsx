import React, { createContext, useContext, useState } from "react";
import { Formik } from "formik";
import {
  TextInput,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform,
} from "react-native";
import axios from "axios";
import AppContext from "../Context/AppContext";
import { useNavigation } from "expo-router";
axios.defaults.withCredentials = true;

interface LogInProps {
  panel: string;
  setPanel: (panel: string) => void;
}

function Log_In({ panel, setPanel }: LogInProps) {
  const [message, setMessage] = useState("");
  const { user, setUser, baseURL } = useContext(AppContext)!;
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.messageText}>{message}</Text>
        <Text style={styles.headerText}>Welcome Back!</Text>
        <Text style={styles.subHeader}>Log in to continue</Text>
        <Formik
          initialValues={{ username: "", password: "" }}
          onSubmit={async (values) => {
            console.log(values);
            const options = {
              url: baseURL + "api/UsersAPI/TestData",
              method: "GET",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json;charset=UTF-8",
              },
              params: {
                username: values.username,
                password: values.password,
              },
              withCredentials: true, // Important for sending cookies
            };

            try {
              // Send the login request
              const response = await axios(options);
              console.log("Response Status:", response.status);
              console.log("Response Data:", response.data);

              // After login, check the session
              const sessionResponse = await axios.get(
                baseURL + "api/UsersAPI/CheckSession"
              );
              console.log(
                "Is Authenticated = " + sessionResponse.data.isAuthenticated
              );
              if (sessionResponse.data.isAuthenticated) {
                setUser({
                  username: response.data.username,
                  accesskey: response.data.accesskey,
                });
                setMessage("Logged in");
                console.log("Adding log in record");
                axios.post(baseURL + "api/UsersAPI/AddLogInRecord", null, {
                  params:{
                    username: values.username
                  }
                })
                .then((response) => {
                  console.log(response)
                });
                setTimeout(() => {
                  navigation.navigate("Home");
                }, 2000);
              } else {
                setMessage("Invalid username or password");
              }
            } catch (error) {
              console.error("Error fetching data:", error);
              setMessage("An error occurred");
            }
          }}
        >
          {({ handleChange, handleBlur, handleSubmit, values }) => (
            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Username</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your username"
                  placeholderTextColor="#aaa"
                  onChangeText={handleChange("username")}
                  onBlur={handleBlur("username")}
                  value={values.username}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  placeholderTextColor="#aaa"
                  secureTextEntry
                  onChangeText={handleChange("password")}
                  onBlur={handleBlur("password")}
                  value={values.password}
                />
              </View>

              <Text style={styles.switchText}>
                Don't have an account?{" "}
                <Text
                  style={styles.signupText}
                  onPress={() => setPanel("true")} // Switch to Sign Up panel
                >
                  Sign up
                </Text>
              </Text>

              <TouchableOpacity
                style={styles.button}
                onPress={() => handleSubmit()}
              >
                <Text style={styles.buttonText}>Log In</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.linkContainer}>
                <Text style={styles.linkText}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8F0", // Warm cream background
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "100%",
    padding: 25,
    borderRadius: 15,
    backgroundColor: "#FFEBD6", // Soft, warm peach tone
    elevation: 5,
    shadowColor: "#A67C52",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    alignItems: "center",
  },
  messageText: {
    fontSize: 14,
    color: "#A67C52",
    marginBottom: 10,
  },
  headerText: {
    fontSize: 28,
    color: "#A67C52", // Warm brown
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  subHeader: {
    fontSize: 16,
    color: "#A67C52",
    textAlign: "center",
    marginBottom: 25,
  },
  form: {
    width: "100%",
    paddingHorizontal: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: "#A67C52",
    marginBottom: 5,
    fontWeight: "500",
  },
  input: {
    width: "100%",
    backgroundColor: "#FFF",
    padding: 14,
    borderRadius: 8,
    fontSize: 16,
    color: "#333",
    borderWidth: 1,
    borderColor: "#E0C3A3",
  },
  button: {
    backgroundColor: "#A67C52", // Warm brown button
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  linkContainer: {
    marginTop: 20,
  },
  linkText: {
    color: "#A67C52",
    fontSize: 14,
    textDecorationLine: "underline",
  },
  signupText: {
    fontWeight: "bold",
    textDecorationLine: "underline",
    color: "#A67C52",
  },
  switchText: {
    color: "#A67C52",
    marginTop: 10,
    textAlign: "center",
  },
});

export default Log_In;

//3088400
