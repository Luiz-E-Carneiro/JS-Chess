var objCheck = []
var helpKingCells = []
var booleanCheck = false

const resetCheck = () => {
    objCheck = []
    helpKingObjs = []
    booleanCheck = false
}

//  ({ attackPiece: pieceObj, cellsUntilKing: objSpot, objKing: objSpot })

const verificCheck = () => {
    if (!booleanCheck || objCheck.length == 0) return

    let objKing = objCheck[0].objKing
    let color = objKing.piece.color

    if (objCheck.length > 1) {
        blockAllPieces(color)
        EmptySpacesToKing(objKing, true)
    } else {
        helpKing(color)
        kingPath(objKing, false, true)
        if (!kingPath(objKing, false, true) && helpKingObjs.length === 0){
            checkMate(objKing)
        } 
    }

}

const blockAllPieces = (color) => {
    var piecesToBlock = getPieces(color)
    piecesToBlock.forEach(pieceObj => {
        pieceObj.cannotMove = true
        color === 'white' ? cellsBlocked.white.push(pieceObj) : cellsBlocked.black.push(pieceObj)
    });
}

const needHelp = (currentObj) => {
    refrash()
    if(helpKingObjs.length == 0 || currentObj.piece.name === 'king') return false
    for (let i = 0; i < helpKingObjs.length; i++) {
        if(helpKingObjs[i].helpPiece === currentObj){
            paintPath([], [helpKingObjs[i].helpCell])
        }
    }
    return true
}