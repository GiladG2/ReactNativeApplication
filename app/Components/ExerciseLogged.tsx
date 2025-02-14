import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Exercise from "../Interfaces/IExercise";
import axios from "axios";
import AuthContext from "../Context/AppContext";

interface ExerciseLoggedProp {
  exercise: Exercise;
  date?: Date;
  setExercisesLogged: React.Dispatch<React.SetStateAction<Exercise[]>>;
  setOrder: React.Dispatch<React.SetStateAction<number>>;
}

const ExerciseLogged = ({
  exercise,
  date,
  setExercisesLogged,
  setOrder,
}: ExerciseLoggedProp) => {
  const { user, baseURL } = useContext(AuthContext)!;

  // local state to toggle edit mode and hold edited values
  const [editState, setEditState] = useState(false);
  const [editedReps, setEditedReps] = useState<number>(exercise.reps);
  const [editedWeight, setEditedWeight] = useState<number>(exercise.weight);

  // Optional: update local state if the exercise prop changes
  useEffect(() => {
    setEditedReps(exercise.reps);
    setEditedWeight(exercise.weight);
  }, [exercise]);
  useEffect(() => {
    if (editedReps < 0) setEditedReps(0);
    if (editedWeight < 0) setEditedWeight(0);
  }, [editedReps, editedWeight]);
  const handleEdit = (order: number) => {
    axios
      .put(baseURL + "api/TrainingLogAPI/EditLoggedExercise", null, {
        params: {
          exerciseId: exercise.exerciseId,
          username: user?.username,
          date: date,
          order: order,
          reps: editedReps,
          weightKg: editedWeight,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          console.log(response.data)
          if (response.data.value == true) {
            console.log("Exercise updated successfully");
            setExercisesLogged((prevExercises) =>
              prevExercises.map((ex) =>
                ex.order === exercise.order
                  ? { ...ex, reps: editedReps, weight: editedWeight }
                  : ex
              )
            );
          } else {
            console.log("Exercise update failed");
          }
        }
      })
      .catch((error) => {
        console.error("Error updating exercise", error);
      });
  };

  const handleDelete = (order: number) => {
    axios
      .delete(baseURL + "api/TrainingLogAPI/DeleteLoggedExercise", {
        params: {
          exerciseId: exercise.exerciseId,
          order: order,
          username: user?.username,
          date: date,
        },
      })
      .then((response) => {
        console.log("Delete response:", response.data.value);
        // Remove the deleted exercise from the list
        setExercisesLogged((prevExercises) =>
          prevExercises.filter((ex) => ex.order !== order)
        );
      })
      .catch((error) => {
        console.error("Error deleting exercise", error);
      });
  };

  return (
    <LinearGradient
      colors={["#fff", "#f5f1e3"]}
      style={styles.exerciseContainer}
    >
      <Text style={styles.exerciseName}>{exercise.exerciseName}</Text>
      <View style={styles.infoRow}>
        {!editState && (
          <>
            <Text style={styles.infoText}>Reps: {exercise.reps}</Text>
            <Text style={styles.infoText}>Weight: {exercise.weight}</Text>
          </>
        )}
        {editState && (
          <>
            <View style={styles.editRow}>
              <Text style={styles.editLabel}>Reps:</Text>
              <TouchableOpacity
                onPress={() => setEditedReps(editedReps - 1)}
                style={styles.miniButton}
              >
                <Text style={styles.miniButtonText}>-</Text>
              </TouchableOpacity>
              <TextInput
                style={styles.editInput}
                value={String(editedReps)}
                keyboardType="numeric"
                onChangeText={(text) => setEditedReps(Number(text) || 0)}
              />
              <TouchableOpacity
                onPress={() => setEditedReps(editedReps + 1)}
                style={styles.miniButton}
              >
                <Text style={styles.miniButtonText}>+</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.editRow}>
              <Text style={styles.editLabel}>Weight:</Text>
              <TouchableOpacity
                onPress={() => setEditedWeight(editedWeight - 2.5)}
                style={styles.miniButton}
              >
                <Text style={styles.miniButtonText}>-</Text>
              </TouchableOpacity>
              <TextInput
                style={styles.editInput}
                value={String(editedWeight)}
                keyboardType="numeric"
                onChangeText={(text) => setEditedWeight(Number(text) || 0)}
              />
              <TouchableOpacity
                onPress={() => setEditedWeight(editedWeight + 2.5)}
                style={styles.miniButton}
              >
                <Text style={styles.miniButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
      <View style={styles.actionsContainer}>
        <TouchableOpacity>
          {!editState ? (
            <Text style={styles.actionText} onPress={() => setEditState(true)}>
              Edit
            </Text>
          ) : (
            <Text
              style={styles.actionText}
              onPress={() => {
                handleEdit(exercise.order);
                setEditState(false);
              }}
            >
              Save
            </Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(exercise.order)}>
          <Text style={styles.actionText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

export default ExerciseLogged;

const styles = StyleSheet.create({
  exerciseContainer: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  exerciseName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#6f4e37",
    fontFamily: "Georgia",
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: "column",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  infoText: {
    fontSize: 16,
    color: "#6f4e37",
    fontFamily: "Georgia",
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  actionText: {
    backgroundColor: "#6f4e37",
    color: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    fontSize: 16,
    fontFamily: "Georgia",
    fontWeight: "bold",
  },
  editRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },
  editLabel: {
    fontSize: 16,
    color: "#6f4e37",
    fontFamily: "Georgia",
    marginRight: 8,
  },
  editInput: {
    borderWidth: 1,
    borderColor: "#6f4e37",
    borderRadius: 8,
    padding: 4,
    width: 50,
    textAlign: "center",
    marginHorizontal: 4,
    fontSize: 16,
  },
  miniButton: {
    backgroundColor: "#6f4e37",
    borderRadius: 15,
    padding: 4,
    width: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  miniButtonText: {
    fontSize: 18,
    color: "#fff",
    fontFamily: "Georgia",
  },
});
