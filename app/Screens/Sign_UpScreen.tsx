import { Formik } from "formik";
import React, { useContext, useState } from "react";
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import axios from "axios";
import * as Yup from "yup"; // Import YUP for validation
import AuthContext from "../Context/AppContext";
import { useNavigation } from "expo-router";

interface Sign_UpProps {
  panel: string;
  setPanel: (panel: string) => void;
}

function Sign_Up({ panel, setPanel }: Sign_UpProps) {
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const { user, setUser, baseURL } = useContext(AuthContext)!;
  const navigation = useNavigation();
  // YUP Validation Schema
  const validationSchema = Yup.object().shape({
    username: Yup.string()
      .max(12, "Username cannot be longer than 12 characters")
      .required("Username is required"),
    password: Yup.string()
      .matches(
        /^(?=.*[!#@%^&>{}])(?=.{1,}$).*/,
        "Password must contain at least one special character (!#@%^&>{})"
      )
      .required("Password is required"),
    phone: Yup.string()
      .matches(
        /^(?:\+972|0)(?:-?|\s?)\d{1,2}(?:-?|\s?)\d{3}(?:-?|\s?)\d{4}$/,
        "Invalid Israeli phone number"
      )
      .required("Phone number is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    firstname: Yup.string()
      .matches(
        /^[A-Z][a-z]{1,}$/,
        "First name must start with an uppercase letter and follow with lowercase letters"
      )
      .required("First name is required"),
    gender: Yup.string()
      .oneOf(["0", "1"], "Gender must be selected")
      .required("Gender is required"),
    date: Yup.date().required("Date of birth is required"),
  });
  const [message, setMessage] = useState("");
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.headerText}>Sign Up</Text>
        <Text style={styles.subHeader}>Create your account</Text>
        <Text>{message}</Text>
        <Formik
          initialValues={{
            username: "",
            password: "",
            phone: "",
            email: "",
            firstname: "",
            gender: "0",
            date: new Date().toISOString().split("T")[0],
          }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            console.log(values);
            const url = baseURL + "api/UsersAPI/AddUser";
            console.log(url);
            const params = {
              username: values.username,
              password: values.password,
              firstname: values.firstname,
              phonenumber: values.phone,
              gender: values.gender,
              date: values.date,
              goal: 0,
              access: 0,
              email: values.email,
            };
            axios
              .post(url, null, {
                params: params,
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json;charset=UTF-8",
                },
              })
              .then((response) => {
                console.log("Response Status:", response.status);
                console.log("Response Data:", response.data);
                if (response.data.value.message === "Success") {
                  setMessage("Registered successfully");
                  setTimeout(() => {
                    const options = {
                      url: baseURL + "api/UsersAPI/TestData",
                      method: "GET",
                      headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json;charset=UTF-8",
                      },
                      params: {
                        username: values.username,
                        password: values.password,
                      },
                      withCredentials: true, // Important for sending cookies
                    };
                    axios(options).then(async () => {
                      const sessionResponse = await axios.get(
                        baseURL + "api/UsersAPI/CheckSession"
                      );
                      console.log(
                        "Is Authenticated = " +
                          sessionResponse.data.isAuthenticated
                      );
                      if (sessionResponse.data.isAuthenticated) {
                        setUser({
                          username: response.data.username,
                          accesskey: response.data.accesskey,
                        });
                        navigation.navigate('Home');
                      }
                    });
                  }, 1000);
                }
                if (response.data.value.message === "This username is taken")
                  setMessage("This username is taken");
                if (response.data.value.message === "Error") setMessage("Error");
              })
              .catch((error) => {
                if (error.response) {
                  console.error(
                    "Error submitting form:",
                    error.response.status
                  );
                  console.error("Error data:", error.response.data);
                } else if (error.request) {
                  console.error("No response received:", error.request);
                } else {
                  console.error("Error", error.message);
                }
              });
          }}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
            values,
            touched,
            errors,
          }) => (
            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Username</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your username"
                  onChangeText={handleChange("username")}
                  onBlur={handleBlur("username")}
                  value={values.username}
                />
                {touched.username && errors.username && (
                  <Text style={styles.errorText}>{errors.username}</Text>
                )}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  secureTextEntry
                  onChangeText={handleChange("password")}
                  onBlur={handleBlur("password")}
                  value={values.password}
                />
                {touched.password && errors.password && (
                  <Text style={styles.errorText}>{errors.password}</Text>
                )}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Phone</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your phone"
                  keyboardType="phone-pad"
                  onChangeText={handleChange("phone")}
                  onBlur={handleBlur("phone")}
                  value={values.phone}
                />
                {touched.phone && errors.phone && (
                  <Text style={styles.errorText}>{errors.phone}</Text>
                )}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  keyboardType="email-address"
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                  value={values.email}
                />
                {touched.email && errors.email && (
                  <Text style={styles.errorText}>{errors.email}</Text>
                )}
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>First Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your firstname"
                  onChangeText={handleChange("firstname")}
                  onBlur={handleBlur("firstname")}
                  value={values.firstname}
                />
                {touched.firstname && errors.firstname && (
                  <Text style={styles.errorText}>{errors.firstname}</Text>
                )}
              </View>

              <View style={styles.genderContainer}>
                <TouchableOpacity
                  style={[
                    styles.genderButton,
                    values.gender === "0" && styles.selectedGender,
                  ]}
                  onPress={() => setFieldValue("gender", "0")}
                >
                  <Text style={[styles.genderText, { color: "black" }]}>
                    Male
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.genderButton,
                    values.gender === "1" && styles.selectedGender,
                  ]}
                  onPress={() => setFieldValue("gender", "1")}
                >
                  <Text style={[styles.genderText, { color: "black" }]}>
                    Female
                  </Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                style={styles.input}
              >
                <Text style={styles.dateText}>
                  {values.date || "Select Date of Birth"}
                </Text>
              </TouchableOpacity>

              {showDatePicker && (
                <DateTimePicker
                  value={date}
                  mode="date"
                  display="default"
                  onChange={(event: any, selectedDate?: Date | undefined) => {
                    setShowDatePicker(false);
                    if (selectedDate) {
                      setDate(selectedDate);
                      setFieldValue(
                        "date",
                        selectedDate.toISOString().split("T")[0]
                      );
                    }
                  }}
                />
              )}

              <Text style={styles.textLink}>
                Already have an account?{" "}
                <Text onPress={() => setPanel("false")} style={styles.linkText}>
                  Log in
                </Text>
              </Text>

              <TouchableOpacity
                style={styles.submitButton}
                onPress={() => handleSubmit()}
              >
                <Text style={styles.buttonText}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1, // Ensures content can scroll
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0077b6",
    padding: 15,
  },
  card: {
    width: "100%",
    padding: 25,
    borderRadius: 15,
    backgroundColor: "white",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    alignItems: "center",
  },
  headerText: {
    fontSize: 28,
    color: "#0077b6",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  subHeader: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 25,
  },
  form: {
    width: "100%",
    paddingHorizontal: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: "#0077b6",
    marginBottom: 5,
    fontWeight: "500",
  },
  input: {
    width: "100%",
    backgroundColor: "#f1f1f1",
    padding: 10,
    borderRadius: 10,
    borderColor: "#ccc",
    borderWidth: 1,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
  },
  genderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  genderButton: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f1f1f1",
    borderRadius: 10,
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedGender: {
    backgroundColor: "#0077b6",
  },
  genderText: {
    color: "#0077b6",
  },
  dateText: {
    fontSize: 14,
    color: "#0077b6",
  },
  textLink: {
    fontSize: 14,
    textAlign: "center",
    color: "#555",
  },
  linkText: {
    color: "#0077b6",
    fontWeight: "500",
  },
  submitButton: {
    backgroundColor: "#0077b6",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    width: "100%",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});

export default Sign_Up;
