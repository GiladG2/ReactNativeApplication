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
import { LinearGradient } from "expo-linear-gradient";
import Exercise from "../Interfaces/IExercise";
import GraphView from "../Components/GraphView";
import { useNavigation } from "@react-navigation/native";

const TrainingLogScreen = () => {
  const [exercisesLogged, setExercisesLogged] = useState<Exercise[]>([]);
  const [value, setValue] = useState<any>(null);
  const { baseURL, user } = useContext(AuthContext)!;
  const [exercises, setExercises] = useState<any[]>([]);
  const [currentReps, setCurrentReps] = useState(0);
  const [currentWeight, setCurrentWeight] = useState(0);
  const [order, setOrder] = useState(1);
  const navigation = useNavigation();

  // Date picker state
  const [date, setDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  // Redirect if user not logged in
  useEffect(() => {
    if (!user?.username) {
      navigation.navigate("Home");
    }
  }, [user, navigation]);

  // Fetch the exercises list from your API
  useEffect(() => {
    const url = baseURL + "api/ExercisesAPI/GetExerciseList";
    axios.get(url, { withCredentials: true }).then((response) => {
      if (response.status === 200) {
        setExercises(response.data.value);
      }
    });
  }, [baseURL]);

  // Fetch logged exercises and max order when the date changes
  useEffect(() => {
    const logUrl = baseURL + "api/TrainingLogAPI/GetLoggedExercises";
    axios
      .get(logUrl, {
        params: {
          username: user?.username,
          date: date.toISOString(),
        },
        withCredentials: true,
      })
      .then((response) => {
        if (response.status === 200) {
          setExercisesLogged(response.data.value);
          axios
            .get(baseURL + "api/TrainingLogAPI/GetMaxOrder", {
              params: {
                username: user?.username,
                date: date.toISOString(),
              },
              withCredentials: true,
            })
            .then((response) => {
              if (response.status === 200) {
                setOrder(response.data.value);
              }
            });
        }
      })
      .catch((error) =>
        console.error("Error fetching logged exercises:", error)
      );
  }, [date, baseURL, user?.username]);

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
      const url = baseURL + "api/TrainingLogAPI/LogExercise";
      console.log(newExercise.exerciseId)
      console.log(user?.username)
      console.log(date.toISOString())
      console.log(order)
      console.log(currentReps)
      console.log(currentWeight)
      axios
        .post(url, null, {
          params: {
            exerciseId: newExercise.exerciseId,
            username: user?.username,
            date: date.toISOString(),
            order: order,
            reps: currentReps,
            weightKg: currentWeight,
          },
          withCredentials: true,
        })
        .then((response) => {
          console.log("LogExercise response:", response.data.value);
        })
        .catch((error) => console.error("Error logging exercise:", error));
      setExercisesLogged((prev) => [...prev, newExercise]);
      setOrder((prev) => prev + 1);
    }
  };

  // Date picker functions
  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);
  const handleConfirm = (selectedDate: Date) => {
    setDate(selectedDate);
    hideDatePicker();
  };

  const handleDisplayLog = () => {
    setDisplayState(false);
  };
  const handleDisplayGraph = () => {
    setDisplayState(true);
  };

  // Custom render item for the dropdown list
  const renderItem = (item: any) => (
    <View style={styles.dropdownItem}>
      <Text style={styles.dropdownItemText}>{item.label}</Text>
    </View>
  );

  // Prevent negative values
  useEffect(() => {
    if (currentReps < 0) setCurrentReps(0);
    if (currentWeight < 0) setCurrentWeight(0);
  }, [currentReps, currentWeight]);

  const [displayState, setDisplayState] = useState(false); // false = log, true = graph

  return (
    <LinearGradient style={styles.container} colors={["#f5f1e3", "#e8d8c3"]}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.logContainer}>
          <Text style={styles.header}>Log your workout</Text>
          <View style={styles.dateRow}>
            <Ionicons
              name="calendar-outline"
              size={24}
              color="#6f4e37"
              style={{ marginRight: 8 }}
            />
            <TouchableOpacity onPress={showDatePicker}>
              <Text style={styles.dateText}>
                {date.toLocaleDateString()}
              </Text>
            </TouchableOpacity>
          </View>
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
          />
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
              console.log("Selected value:", item.value);
            }}
            dropdownStyle={styles.dropdownStyle}
            renderItem={renderItem}
          />
          <View style={styles.navContainer}>
            <TouchableOpacity onPress={handleDisplayLog}>
              <Text style={styles.navText}>Log your workout</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDisplayGraph}>
              <Text style={styles.navText}>View graph</Text>
            </TouchableOpacity>
          </View>
          {!displayState && (
            <>
              <View style={styles.logDetails}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Reps:</Text>
                  <TouchableOpacity
                    style={styles.counterButton}
                    onPress={() => setCurrentReps(currentReps - 1)}
                  >
                    <Text style={styles.counterButtonText}>-</Text>
                  </TouchableOpacity>
                  <TextInput
                    style={styles.counterInput}
                    value={String(currentReps)}
                    editable={false}
                  />
                  <TouchableOpacity
                    style={styles.counterButton}
                    onPress={() => setCurrentReps(currentReps + 1)}
                  >
                    <Text style={styles.counterButtonText}>+</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Weight :</Text>
                  <TouchableOpacity
                    style={styles.counterButton}
                    onPress={() => setCurrentWeight(currentWeight - 2.5)}
                  >
                    <Text style={styles.counterButtonText}>-</Text>
                  </TouchableOpacity>
                  <TextInput
                    style={styles.counterInput}
                    value={String(currentWeight)}
                    editable={false}
                  />
                  <TouchableOpacity
                    style={styles.counterButton}
                    onPress={() => setCurrentWeight(currentWeight + 2.5)}
                  >
                    <Text style={styles.counterButtonText}>+</Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  style={styles.saveContainer}
                  onPress={handleSave}
                >
                  <Text style={styles.saveButton}>Save</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.loggedExercisesContainer}>
                {exercisesLogged.map((exercise) => (
                  <ExerciseLogged
                    key={exercise.order}
                    exercise={exercise}
                    date={date}
                    setExercisesLogged={setExercisesLogged}
                    setOrder={setOrder}
                  />
                ))}
              </View>
            </>
          )}
          {displayState && (
            <GraphView date={date} exerciseId={value ? value : 0} />
          )}
        </View>
        <Text style={styles.graphText}>Graph</Text>
      </ScrollView>
    </LinearGradient>
  );
};

