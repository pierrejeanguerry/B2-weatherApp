import React, { useState } from "react";
import { View, StyleSheet, Modal, ActivityIndicator } from "react-native";

export default function LoadingModal({ isLoading }) {
  return (
    <View>
      <Modal visible={isLoading} transparent={true} animationType="fade">
        <View style={styles.modalContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});
