import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Scene from "./components/Scene";

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Tetris Clone</Text>
      <StatusBar style="auto" />
      <Scene />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
