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


//Configuration 1
export class Configuration1{
    syllables : Syllable[];
    numRows : number;
    numColumns = number;

    constructor(syllables:Syllable[], numRows:number, numColumns:number){
        this.syllables = Syllable[];
        this.numRows = numRows;
        this.numColumns = numColumns;
    }
}


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
    configuration : Configuration1;
    selected : Syllable[];
    //previousMoves : Puzzle [*]??????

    constructor(configuration:Configuration1, selected:Syllable){
        this.configuration = Configuration1;
        this.selected = Syllable[];
    }
}