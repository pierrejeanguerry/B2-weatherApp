import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native';
import { API_URL } from 'react-native-dotenv';
import { Dropdown } from 'react-native-element-dropdown';
import * as SecureStore from "expo-secure-store";

export default function ShowStation() {
    const [buildingList, setBuildingList] = useState([]);
    const [roomList, setRoomList] = useState([]);
    // const [stationList, setStationList] = useState([]);
    const [selectedBuilding, setSelectedBuilding] = useState();
    const [selectedRoom, setSelectedRoom] = useState();

    async function parseBuilding(data) {
        if (!data)
            return;
        const parsedData = data.map(item => ({
            label: item.name,
            value: item.id
        }));
        setBuildingList(parsedData);
    }
    
    async function parseRoom(data) {
        if (!data)
            return;
        const parsedData = data.map(item => ({
            label: item.name,
            value: item.id
        }));
        setRoomList(parsedData);
    }

    async function getAllBuilding() {

        let userToken;

        try {
            userToken = await SecureStore.getItemAsync("userToken");
        } catch (e) {
            console.error("message", error);
            return;
        }
        try {
            const headers = {
                'Connection': 'keep-alive',
                'Content-Type': 'application/json',
                "Accept": "application/json",
                "token_user": userToken
            }
            res = await axios.get(`${API_URL}/api/building/list`, { headers });
            await parseBuilding(res.data.list_building);
        } catch (e) {
            console.error(e);
        }
    }

    async function getAllRoom() {

        if (selectedBuilding == undefined)
            return;
        let userToken;

        try {
            userToken = await SecureStore.getItemAsync("userToken");
        } catch (e) {
            console.error("message", error);
            return;
        }
        try {
            const headers = {
                'Connection': 'keep-alive',
                'Content-Type': 'application/json',
                "Accept": "application/json",
                "token_user": userToken
            }
            const data = {
                building_id: selectedBuilding.value
            }

            res = await axios.post(`${API_URL}/api/room/list`, data, { headers });
            await parseRoom(res.data.list_room);
            console.log(res.data.list_room);
        } catch (e) {
            console.error(e);
        }
    }

    useEffect(() => {
        getAllBuilding();
    }, []);

    useEffect(() => {
        getAllRoom();
    }, [selectedBuilding]);
    return (
        <View>
            <Dropdown
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={buildingList}
                search
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder="Select building"
                searchPlaceholder="Search..."
                value={selectedBuilding}
                onChange={item => {
                    setSelectedBuilding(item);
                }}
            />
            <Dropdown
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={roomList}
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder="Select room"
                searchPlaceholder="Search..."
                value={selectedRoom}
                onChange={item => {
                    setSelectedRoom(item);
                }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        color: "white",
    },
    input: {
        color: "white",
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        marginBottom: 20,
        width: "70%",
    },
    button: {
        width: "40%",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 4,
        backgroundColor: "green",
    },
    error: {
        paddingBottom: 10,
        textAlign: "left",
        color: "red",
        fontWeight: "bold",
    },
    modalContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)", // Fond gris foncé semi-transparent
    },
    passwordContainer: {
        flexDirection: "row", // Pour aligner l'input et le bouton sur la même ligne
        alignItems: "center",
        marginBottom: 20,
        width: "70%",
        color: "white",
    },
    passwordInput: {
        flex: 1,
        color: "white",
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
    },
});
