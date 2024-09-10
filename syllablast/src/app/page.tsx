'use client'
import React from 'react'
import { Model } from '../model'
import { configuration1 } from '../puzzle'
import { redrawCanvas } from '../boundary'

var actualPuzzle = configuration1;


export default function Home() {
  //initial instantiation of the Model comes from the actualPuzzle
  const [model, setModel] = React.useState(new Model(actualPuzzle))
  const [redraw, setRedraw] = React.useState(0)

  const canvasRef = React.useRef(null) //Later need to be able to refer to App

  //Set up the refresh policies
  React.useEffect(() => {
    redrawCanvas(model, canvasRef.current);
  }, [model, redraw])
  

  //RENDER
  return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <canvas ref={canvasRef} className="puzzle" width={500} height={500}></canvas>
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
