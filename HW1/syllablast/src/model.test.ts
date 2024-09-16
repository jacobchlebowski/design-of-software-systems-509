import { expect, test } from 'vitest'
import { Coordinate, Syllable, Puzzle, Model } from './model.ts'
import { configuration1, configuration2, configuration3 } from './puzzle.ts'

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

