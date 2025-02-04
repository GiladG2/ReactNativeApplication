import React from "react";
import { StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AuthProvider } from "./Context/AppContext";
import { NavigationBar } from "./Components/NavigationBar";

const home = "Home";
const logIn = "Get started";
const trainingLog = "Training log";
const Tab = createBottomTabNavigator();

export default function App() {
  return (
      <AuthProvider>
      <NavigationBar />
    </AuthProvider>   
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    backgroundColor: "#00aed1",
    flex: 1,
  },
});
