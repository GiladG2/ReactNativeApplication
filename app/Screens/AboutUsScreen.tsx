import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Card } from "react-native-paper";

const AboutUsScreen = () => {
  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.header}>Want to track your progress?</Text>
          <Text style={styles.header}>
            Want to have the knowledge of a personal trainer by your side at all times?
          </Text>
          <Text style={styles.description}>
            We are <Text style={styles.bold}>OneLife</Text>, a team passionate about sports, and we're here to make your workouts better, one step at a time.
          </Text>
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "#f9f9f9",
    padding: 20,
    borderRadius: 10,
    elevation: 3,
    width: "100%",
  },
  header: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginTop: 10,
  },
  bold: {
    fontWeight: "700",
    color: "#000",
  },
});

export default AboutUsScreen;
