import { computeRectangle } from "./boundary";
import { configuration1, configuration2, configuration3 } from "./puzzle";

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
    location : Coordinate;
    syllable : string;

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
    readonly selected : Syllable[];     // readonly selected:Array<Syllable> = new Array<Syllable>(2);
    readonly previousMoves : Syllable[];
    readonly allParentWords : string[][];
             syllables : Array<Syllable>;

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
    initialConfig : any;
    selectOrDeselectSyllable: (m: Model, canvas: any, e: any) => void;

    //configuration is going to be JSON-encoded puzzle
    constructor(info) {
        this.initialize(info);
        this.initialConfig = info;
        this.selectOrDeselectSyllable = (m: Model, canvas: any, e: any) => {
            const canvasRect = canvas.getBoundingClientRect();

            // find first syllable piece on which mouse was pressed (if one exists)
            let syllable: Syllable | undefined = m.puzzle.syllables?.find(syllable => {
                let rect = computeRectangle(syllable);
                return rect.contains(e.clientX - canvasRect.left, e.clientY - canvasRect.top);
            });

            // either selected the chosen syllable or set to 'undefined'
            let selected = m.puzzle.selected;
            if (syllable === undefined) { /** do nothing */ }
            else if (selected.length < 2 && !selected.includes(syllable)) {  // if "selected" isn't full and the syllable isn't already selected...
                selected.push(syllable);
            } else if (selected.includes(syllable)) { // if it's already selected, then we can deselect it
                let index = selected.indexOf(syllable);
                selected.splice(index, 1); // remove the syllable from the selected
            }
        };
    }

    initialize(info){
        //initialize the following:
        let numRows = parseInt(info.board.rows);
        let numColumns = parseInt(info.board.columns);

        //Selected Array of Size 2
        // var selected:Array<Syllable> = new Array<Syllable>(2);
        let selected = [];
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



    swapAvailable() : boolean {
        //if "selected" is not equal to 2, then we cannot swap
        if(this.puzzle.selected.length !== 2){ return false; }

        return true;
    }

    undoAvailable() : boolean {
        //if "previousMoves" is 2 or more, then we can undo a swap
        if(this.puzzle.previousMoves.length < 2){ return false; }
        return true;
    }

    resetAvailable() : boolean {
        //if "previousMoves" is 2 or more, then we can reset
        if(this.puzzle.previousMoves.length < 2){ return false; }

        return true;
    }

    swap(syllable1:Syllable,syllable2:Syllable){
        let s1Location = syllable1.location;
        let s2Location = syllable2.location;
        let s1Index = -1;
        let s2Index = -1;
        
        //get index of 2 syllables
        this.puzzle.syllables.forEach(syllable => {
            if(syllable1 === syllable){
                s1Index = this.puzzle.syllables.indexOf(syllable)
                syllable.location = s2Location;
            } else if(syllable2 === syllable){
                s2Index = this.puzzle.syllables.indexOf(syllable)
                syllable.location = s1Location;
            }
        })
        //dont let these change
        const index1 = s1Index;
        const index2 = s2Index;
        const temp = this.puzzle.syllables[index1]
        //add to previous moves before the swap occurs...
        this.puzzle.previousMoves.push(this.puzzle.syllables[index1])
        this.puzzle.previousMoves.push(this.puzzle.syllables[index2])
        //swap them!
        this.puzzle.syllables[index1] = this.puzzle.syllables[index2];
        this.puzzle.syllables[index2] = temp;
    }

    undoSwap(syllable1:Syllable,syllable2:Syllable){
        //undo swap same as swap, except we take from previous moves and don't append to that array after...
        let s1Location = syllable1.location;
        let s2Location = syllable2.location;
        let s1Index = -1;
        let s2Index = -1;
        
        //get index of 2 syllables
        this.puzzle.syllables.forEach(syllable => {
            if(syllable1 === syllable){
                s1Index = this.puzzle.syllables.indexOf(syllable)
                syllable.location = s2Location;
            } else if(syllable2 === syllable){
                s2Index = this.puzzle.syllables.indexOf(syllable)
                syllable.location = s1Location;
            }
        })
        //dont let these change
        const index1 = s1Index;
        const index2 = s2Index;
        const temp = this.puzzle.syllables[index1]
        //swap them!
        this.puzzle.syllables[index1] = this.puzzle.syllables[index2];
        this.puzzle.syllables[index2] = temp;
    }

    updateMoveCount(delta:number){
        this.numMoves += delta;
    }

    updateScore(){
        //set score to 0
        this.scoreCounter = 0;
        //update score by each row...
        
        //just check first syllable of each word first
        for(let r=0; r<16;r+=4){
            //if it equals ANY of the parentsWords first syllables, add a point, and then we wanna traverse the rest of those columns
            if(this.puzzle.syllables[r].syllable === this.puzzle.allParentWords[0][0]){
                //traverse rest of the columns and add a point if it equals that parent word syllable
                let p=0;
                while(p !== 4){
                    if(this.puzzle.syllables[r+p].syllable === this.puzzle.allParentWords[0][p]){
                        this.scoreCounter++;
                        p++
                    }else{
                        p=4;
                    }
                }
            }
            if(this.puzzle.syllables[r].syllable === this.puzzle.allParentWords[1][0]){
                let p=0;
                while(p !== 4){
                    if(this.puzzle.syllables[r+p].syllable === this.puzzle.allParentWords[1][p]){
                        this.scoreCounter++;
                        p++
                    }else{
                        p=4;
                    }
                }
            }
            if(this.puzzle.syllables[r].syllable === this.puzzle.allParentWords[2][0]){
                let p=0;
                while(p !== 4){
                    if(this.puzzle.syllables[r+p].syllable === this.puzzle.allParentWords[2][p]){
                        this.scoreCounter++;
                        p++
                    }else{
                        p=4;
                    }
                }
            }
            if(this.puzzle.syllables[r].syllable === this.puzzle.allParentWords[3][0]){
                let p=0;
                while(p !== 4){
                    if(this.puzzle.syllables[r+p].syllable === this.puzzle.allParentWords[3][p]){
                        this.scoreCounter++;
                        p++
                    }else{
                        p=4;
                    }
                }
            }

        }

        if(this.scoreCounter === 16){ this.victory = true;} else { this.victory = false;}
    }

    reset() {
        //reset puzzle based on configuration name (info.name)?
        this.initialize(this.initialConfig);
    }

    changeConfiguration(buttonName:string){
        if(buttonName === "button configuration1button"){
            //switch to config1
            this.initialize(configuration1)
            this.initialConfig = configuration1
            this.numMoves=0;
            this.scoreCounter = 0;
            this.victory = false;
        }
        if(buttonName === "button configuration2button"){
            //switch to config1
            this.initialize(configuration2)
            this.initialConfig = configuration2
            this.numMoves=0;
            this.scoreCounter = 0;
            this.victory = false;
        }
        if(buttonName === "button configuration3button"){
            //switch to config1
            this.initialize(configuration3)
            this.initialConfig = configuration3
            this.numMoves=0;
            this.scoreCounter = 0
            this.victory = false;
        }
    }

}