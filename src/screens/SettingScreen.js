import React, { useEffect, useContext } from "react";
import { View, StyleSheet } from "react-native";
import ModifyUsername from "../components/ModifyUsername";
import ModifyAccount from "../components/ModifyAccount";
import DeleteAccount from "../components/DeleteAccount";

export default function SettingScreen() {
  return (
    <View style={styles.container}>
      <ModifyUsername />
      <ModifyAccount />
      <DeleteAccount />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    color: "black",
  },
});
