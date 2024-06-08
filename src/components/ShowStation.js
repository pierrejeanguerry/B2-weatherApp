import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Button, StyleSheet, View, FlatList, Pressable, Text } from 'react-native';
import { API_URL } from 'react-native-dotenv';
import { Dropdown } from 'react-native-element-dropdown';
import * as SecureStore from "expo-secure-store";
import Station from '../components/Station';

export default function ShowStation() {
    const [buildingList, setBuildingList] = useState([]);
    const [stationList, setStationList] = useState([]);
    const [selectedBuilding, setSelectedBuilding] = useState();

    async function parseBuilding(data) {
        if (!data)
            return;
        const parsedData = data.map(item => ({
            label: item.name,
            value: item.id
        }));
        setBuildingList(parsedData);
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
            //API_URL=http://176.190.38.210:8000
            res = await axios.get(`http://176.190.38.210:8000/api/building/list`, { headers });
            await parseBuilding(res.data.list_building);
        } catch (e) {
            console.error(e);
        }
    }

    async function getAllStation() {

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
            res = await axios.post(`http://176.190.38.210:8000/api/station/list`, data, { headers });
            setStationList(res.data.list_station);
            console.log(res.data.list_station);
        } catch (e) {
            console.error(e);
        }
    }

    useEffect(() => {
        getAllBuilding();
    }, []);

    useEffect(() => {
        getAllStation();
    }, [selectedBuilding]);

    return (
        <View>

            <Dropdown
                style={styles.dropdown}
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
            {
                stationList && (<FlatList
                    data={stationList}
                    renderItem={({ item }) => (
                        <Station
                            name={item.name}
                            state={item.state}
                            mac={item.mac}
                        />
                    )}
                />)
            }
        </View >
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
