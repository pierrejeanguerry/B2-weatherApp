import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import LoginForm from "../components/LoginForm";

const LoginScreen = ({ navigation }) => {
  const [hide, setHide] = useState(false);
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setHide(true);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setHide(false);
      },
    );
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Pressable
          style={styles.button}
          onPress={() => navigation.navigate("Register")}
        >
          <Text style={styles.textButton}>Sign up</Text>
        </Pressable>
        {hide ? null : (
          <Image
            source={require("../../assets/logov1.png")}
            style={styles.logo}
          />
        )}
        <LoginForm />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
    backgroundColor: "#181818",
    padding: "auto",
  },
  textButton: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  button: {
    color: "white",
    width: "40%",
    marginTop: "5%",
    marginRight: "5%",
    alignItems: "center",
    alignSelf: "flex-end",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    backgroundColor: "#226871",
  },
  logo: {
    alignSelf: "center",
    width: 200,
    height: 200,
    resizeMode: "contain",
  },
});

export default LoginScreen;
