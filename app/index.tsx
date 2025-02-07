import React from "react";
import { StyleSheet, Text, View  } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer, NavigationIndependentTree } from "@react-navigation/native";
import { AuthProvider } from "./Context/AppContext";
import { NavigationBar } from "./Components/NavigationBar";

const Stack = createStackNavigator(); // Correct Stack Navigator

export default function App() {
  return (
    
    <AuthProvider>
      <NavigationIndependentTree>
        <NavigationContainer>
        <Stack.Navigator  screenOptions={{ headerShown: false, }}>
          <Stack.Screen name="Main" component={NavigationBar} />
        </Stack.Navigator>
      </NavigationContainer>
      </NavigationIndependentTree>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    backgroundColor: "#00aed1",
    flex: 1,
  },
});
