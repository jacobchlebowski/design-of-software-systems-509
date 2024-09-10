import { Model, Puzzle, Syllable } from './model'


//Scaling constants for canvas
var BOXSIZE:number = 124;
var OFFSET:number = 3;

export function computeRectangle(syllable:Syllable){
    let c = syllable.location
    return new Rectangle(BOXSIZE*c.column + OFFSET, BOXSIZE*c.row + OFFSET, BOXSIZE*1 -2*OFFSET, BOXSIZE*1 -2*OFFSET);
}


/** Represents a rectangle */
export class Rectangle {
    readonly x : number;
    readonly y : number;
    readonly width : number;
    readonly height : number;

    constructor(x:number, y:number, width:number, height:number){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
}

export function drawPuzzle (ctx:any, puzzle:Puzzle) {
    ctx.shadowColor = 'white'
    let selected = puzzle.selected

    puzzle.syllables?.forEach(syllable => {
         let rect = computeRectangle(syllable);
         if (selected[0] !== undefined && selected[1] !== undefined){       //if AT LEAST ONE THING IS SELECTED
            for(let p of selected){ //FOR EVERY ITEM THATS SELECTED
                    ctx.fillStyle = 'yellow' //change its color to yellow
                }
            } else{
            ctx.fillStyle = 'lightblue';    //NOTHING IS SELECTED
         }
         ctx.fillRect(rect.x, rect.y, rect.width, rect.height)
    })
}


export function redrawCanvas(model:Model, canvasObj:any){
    const ctx = canvasObj.getContext('2d')
    ctx.clearRect(0,0, canvasObj.width, canvasObj.height)

    let nr = model.puzzle.numRows
    let nc = model.puzzle.numColumns

    if (model.puzzle){
        drawPuzzle(ctx, model.puzzle);
    }
}