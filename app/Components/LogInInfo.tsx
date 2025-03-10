import { View, Text, TouchableOpacity } from "react-native";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Calendar } from "react-native-calendars";
import axios from "axios";
import AuthContext from "../Context/AppContext";
import { useFocusEffect } from "expo-router";

const LogInInfo = () => {
  const [logState, setLogState] = useState(false);
  const { user, baseURL } = useContext(AuthContext)!;
  const [markedDates, setMarkedDates] = useState({});

  useFocusEffect(
    useCallback(() => {
      if (!user?.username) return;

      axios
        .get(`${baseURL}api/TrainingLogAPI/GetLogHistory`, {
          params: { username: user.username },
        })
        .then((response) => {
          if (response.status === 200) {
            setMarkedDates(response.data);
          }
        })
        .catch((error) => {
          console.error("Error fetching log history:", error);
        });

      // Cleanup function (optional)
      return () => {};
    }, [user?.username, baseURL])
  );

  const onDayPress = (day) => {
    const selectedDate = day.dateString;

    setMarkedDates((prevMarkedDates) => ({
      ...prevMarkedDates,
      [selectedDate]: {
        marked: true,
        selected: !prevMarkedDates[selectedDate]?.selected, // Toggle selection
        selectedColor: "blue",
      },
    }));

    console.log("Selected day:", selectedDate);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setLogState(true)}>
        <View>
          <LinearGradient
            colors={["#D4FC79", "#00FF00"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.editGradient}
          >
            {!logState ? (
              <Text style={styles.text}>View your activity!</Text>
            ) : (
              <View style={styles.calendarContainer}>
                <Text
                  onPress={() => setLogState(false)}
                  style={{ textAlign: "right", fontWeight: "bold" }}
                >
                  X
                </Text>
                <Calendar
                  style={styles.calendarStyle}
                  onDayPress={onDayPress}
                  markedDates={markedDates}
                  theme={{
                    backgroundColor: "#f0f0f0",
                    calendarBackground: "#ffffff",
                    todayTextColor: "#FF5733",
                    dayTextColor: "#333",
                    monthTextColor: "#228B22",
                    textDayFontWeight: "bold",
                    textMonthFontWeight: "bold",
                    textDayHeaderFontWeight: "bold",
                    textDayFontSize: 16,
                    textMonthFontSize: 18,
                    textDayHeaderFontSize: 14,
                    arrowColor: "#228B22",
                  }}
                />
              </View>
            )}
          </LinearGradient>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default LogInInfo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  editGradient: {
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  calendarContainer: {
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  calendarStyle: {
    borderRadius: 10,
    padding: 5,
  },
});
