/* eslint-disable no-param-reassign */
/* eslint-disable class-methods-use-this */
class SudokuSolver {
  validate(puzzleString) {}

  checkRowPlacement(puzzleString, row, column, value) {}

  checkColPlacement(puzzleString, row, column, value) {}

  checkRegionPlacement(puzzleString, row, column, value) {}

  solve(puzzleString) {
    // Check to see if value is safe to place in current row, column, and box region
    const isSafe = (board, row, col, value) => {
      // Check if value is unique in column
      for (let i = 0; i < 9; i++) {
        if (board[i][col] === value) {
          return false;
        }
      }

      // Check if value is unique in row
      for (let j = 0; j < 9; j++) {
        if (board[row][j] === value) {
          return false;
        }
      }

      // Check if value is unique in box
      const boxTopRow = parseInt(row / 3) * 3; // Returns index of top row of box (0, 3, or 6)
      const boxLeftColumn = parseInt(col / 3) * 3; // Returns index of left column of box (0, 3 or 6)
      for (let k = boxTopRow; k < boxTopRow + 3; k++) {
        for (let l = boxLeftColumn; l < boxLeftColumn + 3; l++) {
          if (board[k][l] === value) {
            return false;
          }
        }
      }

      return true;
    };

    const solveFromCell = (board, row, col) => {
      // If on column 9 (outside row), move to next row and reset column to zero
      if (col === 9) {
        col = 0;
        row++;
      }

      // If on row 9 (outside board), the solution is complete, so return the board
      if (row === 9) {
        return board;
      }

      // If already filled out (not empty) then skip to next column
      if (board[row][col] !== '.') {
        return solveFromCell(board, row, col + 1);
      }

      // Use a recursive backtracking algorithm to solve the sudoku.
      // Start with row 1 and column 1 and check if safe to place in cell.
      // If safe, run the algorithm from next cell (col + 1). If false is
      // returned, empty out cell and backtrack to previous cell and try
      // with next value. The solution has been found when a board
      // is returned.
      for (let i = 1; i < 10; i++) {
        const valueToPlace = i.toString();
        if (isSafe(board, row, col, valueToPlace)) {
          board[row][col] = valueToPlace;
          if (solveFromCell(board, row, col + 1) !== false) {
            return solveFromCell(board, row, col + 1);
          }
          board[row][col] = '.';
        }
      }

      // If solution not found yet, return false
      return false;
    };

    // Turn puzzleString into array of rows and cols
    const generateBoard = (values) => {
      const board = [[], [], [], [], [], [], [], [], []];

      let boardRow = -1;
      for (let i = 0; i < values.length; i++) {
        if (i % 9 === 0) {
          boardRow += 1;
        }
        board[boardRow].push(values[i]);
      }
      return board;
    };

    const solveSudoku = () => {
      const puzzleStringToArray = puzzleString.split('');

      const originalBoard = generateBoard(puzzleStringToArray);

      const solution = solveFromCell(originalBoard, 0, 0);

      if (solution === false) return;

      let solutionString = '';
      for (let i = 0; i < solution.length; i++) {
        for (let j = 0; j < solution[i].length; j++) {
          solutionString += solution[i][j].toString();
        }
      }

      return solutionString;
    };
    return solveSudoku();
  }

  checkPlacement(coordinate, value, solutionString) {
    // Generate puzzle board into array from string
    const generateBoardAndCheck = (solutionArrayValues) => {
      const completedBoard = [[], [], [], [], [], [], [], [], []];

      // Push string values to arrays of array to make rows
      let boardRow = -1;
      for (let i = 0; i < solutionArrayValues.length; i++) {
        if (i % 9 === 0) {
          boardRow += 1;
        }
        completedBoard[boardRow].push(solutionArrayValues[i]);
      }

      // Split coordinate string into array
      const coordinateArray = coordinate.split('');

      // Switch out the coordinate's letter row to a number
      const rowNum = [0, 1, 2, 3, 4, 5, 6, 7, 8];
      const rowLetter = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];

      rowLetter.forEach((letter, i) => {
        if (letter === coordinateArray[0]) {
          coordinateArray[0] = rowNum[i];
        }
      });

      // Check to see if the inquired value and coordinate is equal
      // to the same value and coordinate on the completed board

      coordinateArray[1] -= 1;

      if (value === completedBoard[coordinateArray[0]][coordinateArray[1]]) {
        return true;
      }

      // If placement not valid, return array of strings "row", "column", "region" or any
      // combination of the three where there was conflict
      const placementInvalid = [];

      // Check if value is unique in column
      for (let i = 0; i < 9; i++) {
        if (completedBoard[i][coordinateArray[1]] === value) {
          placementInvalid.push('column');
        }
      }

      // Check if value is unique in row
      for (let j = 0; j < 9; j++) {
        if (completedBoard[coordinateArray[0]][j] === value) {
          placementInvalid.push('row');
        }
      }

      // Check if value is unique in box
      const boxTopRow = parseInt(coordinateArray[0] / 3) * 3; // Returns index of top row of box (0, 3, or 6)
      const boxLeftColumn = parseInt(coordinateArray[1] / 3) * 3; // Returns index of left column of box (0, 3 or 6)
      for (let k = boxTopRow; k < boxTopRow + 3; k++) {
        for (let l = boxLeftColumn; l < boxLeftColumn + 3; l++) {
          if (completedBoard[k][l] === value) {
            placementInvalid.push('region');
          }
        }
      }

      return placementInvalid;
    };

    const solutionStringToArray = solutionString.split('');
    const checkIfValid = generateBoardAndCheck(solutionStringToArray);

    // Make a return object with the valid key representing
    // either true or false, if false, provide a conflict key
    // with array value of strings representing where the
    // conflict is
    const validationObject = {};
    if (checkIfValid === true) {
      validationObject.valid = true;
      return validationObject;
    }
    validationObject.valid = false;
    validationObject.conflict = checkIfValid;
    return validationObject;
  }
}

module.exports = SudokuSolver;
