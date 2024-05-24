import { View, Text, StyleSheet, TextInput, Button } from "react-native";
import React, { useState } from "react";
import LoadingModal from "../components/LoadingModal";
import * as SecureStore from "expo-secure-store";
import axios from "axios";

const AddRoomScreen = ({ route, navigation }) => {
  const { idBuilding } = route.params;
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleAddRoom() {
    let userToken;
    try {
      userToken = await SecureStore.getItemAsync("userToken");
    } catch (e) {
      console.error("message", e);
      return;
    }
    if (userToken) {
      const headers = {
        Connection: "keep-alive",
        "Content-Type": "application/json",
        Accept: "application/json",
        token_user: userToken,
      };
      const data = {
        name_room: name,
        id_building: idBuilding,
      };
      console.log("data: ", data);
      try {
        res = axios.post("http://192.168.137.1:8000/api/room/create", data, {
          headers,
        });
        console.log(res);
        setIsLoading(false);
        navigation.navigate("SelectRoom", { building_id: idBuilding });
      } catch (err) {
        console.error(err);
      }
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Room Name</Text>
      <TextInput
        style={styles.input}
        placeholder="room1"
        placeholderTextColor={"gray"}
        onChangeText={(newName) => setName(newName)}
        value={name}
      />
      <Button
        title="Submit"
        onPress={handleAddRoom}
        color={"#227138"}
        disabled={!name.trim()}
      />
      <LoadingModal isLoading={isLoading} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "white",
  },
  input: {
    color: "white",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 20,
    width: "70%",
  },
  button: {
    width: "40%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    backgroundColor: "green",
  },
  error: {
    paddingBottom: 10,
    textAlign: "left",
    color: "red",
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Fond gris foncé semi-transparent
  },
  passwordContainer: {
    flexDirection: "row", // Pour aligner l'input et le bouton sur la même ligne
    alignItems: "center",
    marginBottom: 20,
    width: "70%",
    color: "white",
  },
  passwordInput: {
    flex: 1,
    color: "white",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
  },
});

export default AddRoomScreen;
