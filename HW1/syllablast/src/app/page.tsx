'use client'
import React from 'react'
import { Model, Syllable } from '../model'
import { configuration1, configuration2, configuration3 } from '../puzzle'
import { computeRectangle, redrawCanvas } from '../boundary'

var actualPuzzle = configuration1;


//CONTROLLER(S)
export function selectOrDeselectSyllable(m:Model, canvas:any, e:any){
  const canvasRect = canvas.getBoundingClientRect();

  // find first syllable piece on which mouse was pressed (if one exists)
  let syllable:Syllable|undefined = m.puzzle.syllables?.find(syllable => {
      let rect = computeRectangle(syllable);
      return rect.contains(e.clientX - canvasRect.left, e.clientY - canvasRect.top);
  })

  //either selected the chosen syllable or set to 'undefined'
  let selected = m.puzzle.selected;
  if(syllable === undefined){/** do nothing */ }
  else if(selected.length < 2 && !selected.includes(syllable)){  //if "selected" isn't full and the syllable isn't already selected...
    selected.push(syllable);
  }else if(selected.includes(syllable)){ //if its already selected, then we can deselect it
    let index = selected.indexOf(syllable);
    selected.splice(index,1); //remove the syllable from the selected
  }
}


export function swapSyllable(m:Model){
  let puzzle = m.puzzle;
  //grab the syllables off of selected
  let syllable2 = puzzle.selected.pop()
  let syllable1 = puzzle.selected.pop()

  //Swap the syllables, add swaps to previousMoves
  if(syllable1 !== undefined && syllable2 !== undefined){
    m.swap(syllable1, syllable2)
  }

  //set number of moves to numMoves+1...
  m.updateMoveCount(+1);
  //check and update score and check for
  m.scoreCounter=0;
  m.updateScore()
}



export function undoSwap(m:Model){
  let puzzle = m.puzzle;
  //grab the syllables off of previousMoves
  let syllable2 = puzzle.previousMoves.pop()
  let syllable1 = puzzle.previousMoves.pop()
  //undo a swap
  if(syllable1 !== undefined && syllable2 !== undefined){
    m.undoSwap(syllable1,syllable2)
  }

  //set number of moves to numMoves+1...
  m.updateMoveCount(-1);
  //check and update score
  m.updateScore()

  /** DON't check for victory */
}


export function resetPuzzle(m:Model){
  m.reset();
}

export function chooseConfiguration(m:Model, buttonName:string){
  m.changeConfiguration(buttonName);
}



/**====================================================================================================================== */
export default function Home() {
  //initial instantiation of the Model comes from the actualPuzzle
  const [model, setModel] = React.useState(new Model(actualPuzzle))
  const [redraw, setRedraw] = React.useState(0)

  const canvasRef = React.useRef(null) //Later need to be able to refer to App

  //Set up the refresh policies
  React.useEffect(() => {
    redrawCanvas(model, canvasRef.current);
  }, [model, redraw])
  

    //low-level controller
    const handleCanvasClick = (e:any) => {
      selectOrDeselectSyllable(model, canvasRef.current, e);
      setRedraw(redraw +1)
    }

    //low-level controller
    const handleSwap = (e:any) => {
      swapSyllable(model);
      setRedraw(redraw +1)
    }

    //low-level controller
    const handleUndoSwap = (e:any) => {
      undoSwap(model);
      setRedraw(redraw +1)
    }

    //low-level controller
    const handleReset = (e:any) => {
      resetPuzzle(model);
      setRedraw(redraw +1)
    }

    //low-level controller
    const handleConfigurationChange = (e:any) => {
      let buttonName = e.target.className
      chooseConfiguration(model,buttonName);
      setRedraw(redraw +1)
    }


  //RENDER
  return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <canvas ref={canvasRef} className="puzzle" width={500} height={500} onClick={model.victory ? undefined : handleCanvasClick}></canvas>
        <label className="nummoves">{"Number of Moves: " + model.numMoves}</label>
        <label className="score">{"Score: " + model.scoreCounter}</label>
        {model.victory && (<label className="congratulationsMessage">{"CONGRATULATIONS"}</label>)}

        <div className="buttons">
        <button data-testid="swapbutton" className="button swapbutton" onClick={handleSwap} disabled={!model.swapAvailable() || model.victory}>Swap</button>
          <button data-testid="resetbutton" className="button resetbutton" onClick={handleReset} disabled={!model.resetAvailable()}>Reset</button>
          <button data-testid="undobutton" className="button undobutton" onClick={handleUndoSwap} disabled={!model.undoAvailable() || model.victory}>Undo</button>
          <button data-testid="configuration1button" className="button configuration1button" onClick={handleConfigurationChange}>Configuration1</button>
          <button data-testid="configuration2button" className="button configuration2button" onClick={handleConfigurationChange}>Configuration2</button>
          <button data-testid="configuration3button" className="button configuration3button" onClick={handleConfigurationChange}>Configuration3</button>
        </div>

      </main>
       );
}
