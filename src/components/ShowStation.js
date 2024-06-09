import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { StyleSheet, View, FlatList, Text} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import * as SecureStore from "expo-secure-store";
import Station from '../components/Station';
import { useFocusEffect } from '@react-navigation/native';

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

  useFocusEffect(
    React.useCallback(() => {
        getAllBuilding();
      return () => {};
    }, [])
  );

    useEffect(() => {
        getAllStation();
    }, [selectedBuilding]);

    return (
        <View>
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
