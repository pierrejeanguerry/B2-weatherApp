import { View, Text, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { LineChart } from "react-native-gifted-charts";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { API_URL } from 'react-native-dotenv';
const DashboardScreen = ({ route }) => {
  const { mac } = route.params;
  const [data, setData] = useState([]);
  const [humidityData, setHumidityData] = useState([]);
  const [temperatureData, setTemperatureData] = useState([]);
  const [altitudeData, setAltitudeData] = useState([]);
  const [pressureData, setPressureData] = useState([]);

  async function getReadings() {
    let userToken;
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
          `${API_URL}/api/reading/list`,
          data,
          { headers: headers }
        );
        setData(res.data.list_readings);
        console.log(data);
        await parseData();
      } catch (error) {
        console.error("Erreur lors de la récupération du token :", error);
      }
    }
  }

  async function parseData() {
    const tempData = data.map((item) => ({
      label: item.date,
      value: item.temperature,
    }));
    const humData = data.map((item) => ({
      date: item.date,
      value: item.humidity,
    }));
    const preData = data.map((item) => ({
      date: item.date,
      value: item.pressure,
    }));
    const altData = data.map((item) => ({
      date: item.date,
      value: item.altitude,
    }));

    setTemperatureData(tempData);
    setHumidityData(humData);
    setPressureData(preData);
    setAltitudeData(altData);
    console.log(temperatureData);
    console.log(humidityData);
    console.log(altitudeData);
    console.log(pressureData);
  }

  useEffect(() => {
    getReadings();
  }, []);

  return (
    <View>
      <Text>Temperature Data</Text>
      <LineChart
        isAnimated
        thickness={3}
        color="#07BAD1"
        animateOnDataChange
        animationDuration={1000}
        onDataChangeAnimationDuration={300}
        areaChart
        yAxisTextStyle={{ color: "lightgray" }}
        hideDataPoints
        startFillColor={"rgb(84,219,234)"}
        endFillColor={"rgb(84,219,234)"}
        startOpacity={0.4}
        endOpacity={0.1}
        backgroundColor="#414141"
        rulesColor="gray"
        rulesType="solid"
        yAxisColor="lightgray"
        xAxisColor="lightgray"
        data={temperatureData}
      />
    </View>
  );
};

export default DashboardScreen;
