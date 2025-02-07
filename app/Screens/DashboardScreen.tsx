import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient"; // Using expo-linear-gradient
import { Formik } from "formik";
import AuthContext from "../Context/AppContext";
import axios from "axios";
import EditProfile from "../Components/EditProfile";
const DashboardScreen = () => {
  const { user, baseURL } = useContext(AuthContext)!;
  const [passwordData, setPassword] = useState("");
  const [phoneData, setPhone] = useState("");
  const [emailData, setEmail] = useState("");
  const [nameData, setName] = useState("");
  const [editState,setEditState] = useState(false)
  useEffect(() => {
    const options = {
      url: baseURL + "api/UsersAPI/GetUser",
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
      params: {
        username: user?.username,
      },
      withCredentials: true, // Important for sending cookies
    };
    axios(options).then((response) => {
      if (response.status === 200) {
        setName(response.data.value.firstName);
        setEmail(response.data.value.email);
        setPhone(response.data.value.phone);
        setPassword(response.data.value.password);
      }
    });
  }, []);
  return (
    <ScrollView style={styles.mainTheme}>
      <LinearGradient
        // Subtle gradient: white to a very light grey
        colors={["#ffffff", "#f9f9f9"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <Text style={styles.header}>
          Welcome to your dashboard, {user?.username}
        </Text>
        <View style={styles.section}>
          <Text style={styles.sectionText}>View your activity</Text>
        </View>
        <EditProfile 
          emailData={emailData}
          passwordData={passwordData}
          nameData={nameData}
          phoneData={phoneData}
        />
        <View>
          <LinearGradient
           colors={["#D4FC79", "#00FF00"]} // Lime gradient colors
            start={{ x: 0, y: 0 }} // Starting point (top-left)
            end={{ x: 1, y: 1 }}
            style={styles.editGradient}
          >
          <Text>Here - log in info</Text>
          </LinearGradient>
        </View>
      </LinearGradient>
    </ScrollView>
  );
};

export default DashboardScreen;

const styles = StyleSheet.create({
  mainTheme: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    padding: 20, // Optional: add some padding around your content
  },
  header: {
    fontSize: 20,
    color: "#333", // Darker text to contrast against a light background
    textAlign: "center",
    marginVertical: 20,
  },
  section: {
    marginVertical: 10,
  },
  sectionText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
  },
  input: {
    margin: 20,
    color: "white",
    backgroundColor: "transparent",
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "white",
  },
  editProfile: {
    backgroundColor: "orange",
    borderRadius: 15,
  },
  editGradient: {
    borderRadius: 15,
    padding: 20, // Adds inner spacing to emphasize the gradient area
    // Optional: add shadow for more depth (iOS)
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    // Optional: add elevation for Android
    elevation: 5,
  },
  label: {
    color: "white",
    marginLeft: 20,
    fontWeight: "bold",
    fontSize: 16,
  },
});
