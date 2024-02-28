import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Button,
  Modal,
  TextInput,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";

export default function DeleteAccount() {
  return (
    <View>
      <Pressable
        style={styles.deleteButton}
        onPress={() => navigation.navigate("Home")}
      >
        <Text style={styles.textButton}>Delete Account</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  username: {
    fontSize: 24,
    fontWeight: "800",
  },
  container: {
    alignItems: "center",
    justifyContent: "center",
    color: "black",
  },
  textButton: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  input: {
    color: "black",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    width: "70%",
  },
  button: {
    color: "white",
    width: "40%",
    marginTop: "5%",
    marginBottom: 30,
    alignItems: "center",
    alignSelf: "flex-end",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    backgroundColor: "#226871",
  },
  accountButton: {
    color: "white",
    width: "80%",
    marginBottom: 30,
    alignItems: "center",
    alignSelf: "center",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 4,
    backgroundColor: "#226871",
  },
  readingButton: {
    color: "white",
    width: "80%",
    marginBottom: 30,
    alignItems: "center",
    alignSelf: "center",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 4,
    backgroundColor: "#226871",
  },
  deleteButton: {
    color: "white",
    width: "80%",
    marginBottom: 30,
    alignItems: "center",
    alignSelf: "center",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 4,
    backgroundColor: "#226871",
  },
  modalContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  close: {
    margin: 10,
    padding: 10,
  },
});
