import React, { useState, useEffect } from 'react'
import { TouchableOpacity, Text, StyleSheet } from 'react-native'
import NextItem from './NextItem'

export default function Hold({ holdTet, hold }) {
  return (
    <TouchableOpacity onPress={hold} style={styles.holdBox}>
      <Text style={styles.holdText}>Hold:</Text>
      {holdTet.map((tet, index) => {
        return <NextItem key={index} tet={tet} />
      })}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  holdBox: {
    width: '100%',
    height: '12%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.548)',
  },
  holdText: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
  },
})
