import { View, Text, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { LineChart } from "react-native-gifted-charts";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { API_URL } from 'react-native-dotenv';
import { Dropdown } from "react-native-element-dropdown";
import LoadingModal from "../components/LoadingModal";
import { AnimatedCircularProgress } from 'react-native-circular-progress';
const DashboardScreen = ({ route }) => {
    const { id } = route.params;
    const { name } = route.params;
    const [data, setData] = useState([]);
    const [humidityData, setHumidityData] = useState([]);
    const [temperatureData, setTemperatureData] = useState([]);
    const [selectedDate, setSelectedDate] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [pressureData, setPressureData] = useState(0);
    const [altitudeData, setAltitudeData] = useState(0);

    const date = [
        { label: "Aujourd'hui", value: 1 },
        { label: "la semaine dernière", value: 7 },
        { label: "le mois dernier", value: 30 },
        { label: "l'année dernière", value: 365 },
    ];
    async function getReadings() {
        let userToken;
        try {
            userToken = await SecureStore.getItemAsync("userToken");
        } catch (e) {
            console.error("message", e);
            return;
        }
        setIsLoading(true);
        if (userToken) {
            const headers = {
                "Content-Type": "application/json",
                Accept: "application/json",
                token_user: userToken,
            };
            const data = {
                days: '365',
            };
            try {
                res = await axios.get(
                    `${API_URL}/api/readings/${id}`,
                    {
                        data: data,
                        headers: headers
                    }
                );
                setData(res.data.list_readings);
            } catch (error) {
                console.error("Erreur lors de la récupération du token :", error.message);
            }
        }
        setIsLoading(false);
    }

    useEffect(() => {
        getReadings();
    }, [])

    async function filterData(day) {
        return data.filter(item => new Date(item.date).getTime() >= new Date().getTime() - (day * 24 * 60 * 60 * 1000));
    }

    async function groupAndAverage(period, day) {
        const groupedData = {};
        const filteredData = await filterData(day);
        setPressureData(filteredData.at(0).pressure);
        setAltitudeData(filteredData.at(0).altitude);
        filteredData.forEach(item => {
            const date = new Date(item.date);
            let key;
            switch (period) {
                case 'hour':
                    key = date.toISOString().substring(0, 13);
                    break;
                case 'day':
                    key = date.toISOString().substring(0, 10);
                    break;
                case 'month':
                    key = date.toISOString().substring(0, 7);
                    break;
                default:
                    break;
            }
            if (!groupedData[key]) {
                groupedData[key] = { count: 0, sum: { altitude: 0, humidity: 0, pressure: 0, temperature: 0 } };
            }

            groupedData[key].count++;
            groupedData[key].sum.altitude += item.altitude;
            groupedData[key].sum.humidity += item.humidity;
            groupedData[key].sum.pressure += item.pressure;
            groupedData[key].sum.temperature += item.temperature;
        });
        let temperature = [];
        temperature = Object.keys(groupedData).map(key => {
            const { count, sum } = groupedData[key];
            return {
                label: period == 'hour' ? `${key.substring(11, 13)}H00` :
                    period == 'day' && day == 7 ? `${key.substring(8, 11)}` :
                        period == 'day' && day == 30 ? `${key.substring(8, 11)}/${key.substring(5, 7)}` :
                            `${key.substring(5, 7)}/${key.substring(2, 4)}`,
                value: sum.temperature / count
            };
        });
        let humidity = [];
        humidity = Object.keys(groupedData)
            .map(key => {
                const { count, sum } = groupedData[key];
                return {
                    label: period == 'hour' ? `${key.substring(11, 13)}H00` :
                        period == 'day' && day == 7 ? `${key.substring(8, 11)}` :
                            period == 'day' && day == 30 ? `${key.substring(8, 11)}/${key.substring(5, 7)}` :
                                `${key.substring(5, 7)}/${key.substring(2, 4)}`,
                    value: sum.humidity / count,
                };
            });
        setTemperatureData(temperature.reverse());
        setHumidityData(humidity.reverse());
    }
    useEffect(() => {
        switch (selectedDate) {
            case 1:
                groupAndAverage('hour', 1);
                break;
            case 7:
                groupAndAverage('day', 7);
                break;
            case 30:
                groupAndAverage('day', 30);
                break;
            case 365:
                groupAndAverage('month', 365);
                break;
            default:
                break;
        }
    }, [selectedDate])



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
                activeColor="darkgray"
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
                    <Text style={styles.subtitle}>Temperature</Text>
                    <LineChart
                        thickness={3}
                        color="#07BAD1"
                        areaChart
                        startFillColor={"red"}
                        endFillColor={"rgb(84,219,234)"}
                        startOpacity={0.4}
                        endOpacity={0.4}
                        yAxisTextStyle={{ color: "white" }}
                        xAxisLabelTextStyle={{ color: "white" }}
                        backgroundColor="#181818"
                        formatYLabel={(label) => `${label}°C`}
                        rulesColor="gray"
                        rulesType="dotted"
                        yAxisColor="lightgray"
                        xAxisColor="lightgray"
                        showXAxisIndices="true"
                        spacing={selectedDate == 365 ? 80 : 50}
                        data={temperatureData}
                        height={200}
                        scrollToEnd
                    />
                    <Text style={styles.subtitle}>Humidité</Text>
                    <LineChart
                        thickness={3}
                        color="#07BAD1"
                        areaChart
                        yAxisTextStyle={{ color: "lightgray" }}
                        xAxisLabelTextStyle={{ color: "white" }}
                        formatYLabel={(label) => `${label}%`}
                        showXAxisIndices="true"
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
                        height={200}
                        scrollToEnd
                    />
                    <View style={styles.gaugeContainer}>
                        <View>
                            <Text style={styles.subtitle}>Pression</Text>
                            <AnimatedCircularProgress
                                size={100}
                                width={15}
                                fill={pressureData - 960}
                                rotation={270}
                                tintColor='#139c80'
                                arcSweepAngle={180}
                                backgroundColor="#3d5875" />
                            <Text style={styles.indice_pressure}>{pressureData}hPa</Text>
                        </View>
                        <View>
                            <Text style={styles.subtitle}>Altitude</Text>
                            <AnimatedCircularProgress
                                size={100}
                                width={15}
                                fill={(altitudeData + 434) * 100 / 9283}
                                rotation={270}
                                tintColor='#139c80'
                                arcSweepAngle={180}
                                backgroundColor="#3d5875" />
                            <Text style={styles.indice_altitude}>{altitudeData}m</Text>
                        </View>
                    </View>
                    <LoadingModal isLoading={isLoading} />
                </View>
            )}
        </View>
    );
};

export default DashboardScreen;
const styles = StyleSheet.create({
    gaugeContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
        verticalAlign: "middle",
        marginTop: 10
    },
    indice_pressure: {
        alignSelf: "center",
        color: "white",
        top: -65,
    },
    indice_altitude: {
        alignSelf: "center",
        color: "white",
        top: -65,
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
        backgroundColor: "black"
    },
    container: {
        backgroundColor: "black",
        color: "white",
        height: '100%',
        paddingLeft: 5
    },
    text: {
        color: 'white'
    },
    title: {
        color: "white",
        fontSize: 25,
        fontWeight: "600",
        textAlign: "center",
        margin: 10
    },
    subtitle: {
        color: "white",
        fontSize: 15,
        fontWeight: "600",
        textAlign: "center",
        marginTop: 15
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
