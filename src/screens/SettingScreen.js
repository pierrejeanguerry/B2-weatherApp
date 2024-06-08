import React, { useEffect, useContext } from "react";
import { View, StyleSheet, Button } from "react-native";
import ModifyUsername from "../components/ModifyUsername";
import ModifyAccount from "../components/ModifyAccount";
import DeleteAccount from "../components/DeleteAccount";

export default function SettingScreen() {
  return (
    <View style={styles.container}>
      <ModifyUsername />
      <ModifyAccount />
      <Button title="Sign out" onPress={() => signOut()} color={"red"} />
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
