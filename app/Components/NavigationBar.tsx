import React, { useContext } from "react";
import { StyleSheet, View, Text } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  NavigationContainer,
  NavigationIndependentTree,
  DefaultTheme,
} from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import HomeScreen from "../Screens/HomeScreen";
import Training_LogScreen from "../Screens/Training_LogScreen";
import GetStartedScreen from "../Screens/GetStartedScreen";
import AuthContext from "../Context/AppContext";
import DashboardScreen from "../Screens/DashboardScreen";
import AboutUsScreen from "../Screens/AboutUsScreen";
const home = "Home";
const logIn = "Get started";
const trainingLog = "Training log";
const dashboard = "Dashboard";
const aboutUs = "About us"
const Tab = createBottomTabNavigator();
//const {user,setUser} = useContext(AuthContext)!
// Create a custom theme by extending the default theme
const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "#fff",
    // Global background color for all screens
  },
};
export function NavigationBar() {
  const { user, setUser } = useContext(AuthContext)!;

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
              else if(route.name === dashboard){
                                iconName = focused ? "stats-chart" : "stats-chart-outline";
              }
              else if(route.name === aboutUs){
                iconName = focused ? "information" : "information-outline";
              }
              return <Ionicons name={iconName} size={size} color={color} />;
            },
          })}
        >
          <Tab.Screen name={home} component={HomeScreen} />
          {user !== null ? (
            <>
              <Tab.Screen name={dashboard} component={DashboardScreen} />
              <Tab.Screen name={trainingLog} component={Training_LogScreen} />
            </>
          ) : (
            <>
              <Tab.Screen name={logIn} component={GetStartedScreen} />
              <Tab.Screen name={aboutUs} component={AboutUsScreen} />
            </>
          )}
        </Tab.Navigator>
      </NavigationContainer>
    </NavigationIndependentTree>
  );
  //  }
  return (
    <View>
      <Text>Logged in</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  // Optionally, you can define additional styles here.
});
