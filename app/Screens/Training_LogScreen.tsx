import React, { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import AuthContext from "../Context/AppContext";
import axios from "axios";
import ExerciseLogged from "../Components/ExerciseLogged";
import { TextInput } from "react-native-gesture-handler";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Ionicons from "react-native-vector-icons/Ionicons";
import Exercise from "../Interfaces/IExercise"


const TrainingLogScreen = () => {
  const [exercisesLogged, setExercisesLogged] = useState<Exercise[]>([]);
  const [value, setValue] = useState(null);
  const { baseURL } = useContext(AuthContext)!;
  const [exercises, setExercises] = useState<any[]>([]);
  const [currentReps, setCurretReps] = useState(0);
  const [currentWeight, setCurrentWeight] = useState(0);
  const [order, setOrder] = useState(1); // Initialize order (starts at 1)

  // Date picker state
  const [date, setDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  // Fetch the exercises list from your API
  useEffect(() => {
    const url = baseURL + "api/ExercisesAPI/GetExerciseList";
    axios.get(url).then((response) => {
      if (response.status === 200) {
        setExercises(response.data.value);
      }
    });
  }, [baseURL]);

  // Function to handle saving the selected exercise
  const handleSave = () => {
    const selectedExercise = exercises.find(
      (exercise) => exercise.value === value
    );
    if (selectedExercise) {
      const newExercise: Exercise = {
        exerciseId: selectedExercise.value,
        exerciseName: selectedExercise.label,
        order: order,
        reps: currentReps,
        weight: currentWeight,
      };
      setExercisesLogged((prevExercises) => [...prevExercises, newExercise]);
      setOrder((prevOrder) => prevOrder + 1);
    }
  };

  // Date picker functions
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (selectedDate: Date) => {
    setDate(selectedDate);
    hideDatePicker();
  };

  // Custom render item for the dropdown list
  const renderItem = (item: any) => {
    return (
      <View style={styles.item}>
        <Text style={styles.itemText}>{item.label}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.logContainer}>
          <Text style={styles.header}>Log your workout</Text>

          {/* DATE PICKER SECTION */}
          <View style={styles.dateRow}>
            <Ionicons
              name="calendar-outline"
              size={24} // Appropriate size for the icon
              color="#0077b6" // Color matching your theme
              style={{ marginRight: 8 }} // Space between the icon and the date text
            />
            <TouchableOpacity onPress={showDatePicker}>
              <Text style={styles.dateText}>{date.toLocaleDateString()}</Text>
            </TouchableOpacity>
          </View>
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
          />
          {/* END DATE PICKER SECTION */}

          <Text style={styles.label}>Select an exercise:</Text>
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            iconStyle={styles.iconStyle}
            data={exercises}
            search
            maxHeight={200}
            labelField="label"
            valueField="value"
            placeholder="Select item"
            searchPlaceholder="Search..."
            value={value}
            onChange={(item: any) => {
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

            {/* Save Button */}
            <TouchableOpacity onPress={handleSave}>
              <Text style={styles.saveButton}>Save</Text>
            </TouchableOpacity>
          </View>

          {/* Render the logged exercises */}
          <View>
            {exercisesLogged.map((exercise) => (
              <ExerciseLogged key={exercise.order} exercise={exercise} />
            ))}
          </View>
        </View>
        <Text style={styles.graphText}>Graph</Text>
      </ScrollView>
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
  dateContainer: {
    alignItems: "center",
    marginBottom: 20,
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
    backgroundColor: "transparent",
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
    color: "white",
    marginRight: 10,
  },
  button: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginHorizontal: 6,
  },
  buttonText: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    alignSelf: "center",
  },
  dateText: {
    fontSize: 14,
    color: "#0077b6",
    textAlign: "center",
    padding: 10,
    backgroundColor: "#f1f1f1",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    width:250,

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
  saveButton: {
    color: "white",
    borderColor: "white",
    borderRadius: 10,
    borderWidth: 2,
    textAlign: "center",
    marginLeft: 60,
    padding: 5,
  },
});
