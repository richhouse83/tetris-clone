import { StatusBar } from 'expo-status-bar'
import React, { useState } from 'react'
import { ImageBackground, StyleSheet, Text, View } from 'react-native'
import Scene from './components/Scene'

const image = require('./assets/thewave.jpg')

export default function App() {
  const [score, setScore] = useState(0)

  const increaseScore = (amount) => {
    setScore((prev) => (prev += amount))
  }
  return (
    <View style={styles.container}>
      <ImageBackground source={image} style={styles.image}>
        <View style={styles.textBox}>
          <Text style={styles.text}>Tetris Clone</Text>
          <Text style={styles.text}>Current Score: {score}</Text>
        </View>
        <StatusBar style="auto" />
        <Scene increaseScore={increaseScore} score={score} />
      </ImageBackground>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    alignItems: 'center',
    justifyContent: 'center',
  },
  textBox: {
    height: '5%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  text: {
    paddingHorizontal: '5%',
    fontSize: 15,
    color: 'black',
  },
  image: {
    height: '100%',
    width: '100%',
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
})
