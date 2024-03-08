const pawnException = (objPawn) => {
    var help = document.createElement('div')
    helpersDots.push(help)
    help.classList.add('ring')
    objPawn.newSpot.cell.appendChild(help)
    objPawn.newSpot.cell.classList.add('path')

    possiblePlays.push([objPawn.newSpot])    
    objPawn.newSpot.possibleMove = true

}