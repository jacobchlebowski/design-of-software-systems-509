import { expect, test } from 'vitest'
import { Coordinate, Syllable, Puzzle, Model } from './model.ts'
import { configuration1, configuration2, configuration3 } from './puzzle.ts'
import Home from './app/page.tsx'
import React from 'react';
import { render, fireEvent } from '@testing-library/react';

test('Coordinate', () => {
  let c1 = new Coordinate(2, 3)
  expect(c1.row).toBe(2)
  expect(c1.column).toBe(3)
})

test('Syllable', () => {
  let coord1 = new Coordinate(3,5)
  let s1 = new Syllable(coord1, "aSyllable")

  expect(s1.location.row).toBe(3)
  expect(s1.location.column).toBe(5)
  expect(s1.syllable).toBe("aSyllable")
})

test('Puzzle', () => {
  // let pz = new Puzzle(4, 4, new Coordinate(2, 3), Down)
  let numRows = 4;
  let numColumns = 4;
  let selected = [];
  let previousMoves = [];

  let s1 = new Syllable(new Coordinate(0,0), "ter"), s2 = new Syllable(new Coordinate(0,1), "ate"), s3 = new Syllable(new Coordinate(0,2), "ble"), s4 = new Syllable(new Coordinate(0,3), "der"), s5 = new Syllable(new Coordinate(1,0), "fil"), s6 = new Syllable(new Coordinate(1,1), "in"), s7 = new Syllable(new Coordinate(1,2), "im"), s8 = new Syllable(new Coordinate(1,3), "i"), s9 = new Syllable(new Coordinate(2,0), "i"), s10 = new Syllable(new Coordinate(2,1), "late"), s11 = new Syllable(new Coordinate(2,2), "mac"), s12 = new Syllable(new Coordinate(2,3), "un"), s13 = new Syllable(new Coordinate(3,0), "u"), s14 = new Syllable(new Coordinate(3,1), "vis"), s15 = new Syllable(new Coordinate(3,2), "af"), s16 = new Syllable(new Coordinate(3,3), "wa");
  var allSyllables:Array<Syllable> = [];
  allSyllables.push(s1,s2,s3,s4,s5,s6,s7,s8,s9,s10,s11,s12,s13,s14,s15,s16)

  var allParentWords:Array<Array<string>> = [];
  allParentWords.push(["in","vis","i","ble"],["im","mac","u","late"],["af","fil","i","ate"],["un","der","wa","ter"])

  //test puzzle
  let pz = new Puzzle(numRows, numColumns, allSyllables, selected, previousMoves, allParentWords);


  expect(pz.numRows).toBe(4)
  expect(pz.numColumns).toBe(4)
  expect(pz.selected).toStrictEqual([]);
  expect(pz.previousMoves).toStrictEqual([]);
  // expect(pz.allSyllables).toBe([(new Syllable(new Coordinate(0,0),"ate"))])
  expect(pz.allSyllables).toStrictEqual([new Syllable(new Coordinate(0,0), "ter"), s2 = new Syllable(new Coordinate(0,1), "ate"), s3 = new Syllable(new Coordinate(0,2), "ble"), s4 = new Syllable(new Coordinate(0,3), "der"), s5 = new Syllable(new Coordinate(1,0), "fil"), s6 = new Syllable(new Coordinate(1,1), "in"), s7 = new Syllable(new Coordinate(1,2), "im"), s8 = new Syllable(new Coordinate(1,3), "i"), s9 = new Syllable(new Coordinate(2,0), "i"), s10 = new Syllable(new Coordinate(2,1), "late"), s11 = new Syllable(new Coordinate(2,2), "mac"), s12 = new Syllable(new Coordinate(2,3), "un"), s13 = new Syllable(new Coordinate(3,0), "u"), s14 = new Syllable(new Coordinate(3,1), "vis"), s15 = new Syllable(new Coordinate(3,2), "af"), s16 = new Syllable(new Coordinate(3,3), "wa")])
  expect(allParentWords).toStrictEqual([["in","vis","i","ble"],["im","mac","u","late"],["af","fil","i","ate"],["un","der","wa","ter"]])

  // // use 'toStrictEqual' when object structure is to be compared, and not just ==
  // expect(pz.destination).toStrictEqual(new Coordinate(2, 3))
  // expect(pz.finalMove).toBe(Down)
})

test('Model', () => {
  let m = new Model(configuration1)
  

  expect(m.numMoves).toBe(0)
  expect(m.victory).toBe(false)

  // use 'toStrictEqual' when object structure is to be compared, and not just ==
  expect(m.puzzle.numRows).toBe(4)
  expect(m.puzzle.numColumns).toBe(4)
})


