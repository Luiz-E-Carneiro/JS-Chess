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

    if (objCheck.length > 1) { // Double Check
        blockAllPieces(color)
        EmptySpacesToKing(objKing, true)
    } else {
        helpKing(color)
        if (!kingPath(objKing, false, true) && helpKingObjs.length === 0){
            checkMate(objKing)
        } else if(helpKingObjs.length === 0){
            blockAllPieces(objKing.piece.color, 'king')
        } 
    }

}

const blockAllPieces = (color, leftPiece = undefined) => {
    var piecesToBlock = getPieces(color)
    piecesToBlock.forEach(pieceObj => {
        if(pieceObj.piece.name != leftPiece){
            pieceObj.cannotMove = true
            color === 'white' ? cellsBlocked.white.push(pieceObj) : cellsBlocked.black.push(pieceObj)
        } 
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