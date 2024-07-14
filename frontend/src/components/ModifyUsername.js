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

export default function ModifyUsername({ onUpdateUsername }) {
    const [newUsername, setNewUsername] = useState("");
    const [modifyUsername, setModifyUsername] = useState(false);

    async function handleUpdateUsername() {
        let userToken;
        try {
            userToken = await SecureStore.getItemAsync("userToken");
            try {
                id = await SecureStore.getItemAsync("user_id");
                console.log("id = ", typeof(id));
                const headers = {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    token_user: userToken,
                };
                const data = {
                    username: newUsername,
                    password: null,
                    email: null
                };
                const res = await axios.patch(
                    `${API_URL}/api/users/${parseInt(id)}`,
                    data,
                    { headers: headers }
                );
                await SecureStore.setItemAsync("username", newUsername);
                onUpdateUsername(newUsername);
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
        <View>
            <Pressable
                style={styles.button}
                onPress={() => setModifyUsername(!modifyUsername)}
            >
                <Text style={styles.textButton}>Modifier le nom d'utilisateur</Text>
            </Pressable>

            <Modal visible={modifyUsername} transparent={true} animationType="fade">
                <View style={styles.modalContainer}>
                    <Pressable style={styles.close} onPress={handleClose}>
                        <Text style={styles.textButtonClose}>Fermer</Text>
                    </Pressable>
                    <Text style={styles.title}>Modifier le nom d'utilisateur</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Nouveau nom"
                        placeholderTextColor={"gray"}
                        onChangeText={(name) => setNewUsername(name)}
                        value={newUsername}
                    />
                    <Button
                        title="Envoyer"
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
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        color: "white",
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
        width: "80%",
        alignItems: "center",
        alignSelf: "center",
        marginBottom: 30,
        paddingVertical: 16,
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