test('swapAvailable', () => {
  let m = new Model(configuration1)
  //if "selected" is not equal to 2, then we cannot swap
  expect(m.swapAvailable()).toBe(false)

  m.puzzle.selected.push(new Syllable(new Coordinate(0,0),"ter"))
  m.puzzle.selected.push(new Syllable(new Coordinate(0,1),"ate"))

  //else, we can swap
  expect(m.swapAvailable()).toBe(true)
})


test('undoAvailable', () => {
  let m = new Model(configuration1)
  //if "selected" is not equal to 2, then we cannot swap
  expect(m.undoAvailable()).toBe(false)

  m.puzzle.previousMoves.push(new Syllable(new Coordinate(0,0),"ter"))
  m.puzzle.previousMoves.push(new Syllable(new Coordinate(0,1),"ate"))

  //else, we can swap
  expect(m.undoAvailable()).toBe(true)
})


test('resetAvailable', () => {
  let m = new Model(configuration1)
  //if "selected" is not equal to 2, then we cannot swap
  expect(m.resetAvailable()).toBe(false)

  m.puzzle.previousMoves.push(new Syllable(new Coordinate(0,0),"ter"))
  m.puzzle.previousMoves.push(new Syllable(new Coordinate(0,1),"ate"))

  //else, we can swap
  expect(m.resetAvailable()).toBe(true)
})


test('swap', () => {
  let m = new Model(configuration1)
  // let pz = new Puzzle(4, 4, new Coordinate(2, 3), Down)
  let numRows = 4;
  let numColumns = 4;
  let selected = [];
  let previousMoves = [];

  let s1 = new Syllable(new Coordinate(0,0), "ter"), s2 = new Syllable(new Coordinate(0,1), "ate"), s3 = new Syllable(new Coordinate(0,2), "ble"), s4 = new Syllable(new Coordinate(0,3), "der"), s5 = new Syllable(new Coordinate(1,0), "fil"), s6 = new Syllable(new Coordinate(1,1), "in"), s7 = new Syllable(new Coordinate(1,2), "im"), s8 = new Syllable(new Coordinate(1,3), "i"), s9 = new Syllable(new Coordinate(2,0), "i"), s10 = new Syllable(new Coordinate(2,1), "late"), s11 = new Syllable(new Coordinate(2,2), "mac"), s12 = new Syllable(new Coordinate(2,3), "un"), s13 = new Syllable(new Coordinate(3,0), "u"), s14 = new Syllable(new Coordinate(3,1), "vis"), s15 = new Syllable(new Coordinate(3,2), "af"), s16 = new Syllable(new Coordinate(3,3), "wa");
  var allSyllables:Array<Syllable> = [];
  allSyllables.push(s1,s2,s3,s4,s5,s6,s7,s8,s9,s10,s11,s12,s13,s14,s15,s16)

  var allParentWords:Array<Array<string>> = [];
  allParentWords.push(["in","vis","i","ble"],["im","mac","u","late"],["af","fil","i","ate"],["un","der","wa","ter"])

  //test puzzle
  let pz = new Puzzle(numRows, numColumns, allSyllables, selected, previousMoves, allParentWords);
  pz.initialize(allSyllables);
  
  //commence a swap between s1 and s2
  let syllable1 = pz.syllables[0];
  let syllable2 = pz.syllables[1];
  m.swap(syllable1,syllable2);

  //else, we can swap
  expect(syllable1.location).toStrictEqual(new Coordinate(0,0))
  expect(syllable2.location).toStrictEqual(new Coordinate(0,1))
})


