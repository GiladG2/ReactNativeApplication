import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import AuthContext from "../Context/AppContext";
import axios from "axios";
import ExerciseLogged from "../Components/ExerciseLogged";
import { TextInput } from "react-native-gesture-handler";

const TrainingLogScreen = () => {
  const [value, setValue] = useState(null);
  const { baseURL } = useContext(AuthContext)!;
  const [exercises, setExercises] = useState([]);
  const [currentReps, setCurretReps] = useState(0);
  const [currentWeight, setCurrentWeight] = useState(0);
  useEffect(() => {
    const url = baseURL + "api/ExercisesAPI/GetExerciseList";
    axios.get(url).then((response) => {
      if (response.status === 200) {
        setExercises(response.data.value);
      }
    });
  }, []);
  // Custom renderItem to control list item appearance
  const renderItem = (item) => {
    return (
      <View style={styles.item}>
        <Text style={styles.itemText}>{item.label}</Text>
      </View>
    );
  };
  const handleSave = () => {};
  return (
    <View style={styles.container}>
      <View style={styles.logContainer}>
        <Text style={styles.header}>Log your workout!</Text>
        <Text style={styles.label}>Select an exercise:</Text>
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={exercises}
          search
          maxHeight={200} // Limit height to enable scrolling if needed
          labelField="label"
          valueField="value"
          placeholder="Select item"
          searchPlaceholder="Search..."
          value={value}
          onChange={(item) => {
            setValue(item.value);
          }}
          dropdownStyle={styles.dropdownStyle}
          renderItem={renderItem}
        />

        <View style={styles.containerForLog}>
          {/* Reps Section */}
          <View style={styles.section}>
            <Text style={styles.labelForSave}>Reps:</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setCurretReps(currentReps - 1)}
            >
              <Text style={styles.buttonText}>-</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              value={String(currentReps)}
              editable={false}
            />
            <TouchableOpacity
              style={styles.button}
              onPress={() => setCurretReps(currentReps + 1)}
            >
              <Text style={styles.buttonText}>+</Text>
            </TouchableOpacity>
          </View>

          {/* Weight Section */}
          <View style={styles.section}>
            <Text style={styles.labelForSave}>Weight:</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setCurrentWeight(currentWeight - 1)}
            >
              <Text style={styles.buttonText}>-</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              value={String(currentWeight)}
              editable={false}
            />
            <TouchableOpacity
              style={styles.button}
              onPress={() => setCurrentWeight(currentWeight + 1)}
            >
              <Text style={styles.buttonText}>+</Text>
            </TouchableOpacity>
          </View>
          <Text onPress={() => handleSave()} style={styles.saveButton}>Save</Text>
        </View>

        <ExerciseLogged exercise={{ exerciseId: 0, exerciseName: "3" }} />
      </View>

      <Text style={styles.graphText}>Graph</Text>
    </View>
  );
};

export default TrainingLogScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  logContainer: {
    backgroundColor: "#af621c",
    margin: 10,
    padding: 10,
    borderRadius: 15,
  },
  header: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "white",
  },
  label: {
    marginBottom: 5,
    color: "white",
    fontSize: 14,
  },
  dropdown: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 8,
    backgroundColor: "white",
  },
  placeholderStyle: {
    fontSize: 12,
    color: "#999",
  },
  selectedTextStyle: {
    fontSize: 12,
    color: "#333",
  },
  inputSearchStyle: {
    height: 35,
    fontSize: 12,
  },
  iconStyle: {
    width: 15,
    height: 15,
  },
  dropdownStyle: {
    position: "absolute",
    top: 45,
    left: 0,
    right: 0,
    zIndex: 1000,
    borderRadius: 6,
  },
  item: {
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  itemText: {
    fontSize: 12,
    color: "#333",
  },
  graphText: {
    margin: 10,
    fontSize: 16,
  },
  containerForLog: {
    backgroundColor: "transperent",
    width: "80%",
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    marginLeft: 40,
  },
  labelForSave: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white", // Coffee brown
    marginRight: 10,
  },
  // Updated button style for refined look
  button: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginHorizontal: 6,
  },
  buttonText: {
    fontSize: 16,
    color: "white", // Coffee brown
    fontWeight: "bold",
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#af621c",
    borderRadius: 6,
    paddingHorizontal: 12,
    textAlign: "center",
    fontSize: 14,
    fontWeight: "bold",
    color: "#3d1e0f",
    width: 50,
  },
  saveButton:{
    color:"white",
    borderColor:"white",
    borderRadius:10,
    borderWidth:2,
    textAlign:"center",
    marginLeft:60,
  }
});
