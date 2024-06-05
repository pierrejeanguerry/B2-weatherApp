import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { View } from 'react-native';
import { API_URL } from 'react-native-dotenv';
import { Dropdown } from 'react-native-element-dropdown';

 export default function ShowStation() {
     const [buildingList, setBuildingList] = useState([]);
     const [stationList, setStationList] = useState([]);
     const [selectedBuilding, setSelectedBuilding] = useState();

     async function getAllBuilding(){
        
     }
     useEffect(() => {
        res = axios.get(`${API_URL}/api/building/list`, )        
     }, []);

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
        placeholder="Select item"
        searchPlaceholder="Search..."
        value={value}
        onChange={item => {
          setSelectedBuilding(item.value);
        }}
         />
         </View>
     )
 }
