import React, { useState, useEffect } from 'react'
import { StyleSheet, View } from 'react-native'

export default function Square({ x, y, filled, color }) {
  const [squareStyle, setSquareStyle] = useState([styles.square])

  useEffect(() => {
    setSquareStyle(
      filled ? [styles.square, { backgroundColor: color }] : [styles.square]
    )
  }, [filled])

  return <View style={squareStyle}></View>
}

const styles = StyleSheet.create({
  square: {
    width: '10%',
    height: 32,
    borderColor: 'white',
    borderWidth: 1,
  },
  highlighted: {
    backgroundColor: 'red',
  },
})
