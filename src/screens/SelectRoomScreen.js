import { View, Text, Button, FlatList, StyleSheet } from "react-native";
import ListComponent from "../components/ListComponent";
import * as SecureStore from "expo-secure-store";
import { useFocusEffect } from "@react-navigation/native";
import React, { useState } from "react";
import axios from "axios";

const SelectRoomScreen = ({ navigation, route }) => {
  const { building_id } = route.params;
  const [roomData, setRoomData] = useState(null);

  const getRoomList = async () => {
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
        building_id: building_id,
      };
      try {
        res = await axios.post(
          "http://176.190.38.210:8000/api/room/list",
          data,
          {
            headers,
          }
        );

        setRoomData(res.data.list_room);
      } catch {
        (err) => {
          console.error(err.message);
        };
      }
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      getRoomList();
      return () => {};
    }, [])
  );

  async function handleSelectRoom(id) {
    navigation.navigate("AddStation", { room_id: id });
  }

  async function handleDelete(id) {
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
        id_room: id,
      };

      try {
        res = await axios.post(
          "http://176.190.38.210:8000/api/room/delete",
          data,
          {
            headers,
          }
        );

        setRoomData(res.data.list_room);
        getRoomList();
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
      <Text>Select a room</Text>
      <Button
        title="Add Room"
        onPress={() =>
          navigation.navigate("AddRoom", { idBuilding: building_id })
        }
        color={"green"}
      />
      <FlatList
        style={styles.container}
        data={roomData}
        renderItem={({ item }) => (
          <ListComponent
            item={item}
            onSelect={(id) => handleSelectRoom(id)}
            onDelete={(id) => handleDelete(id)}
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

export default SelectRoomScreen;
