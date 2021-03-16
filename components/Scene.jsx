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

  const setClear = (y, x) => {
    setBoard((prevBoard) => {
      const newBoard = [...prevBoard]
      newBoard[y][x].filled = ''
      return newBoard
    })
  }

  const setBlocked = (y, x) => {
    setBoard((prevBoard) => {
      const newBoard = [...prevBoard]
      newBoard[y][x].filled = 'blocked'
      return newBoard
    })
  }

  const clearLine = (row, rowIndex) => {
    for (let i = 0; i < rowIndex; i++) {
      board[i].forEach(({ y, x }) => {
        if (board[y][x].filled === 'blocked') {
          setBlocked(y + 1, x)
        } else if (board[y][x].filled === '') {
          setClear(y + 1, x)
        }
      })
    }
  }

  const reset = () => {
    setBoard(gameBoard)
    setRotation(0)
    setTetromino(() => {
      tet = chooseTetromino()
      return tetrominoes[tet].initial
    })
  }

  const advance = () => {
    checkLines()
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

        setRotation(0)
        return tetrominoes[tet].initial
      }
    })
  }

  const lateral = (value) => {
    setTetromino((prev) => {
      let canMove = true
      prev.forEach(({ y, x }) => {
        if (y + value < 0 || y + value > 9) {
          canMove = false
        } else if (board[x][y + value].filled === 'blocked') {
          canMove = false
        }
      })
      if (canMove) {
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
    if (press.locationX === locationX) {
      spin()
    }
    setSpeed(500)
  }

  const checkMove = ({ nativeEvent: { locationX, locationY } }) => {
    if (press.locationX - locationX < -20) {
      lateral(1)
      setPress({ locationX, locationY })
    } else if (press.locationX - locationX > 20) {
      setPress({ locationX, locationY })
      lateral(-1)
    } else if (press.locationY - locationY < -20) {
      advance()
      setPress({ locationX, locationY })
    }
  }

  const checkLines = () => {
    board.forEach((row, index) => {
      if (row.every(({ filled }) => filled === 'blocked')) {
        clearLine(row, index)
      }
    })
  }

  const spin = () => {
    setTetromino((prev) => {
      const spinIndex = rotation
      const { spin } = tetrominoes[tet]
      const adjust = boundsCheck(spin[spinIndex], tetromino)
      let canSpin = true

      const newPos = prev.map(({ x, y }, index) => {
        return {
          x: x + spin[spinIndex].x[index] + adjust.x,
          y: y + spin[spinIndex].y[index] + adjust.y,
        }
      })

      newPos.forEach(({ x, y }) => {
        if (board[x][y].filled === 'blocked') {
          canSpin = false
        }
      })

      if (canSpin) {
        setRotation((prev) => {
          if (prev + 1 < spin.length) {
            return prev + 1
          } else return 0
        })
        prev.forEach(({ x, y }) => {
          setClear(x, y)
        })

        return newPos
      } else return prev
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
      onResponderMove={checkMove}
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
