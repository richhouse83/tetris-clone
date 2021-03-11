import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, Button } from 'react-native'
import Square from './Square'
import tetrominoes from '../scripts/tetrominoes'

const gameBoard = []
for (let i = 0; i < 20; i++) {
  gameBoard.push([])
  for (let j = 0; j < 10; j++) {
    gameBoard[i].push({ y: i, x: j, filled: '' })
  }
}

const tetArray = ['line', 'square', 'L', 'backL', 'T', 'Z', 'backZ']

const chooseTetromino = () => {
  const rand = Math.floor(Math.random() * tetArray.length)
  return tetArray[rand]
}

let tet = chooseTetromino()

export default function scene() {
  const [board, setBoard] = useState(gameBoard)
  const [press, setPress] = useState(null)
  const [move, setMove] = useState(0)
  const [paused, setPaused] = useState(false)
  const [speed, setSpeed] = useState(500)
  const [tetromino, setTetromino] = useState(tetrominoes[tet].initial)
  const [rotation, setRotation] = useState(0)

  const setFilled = (x, y) => {
    setBoard((prevBoard) => {
      const newBoard = [...prevBoard]
      newBoard[x][y].filled = 'filled'
      return newBoard
    })
  }

  const setClear = (x, y) => {
    setBoard((prevBoard) => {
      const newBoard = [...prevBoard]
      newBoard[x][y].filled = ''
      return newBoard
    })
  }

  const setBlocked = (x, y) => {
    setBoard((prevBoard) => {
      const newBoard = [...prevBoard]
      newBoard[x][y].filled = 'blocked'
      return newBoard
    })
  }

  const clearLine = (row) => {
    setBoard((prevBoard) => {
      const newBoard = [...prevBoard]
      row.forEach(({ x, y }) => {
        newBoard[y][x].filled = ''
      })
      return newBoard
    })
  }

  const reset = () => {
    setBoard(gameBoard)
    setTetromino(() => {
      tet = chooseTetromino()
      return tetrominoes[tet].initial
    })
  }

  const advance = () => {
    setTetromino((prev) => {
      let canMove = true
      prev.forEach(({ x, y }) => {
        if (x + 1 >= 20) canMove = false
        else if (board[x + 1][y].filled === 'blocked') canMove = false
      })
      if (canMove) {
        return prev.map(({ x, y }) => {
          setClear(x, y)
          return { x: x + 1, y }
        })
      } else {
        tet = chooseTetromino()

        prev.forEach(({ x, y }) => {
          setBlocked(x, y)
        })
        checkLines()
        setRotation(0)
        return tetrominoes[tet].initial
      }
    })
  }

  const lateral = (value) => {
    setTetromino((prev) => {
      if (prev[0].y + value >= 0 && prev[3].y + value < 10) {
        return prev.map(({ x, y }) => {
          setClear(x, y)
          return { x, y: y + value }
        })
      }
      return prev
    })
  }

  const pause = () => {
    setPaused((prev) => !prev)
  }

  const gestureStart = ({ nativeEvent: { locationX, locationY } }) => {
    setPress({ locationX, locationY })
  }

  const checkGesture = ({ nativeEvent: { locationX } }) => {
    if (locationX < 0) {
      lateral(-1)
    } else if (locationX > press.locationX) {
      lateral(1)
    } else advance()
  }

  const checkLines = () => {
    board.forEach((row, index) => {
      if (row.every(({ filled }) => filled === 'blocked')) {
        clearLine(row)
      }
    })
  }

  const spin = () => {
    setTetromino((prev) => {
      const spinIndex = rotation
      const { spin } = tetrominoes[tet]
      const adjust = boundsCheck(spin[spinIndex], tetromino)
      console.log(adjust)
      setRotation((prev) => {
        if (prev + 1 < spin.length) {
          return prev + 1
        } else return 0
      })
      return prev.map(({ x, y }, index) => {
        setClear(x, y)
        return {
          x: x + spin[spinIndex].x[index] + adjust.x,
          y: y + spin[spinIndex].y[index] + adjust.y,
        }
      })
    })
  }

  const boundsCheck = (spin, tetromino) => {
    const adjust = {
      x: 0,
      y: 0,
    }
    tetromino.forEach(({ x, y }, index) => {
      const targetY = y + spin.y[index]
      const targetX = x + spin.x[index]

      function checkSides(target, plane) {
        const upperBound = plane === 'y' ? 9 : 19
        if (target < 0) {
          adjust[plane] = Math.max(adjust[plane], Math.abs(target))
        } else if (target > upperBound) {
          adjust[plane] = Math.min(adjust[plane], upperBound - target)
        }
      }

      checkSides(targetY, 'y')
      checkSides(targetX, 'x')

      // if (targetY < 0) {
      //   adjust.y = Math.max(adjust.y, Math.abs(targetY))
      // } else if (targetY > 9) {
      //   adjust.y = Math.min(adjust.y, 9 - targetY)
      // }
    })
    return adjust
  }

  useEffect(() => {
    tetromino.forEach(({ x, y }) => {
      setFilled(x, y)
    })
  }, [tetromino])

  useEffect(() => {
    if (!paused) {
      advance()
      setTimeout(() => {
        setMove((prev) => prev + 1)
      }, speed)
    }
  }, [move, paused])

  return (
    <View
      style={styles.scene}
      onStartShouldSetResponder={(event) => true}
      onResponderGrant={gestureStart}
      onResponderRelease={checkGesture}
    >
      {board.map((row) => {
        return row.map((col) => {
          return (
            <Square
              key={`${col.x}, ${col.y}`}
              x={col.x}
              y={col.y}
              filled={col.filled}
            />
          )
        })
      })}
      <Button onPress={spin} title="spin" />
      <Button onPress={reset} title="reset" />
      <Button onPress={pause} title={paused ? 'play' : 'pause'} />
    </View>
  )
}

const styles = StyleSheet.create({
  sceneText: {
    color: 'white',
    fontSize: 32,
  },
  scene: {
    backgroundColor: 'black',
    width: '90%',
    height: '90%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignContent: 'center',
    justifyContent: 'center',
  },
})
