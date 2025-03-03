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
import { Formik } from "formik";

interface Sign_UpProps {
  panel: string;
  setPanel: (panel: string) => void;
}

function Sign_Up({ panel, setPanel }: Sign_UpProps) {
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const { user, setUser, baseURL } = useContext(AuthContext)!;
  const navigation = useNavigation();
  const [message, setMessage] = useState("");

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

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.headerText}>Sign Up</Text>
        <Text style={styles.subHeader}>Create your account</Text>
        <Text style={styles.messageText}>{message}</Text>
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
            const url = baseURL + "api/UsersAPI/AddUser";
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
                      withCredentials: true,
                    };
                    axios(options).then(async () => {
                      const sessionResponse = await axios.get(
                        baseURL + "api/UsersAPI/CheckSession"
                      );
                      if (sessionResponse.data.isAuthenticated) {
                        setUser({
                          username: response.data.username,
                          accesskey: response.data.accesskey,
                        });
                        navigation.navigate("Home");
                      }
                    });
                  }, 1000);
                }
                if (response.data.value.message === "This username is taken")
                  setMessage("This username is taken");
                if (response.data.value.message === "Error")
                  setMessage("Error");
              })
              .catch((error) => {
                console.error("Error submitting form:", error);
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
                  placeholderTextColor="#aaa"
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
                  placeholderTextColor="#aaa"
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
                  placeholderTextColor="#aaa"
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
                  placeholderTextColor="#aaa"
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
                  placeholder="Enter your first name"
                  placeholderTextColor="#aaa"
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
                  <Text
                    style={[
                      styles.genderText,
                      values.gender === "0" && styles.selectedGenderText,
                    ]}
                  >
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
                  <Text
                    style={[
                      styles.genderText,
                      values.gender === "1" && styles.selectedGenderText,
                    ]}
                  >
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
                  onChange={(event: any, selectedDate?: Date) => {
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
                <Text
                  onPress={() => setPanel("false")}
                  style={styles.linkText}
                >
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

export default Sign_Up;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#FFF8F0", // Matches Log_In container background
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
  },
  card: {
    width: "100%",
    padding: 25,
    borderRadius: 15,
    backgroundColor: "#FFEBD6", // Soft, warm peach tone
    elevation: 5,
    shadowColor: "#A67C52",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    alignItems: "center",
  },
  messageText: {
    fontSize: 14,
    color: "#A67C52",
    marginBottom: 10,
  },
  headerText: {
    fontSize: 28,
    color: "#A67C52",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  subHeader: {
    fontSize: 16,
    color: "#A67C52",
    textAlign: "center",
    marginBottom: 25,
  },
  form: {
    width: "100%",
    paddingHorizontal: 20,
  },
  inputContainer: {
    marginBottom: 20,
    width: "100%",
  },
  label: {
    fontSize: 14,
    color: "#A67C52",
    marginBottom: 5,
    fontWeight: "500",
  },
  input: {
    width: "100%",
    backgroundColor: "#FFF",
    padding: 14,
    borderRadius: 8,
    fontSize: 16,
    color: "#333",
    borderWidth: 1,
    borderColor: "#E0C3A3",
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
    padding: 14,
    backgroundColor: "#FFF",
    borderRadius: 8,
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E0C3A3",
  },
  selectedGender: {
    backgroundColor: "#A67C52",
  },
  genderText: {
    fontSize: 14,
    color: "#A67C52",
  },
  selectedGenderText: {
    color: "#FFF",
  },
  dateText: {
    fontSize: 14,
    color: "#A67C52",
  },
  textLink: {
    fontSize: 14,
    textAlign: "center",
    color: "#A67C52",
    marginTop: 10,
  },
  linkText: {
    color: "#A67C52",
    fontWeight: "500",
    textDecorationLine: "underline",
  },
  submitButton: {
    backgroundColor: "#A67C52",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
    width: "100%",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
