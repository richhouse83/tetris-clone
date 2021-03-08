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
  const [tetromino, setTetromino] = useState({ x: 0, y: 3 });

  const setFilled = (x, y) => {
    setBoard((prevBoard) => {
      const newBoard = [...prevBoard];
      newBoard[x][y].filled = !newBoard[x][y].filled;
      return newBoard;
    });
  };

  const reset = () => {
    setBoard(gameBoard);
    setTetromino({ x: 0, y: 3 });
    setFilled(0, 3);
  };

  const advance = () => {
    setTetromino(({ x, y }) => {
      if (x + 1 < 20 && !board[x + 1][y].filled) {
        setFilled(x, y);
        setFilled(x + 1, y);
        return { x: x + 1, y };
      } else {
        setFilled(0, 3);
        return { x: 0, y: 3 };
      }
    });
  };

  const lateral = (value) => {
    setTetromino(({ x, y }) => {
      if (y + value >= 0 && y + value < 10 && !board[x][y + value].filled) {
        setFilled(x, y);
        setFilled(x, y + value);
        return { x, y: y + value };
      } else return { x, y };
    });
  };

  const gestureStart = ({ nativeEvent: { locationX, locationY } }) => {
    setPress({ locationX, locationY });
  };

  const checkGesture = ({ nativeEvent: { locationX } }) => {
    if (locationX < 0) {
      lateral(-1);
    } else if (locationX > press.locationX) {
      lateral(1);
    } else advance();
  };

  useEffect(() => {
    setFilled(tetromino.x, tetromino.y);
  }, []);

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
              setFilled={setFilled}
            />
          );
        });
      })}
      <Button onPress={reset} title="reset" />
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
