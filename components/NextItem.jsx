import React, { useState, useEffect } from 'react'
import { View, StyleSheet } from 'react-native'
import NextSquare from './NextSquare'
import tetrominoes from '../scripts/tetrominoes'

export default function NextItem({ tet }) {
  const nextBoard = []
  for (let i = 0; i < 2; i++) {
    nextBoard.push([])
    for (let j = 0; j < 4; j++) {
      nextBoard[i].push({ y: i, x: j, filled: '', color: '' })
    }
  }
  const [board, setBoard] = useState(nextBoard)

  const tetromino = tetrominoes[tet]

  useEffect(() => {
    if (tet) {
      setBoard(() => {
        const newBoard = []
        for (let i = 0; i < 2; i++) {
          newBoard.push([])
          for (let j = 0; j < 4; j++) {
            newBoard[i].push({ y: i, x: j, filled: '', color: '' })
          }
        }
        tetromino.initial.forEach(({ x, y }) => {
          newBoard[x][y - 3].filled = 'filled'
        })
        return newBoard
      })
    } else
      setBoard(() => {
        const newBoard = []
        for (let i = 0; i < 2; i++) {
          newBoard.push([])
          for (let j = 0; j < 4; j++) {
            newBoard[i].push({ y: i, x: j, filled: '', color: '' })
          }
        }
        return newBoard
      })
  }, [tet])

  return (
    <View style={styles.nextItem}>
      {board.map((row) => {
        return row.map((col) => {
          return (
            <NextSquare
              key={`${col.x}, ${col.y}`}
              x={col.x}
              y={col.y}
              filled={col.filled}
              color={col.color}
            />
          )
        })
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  nextItem: {
    width: '25%',
    height: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: '20%',
    justifyContent: 'space-between',
  },
})
