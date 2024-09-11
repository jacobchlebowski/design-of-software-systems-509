import { Model, Puzzle, Syllable } from './model'


//Scaling constants for canvas
var BOXSIZE:number = 124;
var OFFSET:number = 5;

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

    /** does the (x,y) point exist within the rectangle */
    contains(x:number, y:number) : boolean {
        return this.x >= this.x && x <= (this.x + this.width) && y >= this.y && y <= (this.y + this.height);
    }
}

export function drawPuzzle (ctx:any, puzzle:Puzzle) {
    ctx.shadowColor = 'white'
    let selected = puzzle.selected

    puzzle.syllables?.forEach(syllable => {
         let rect = computeRectangle(syllable);
         if (selected.includes(syllable)){       //if the syllable is in selected
                ctx.fillStyle = 'yellow' //change its color to yellow
            } else{
                //WHATEVER IS NOT SELECTED MAKE LIGHT BLUE
                ctx.fillStyle = 'lightblue';
            }

         //draw the rectangle (each syllable) and add the syllable
         ctx.fillRect(rect.x, rect.y, rect.width, rect.height)
         ctx.fillStyle='black';
         ctx.font = '10px Arial';
         ctx.textAlign = 'right';
         ctx.textBaseline = 'bottom';
         ctx.fillText("hello",rect.width,rect.height);
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