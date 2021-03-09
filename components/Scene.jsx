import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import Square from "./Square";

const gameBoard = [];
for (let i = 0; i < 20; i++) {
  gameBoard.push([]);
  for (let j = 0; j < 10; j++) {
    gameBoard[i].push({ y: i, x: j, filled: false });
  }
}

export default function scene() {
  const [board, setBoard] = useState(gameBoard);
  const [press, setPress] = useState(null);
  const [move, setMove] = useState(0);
  const [paused, setPaused] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [tetromino, setTetromino] = useState([
    { x: 0, y: 3 },
    { x: 0, y: 4 },
    { x: 0, y: 5 },
    { x: 0, y: 6 },
  ]);

  const setFilled = (x, y) => {
    setBoard((prevBoard) => {
      const newBoard = [...prevBoard];
      newBoard[x][y].filled = !newBoard[x][y].filled;
      return newBoard;
    });
  };

  const reset = () => {
    setBoard(gameBoard);
    setTetromino([
      { x: 0, y: 3 },
      { x: 0, y: 4 },
      { x: 0, y: 5 },
      { x: 0, y: 6 },
    ]);
    tetromino.forEach(({ x, y }) => setFilled(x, y));
  };

  const advance = () => {
    setTetromino((prev) => {
      let canMove = true;
      prev.forEach(({ x, y }) => {
        if (x + 1 >= 20) canMove = false;
        else if (board[x + 1][y].filled) canMove = false;
      });
      if (canMove) {
        return prev.map(({ x, y }) => {
          setFilled(x, y);
          setFilled(x + 1, y);
          return { x: x + 1, y };
        });
      } else {
        return prev.map((square, index) => {
          setFilled(0, 3 + index);
          return { x: 0, y: 3 + index };
        });
      }
    });
  };

  const lateral = (value) => {
    setTetromino((prev) => {
      if (prev[0].y + value >= 0 && prev[3].y + value < 10) {
        return prev.map(({ x, y }) => {
          setFilled(x, y);
          setFilled(x, y + value);
          return { x, y: y + value };
        });
      }
      return prev;
    });
  };

  const pause = () => {
    setPaused((prev) => !prev);
  };

  const gestureStart = ({ nativeEvent: { locationX, locationY } }) => {
    setPress({ locationX, locationY });
  };

  const checkGesture = ({ nativeEvent: { locationX } }) => {
    if (locationX < 0) {
      lateral(-1);
    } else if (locationX > press.locationX) {
      lateral(1);
    }
  };

  useEffect(() => {
    tetromino.forEach((square) => {
      setFilled(square.x, square.y);
    });
  }, []);

  useEffect(() => {
    if (!paused) {
      advance();
      setTimeout(() => {
        setMove((prev) => prev + 1);
      }, speed);
    }
  }, [move, paused]);

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
          );
        });
      })}
      <Button onPress={reset} title="reset" />
      <Button onPress={pause} title={paused ? "play" : "pause"} />
    </View>
  );
}

const styles = StyleSheet.create({
  sceneText: {
    color: "white",
    fontSize: 32,
  },
  scene: {
    backgroundColor: "black",
    width: "90%",
    height: "90%",
    flexDirection: "row",
    flexWrap: "wrap",
    alignContent: "center",
    justifyContent: "center",
  },
});
