'use client'
import React from 'react'
import { Model, Syllable } from '../model'
import { configuration1 } from '../puzzle'
import { computeRectangle, redrawCanvas } from '../boundary'

var actualPuzzle = configuration1;


//controller(s)
export function selectSyllable(m:Model, canvas:any, e:any){
  const canvasRect = canvas.getBoundingClientRect();

  // find first syllable piece on which mouse was pressed (if one exists)
  let syllable:Syllable|undefined = m.puzzle.syllables?.find(syllable => {
      let rect = computeRectangle(syllable);
      return rect.contains(e.clientX - canvasRect.left, e.clientY - canvasRect.top);
  })

  //either selected the chosen syllable or set to 'undefined'
  if(syllable === undefined){
    //do nothing
  }else{
    m.puzzle.selected.push(syllable);
  }
}


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
  const handleClick = (e:any) => {
    selectSyllable(model, canvasRef.current, e);
    console.log(model.puzzle.selected.pop());
    console.log(model.puzzle.selected)
  }


  //RENDER
  return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <canvas ref={canvasRef} className="puzzle" width={500} height={500} onClick={handleClick}></canvas>
        <label className="nummoves">{"Number of Moves:" + model.numMoves}</label>
        <label className="score">Score:</label>

        <div className="buttons">
        <button className="button swapbutton">Swap</button>
          <button className="button resetbutton">Reset</button>
          <button className="button undobutton">Undo</button>
          <button className="button configuration1button">Configuration1</button>
          <button className="button configuration2button">Configuration2</button>
          <button className="button configuration3button">Configuration3</button>
        </div>

      </main>
       );
}
