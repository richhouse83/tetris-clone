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
      <View style={styles.textBox}>
        <Text style={styles.text}>Tetris Clone</Text>
        <Text style={styles.text}>Current Score: {score}</Text>
      </View>
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
  textBox: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  text: {
    paddingHorizontal: '5%',
    fontSize: 15,
  },
})
