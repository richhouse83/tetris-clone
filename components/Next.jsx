import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import NextItem from './NextItem'
import { nanoid } from 'nanoid/non-secure'

export default function Next({ nextArray }) {
  const [key, setKey] = useState(nanoid())

  useEffect(() => {
    setKey(nanoid())
  }, [nextArray])

  return (
    <View style={styles.nextBox}>
      <Text>Next:</Text>
      {nextArray.map((tet, index) => {
        const itemKey = `${key}${index}`
        return (
          <>
            <NextItem key={itemKey} tet={tet} />
          </>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  nextBox: {
    width: '100%',
    height: '15%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
})
