import { View, Text, StyleSheet, TextInput, Button } from "react-native";
import React, { useState } from "react";
import LoadingModal from "../components/LoadingModal";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { API_URL } from 'react-native-dotenv';

const AddBuildingScreen = () => {
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  async function handleAddBuilding() {
    let userToken;
    try {
      userToken = await SecureStore.getItemAsync("userToken");
    } catch (e) {
      console.error("message", e);
      return;
    }
    const headers = {
      Connection: "keep-alive",
      "Content-Type": "application/json",
      Accept: "application/json",
      token_user: userToken,
    };
    const data = {
      name_building: name,
    };
    try {
      res = axios.post(`${API_URL}/api/building/create`, data, {
        headers,
      });
      console.log(await res);
      setIsLoading(false);
      navigation.navigate("SelectBuilding");
    } catch (err) {
      console.error(err.message);
    }
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="nom de batiment..."
        placeholderTextColor={"gray"}
        onChangeText={(newName) => setName(newName)}
        value={name}
      />
      <Button
        title="Ajouter"
        onPress={handleAddBuilding}
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
    backgroundColor: "black",
      width: "100%",
      height: "100%",
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
    marginTop: 20,
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

export default AddBuildingScreen;
