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

    place(location:Coordinate){
        let aLocation = new Coordinate(this.location.row, this.location.column);
        aLocation = location;
    }

    copy() : Syllable {
        let s = new Syllable(this.location, this.syllable);
        s.place(this.location)
        return s;
    }
}

//Puzzle
export class Puzzle{
    readonly numRows : number;
    readonly numColumns : number;
    readonly allSyllables : Syllable[];
    readonly selected : Syllable[];
    readonly previousMoves : Syllable[];
    readonly allParentWords : string[][];
             syllables : Array<Syllable> | undefined;

    constructor(numRows:number, numColumns:number, allSyllables:Syllable[], selected:Syllable[], previousMoves:Syllable[], allParentWords:string[][]){
        this.numRows = numRows;
        this.numColumns = numColumns;
        this.allSyllables = allSyllables;
        this.selected = selected;
        this.previousMoves = previousMoves;
        this.allParentWords = allParentWords;
    }

    initialize(syllables:Array<Syllable>){
        //make sure to create NEW Syllable objects
        this.syllables = syllables.map(s => s.copy());
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

        //Selected Array of Size 2
        var selected:Array<Syllable> = new Array<Syllable>(2);
        let previousMoves = [];

        //Grab all parent words
        var allParentWords:Array<Array<string>> = [];
        for (let i of info.parentWords){
            let word = [i.firstSyll,i.secondSyll,i.thirdSyll,i.fourthSyll];
            allParentWords.push(word);
        }

        //Grab all syllables
        var allSyllables:Array<Syllable> = [];
        for (let s of info.syllables){
            let coordinate = new Coordinate(parseInt(s.location.row),parseInt(s.location.column))
            let syllable = new Syllable(coordinate,s.label);
            allSyllables.push(syllable);
        }

        // Place Syllables on board
        for (let p of allSyllables){
            p.place(p.location);
        }

        //create puzzle to be initialized
        this.puzzle = new Puzzle(numRows, numColumns, allSyllables, selected, previousMoves, allParentWords);
        this.puzzle.initialize(allSyllables);
        this.numMoves = 0;
        this.scoreCounter = 0;
        this.victory = false;
    }

}