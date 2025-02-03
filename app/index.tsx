import React from "react";
import { StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer, NavigationIndependentTree } from "@react-navigation/native";
import HomeScreen from "./Screens/HomeScreen";
import Log_In from "./Screens/Log_InScreen";
import Sign_Up from "./Screens/Sign_UpScreen";
import Training_LogScreen from "./Screens/Training_LogScreen";
import Ionicons from "react-native-vector-icons/Ionicons";
import LinearGradient from "react-native-linear-gradient";

import { NavigationBar } from "./Components/NavigationBar";

const home = "Home";
const logIn = "Get started";
const trainingLog = "Training log";
const Tab = createBottomTabNavigator();

export default function App() {
  return (
  <NavigationBar/>
   
  );
}

const styles = StyleSheet.create({
  // You can define additional styles if needed
  pageContainer: {
    backgroundColor: "#00aed1",
    flex: 1,
  },
});
