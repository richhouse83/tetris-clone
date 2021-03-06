import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import NextItem from './NextItem'

export default function Next({ nextArray }) {
  return (
    <View style={styles.nextBox}>
      <Text style={styles.nextText}>Next:</Text>
      {nextArray.map((tet, index) => {
        return <NextItem key={index} tet={tet} />
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  nextBox: {
    width: '100%',
    height: '12%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.548)',
  },
  nextText: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
  },
})
