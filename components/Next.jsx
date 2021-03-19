import React from 'react'
import { View, Text } from 'react-native'
import NextItem from './NextItem'

export default function Next({ nextArray }) {
  return (
    <View
      style={{
        width: '100%',
        height: '15%',
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}
    >
      <Text>Next:</Text>
      {nextArray.map((tet, index) => {
        return (
          <>
            <NextItem key={index} tet={tet} />
          </>
        )
      })}
    </View>
  )
}