export default TrainingLogScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 20,
  },
  logContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#6f4e37",
    textAlign: "center",
    marginBottom: 16,
    fontFamily: "Georgia",
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  dateText: {
    fontSize: 16,
    color: "#6f4e37",
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#d3b8a0",
    fontFamily: "Georgia",
  },
  navContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  navText: {
    flex: 0.5,
    textAlign: "center",
    fontSize: 16,
    color: "#6f4e37",
    fontFamily: "Georgia",
  },
  label: {
    fontSize: 18,
    color: "#6f4e37",
    marginBottom: 8,
    fontFamily: "Georgia",
  },
  dropdown: {
    height: 50,
    borderColor: "#6f4e37",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    marginBottom: 16,
  },
  placeholderStyle: {
    fontSize: 16,
    color: "#999",
    fontFamily: "Georgia",
  },
  selectedTextStyle: {
    fontSize: 16,
    color: "#6f4e37",
    fontFamily: "Georgia",
  },
  inputSearchStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 24,
    height: 24,
    tintColor: "#6f4e37",
  },
  dropdownStyle: {
    borderRadius: 20,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  dropdownItemText: {
    fontSize: 16,
    color: "#6f4e37",
    fontFamily: "Georgia",
  },
  logDetails: {
    marginVertical: 16,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 18,
    color: "#6f4e37",
    fontFamily: "Georgia",
    marginRight: 12,
  },
  counterButton: {
    backgroundColor: "#6f4e37",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginHorizontal: 6,
  },
  counterButtonText: {
    fontSize: 20,
    color: "#fff",
    fontFamily: "Georgia",
  },
  counterInput: {
    width: 50,
    textAlign: "center",
    fontSize: 18,
    color: "#6f4e37",
    borderBottomWidth: 1,
    borderColor: "#6f4e37",
    fontFamily: "Georgia",
  },
  saveContainer: {
    alignSelf: "center",
    backgroundColor: "#fff",
    borderRadius: 25,
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderWidth: 2,
    borderColor: "#6f4e37",
    marginTop: 20,
  },
  saveButton: {
    fontSize: 18,
    color: "#6f4e37",
    fontWeight: "bold",
    fontFamily: "Georgia",
  },
  loggedExercisesContainer: {
    marginTop: 20,
  },
  graphText: {
    fontSize: 20,
    color: "#6f4e37",
    textAlign: "center",
    fontFamily: "Georgia",
    marginTop: 20,
  },
});
