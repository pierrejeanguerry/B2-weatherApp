import React, { useState } from "react";
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
import axios from "axios";
import LoadingModal from "./LoadingModal";
import { API_URL } from 'react-native-dotenv'

export default function ModifyAccount() {
    const [isLoading, setIsLoading] = useState(false);
    const [modifyAccount, setModifyAccount] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showRepeatPassword, setShowRepeatPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    async function handleUpdateId() {
        let userToken;
        setIsLoading(true);

        try {
            userToken = await SecureStore.getItemAsync("userToken");
            id = await SecureStore.getItemAsync("user_id");
            try {
                if (password !== repeatPassword)
                    throw new Error("Les mots de passe ne correspondent pas");
                const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{10,20}$/;
                if (!passwordRegex.test(password))
                    throw new Error(
                        "Password is not strong enough. At least 1 lowercase and uppercase character, 1 number, between 10 and 20 characters."
                    );
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) throw new Error("Email non valide");
                const headers = {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    token_user: userToken,
                };
                const data = {
                    username: null,
                    email: email,
                    password: password,
                    currentPassword: currentPassword,
                };
                const res = await axios.patch(
                    `${API_URL}/api/users/${id}`,
                    data,
                    { headers: headers }
                );
                setModifyAccount(!modifyAccount);
                setIsLoading(false);
                setPassword("");
                setCurrentPassword("");
                setRepeatPassword("");
                setEmail("");
            } catch (e) {
                throw new Error(e);
            }
        } catch (error) {
            setIsLoading(false);
            setErrorMessage(error.message);
        }
    }

    function handleClose() {
        setModifyAccount(!modifyAccount);
        setPassword("");
        setCurrentPassword("");
        setRepeatPassword("");
        setEmail("");
    }

    return (
        <View>
            <Pressable
                style={styles.button}
                onPress={() => setModifyAccount(!modifyAccount)}
            >
                <Text style={styles.textButton}>Modifier les identifiants</Text>
            </Pressable>
            <Modal visible={modifyAccount} transparent={true} animationType="fade">
                <View style={styles.modalContainer}>
                    <Pressable style={styles.close} onPress={handleClose}>
                        <Text style={styles.textButtonClose}>Fermer</Text>
                    </Pressable>
                    <Text style={styles.title}>Modifier les identifiants</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        placeholderTextColor={"gray"}
                        onChangeText={(name) => setEmail(name)}
                        value={email}
                    />
                    <View style={styles.passwordContainer}>
                        <TextInput
                            style={styles.passwordInput}
                            placeholder="Mot de passe actuel"
                            placeholderTextColor={"gray"}
                            onChangeText={(newLogin) => setCurrentPassword(newLogin)}
                            value={currentPassword}
                            secureTextEntry={!showCurrentPassword}
                        />
                        <Button
                            title={showCurrentPassword ? "Cacher" : "Afficher"}
                            onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                            color={"gray"}
                        />
                    </View>
                    <View style={styles.passwordContainer}>
                        <TextInput
                            style={styles.passwordInput}
                            placeholder="Mot de passe"
                            placeholderTextColor={"gray"}
                            onChangeText={(newLogin) => setPassword(newLogin)}
                            value={password}
                            secureTextEntry={!showPassword}
                        />
                        <Button
                            title={showPassword ? "Cacher" : "Afficher"}
                            onPress={() => setShowPassword(!showPassword)}
                            color={"gray"}
                        />
                    </View>
                    <View style={styles.passwordContainer}>
                        <TextInput
                            style={styles.passwordInput}
                            placeholder="Répéter le mot de passe"
                            placeholderTextColor={"gray"}
                            onChangeText={(newLogin) => setRepeatPassword(newLogin)}
                            value={repeatPassword}
                            secureTextEntry={!showRepeatPassword}
                        />
                        <Button
                            title={showRepeatPassword ? "Cacher" : "Afficher"}
                            onPress={() => setShowRepeatPassword(!showRepeatPassword)}
                            color={"gray"}
                        />
                    </View>
                    {errorMessage ? (
                        <Text style={styles.error}>{errorMessage}</Text>
                    ) : null}
                    <Button
                        title="Envoyer"
                        onPress={handleUpdateId}
                        color={"#226871"}
                        disabled={
                            !email.trim() ||
                            !password.trim() ||
                            !repeatPassword.trim() ||
                            !currentPassword.trim()
                        }
                    />
                </View>
            </Modal>
            <LoadingModal isLoading={isLoading} />
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
        marginBottom: 30,
        alignItems: "center",
        alignSelf: "center",
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 4,
        backgroundColor: "blue",
    },
    modalContainer: {
        flex: 1,
        color: "white",
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
    passwordContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
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
    passwordText: {
        flexDirection: "row",
        fontSize: 12,
        marginBottom: 20,
        color: "gray",
    },
});
