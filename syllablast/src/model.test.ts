import { expect, test } from 'vitest'
import { MoveType, Up, Down, Left, Right, NoMove } from './model.ts'
import { Coordinate, Piece, Puzzle, Model } from './model.ts'
import { puzzleInformation } from './puzzle.ts'

test('MoveType', () => {

  expect(MoveType.parse("down")).toBe(Down)
  expect(MoveType.parse("up")).toBe(Up)
  expect(MoveType.parse("left")).toBe(Left)
  expect(MoveType.parse("right")).toBe(Right)

  expect(MoveType.parse("--BAD--")).toBe(NoMove)
})

test('Coordinate', () => {
  let c1 = new Coordinate(2, 3)
  expect(c1.row).toBe(2)
  expect(c1.column).toBe(3)
})

test('Piece', () => {
  let p1 = new Piece(2, 1, false)

  expect(p1.width).toBe(2)
  expect(p1.height).toBe(1)
  expect(p1.isWinner).toBe(false)
})

test('Puzzle', () => {
  let pz = new Puzzle(4, 5, new Coordinate(2, 3), Down)

  expect(pz.numRows).toBe(4)
  expect(pz.numColumns).toBe(5)

  // use 'toStrictEqual' when object structure is to be compared, and not just ==
  expect(pz.destination).toStrictEqual(new Coordinate(2, 3))
  expect(pz.finalMove).toBe(Down)
})

test('Model', () => {
  let m = new Model(puzzleInformation)

  expect(m.numMoves).toBe(0)
  expect(m.victory).toBe(false)

  // use 'toStrictEqual' when object structure is to be compared, and not just ==
  expect(m.puzzle.numRows).toBe(5)
  expect(m.puzzle.numColumns).toBe(4)

})