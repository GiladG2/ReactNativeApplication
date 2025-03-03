import { View, StyleSheet, Dimensions, Text } from "react-native";
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
          const formattedData = response.data.value.map((item: any) => ({
            value: item.value,
            label: item.label,
          }));
          setData(formattedData);
        } else {
          setData([]);
        }
      })
      .catch((error) => console.error("API Error at moutning:", error));
  }, [exerciseId, timeFrameValue, date]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>☕ Workout Progress</Text>
      <Dropdown
        data={[
          { label: "All time", value: 0 },
          { label: "Last month", value: 1 },
          { label: "Last 3 months", value: 2 },
          { label: "Last 6 months", value: 3 },
          { label: "Last year", value: 4 },
        ]}
        maxHeight={250}
        labelField="label"
        valueField="value"
        placeholder="Select time frame"
        value={timeFrameValue}
        onChange={(item: any) => setTimeFrameValue(item.value)}
        style={styles.dropdown}
      />
      {data.length > 0 ? (
        <View style={styles.chartContainer}>
          <LineChart
            data={data}
            hideDataPoints
            spacing={(screenWidth - 160) / data.length}
            color="#6F4E37" // Darker brown color
            initialSpacing={0}
            noOfSections={4}
            yAxisColor="transparent"
            yAxisThickness={0}
            rulesType="solid"
            rulesColor="#E0D5C9" // Lighter grid lines
            xAxisColor="#E0D5C9"
            thickness={3}
            animateOnDataChange
            onDataChangeAnimationDuration={500}
            pointerConfig={{
              activatePointersOnLongPress: true, // Show on hover
              pointerStripUptoDataPoint: true,
              pointerStripColor: "#6F4E37",
              pointerStripWidth: 2,
              strokeDashArray: [],
              pointerColor: "#6F4E37",
              radius: 6,
              pointerLabelWidth: 100,
              pointerLabelHeight: 80,
              pointerLabelComponent: (items) => (
                <View style={styles.tooltip}>
                  <Text style={styles.tooltipLabel}>{items[0].label}</Text>
                  <Text style={styles.tooltipValue}>{items[0].value} kg</Text>
                </View>
              ),
            }}
          />
        </View>
      ) : (
        <Text style={styles.noDataText}>No data available ☕</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "#6F4E37",
    fontFamily: "serif",
    marginBottom: 10,
  },
  dropdown: {
    height: 50,
    borderColor: "#8B5A2B",
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  chartContainer: {
    paddingVertical: 20,
    height: 250,
  },
  noDataText: {
    textAlign: "center",
    color: "#8B5A2B",
    fontSize: 16,
    marginTop: 20,
  },
  tooltip: {
    backgroundColor: "#6F4E37",
    borderRadius: 6,
    padding: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  tooltipLabel: {
    color: "#F5E1C8",
    fontSize: 12,
    marginBottom: 4,
  },
  tooltipValue: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default GraphView;
