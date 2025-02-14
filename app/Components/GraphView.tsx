import { View, StyleSheet, Dimensions, Text, Animated } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { LineChart } from "react-native-gifted-charts";
import axios from "axios";
import AuthContext from "../Context/AppContext";
import { Dropdown } from "react-native-element-dropdown";

interface GraphViewProps {
  date: Date;
  exerciseId: number;
}

const GraphView = ({ date, exerciseId }: GraphViewProps) => {
  const [timeFrameValue, setTimeFrameValue] = useState(0);
  const { user, baseURL } = useContext(AuthContext)!;
  const [data, setData] = useState([]);
  const screenWidth = Dimensions.get("window").width;
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    axios({
      url: `${baseURL}api/TrainingLogAPI/GetGraphData`,
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
      params: {
        username: user?.username,
        exerciseId: exerciseId,
        period: timeFrameValue,
      },
      withCredentials: true,
    })
      .then((response) => {
        if (response.status === 200 && response.data.value.length > 0) {
          console.log("API Data:", response.data.value); // Debugging
          setData(
            response.data.value.map((item: any, index: number) => ({
              value: item.value, // Ensure this is a number
              label: item.date ?? `Point ${index + 1}`, // Optional labels
            }))
          );

          // Start fade-in animation
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }).start();
        } else {
          setData([]);
        }
      })
      .catch((error) => console.error("API Error:", error));
  }, [exerciseId, timeFrameValue]);

  const timeFrameData = [
    { label: "All time", value: 0 },
    { label: "Last month", value: 1 },
    { label: "Last 3 months", value: 2 },
    { label: "Last 6 months", value: 3 },
    { label: "Last year", value: 4 },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>☕ Workout Progress</Text>
      <Dropdown
        data={timeFrameData}
        maxHeight={200}
        labelField="label"
        valueField="value"
        placeholder="Select time frame"
        value={timeFrameValue}
        onChange={(item: any) => setTimeFrameValue(item.value)}
        style={styles.dropdown}
        selectedTextStyle={styles.selectedText}
        placeholderStyle={styles.placeholder}
        itemTextStyle={styles.itemText}
        dropdownStyle={styles.dropdownStyle}
      />
      {data.length > 0 ? (
        <Animated.View style={[styles.chartContainer, { opacity: fadeAnim }]}>
          <LineChart
            data={data}
            width={screenWidth - 40}
            height={250}
            spacing={50}
            initialSpacing={10}
            thickness={4}
            color="#6F4E37" // Coffee brown
            isAnimated
            animationDuration={1000}
            showXAxisIndices
            showYAxisIndices
            xAxisIndicesHeight={5}
            yAxisIndicesWidth={5}
            xAxisColor="#D2B48C" // Light brown
            yAxisColor="#D2B48C"
            backgroundColor="#F5E1C8"
            curve="natural"
            dataPointsColor="#8B5A2B" // Deep brown points
            dataPointsRadius={5}
          />
        </Animated.View>
      ) : (
        <Text style={styles.noDataText}>No data available ☕</Text>
      )}
    </View>
  );
};

export default GraphView;

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: "#F5E1C8", // Warm beige
    borderRadius: 15,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 2, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "#6F4E37", // Coffee brown
    fontFamily: "serif", // Vintage feel
    marginBottom: 10,
  },
  dropdown: {
    height: 50,
    borderColor: "#8B5A2B", // Deep brown
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  selectedText: {
    fontSize: 16,
    color: "#6F4E37",
    fontWeight: "bold",
  },
  placeholder: {
    fontSize: 16,
    color: "#8B5A2B",
  },
  itemText: {
    fontSize: 16,
    color: "#6F4E37",
  },
  dropdownStyle: {
    borderRadius: 8,
    backgroundColor: "#FFF5E1", // Soft cream
  },
  chartContainer: {
    marginTop: 20,
    alignSelf: "center",
    width: "100%",
    overflow: "hidden",
  },
  noDataText: {
    textAlign: "center",
    color: "#8B5A2B",
    fontSize: 16,
    marginTop: 20,
  },
});
