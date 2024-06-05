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
import * as SecureStore from "expo-secure-store";
import { API_URL } from 'react-native-dotenv'

import axios from "axios";

export default function ModifyUsername() {
  const [username, setUsername] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [modifyUsername, setModifyUsername] = useState(false);

  async function getUsername() {
    setUsername(SecureStore.getItemAsync("username"));
  }

  useEffect(() => {
    getUsername();
  }, []);

  async function handleUpdateUsername() {
    let userToken;
    try {
      userToken = await SecureStore.getItemAsync("userToken");
      try {
        const headers = {
          "Content-Type": "application/json",
          Accept: "application/json",
          token_user: userToken,
        };
        const data = {
          username: newUsername,
        };
        const res = await axios.post(
          `${API_URL}/api/user/username/update`,
          data,
          { headers: headers }
        );
        await SecureStore.setItemAsync("username", newUsername);
        getUsername();
        setModifyUsername(false);
      } catch (e) {
        console.error("Une erreur s'est produite: ", e);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération du token :", error);
    }
  }

  function handleClose() {
    setModifyUsername(!modifyUsername);
    setNewUsername("");
  }

  return (
    <View style={styles.container}>
      <Text style={styles.username}>{username}</Text>
      <Pressable
        style={styles.button}
        onPress={() => setModifyUsername(!modifyUsername)}
      >
        <Text style={styles.textButton}>Modify username</Text>
      </Pressable>
      <Modal visible={modifyUsername} transparent={true} animationType="fade">
        <View style={styles.modalContainer}>
          <Pressable style={styles.close} onPress={handleClose}>
            <Text style={styles.textButtonClose}>Close</Text>
          </Pressable>
          <Text style={styles.title}>Modify username</Text>
          <TextInput
            style={styles.input}
            placeholder="New Username"
            placeholderTextColor={"gray"}
            onChangeText={(name) => setNewUsername(name)}
            value={newUsername}
          />
          <Button
            title="Submit"
            onPress={handleUpdateUsername}
            color={"#226871"}
            disabled={!newUsername.trim()}
          />
        </View>
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "white",
  },
  username: {
    fontSize: 24,
    fontWeight: "800",
  },
  textButton: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  input: {
    color: "white",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    width: "70%",
  },
  button: {
    color: "white",
    width: "40%",
    alignContent: "center",
    marginTop: "5%",
    marginBottom: 30,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    backgroundColor: "gray",
  },
  modalContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.9)",
  },
  close: {
    alignSelf: "flex-end",
    right: "15%",
    borderColor: "red",
    borderWidth: 1,
    borderRadius: 4,
    margin: 10,
    padding: 10,
  },
  textButtonClose: {
    color: "red",
    fontSize: 14,
    fontWeight: "bold",
  },
});
