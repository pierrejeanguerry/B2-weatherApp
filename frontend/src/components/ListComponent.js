import { View, Text, Pressable, StyleSheet } from "react-native";
import React, { useState } from "react";
import axios from "axios";

const ListComponent = ({ item, onSelect, onDelete }) => {
  const [err, setErr] = useState(true);

  return (
    <View style={styles.list}>
      {!err && (
        <Text style={styles.err}> Building should be empty to be deleted</Text>
      )}
      <Pressable
        onPress={() => {
          onSelect(item.id);
        }}
        style={styles.item}
      >
        <Text style={styles.textButton}>{item.name}</Text>
      </Pressable>
      <Pressable
        onPress={() => {
          setErr(onDelete(item.id));
        }}
        style={styles.delete}
      >
        <Text style={styles.textButton}>delete</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  list: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  textButton: {
    color: "black",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
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
  err: {
    color: "red",
  },
});

export default ListComponent;
