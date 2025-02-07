import React, { useContext, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import { Formik } from "formik";
import { LinearGradient } from "expo-linear-gradient";
import AuthContext from "../Context/AppContext";
import axios from "axios";

interface EditProfileProps {
  passwordData: string;
  emailData: string;
  nameData: string;
  phoneData: string;
}

export default function EditProfile(editProp: EditProfileProps) {
  const { user, baseURL } = useContext(AuthContext)!;
  const [openState, setOpenState] = useState(false);

  return (
    // Full-screen container
    <View style={{ flex: 1 }}>
      {/* Outer gradient covering the entire page */}
      <LinearGradient colors={["#ffffff", "#f9f9f9"]} style={{ flex: 1 }}>
        <View style={styles.section}>
          <Text style={styles.sectionText}>Edit your profile</Text>
          <Formik
            enableReinitialize={true}
            initialValues={{
              password: editProp.passwordData,
              email: editProp.emailData,
              firstname: editProp.nameData,
              phone: editProp.phoneData,
            }}
            onSubmit={(values) => {
              console.log(values);
              const params = {
                username: user?.username,
                password: values.password,
                firstname: values.firstname,
                phonenumber: values.phone,
                email: values.email,
              };
              axios.post(baseURL + "", null, {
                params: params,
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json;charset=UTF-8",
                },
              });
            }}
          >
            {({ handleChange, handleBlur, handleSubmit, values }) => (
              <View style={styles.editProfile}>
                <LinearGradient
                  colors={["#ffa500", "#ff4500"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.editGradient}
                >
                  {openState ? (
                    <View>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                          width: "100%",
                        }}
                      >
                        <Text style={styles.label}>Firstname</Text>
                        <TouchableOpacity onPress={() => setOpenState(false)}>
                          <Text style={{ fontSize: 20, color: "white" }}>X</Text>
                        </TouchableOpacity>
                      </View>
                      <TextInput
                        placeholderTextColor="white"
                        placeholder="Edit your first name"
                        onChangeText={handleChange("firstname")}
                        onBlur={handleBlur("firstname")}
                        value={values.firstname}
                        style={styles.input}
                      />
                      <View>
                        <Text style={styles.label}>Password</Text>
                        <TextInput
                          placeholderTextColor="white"
                          placeholder="Edit your password"
                          onChangeText={handleChange("password")}
                          onBlur={handleBlur("password")}
                          value={values.password}
                          style={styles.input}
                          secureTextEntry
                        />
                      </View>
                      <View>
                        <Text style={styles.label}>Phone number</Text>
                        <TextInput
                          placeholderTextColor="white"
                          placeholder="Edit your phone"
                          onChangeText={handleChange("phone")}
                          onBlur={handleBlur("phone")}
                          value={values.phone}
                          style={styles.input}
                          keyboardType="phone-pad"
                        />
                      </View>
                      <View>
                        <Text style={styles.label}>Email</Text>
                        <TextInput
                          placeholderTextColor="white"
                          placeholder="Edit your email"
                          onChangeText={handleChange("email")}
                          onBlur={handleBlur("email")}
                          value={values.email}
                          style={styles.input}
                          keyboardType="email-address"
                        />
                      </View>
                      <TouchableOpacity onPress={() => handleSubmit()}>
                        <Text
                          style={{
                            color: "white",
                            borderWidth: 2,
                            textAlign: "center",
                            borderColor: "white",
                            marginHorizontal: 20,
                            borderRadius: 15,
                            padding: 10,
                          }}
                        >
                          Submit
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <Text
                      onPress={() => setOpenState(true)}
                      style={{
                        textAlign: "center",
                        color: "white",
                        fontSize: 25,
                        fontWeight: "bold",
                      }}
                    >
                      Start editing
                    </Text>
                  )}
                </LinearGradient>
              </View>
            )}
          </Formik>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginVertical: 10,
    flex: 1,
  },
  sectionText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
  },
  input: {
    margin: 20,
    color: "white",
    backgroundColor: "transparent",
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "white",
  },
  editProfile: {
    backgroundColor: "orange",
    borderRadius: 15,
    flex: 1,
  },
  editGradient: {
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  label: {
    color: "white",
    marginLeft: 20,
    fontWeight: "bold",
    fontSize: 16,
  },
});
