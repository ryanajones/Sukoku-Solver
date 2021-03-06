const { json } = require('body-parser');
const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  const solver = new SudokuSolver();

  app.route('/api/check').post((req, res) => {
    const { puzzle, coordinate, value } = req.body;

    // Check if puzzle, coordinate, or value is missing
    if (
      puzzle === undefined ||
      coordinate === undefined ||
      value === undefined
    ) {
      return res.json({ error: 'Required field(s) missing' });
    }

    // Check if puzzle contains values that are not numbers or periods
    const invalidCharacters = 'Invalid characters in puzzle';
    if (solver.validate(puzzle) === invalidCharacters) {
      return res.json({ error: invalidCharacters });
    }

    // Check if puzzle is greater or less than 81 characters
    const puzzleLength = 'Expected puzzle to be 81 characters long';
    if (solver.validate(puzzle) === puzzleLength) {
      return res.json({ error: puzzleLength });
    }

    // Check if coordinate points to a cell
    const rowsAndColumnRegex = /[A-I][1-9]/;
    if (!rowsAndColumnRegex.test(coordinate)) {
      return res.json({ error: 'Invalid coordinate' });
    }

    // Check if value is a number between 1-9
    const numberRegex = /[1-9]/;
    if (!numberRegex.test(value)) {
      return res.json({ error: 'Invalid value' });
    }

    // Check if the given value is true for the given coordinate.
    // Return true or false, and if false, provide if the conflict
    // is in row, column, region, or all three
    const checkIfValid = solver.checkPlacement(coordinate, value, puzzle);

    if (checkIfValid.valid === true) {
      return res.json({ valid: checkIfValid.valid });
    }

    return res.json(checkIfValid);
  });

  app.route('/api/solve').post((req, res) => {
    const { puzzle } = req.body;

    // Check if puzzle is missing
    if (puzzle === undefined) {
      return res.json({ error: 'Required field missing' });
    }

    // Check if puzzle is greater or less than 81 characters
    const puzzleLength = 'Expected puzzle to be 81 characters long';
    if (solver.validate(puzzle) === puzzleLength) {
      return res.json({ error: puzzleLength });
    }

    // Check if puzzle contains values that are not numbers or periods
    const numberOrPeriodRegex = /[^.0-9]/g;
    if (numberOrPeriodRegex.test(puzzle)) {
      return res.json({ error: 'Invalid characters in puzzle' });
    }

    // Solve the given puzzle string
    const solutionString = solver.solve(puzzle);
    if (solutionString) {
      return res.json({ solution: solutionString });
    }

    // Check if puzzle is invalid or cannot be solved
    if (!solutionString) {
      return res.json({ error: 'Puzzle cannot be solved' });
    }
  });
};
