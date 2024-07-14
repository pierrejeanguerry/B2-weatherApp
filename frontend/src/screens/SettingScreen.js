import React, { useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { Text, View, StyleSheet, Button, Pressable } from "react-native";
import ModifyUsername from "../components/ModifyUsername";
import ModifyAccount from "../components/ModifyAccount";
import DeleteAccount from "../components/DeleteAccount";
import AuthContext from "../components/AuthContext";

export default function SettingScreen() {
    const { signOut } = useContext(AuthContext);
    const [username, setUsername] = useState("");


    useEffect(() => {
        setUsername(SecureStore.getItemAsync("username"));
    }, []);

    function handleUpdateUsername(newUsername) {
        setUsername(newUsername);
    }


    return (
        <View style={styles.container}>
            <Text style={styles.username}>{username}</Text>
            <ModifyUsername onUpdateUsername={() => handleUpdateUsername()} />
            <ModifyAccount />
            <Pressable style={styles.button} onPress={() => signOut()}>
        <Text style={styles.textButton}>Se déconnecter</Text>
        </Pressable>
            <DeleteAccount />
        </View>
    );
}

const styles = StyleSheet.create({
  textButton: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  button: {
    color: "white",
    width: "80%",
    marginBottom: 30,
    alignItems: "center",
    alignSelf: "center",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 4,
    backgroundColor: "red",
  },
    container: {
        height: "100%",
        backgroundColor: "#181818",
        justifyContent: "center"
    },
    username: {
        color: "white",
        position: "absolute",
        top: 10,
        fontSize: 30,
        fontWeight: "500",
        alignSelf: "center"
    }
});
