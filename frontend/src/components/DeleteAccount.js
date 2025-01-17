import React, { useContext, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Button,
  Modal,
  TextInput,
} from "react-native";
import LoadingModal from "./LoadingModal";
import AuthContext from "./AuthContext";

export default function DeleteAccount() {
  const [deleteAccount, setDeleteAccount] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);
  const { deleteAcc } = useContext(AuthContext);

  function handleClose() {
    setDeleteAccount(false);
    setPassword("");
  }

  async function handleDeleteAccount() {
    try {
      setIsLoading(true);
      await deleteAcc(password);
      setIsLoading(false);
      setDeleteAccount(false);
    } catch (error) {
      setIsLoading(false);
      setDeleteAccount(false);
      setErrorMessage(error.message);
    }
  }

  return (
    <View>
      <Pressable style={styles.button} onPress={() => setDeleteAccount(true)}>
        <Text style={styles.textButton}>Supprimer le compte</Text>
      </Pressable>
      <Modal visible={deleteAccount} transparent={true} animationType="fade">
        <View style={styles.modalContainer}>
          <Pressable style={styles.close} onPress={handleClose}>
            <Text style={styles.textButtonClose}>Fermer</Text>
          </Pressable>
          <Text style={styles.title}>Supprimer le compte</Text>
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
          {errorMessage ? (
            <Text style={styles.error}>{errorMessage}</Text>
          ) : null}

          <Button
            title="Supprimer"
            onPress={handleDeleteAccount}
            color={"#226871"}
            disabled={!password.trim()}
          />
        </View>
      </Modal>
      <LoadingModal isLoading={isLoading} />
    </View>
  );
}

const styles = StyleSheet.create({
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
  error: {
    paddingBottom: 10,
    textAlign: "left",
    color: "red",
    fontWeight: "bold",
  },
});