test('undoSwap', () => {
  let m = new Model(configuration1)
  // let pz = new Puzzle(4, 4, new Coordinate(2, 3), Down)
  let numRows = 4;
  let numColumns = 4;
  let selected = [];
  let previousMoves = [];

  let s1 = new Syllable(new Coordinate(0,0), "ter"), s2 = new Syllable(new Coordinate(0,1), "ate"), s3 = new Syllable(new Coordinate(0,2), "ble"), s4 = new Syllable(new Coordinate(0,3), "der"), s5 = new Syllable(new Coordinate(1,0), "fil"), s6 = new Syllable(new Coordinate(1,1), "in"), s7 = new Syllable(new Coordinate(1,2), "im"), s8 = new Syllable(new Coordinate(1,3), "i"), s9 = new Syllable(new Coordinate(2,0), "i"), s10 = new Syllable(new Coordinate(2,1), "late"), s11 = new Syllable(new Coordinate(2,2), "mac"), s12 = new Syllable(new Coordinate(2,3), "un"), s13 = new Syllable(new Coordinate(3,0), "u"), s14 = new Syllable(new Coordinate(3,1), "vis"), s15 = new Syllable(new Coordinate(3,2), "af"), s16 = new Syllable(new Coordinate(3,3), "wa");
  var allSyllables:Array<Syllable> = [];
  allSyllables.push(s1,s2,s3,s4,s5,s6,s7,s8,s9,s10,s11,s12,s13,s14,s15,s16)

  var allParentWords:Array<Array<string>> = [];
  allParentWords.push(["in","vis","i","ble"],["im","mac","u","late"],["af","fil","i","ate"],["un","der","wa","ter"])

  //test puzzle
  let pz = new Puzzle(numRows, numColumns, allSyllables, selected, previousMoves, allParentWords);
  
  //commence a swap between s1 and s2
  let syllable3 = pz.allSyllables[0];
  let syllable4 = pz.allSyllables[1];
  m.swap(syllable3,syllable4);

  //commence an undo swap between s1 and s2
  m.undoSwap(syllable3,syllable4);

  //else, we can swap
  expect(syllable3.location).toStrictEqual(new Coordinate(0,0))
  expect(syllable4.location).toStrictEqual(new Coordinate(0,1))
})


// test('resetPuzzle', () => {
//   let m = new Model(configuration1)

//   //then reset
//   expect(resetPuzzle(m)).toBe(undefined)
// })

// test('chooseConfiguration', () => {
//   let m = new Model(configuration1)
//   let buttonName = "configuration2"

//   //then change configuration
//   expect(chooseConfiguration(m,buttonName)).toBe(undefined)
// })

// test('Access GUI', async() => {
//   const { getByTestId } = render(Home());

//   const swapbutton = getByTestId('swapbutton');
//   const canvasElement = getByTestId('canvas');

//   // Verify that the swap button is initially disabled
//   expect(swapbutton.disabled).toBeTruthy();

//   // Simulate a canvas click (the coordinates are based on your game's requirements)
//   fireEvent.click(canvasElement, { screenX: 436, screenY: 573, clientX: 184, clientY: 440 });

//   // You can then assert how the state should change (e.g., swap button becomes enabled after some interactions)
//   expect(swapbutton.disabled).toBeFalsy();
// });



test('updateScore', () => {
  let m = new Model(configuration1)
  let numRows = 4;
  let numColumns = 4;
  let selected = [];
  let previousMoves = [];

  let s1 = new Syllable(new Coordinate(0,0), "ter"), s2 = new Syllable(new Coordinate(0,1), "ate"), s3 = new Syllable(new Coordinate(0,2), "ble"), s4 = new Syllable(new Coordinate(0,3), "der"), s5 = new Syllable(new Coordinate(1,0), "fil"), s6 = new Syllable(new Coordinate(1,1), "in"), s7 = new Syllable(new Coordinate(1,2), "im"), s8 = new Syllable(new Coordinate(1,3), "i"), s9 = new Syllable(new Coordinate(2,0), "i"), s10 = new Syllable(new Coordinate(2,1), "late"), s11 = new Syllable(new Coordinate(2,2), "mac"), s12 = new Syllable(new Coordinate(2,3), "un"), s13 = new Syllable(new Coordinate(3,0), "u"), s14 = new Syllable(new Coordinate(3,1), "vis"), s15 = new Syllable(new Coordinate(3,2), "af"), s16 = new Syllable(new Coordinate(3,3), "wa");
  var allSyllables:Array<Syllable> = [];
  allSyllables.push(s1,s2,s3,s4,s5,s6,s7,s8,s9,s10,s11,s12,s13,s14,s15,s16)

  var allParentWords:Array<Array<string>> = [];
  allParentWords.push(["in","vis","i","ble"],["im","mac","u","late"],["af","fil","i","ate"],["un","der","wa","ter"])

  //test puzzle
  let pz = new Puzzle(numRows, numColumns, allSyllables, selected, previousMoves, allParentWords);
  m.puzzle = pz
  m.puzzle.syllables = allSyllables;
  

  //update score before swap
  m.updateScore()
  expect(m.scoreCounter).toStrictEqual(0)

  // //commence a swap between syllables[0] and [15] for +1 in score
  let syllable3 = pz.allSyllables[0];
  let syllable4 = pz.allSyllables[15];
  m.swap(syllable3,syllable4);
  m.updateScore()
  expect(m.scoreCounter).toStrictEqual(0)

})
