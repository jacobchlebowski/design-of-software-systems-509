//Coordinate
export class Coordinate {
    readonly row : number;
    readonly column : number;


    constructor(row:number, column:number){
        this.row = row;
        this.column = column;
    }
}

//Syllable
export class Syllable {
    readonly coordinate : Coordinate;
    readonly syllable : string;
    readonly parentWord : string;
    readonly syllableNumber : number;
    readonly validLocation : boolean;

    constructor(coordinate:Coordinate, syllable:string, parentWord:string, syllableNumber:number, validLocation:boolean){
        this.coordinate = coordinate;
        this.syllable = syllable;
        this.parentWord = parentWord;
        this.syllableNumber = syllableNumber;
        this.validLocation = validLocation;
    }
}


// //Configuration 1??
// export class Configuration{
//     syllables : Syllable[];
//     numRows : number;
//     numColumns : number;

//     constructor(syllables:Syllable[], numRows:number, numColumns:number){
//         this.syllables = Syllable[];
//         this.numRows = numRows;
//         this.numColumns = numColumns;
//     }
// }


// //Configuration 2
// export class Configuration2{
//     syllables : Syllable[];
//     numRows : number;
//     numColumns = number;

//     constructor(syllables:Syllable[], numRows:number, numColumns:number){
//         this.syllables = Syllable[];
//         this.numRows = numRows;
//         this.numColumns = numColumns;
//     }
// }

// //Configuration 3
// export class Configuration3{
//     syllables : Syllable[];
//     numRows : number;
//     numColumns = number;

//     constructor(syllables:Syllable[], numRows:number, numColumns:number){
//         this.syllables = Syllable[];
//         this.numRows = numRows;
//         this.numColumns = numColumns;
//     }
// }


//Puzzle
export class Puzzle{
    syllables : Syllable[];
    selected : Syllable[];
    numRows : number;
    numColumns : number;
    //previousMoves : Puzzle [*]??????

    constructor(syllables:Syllable, selected:Syllable, numRows:number, numColumns:number){
        this.syllables = Syllable;
        this.selected = Syllable;
        this.numRows = numRows;
        this.numColumns = numColumns;
    }
}


//Model
export class Model{
    puzzle : Puzzle;
    numMoves : number;
    scoreCounter : number;
    victory : boolean;

    //configuration is going to be JSON-encoded puzzle
    constructor(configuration){
        this.initialize(configuration);
    }

    initialize(configuration){
        // let syllables = parseInt(configuration.board.syllables);
        // let selected = parseInt(configuration.selected.)
        let numRows = parseInt(configuration.board.numRows);
        let numColumns = parseInt(configuration.board.numColumns);
        //let previousMoves = 
     
       // this.puzzle = new Puzzle(numRows,numColumns);
    }

}