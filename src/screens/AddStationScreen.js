import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Button,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { CameraView, Camera } from "expo-camera";
import LoadingModal from "../components/LoadingModal";

const AddStationScreen = (props) => {
  const [buildingData, setBuildingData] = useState(null);
  const [roomData, setRoomData] = useState(null);
  const [idBuilding, setIdBuilding] = useState(0);
  const [idRoom, setIdRoom] = useState(0);
  const [buildingSelected, setBuildingSelected] = useState(false);
  const [roomSelected, setRoomSelected] = useState(false);
  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [mac, setMac] = useState("");
  const [hasPermission, setHasPermission] = useState(null);
  const [toScan, setToScan] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hide, setHide] = useState(false);
  const [errMessage, setErrMessage] = useState("");

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
        building_id: id,
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
      getBuildingList();
      return () => {};
    }, [])
  );

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setHide(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setHide(false);
      }
    );
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  async function handleToggleBuilding(id) {
    if (idBuilding != id) {
      await getRoomList(id);
      setIdBuilding(id);
      setBuildingSelected(true);
    } else {
      setIdBuilding(0);
      setBuildingSelected(false);
      setRoomSelected(false);
    }
  }

  async function handleToggleRoom(id) {
    if (idRoom != id) {
      setIdRoom(id);
      setRoomSelected(true);
    } else {
      setIdRoom(0);
      setRoomSelected(false);
    }
  }

  async function handleAddStation() {
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
        id_room: idRoom,
        name_station: name,
        mac_address: mac,
      };
      axios
        .post("http://176.190.38.210:8000/api/station/create", data, {
          headers,
        })
        .then((res) => {
          console.log(res);
          setIsLoading(false);
          navigation.navigate("Home");
        })
        .catch((err) => {
          console.log(err);
          setErrMessage("Station already used");
        });
    }
  }

  const getCameraPermissions = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === "granted");
  };

  const handleBarCodeScanned = ({ data }) => {
    setToScan(false);
    setMac(data);
  };

  async function handleToggleQrCode() {
    await getCameraPermissions();
    setToScan(true);
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View>
        {!hide && (
          <>
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
            {buildingSelected && (
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
                      onPress={() => handleToggleRoom(item.id)}
                      style={styles.item}
                    ></Button>
                  )}
                />
              </>
            )}
          </>
        )}

        <Text>Station name</Text>
        <TextInput
          style={styles.input}
          placeholder="station1"
          placeholderTextColor={"gray"}
          onChangeText={(newName) => setName(newName)}
          value={name}
        />

        {toScan ? (
          <>
            <CameraView
              onBarcodeScanned={!toScan ? undefined : handleBarCodeScanned}
              barcodeScannerSettings={{
                barcodeTypes: ["qr", "pdf417"],
              }}
              style={StyleSheet.absoluteFillObject}
            />
            <Button title={"Cancel"} onPress={() => setToScan(false)} />
          </>
        ) : (
          <>
            <Button title={"Tap to Scan QRcode"} onPress={handleToggleQrCode} />
            <TextInput
              style={styles.input}
              placeholder="mac_address"
              placeholderTextColor={"gray"}
              onChangeText={(newName) => setName(newName)}
              value={mac}
              // editable={false}
            />
            {roomSelected && (
              <>
                {errMessage && <Text>{errMessage}</Text>}
                <Button
                  title="Submit"
                  onPress={handleAddStation}
                  color={"#227138"}
                  disabled={!name.trim() && !mac.trim()}
                />
              </>
            )}
          </>
        )}
        <LoadingModal isLoading={isLoading} />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    // height: "100%",
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
