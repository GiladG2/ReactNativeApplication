import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Calendar } from "react-native-calendars";
import AuthContext from "../Context/AppContext";
import axios from "axios";

const DashboardScreen = () => {
  const { user, baseURL } = useContext(AuthContext)!;
  const [markedDates, setMarkedDates] = useState({});
  const [userData, setUserData] = useState({
    name: "",
    password: "",
    email: "",
    phone: "",
  });
  const [editState, setEditState] = useState(false);
  const [editableData, setEditableData] = useState({
    name: "",
    password: "",
    email: "",
    phone: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!user?.username) return; // Prevent API calls if user is null

    axios
      .get(`${baseURL}api/UsersAPI/GetUser`, {
        params: { username: user.username },
      })
      .then((response) => {
        if (response.status === 200) {
          const data = {
            name: response.data.value.firstName,
            password: response.data.value.password,
            email: response.data.value.email,
            phone: response.data.value.phone,
          };
          setUserData(data);
          // Only update editableData if you're not currently editing
          if (!editState) {
            setEditableData(data);
          }
        }
      })
      .catch((error) =>
        setErrorMessage("Error fetching user data: " + error.message)
      );

    axios
      .get(`${baseURL}api/TrainingLogAPI/GetLogHistory`, {
        params: { username: user.username },
      })
      .then((response) => {
        if (response.status === 200) {
          setMarkedDates(response.data);
        }
      })
      .catch((error) =>
        setErrorMessage("Error fetching log history: " + error.message)
      );
  }, [user, editState]);

  const handleSubmit = () => {
    // Update the local state first
    setUserData(editableData);
    setEditState(false);

    const userDataToSend = {
      username: user?.username,
      firstName: editableData.name,
      password: editableData.password,
      phonenumber: editableData.phone, // Must match the backend parameter name
      email: editableData.email,
    };

    axios
      .put(baseURL + "api/UsersAPI/EditProfile", null, {
        params: userDataToSend, // Send data as query parameters
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
      })
      .then((response) => {
        if (response.status === 200) {
          console.log("User updated successfully:", response.data);
          setUserData(editableData);
          setErrorMessage("");
        }
      })
      .catch((error) =>
        setErrorMessage("Error updating user: " + error.message)
      );
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.header}>Welcome, {user?.username}!</Text>
        {errorMessage ? (
          <Text style={styles.errorText}>{errorMessage}</Text>
        ) : null}
        <View style={styles.card}>
          {!editState ? (
            <>
              <Text style={styles.infoLabel}>Name</Text>
              <Text style={styles.info}>{userData.name}</Text>
              <Text style={styles.infoLabel}>Password</Text>
              <Text style={styles.info}>••••••••</Text>
              {/* Hide actual password */}
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.info}>{userData.email}</Text>
              <Text style={styles.infoLabel}>Phone</Text>
              <Text style={styles.info}>{userData.phone}</Text>
              <Text
                style={styles.editButton}
                onPress={() => setEditState(true)}
              >
                Edit
              </Text>
            </>
          ) : (
            <>
              <Text style={styles.infoLabel}>Name</Text>
              <TextInput
                style={styles.input}
                value={editableData.name}
                onChangeText={(text) =>
                  setEditableData({ ...editableData, name: text })
                }
              />
              <Text style={styles.infoLabel}>Password</Text>
              <TextInput
                style={styles.input}
                value={editableData.password}
                secureTextEntry={true}
                onChangeText={(text) =>
                  setEditableData({ ...editableData, password: text })
                }
              />
              <Text style={styles.infoLabel}>Email</Text>
              <TextInput
                style={styles.input}
                value={editableData.email}
                onChangeText={(text) =>
                  setEditableData({ ...editableData, email: text })
                }
              />
              <Text style={styles.infoLabel}>Phone</Text>
              <TextInput
                style={styles.input}
                value={editableData.phone}
                onChangeText={(text) =>
                  setEditableData({ ...editableData, phone: text })
                }
              />
              <Button title="Submit" onPress={handleSubmit} />
            </>
          )}
        </View>

        <Text style={styles.subHeader}>Activity Log</Text>
        <View style={styles.calendarContainer}>
          <Calendar
            markedDates={markedDates}
            theme={{
              backgroundColor: "#ffffff",
              calendarBackground: "#f5f5f5",
              todayTextColor: "#007AFF",
              dayTextColor: "#333",
              monthTextColor: "#007AFF",
              textDayFontWeight: "bold",
              textMonthFontWeight: "bold",
              textDayHeaderFontWeight: "bold",
              textDayFontSize: 16,
              textMonthFontSize: 18,
              textDayHeaderFontSize: 14,
              arrowColor: "#007AFF",
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default DashboardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  subHeader: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#007AFF",
    marginTop: 30,
    marginBottom: 10,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#f5f5f5",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#007AFF",
  },
  info: {
    fontSize: 18,
    color: "#333",
    marginBottom: 10,
  },
  input: {
    fontSize: 18,
    color: "#333",
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
  },
  editButton: {
    textAlign: "center",
    fontSize: 16,
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 15,
    padding: 5,
    marginTop: 10,
  },
  calendarContainer: {
    borderRadius: 10,
    backgroundColor: "#f5f5f5",
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10,
  },
});
