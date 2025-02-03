import React, { useState } from "react";
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

interface LogInProps {
  panel: string;
  setPanel: (panel: string) => void;
}

function Log_In({ panel, setPanel }: LogInProps) {
  const [message, setMessage] = useState("");

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text>{message}</Text>
        <Text style={styles.headerText}>Welcome Back!</Text>
        <Text style={styles.subHeader}>Log in to continue</Text>
        <Formik
          initialValues={{ username: "", password: "" }}
          onSubmit={(values) => {
            let baseURL;
          
            if (Platform.OS === "ios") {
              baseURL = "http://localhost:5030/api/UsersAPI/TestData";
            } else if (Platform.OS === "android")
               {
              baseURL = "http://10.0.2.2:5030/api/UsersAPI/TestData"; // Emulator
            } else {
              baseURL = "http://your-production-server.com/api/UsersAPI/TestData"; // Physical device or production
            }
            console.log(values);
            const options = {
              url: baseURL,
              method: "GET",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json;charset=UTF-8",
              },
              params: {
                username: values.username,
                password: values.password,
              },
            };

            axios(options)
              .then((response) => {
                console.log("Response Status:", response.status);
                console.log("Response Data:", response.data);
                if (response.data.value == true) setMessage("Logged in");
                if (response.data.value == false) setMessage("User not found");
              })
              .catch((error) => {
                console.error("Error fetching data:", error);
                setMessage("An error occurred");
              });
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

              <Text>
                Don't have an account?{" "}
                <Text
                  style={styles.signupText}
                  onPress={() => setPanel("true")} // Switch to Sign Up panel
                >
                  Sign up
                </Text>
              </Text>

              <TouchableOpacity style={styles.button} onPress={() => handleSubmit()}>
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0077b6",
  },
  card: {
    width: "90%",
    padding: 25,
    borderRadius: 15,
    backgroundColor: "white",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    alignItems: "center",
  },
  headerText: {
    fontSize: 28,
    color: "#0077b6",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  subHeader: {
    fontSize: 16,
    color: "#555",
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
    color: "#0077b6",
    marginBottom: 5,
    fontWeight: "500",
  },
  input: {
    width: "100%",
    backgroundColor: "#f1f1f1",
    padding: 14,
    borderRadius: 8,
    fontSize: 16,
    color: "#333",
  },
  button: {
    backgroundColor: "#0077b6",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  linkContainer: {
    marginTop: 20,
  },
  linkText: {
    color: "#0077b6",
    fontSize: 14,
    textDecorationLine: "underline",
  },
  signupText: {
    fontWeight: "bold",
    textDecorationLine: "underline",
    color: "#0077b6",
  },
});

export default Log_In;
