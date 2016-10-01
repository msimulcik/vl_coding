#!/usr/bin/env node

/*
 * Color fill
 *
 * This file contains implementation of recursive flood fill algorithm with
 * simple CLI for inputing screen and positions with color.
 *
 * At the begining CLI asks for lines of screen with space separated int
 * values, for exapmle:
 *   0 4 0 0 0 2 0 0 0 0 0 0 1
 *   0 4 0 0 0 2 0 0 0 0 0 0 1
 *   0 4 0 0 0 2 0 0 0 0 0 0 1
 *   0 4 0 0 0 2 7 7 7 7 7 7 1
 *   0 4 0 0 0 2 0 0 0 0 0 0 1
 *   0 4 0 0 0 3 0 0 0 0 0 0 1
 *   0 0 3 3 3 0 0 0 0 0 0 0 1
 *   0 0 0 0 8 0 0 0 0 0 0 0 1
 *
 * To end inputing lines enter blank line. Then CLI will ask for x, y and color
 * inputs. After that it prints screen with filled area and ask for x, y, and color
 * again in loop.
 *
 * Usage: node color_fill.js
 *
 * Author: Miroslav Simulcik
 * Date: Oct 1, 2016
 */

"use strict";

const readline = require('readline');
const fs = require('fs');

function floodFill(screen, x, y, origColor, newColor) {
  const cellColor = screen[x] && screen[x][y];
  if (
    cellColor == null ||
    cellColor !== origColor ||
    cellColor === newColor
  ) {
    return;
  }
  screen[x][y] = newColor;
  floodFill(screen, x+1, y, origColor, newColor);
  floodFill(screen, x-1, y, origColor, newColor);
  floodFill(screen, x, y+1, origColor, newColor);
  floodFill(screen, x, y-1, origColor, newColor);
}

function fill(screen, x, y, color) {
  const origColor = screen[y] && screen[y][x];
  if (!origColor) {
    console.error('Selected position is out of screen!');
    return;
  }
  floodFill(screen, y, x, origColor, color);
}

// ---------------------
// Simple CLI implementation
// ---------------------

function print(screen) {
  screen.forEach((row) => {
    console.log(row.join(' '));
  })
  console.log('');
}

function startCLI(cb) {
  const screen = [];
  let lineNumber = 0;
  let state = 'screen';
  let x;
  let y;
  let color;

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.setPrompt(`screen line ${lineNumber+1}> `);
  rl.prompt();

  rl.on('line', (line) => {
    switch (state) {
      case 'screen':
        if (line === '') {
          state = 'x';
          rl.setPrompt('x> ');
        } else {
          screen[lineNumber++] = line.trim().split(' ');
          rl.setPrompt(`screen line ${lineNumber+1}> `);
        }
        break;
      case 'x':
        x = parseInt(line, 10);
        rl.setPrompt('y> ');
        state = 'y';
        break;
      case 'y':
        y = parseInt(line, 10);
        rl.setPrompt('color> ');
        state = 'color';
        break;
      case 'color':
        color = parseInt(line, 10);
        cb(screen, x, y, color);
        rl.setPrompt('x> ');
        state = 'x';
        break;
      default:
        break;
    }
    rl.prompt();
  });
}

startCLI((screen, x, y, color) => {
  fill(screen, x, y, color);
  print(screen);
});
