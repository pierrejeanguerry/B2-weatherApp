import { useContext, useEffect } from "react";
import { View, Text, Button } from "react-native";
import AuthContext from "../components/AuthContext";
import { useNavigation } from "@react-navigation/native";

const HomeScreen = () => {
  const { signOut } = useContext(AuthContext);
  const navigation = useNavigation();

  return (
    <View>
      <Text>Page d'Accueil (Météo)</Text>
      <Button title="Sign out" onPress={() => signOut()} color={"red"} />
      <Button
        title="Settings"
        onPress={() => navigation.navigate("Setting")}
        color={"blue"}
      />
    </View>
  );
};

export default HomeScreen;
