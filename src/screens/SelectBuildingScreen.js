import { View, Text, Pressable, FlatList, StyleSheet } from "react-native";
import React, { useState } from "react";
import * as SecureStore from "expo-secure-store";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import ListComponent from "../components/ListComponent";
const SelectBuildingScreen = ({ navigation }) => {
  const [buildingData, setBuildingData] = useState(null);
  const getBuildingList = async () => {
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
      try {
        res = await axios.get("http://192.168.137.1:8000/api/building/list", {
          headers,
        });

        setBuildingData(res.data.list_building);
      } catch {
        (err) => {
          console.error(err.message);
        };
      }
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      getBuildingList();
      return () => {};
    }, [])
  );

  async function handleSelectBuilding(id) {
    navigation.navigate("SelectRoom", { building_id: id });
  }

  async function handleDeleteBuilding(id) {
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
        building_id: id,
      };

      try {
        res = await axios.post(
          "http://192.168.137.1:8000/api/building/delete",
          data,
          { headers }
        );

        setBuildingData(res.data.list_building);
        getBuildingList();
        return true;
      } catch {
        (err) => {
          console.error(err.message);
          return false;
        };
      }
    }
  }

  return (
    <View>
      <Text style={styles.title}>Select a building</Text>
      <Pressable
        onPress={() => navigation.navigate("AddBuilding")}
        style={styles.button}
      >
        <Text>Add building</Text>
      </Pressable>
      <FlatList
        style={styles.container}
        data={buildingData}
        renderItem={({ item }) => (
          <ListComponent
            item={item}
            onSelect={(id) => handleSelectBuilding(id)}
            onDelete={(id) => handleDeleteBuilding(id)}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  list: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  input: {
    color: "white",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 20,
    width: "70%",
  },
  container: {
    height: "100%",
    padding: "auto",
    display: "flex",
    gap: 10,
  },
  textButton: {
    color: "black",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
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
  item: {
    backgroundColor: "white",
    padding: 10,
    fontSize: 18,
    height: 44,
    borderRadius: 4,
    color: "black",
    width: "65%",
    margin: 4,
    justifyContent: "center",
  },
  delete: {
    backgroundColor: "red",
    width: "25%",
    borderRadius: 4,
    margin: 4,
    justifyContent: "center",
  },
});

export default SelectBuildingScreen;
