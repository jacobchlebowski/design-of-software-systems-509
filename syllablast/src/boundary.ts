import { Model } from './model'

export function redrawCanvas(model:Model, canvasObj:any){
    const ctx = canvasObj.getContext('2d')
    ctx.clearRect(0,0, canvasObj.width, canvasObj.height)

    let nr = model.puzzle.numRows
    let nc = model.puzzle.numColumns

    ctx.fillStyle = 'orange'
    console.log(nc);
    console.log(nr);
    ctx.fillRect(0, 0, 100*nc, 100*nr)
}