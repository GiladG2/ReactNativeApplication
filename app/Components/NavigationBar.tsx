import React from "react";
import { StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer, NavigationIndependentTree, DefaultTheme } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import HomeScreen from "../Screens/HomeScreen";
import Log_In from "../Screens/Log_InScreen";
import Training_LogScreen from "../Screens/Training_LogScreen";
import GetStartedScreen from "../Screens/GetStartedScreen";

const home = "Home";
const logIn = "Get started";
const trainingLog = "Training log";
const Tab = createBottomTabNavigator();

// Create a custom theme by extending the default theme
const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "#00aed1",
     // Global background color for all screens
  },
};

export  function NavigationBar() {
  return (
    <NavigationIndependentTree>
      <NavigationContainer theme={MyTheme}>
        <Tab.Navigator
          initialRouteName={home}
          screenOptions={({ route }) => ({
            headerShown: false, // Hide headers globally
            tabBarIcon: ({ focused, color, size }) => {
              let iconName = "";
              if (route.name === home) {
                iconName = focused ? "home" : "home-outline";
              } else if (route.name === logIn) {
                iconName = "log-in-outline";
              } else if (route.name === trainingLog) {
                iconName = focused ? "analytics" : "analytics-outline";
              }
              return <Ionicons name={iconName} size={size} color={color} />;
            },
          })}
        >
          <Tab.Screen name={home} component={HomeScreen} />
          <Tab.Screen name={logIn} component={GetStartedScreen} />
          <Tab.Screen name={trainingLog} component={Training_LogScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </NavigationIndependentTree>
  );
}

const styles = StyleSheet.create({
  // Optionally, you can define additional styles here.
});
