import { View, Text, FlatList, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { LineChart } from "react-native-gifted-charts";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { API_URL } from 'react-native-dotenv';
import { Dropdown } from "react-native-element-dropdown";
import LoadingModal from "../components/LoadingModal";
const DashboardScreen = ({ route }) => {
    const { mac } = route.params;
    const { name } = route.params;
    const [data, setData] = useState([]);
    const [humidityData, setHumidityData] = useState([]);
    const [temperatureData, setTemperatureData] = useState([]);
    const [selectedDate, setSelectedDate] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    async function getReadings() {
        setIsLoading(true);
        let userToken;
        if (selectedDate == 0)
            return;
        try {
            userToken = await SecureStore.getItemAsync("userToken");
        } catch (e) {
            console.error("message", e);
            return;
        }
        if (userToken) {
            const headers = {
                "Content-Type": "application/json",
                Accept: "application/json",
                token_user: userToken,
            };
            const data = {
                mac_address: mac,
            };
            try {
                res = await axios.post(
                    `${API_URL}/api/reading/${selectedDate}/list`,
                    data,
                    { headers: headers }
                );
                setData(res.data.list_readings);
                await parseData();
                console.log(res.data.list_readings);
            } catch (error) {
                console.error("Erreur lors de la récupération du token :", error.message);
            }
        }
    }

    function isoToHour(dateString) {
        const date = new Date(dateString);
        const hours = String(date.getUTCHours()).padStart(2, '0');
        const minutes = String(date.getUTCMinutes()).padStart(2, '0');
        return `${hours}h${minutes}`;
    }

    function isoToDay(dateString) {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Les mois vont de 0 à 11
        return `${day}/${month}`;
    }

    function isoToYear(dateString) {
        const date = new Date(dateString);
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Les mois vont de 0 à 11
        const year = date.getFullYear();
        return `${month}/${year}`;
    }

    async function parseData() {

        const tempData = data.map((item) => ({
            label: (selectedDate == 365 ? isoToYear(item.date) : selectedDate == 1 ? isoToHour(item.date) : isoToDay(item.date)),
            value: item.temperature,
        }));
        const humData = data.map((item) => ({
            label: (selectedDate == 365 ? isoToYear(item.date) : selectedDate == 1 ? isoToHour(item.date) : isoToDay(item.date)),
            value: item.humidity,
        }));

        setTemperatureData(tempData);
        setHumidityData(humData);
    }

    useEffect(() => {
        getReadings();
    }, [selectedDate]);

    const date = [
        { label: "Aujourd'hui", value: 1 },
        { label: "la semaine dernière", value: 7 },
        { label: "le mois dernier", value: 30 },
        { label: "l'année dernière", value: 365 },
    ]
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{name}</Text>
            <Dropdown
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                containerStyle={styles.dropdown_container}
                itemTextStyle={styles.dropdown_label}
                style={styles.dropdown}
                data={date}
                maxHeight={300}
                labelField="label"
                valueField="value"
                placeholder="Choisir une période"
                value={selectedDate}
                onChange={item => {
                    setSelectedDate(item.value);
                }}
            />
            {selectedDate != 0 && (
                <View>
                    <Text>Temperature</Text>
                    <LineChart
                        thickness={3}
                        color="#07BAD1"
                        yAxisTextStyle={{ color: "white" }}
                        xAxisLabelTextStyle={{ color: "white" }}
                        backgroundColor="#181818"
                        rulesColor="gray"
                        rulesType="dotted"
                        yAxisColor="lightgray"
                        xAxisColor="lightgray"
                        spacing={selectedDate == 365 ? 80 : 50}
                        data={temperatureData}
                        scrollToEnd
                    />
                    <Text>Humidité</Text>
                    <LineChart
                        thickness={3}
                        color="#07BAD1"
                        areaChart
                        yAxisTextStyle={{ color: "lightgray" }}
                        xAxisLabelTextStyle={{ color: "white" }}
                        hideDataPoints
                        startFillColor={"rgb(84,219,234)"}
                        endFillColor={"red"}
                        startOpacity={0.4}
                        endOpacity={0.4}
                        backgroundColor="#181818"
                        rulesColor="gray"
                        rulesType="dotted"
                        yAxisColor="lightgray"
                        xAxisColor="lightgray"
                        data={humidityData}
                        spacing={selectedDate == 365 ? 80 : 50}
                        scrollToEnd
                    />
                </View>
            )}
        <LoadingModal isLoading={isLoading}/>
        </View>
    );
};

export default DashboardScreen;
const styles = StyleSheet.create({
    dropdown: {
        color: "white",
        height: 50,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
        width: "95%",
        alignSelf: "center",
        backgroundColor: "black"
    },
    container: {
        backgroundColor: "black",
        color: "white",
        height: '100%'
    },
    add: {
        alignItems: 'center',
        verticalAlign: 'center',
        backgroundColor: 'blue',
        borderRadius: 100,
        marginBottom: 20,
        width: "10%",
        height: "5%",
        padding: 10,
        margin: 5,
        position: "relative"
    },
    settings: {
        alignItems: 'center',
        verticalAlign: 'center',
        backgroundColor: 'green',
        borderRadius: 100,
        marginBottom: 20,
        width: "10%",
        height: "5%",
        padding: 10,
        margin: 5,
        position: "absolute",
        right: 5
    },
    text: {
        color: 'white'
    },
    title: {
        color: "white",
        fontSize: 30,
        fontWeight: "600",
        textAlign: "center",
        margin: 20
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
});
