import { View, Text, StyleSheet, TextInput } from "react-native";
import React from "react";

interface Exercise {
  exerciseName?: string;
  exerciseId?: number;
  order: number;
  reps?: number;
  weight?: number;
}

interface ExerciseLoggedProp {
  exercise: Exercise;
}

const ExerciseLogged = ({ exercise }: ExerciseLoggedProp) => {


  return (
    <View style={styles.exerciseContainer}>
      <Text>{exercise.exerciseName}</Text>

      {/* Reps Section */}
      <View style={styles.inputRow}>
        <Text>Reps: {exercise.reps}</Text>
      </View>

      {/* Weight Section */}
      <View style={styles.inputRow}>
        <Text>Weight: {exercise.weight}</Text>
      </View>

      <View style={styles.actionsContainer}>
        <Text
          style={styles.actionText}
          onPress={() => console.log(exercise.exerciseName)}
        >
          Edit
        </Text>
        <Text
          style={styles.actionText}
          onPress={() => console.log(exercise.exerciseId)}
        >
          Delete
        </Text>
      </View>
    </View>
  );
};

export default ExerciseLogged;

const styles = StyleSheet.create({
  exerciseContainer: {
    backgroundColor: "white",
    marginVertical: 20,
    padding: 15,
    borderRadius: 20,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  input: {
    textAlign: "center",
    textDecorationLine: "underline",
    borderColor: "gray",
  },
  operationBtn: {
    fontWeight: "bold",
    fontSize: 18,
    marginHorizontal: 5,
    color: "black",
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  actionText: {
    backgroundColor: "#af621c",
    padding: 10,
    borderRadius: 15,
    width: 70,
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
