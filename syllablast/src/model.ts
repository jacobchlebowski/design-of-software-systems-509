//Coordinate
export class Coordinate {
    public row : number;
    public column : number;

    constructor(row:number, column:number){
        this.row = row;
        this.column = column;
    }
}

//Syllable
export class Syllable {
    readonly location : Coordinate;
    readonly syllable : string;

    constructor(location:Coordinate,syllable:string){
        this.location = location;
        this.syllable = syllable;
    }
}

//Puzzle
export class Puzzle{
    readonly numRows : number;
    readonly numColumns : number;
    readonly syllables : Syllable[];
    readonly selected : [Syllable,Syllable];
    readonly previousMoves : Syllable[];
    readonly parentWords : string[][];

    constructor(numRows:number, numColumns:number, syllables:Syllable[], selected:[Syllable,Syllable], previousMoves:Syllable[], parentWords:string[][]){
        this.numRows = numRows;
        this.numColumns = numColumns;
        this.syllables = syllables;
        this.selected = selected;
        this.previousMoves = previousMoves;
        this.parentWords = parentWords;
    }
}

//Model
export class Model{
    puzzle : Puzzle;
    numMoves : number;
    scoreCounter : number;
    victory : boolean;

    //configuration is going to be JSON-encoded puzzle
    constructor(info){
        this.initialize(info);
    }

    initialize(info){
        //initialize the following:
        let numRows = parseInt(info.board.rows);
        let numColumns = parseInt(info.board.columns);
        let syllables = info.syllables;
        let selected = [Syllable,Syllable];
        let previousMoves = [];
        let parentWords = info.parentWords;


        this.puzzle = new Puzzle(numRows, numColumns, syllables, selected, previousMoves, parentWords);
        this.numMoves = 0;
        this.scoreCounter = 0;
        this.victory = false;

    }

}