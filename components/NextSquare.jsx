import React, { useState, useEffect } from 'react'
import { StyleSheet, View } from 'react-native'

export default function NextSquare({ x, y, filled, color }) {
  const [squareStyle, setSquareStyle] = useState([styles.square])

  useEffect(() => {
    setSquareStyle(
      filled ? [styles.square, { backgroundColor: 'black' }] : [styles.square]
    )
  }, [filled])

  return <View style={squareStyle}></View>
}

const styles = StyleSheet.create({
  square: {
    width: '24%',
    height: '18%',
    borderColor: 'white',
    borderRadius: 2,
    borderWidth: 1,

    backgroundColor: 'transparent',
  },
})
