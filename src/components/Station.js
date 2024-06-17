import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faListDots, faDotCircle, faHandDots, faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { useNavigation } from '@react-navigation/native';
import { React, useState } from 'react';
import { TextInput, StyleSheet, Pressable, View, Text, Modal, Button } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import LoadingModal from './LoadingModal';
import * as SecureStore from "expo-secure-store";
import axios from 'axios';
import { API_URL } from "react-native-dotenv"

export default function Station({ name, state, mac, buildingList, selectedBuilding, handleUpdateStation }) {
    const navigation = useNavigation();
    const [showModal, setShowModal] = useState(false);
    const [newName, setNewName] = useState("");
    const [newSelectedBuilding, setNewSelectedBuilding] = useState(selectedBuilding);
    const [isLoading, setIsLoading] = useState(false);

    async function handleOption() {
        let userToken;
        try {
            userToken = await SecureStore.getItemAsync("userToken");
        } catch (e) {
            console.error("message", error);
            return;
        }
        id = await SecureStore.getItemAsync("user_id");
        setIsLoading(true);
        try {
            const headers = {
                'Connection': 'keep-alive',
                'Content-Type': 'application/json',
                "Accept": "application/json",
                "token_user": userToken
            }
            const data = {
                'newBuilding_id': (!newSelectedBuilding || newSelectedBuilding == selectedBuilding) ? 0 : newSelectedBuilding,
                'new_name': newName,
                'mac_address': mac
            }
            res = await axios.patch(`${API_URL}/api/stations/${id}`, data, { headers });
            setShowModal(false);
        } catch (e) {
            console.error(e);
            setShowModal(false);
        }
        setIsLoading(false);
        handleUpdateStation();

    }

    function handleClose() {
        setNewName("");
        setNewSelectedBuilding(selectedBuilding);
        setShowModal(false);
    }

    return (
        <View>
            <Pressable
                style={styles.container}
                onPress={() => navigation.navigate("Dashboard", { mac: mac, name: name })}
            >
                <Text style={styles.text}>
                    {name}
                </Text>
                {state == 0 ? (
                    <Text style={styles.off}>
                        OFF
                    </Text>
                ) : state == 1 ? (
                    <Text style={styles.on}>
                        ON
                    </Text>
                ) : (
                    <Text style={styles.error}>
                        ERROR
                    </Text>
                )}
                <Pressable
                    style={styles.option}
                    onPress={() => setShowModal(true)}
                >
                    <FontAwesomeIcon icon={faEllipsisVertical} style={{ color: "white"}} />
                </Pressable>
            </Pressable>
            <Modal visible={showModal} transparent={true} animationType="fade">
                <View style={styles.modalContainer}>
                    <Pressable style={styles.close} onPress={handleClose}>
                        <Text style={styles.textButtonClose}>Fermer</Text>
                    </Pressable>
                    <Text style={styles.title}>Changer le nom de la station</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Station1"
                        placeholderTextColor={"gray"}
                        onChangeText={(name) => setNewName(name)}
                        value={newName}
                    />
                    <Text style={styles.title}>Modifier le Batiment de la station</Text>
                    <Dropdown
                        style={styles.dropdown}
                        data={buildingList}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={styles.inputSearchStyle}
                        containerStyle={styles.dropdown_container}
                        itemTextStyle={styles.dropdown_label}
                        activeColor="darkgray"
                        search={true}
                        maxHeight={300}
                        labelField="label"
                        valueField="value"
                        placeholder="Selectionner un batiment"
                        searchPlaceholder="Rechercher..."
                        value={selectedBuilding}
                        onChange={item => {
                            setNewSelectedBuilding(item.value);
                        }}
                    />
                    <Button
                        title="Envoyer"
                        onPress={handleOption}
                        color={"#226871"}
                    />
                </View>
            </Modal>
        <LoadingModal isLoading={isLoading}/>
        </View >
    )
}

const styles = StyleSheet.create({
    container: {
        alignSelf: "center",
        marginTop: 10,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        padding: 15,
        width: "95%"
    },
    text: {
        color: "white",
        fontWeight: "600"
    },
    off: {
        marginTop: 10,
        color: "gray",
        fontWeight: "300"
    },
    on: {
        marginTop: 10,
        color: "green",
        fontWeight: "300"
    },
    error: {
        marginTop: 10,
        color: "red",
        fontWeight: "300"
    },
    option: {
        position: "absolute",
        paddingTop: 15,
        right: 5,
        borderWidth: 0.5,
        borderRadius: 8,
        alignSelf: "flex-end",
        height: 80,
        width: 30,
        backgroundColor: "black"

    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        color: "white",
    },
    textButton: {
        color: "white",
        fontSize: 14,
        fontWeight: "bold",
    },
    input: {
        color: "white",
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        marginBottom: 10,
        width: "70%",
    },
    button: {
        color: "white",
        width: "80%",
        alignItems: "center",
        alignSelf: "center",
        marginBottom: 30,
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 4,
        backgroundColor: "gray",
    },
    modalContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.9)",
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
    dropdown: {
        color: "white",
        height: 50,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
        width: "95%",
        alignSelf: "center",
        backgroundColor: "black",
        marginBottom: 20
    },
    dropdown_container: {
        backgroundColor: "black"
    },
    dropdown_label: {
        color: "white"
    },
    placeholderStyle: {
        fontSize: 16,
        color: "white",
    },
    selectedTextStyle: {
        fontSize: 16,
        color: "white",
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
        color: "white",
    },
    empty: {
        color: "cyan",
        fontSize: 25,
        fontWeight: "500"
    }
})
