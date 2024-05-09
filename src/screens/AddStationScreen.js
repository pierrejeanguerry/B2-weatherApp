import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Button,
  Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useIsFocused } from "@react-navigation/native";
const AddStationScreen = (props) => {
  const [buildingData, setBuildingData] = useState(null);
  const [roomData, setRoomData] = useState(null);
  const [idBuilding, setIdBuilding] = useState(0);
  const [buildingSelected, setBuildingSelected] = useState(false);
  const [roomSelected, setRoomSelected] = useState(false);
  const navigation = useNavigation();
  const isFocused = useIsFocused();

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
        res = await axios.get("http://176.190.38.210:8000/api/building/list", {
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

  const getRoomList = async (id) => {
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
        id_building: id,
      };
      console.log("id_building: ", idBuilding, " header: ", headers);
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
      getBuildingList();
      return () => {};
    }, [])
  );

  async function handleToggleBuilding(id) {
    // console.log(buildingData);
    if (idBuilding != id) {
      setIdBuilding(id);
      setBuildingSelected(true);
      getRoomList(id);
    } else {
      setIdBuilding(0);
      setBuildingSelected(false);
    }
  }

  function handleSelectRoom(id) {
    // setIdBuilding(id);
    // // setBuildingSelected(false);
    // setBuildingSelected(true);
  }

  return (
    <View>
      <Text>Select a building</Text>
      <Button
        title="Add building"
        onPress={() => navigation.navigate("AddBuilding")}
        color={"green"}
      />
      <FlatList
        data={buildingData}
        renderItem={({ item }) => (
          <Button
            title={item.name}
            onPress={() => handleToggleBuilding(item.id)}
            style={styles.item}
          />
        )}
      />
      {buildingSelected ? (
        <>
          <Text>Select a room</Text>
          <Button
            title="Add Room"
            onPress={() =>
              navigation.navigate("AddRoom", { idBuilding: idBuilding })
            }
            color={"green"}
          />
          <FlatList
            data={roomData}
            renderItem={({ item }) => (
              <Button
                title={item.name}
                onPress={handleSelectRoom(item.id)}
                style={styles.item}
              ></Button>
            )}
          />
        </>
      ) : (
        <></>
      )}
    </View>
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
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
    color: "black",
  },
});
export default AddStationScreen;
