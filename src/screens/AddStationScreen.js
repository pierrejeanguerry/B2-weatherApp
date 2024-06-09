import {
  View,
  Text,
  StyleSheet,
  Button,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { CameraView, Camera } from "expo-camera";
import LoadingModal from "../components/LoadingModal";
import { API_URL } from 'react-native-dotenv';

const AddStationScreen = ({ navigation, route }) => {
  const { building_id } = route.params;
  const [name, setName] = useState("");
  const [mac, setMac] = useState("");
  const [hasPermission, setHasPermission] = useState(Camera.requestCameraPermissionsAsync());
  const [toScan, setToScan] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hide, setHide] = useState(false);
  const [errMessage, setErrMessage] = useState("");

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
        id_building: building_id,
        name_station: name,
        mac_address: mac,
      };
      axios
        .post(`${API_URL}/api/station/create`, data, {
          headers,
        })
        .then((res) => {
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
    Keyboard.dismiss();
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === "granted");
  };

  const handleBarCodeScanned = ({ data }) => {
    setToScan(false);
    setMac(data);
  };

  async function handleToggleQrCode() {
    Keyboard.dismiss();
    setToScan(true);
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        {toScan && (
          <>
            <CameraView
              onBarcodeScanned={!toScan ? undefined : handleBarCodeScanned}
              barcodeScannerSettings={{
                barcodeTypes: ["qr", "pdf417"],
              }}
              style={StyleSheet.absoluteFillObject}
            />
            <Pressable
              style={styles.cancelButton}
              onPress={() => setToScan(false)}
            >
              <Text style={styles.textCancel}>Annuler</Text>
            </Pressable>
          </>
        )}
        <View style={styles.containerInput}>
          {!toScan && (
            <>
              <Text style={styles.textButton}>Entrer le nom de la station</Text>
              <TextInput
                style={styles.input}
                placeholder="station1"
                placeholderTextColor={"gray"}
                onChangeText={(newName) => setName(newName)}
                value={name}
              />
              {hasPermission ? (
                <Pressable style={styles.camButton} onPress={handleToggleQrCode}>
                  <Text style={styles.textButton}>Scanner le QRcode</Text>
                </Pressable>
              ) : (
                <>
                  <Pressable onPress={getCameraPermissions} style={styles.camButton}>
                    <Text style={styles.textButton}>Authoriser la camera</Text>
                  </Pressable>
                </>
              )}

              <TextInput
                style={styles.input}
                placeholder="adresse mac"
                placeholderTextColor={"gray"}
                onChangeText={(newMac) => setMac(newMac)}
                value={mac}
              />

              {errMessage && <Text>{errMessage}</Text>}
              <Button
                title="Ajouter"
                onPress={handleAddStation}
                disabled={!name.trim() || !mac.trim()}
              />
            </>
          )}
        </View>
        <LoadingModal isLoading={isLoading} />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  list: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  input: {
    alignSelf: "center",
    color: "white",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 20,
    width: "70%",
  },
container: {
    backgroundColor: "#181818",
    width: "100%",
    height: "100%",
},
  containerInput: {
      marginTop: 20,
    height: "100%",
    // backgroundColor: "#181818",
    padding: "auto",
    // display: "flex",
    gap: 10,
  },
  textButton: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
  camButton: {
      marginBottom: 20,
    color: "white",
    width: "65%",
    alignItems: "center",
    alignSelf: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    backgroundColor: "green",
  },
  button: {
    color: "white",
    width: "65%",
    alignItems: "center",
    alignSelf: "center",
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
  cancelButton: {
    color: "white",
    width: "100%",
    alignSelf: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    backgroundColor: "red",
      position: "absolute",
      bottom: 0
  },
  textCancel: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
});
export default AddStationScreen;
