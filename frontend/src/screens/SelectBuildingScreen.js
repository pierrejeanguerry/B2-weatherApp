import { View, Text, Pressable, FlatList, StyleSheet } from "react-native";
import React, { useState } from "react";
import * as SecureStore from "expo-secure-store";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import ListComponent from "../components/ListComponent";
import { API_URL } from 'react-native-dotenv';

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
                res = await axios.get(`${API_URL}/api/buildings`, {
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
            return () => { };
        }, [])
    );

    async function handleSelectBuilding(id) {
        navigation.navigate("AddStation", { building_id: id });
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

            try {
                res = await axios.delete(
                    `${API_URL}/api/buildings/${id}`,
                    {
                        headers: headers
                    }
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
        <View style={styles.container}>
            <Pressable
                onPress={() => navigation.navigate("AddBuilding")}
                style={styles.button}
            >
                <Text style={styles.textButton}>Ajouter un batiment</Text>
            </Pressable>
            <FlatList
                style={styles.list}
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
    input: {
        color: "white",
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        marginBottom: 20,
        width: "70%",
    },
    list: {
        height: "100%",
        padding: "auto",
        display: "flex",
        gap: 10,
    },
    textButton: {
        color: "white",
        fontSize: 14,
        fontWeight: "bold",
        textAlign: "center",
    },
    button: {
        color: "white",
        width: "40%",
        marginTop: "5%",
        marginRight: "5%",
        marginBottom: 30,
        alignItems: "center",
        alignSelf: "flex-end",
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 4,
        backgroundColor: "#226871",
    },
    container: {
        backgroundColor: "black"
    }
});

export default SelectBuildingScreen;
