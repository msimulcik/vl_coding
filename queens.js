#!/usr/bin/env node

/*
 * N-queens problem
 *
 * This script calculates number of solutions of N-queens problem for given N
 *
 * Input: N
 * Output: number of solutions
 *
 * Usage: node queens.js <N>
 *
 * Author: Miroslav Simulcik
 * Date: Oct 1, 2016
 */

"use strict";

function initColumns(n) {
  const res = {};
  for (let i = 0; i < n; i++) {
    res[i] = true;
  }
  return res;
}

function findNumberOfSolutions(n) {
  let remainingColumns = initColumns(n);
  let board = []; // curent state of board
                  // indexes of array represent rows
                  // and numbers in array represent columns
  let ltrDiagonals = {}; // currently occupied left to right diagonals
  let rtlDiagonals = {}; // currently occupied right to left diagonals
  let solutionsCount = 0;

  function hasDiagonalConflict(row, column) {
    return ltrDiagonals[row - column] || rtlDiagonals[row + column];
  }

  function positionQueen(row, column) {
    board.push(column);
    delete remainingColumns[column];
    ltrDiagonals[row - column] = true;
    rtlDiagonals[row + column] = true;
  }

  function removeQueen(row, column) {
    board.pop();
    remainingColumns[column] = true;
    delete ltrDiagonals[row - column];
    delete rtlDiagonals[row + column];
  }

  function processNextRow() {
    let row = board.length;

    // we have successfully positioned queens on every row
    if (row === n) {
      solutionsCount++;
      return;
    }

    // isolate columns that needs to be processed for this row
    // bacause ramainingColumns changes over time
    const columnsToProcess = Object.keys(remainingColumns);

    for (let i = 0; i < columnsToProcess.length; i++) {
      const column = +columnsToProcess[i];
      if (!hasDiagonalConflict(row, column)) {
        positionQueen(row, column);
        processNextRow();
        removeQueen(row, column);
      }
    }
  }

  processNextRow();
  return solutionsCount;
}

if (process.argv.length < 3) {
  console.log("Usage: node queens.js <N>");
} else {
  console.log(findNumberOfSolutions(+process.argv[2]));
}
