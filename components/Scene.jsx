import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, Button } from 'react-native'
import Square from './Square'
import Next from './Next'
import tetrominoes from '../scripts/tetrominoes'
import { boundsCheck } from '../scripts/bounds'

const gameBoard = []
for (let i = 0; i < 20; i++) {
  gameBoard.push([])
  for (let j = 0; j < 10; j++) {
    gameBoard[i].push({ y: i, x: j, filled: '', color: '' })
  }
}

const tetArray = ['line', 'square', 'L', 'backL', 'T', 'Z', 'backZ']

const chooseTetromino = () => {
  const rand = Math.floor(Math.random() * tetArray.length)
  return tetArray[rand]
}

const initialArray = []

for (let i = 0; i < 3; i++) {
  initialArray[i] = chooseTetromino()
}

let tet = chooseTetromino()

export default function scene({ increaseScore, score }) {
  const [board, setBoard] = useState(gameBoard)
  const [press, setPress] = useState(null)
  const [move, setMove] = useState(0)
  const [paused, setPaused] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [speed, setSpeed] = useState(500)
  const [prevSpeed, setPrevSpeed] = useState(500)
  const [nextArray, setNextArray] = useState(initialArray)
  const [tetromino, setTetromino] = useState(tetrominoes[tet].initial)
  const [rotation, setRotation] = useState(0)

  const nextTetromino = (prevArr) => {
    const newArr = [...prevArr]
    newArr.shift()
    newArr.push(chooseTetromino())

    return newArr
  }

  const setFilled = (x, y) => {
    setBoard((prevBoard) => {
      const newBoard = [...prevBoard]
      newBoard[x][y].filled = 'filled'
      newBoard[x][y].color = tetrominoes[tet].color
      return newBoard
    })
  }

  const setClear = (y, x) => {
    setBoard((prevBoard) => {
      const newBoard = [...prevBoard]
      newBoard[y][x].filled = ''
      newBoard[y][x].color = ''
      return newBoard
    })
  }

  const setBlocked = (y, x, color) => {
    setBoard((prevBoard) => {
      const newBoard = [...prevBoard]
      newBoard[y][x].filled = 'blocked'
      newBoard[y][x].color = color
      return newBoard
    })
  }

  const reset = () => {
    setGameOver(false)
    setPaused(false)
    increaseScore(-score)
    setSpeed(500)
    setBoard(() => {
      const newBoard = []
      for (let i = 0; i < 20; i++) {
        newBoard.push([])
        for (let j = 0; j < 10; j++) {
          newBoard[i].push({ y: i, x: j, filled: '', color: '' })
        }
      }
      return newBoard
    })
    setRotation(0)
    setTetromino(() => {
      tet = chooseTetromino()
      return tetrominoes[tet].initial
    })
  }

  const advance = () => {
    if (board[0][3].filled === 'blocked') {
      setPaused(true)
      setGameOver(true)
    }
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
        const color = tetrominoes[tet].color
        prev.forEach(({ x, y }) => {
          setBlocked(x, y, color)
        })
        setNextArray(nextTetromino)
        tet = nextArray[0]
        setRotation(0)
        return tetrominoes[tet].initial
      }
    })
  }

  const lateral = (value) => {
    if (!paused) {
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
  }

  const pause = () => {
    setPaused((prev) => !prev)
  }

  const gestureStart = ({ nativeEvent: { locationX, locationY } }) => {
    setPress({ locationX, locationY })
    setPrevSpeed(speed)
  }

  const checkGesture = ({ nativeEvent: { locationX } }) => {
    if (press.locationX === locationX) {
      spin()
    }
    setSpeed(prevSpeed)
  }

  const checkMove = ({ nativeEvent: { locationX, locationY } }) => {
    if (press.locationX - locationX < -25) {
      lateral(1)
      setPress({ locationX, locationY })
    } else if (press.locationX - locationX > 25) {
      setPress({ locationX, locationY })
      lateral(-1)
    } else if (press.locationY - locationY < -15) {
      setSpeed(1)
    }
  }

  const checkLines = () => {
    let multiplier = 1
    board.forEach((row, index) => {
      if (row.every(({ filled }) => filled === 'blocked')) {
        clearLine(row, index, board)
        increaseScore(100 * multiplier)
        multiplier++
        setSpeed((prev) => prev - 50)
      }
    })
  }

  const spin = () => {
    if (!paused) {
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
  }

  const clearLine = (row, rowIndex, board) => {
    for (let i = 0; i < rowIndex; i++) {
      board[i].forEach(({ y, x, color }) => {
        if (board[y][x].filled === 'blocked') {
          setBlocked(y + 1, x, color)
        } else if (board[y][x].filled === '') {
          setClear(y + 1, x)
        }
      })
    }
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
      {paused && <Text style={styles.paused}>PAUSED</Text>}
      {board.map((row) => {
        return row.map((col) => {
          return (
            <Square
              key={`${col.x}, ${col.y}`}
              x={col.x}
              y={col.y}
              filled={col.filled}
              color={col.color}
            />
          )
        })
      })}
      <Button onPress={reset} title="reset" />
      <Button
        onPress={pause}
        title={paused ? 'play' : 'pause'}
        disabled={gameOver}
      />
      <Next nextArray={nextArray} />
    </View>
  )
}

const styles = StyleSheet.create({
  scene: {
    backgroundColor: 'white',
    width: '70%',
    height: '74%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignContent: 'center',
    justifyContent: 'center',
  },
  paused: {
    color: 'white',
    position: 'absolute',
    top: '45%',
    zIndex: 10,
    fontSize: 20,
    fontWeight: 'bold',
  },
})
