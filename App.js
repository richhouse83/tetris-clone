import { StatusBar } from 'expo-status-bar'
import React, { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Scene from './components/Scene'

export default function App() {
  const [score, setScore] = useState(0)

  const increaseScore = (amount) => {
    setScore((prev) => (prev += amount))
  }
  return (
    <View style={styles.container}>
      <Text>Tetris Clone</Text>
      <Text>Current Score: {score}</Text>
      <StatusBar style="auto" />
      <Scene increaseScore={increaseScore} score={score} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
