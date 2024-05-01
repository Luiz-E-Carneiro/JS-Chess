var defendPieces = []
var attackingPieces = []

const verificDefendingPiece = (arrayCells, piece, direction) => {
    let color = piece.color
    var amountPieces = arrayCells.filter(objCell => objCell.piece && objCell.piece.color != color)

    var defendingPiece

    if (amountPieces.length == 2) {
        amountPieces[0].piece.name === 'king' ? defendingPiece = amountPieces[1] : defendingPiece = amountPieces[0]
        limitDefenderPiece(defendingPiece, direction)
        attackingPieces.push(piece)
    }
}


const limitDefenderPiece = (defendingPiece, direc) => {
    let name = defendingPiece.piece.name
    const { column, line } = defendingPiece

//    onlyLR  ;   onlyUD  ;   onlyTLBR    ;   onlyTRBL    ; cannotMove
    defendPieces.push(boardObj[line][column])
    //Vertical & Horizontal
    if (direc === 'left' || direc === 'right') {
        if (name === 'queen' || name === 'rook') {
            boardObj[line][column].onlyLR = true
        } else {
            boardObj[line][column].cannotMove = true
        }
    } else if (direc === 'up' || direc === 'down') {
        if (name === 'queen' || name === 'rook' || name === 'pawn') {
            boardObj[line][column].onlyUD = true
        } else {
            boardObj[line][column].cannotMove = true
        }
    }
    //Diagonal
    else if (direc === 'topLeft' || direc === 'bottomRight') {
        if(name === 'pawn'){
            boardObj[line][column].onlyCaptureTL = true
        }else if (name === 'queen' || name === 'bishop') {
            boardObj[line][column].onlyTLBR = true
        } else {
            boardObj[line][column].cannotMove = true
        }
    } else if (direc === 'topRight' || direc === 'bottomLeft') {
        if(name === 'pawn'){
            boardObj[line][column].onlyCaptureTR = true
        } else if (name === 'queen' || name === 'bishop') {
            boardObj[line][column].onlyTRBL = true
        } else {
            boardObj[line][column].cannotMove = true
        }
    }
}

const resetLimits = ( ) => {
    if(defendPieces.length === 0) return
    defendPieces.forEach(cellObj => {
        let {line, column} = cellObj

        if(cellObj.onlyLR) delete boardObj[line][column].onlyLR
        if(cellObj.onlyUD) delete boardObj[line][column].onlyUD
        if(cellObj.onlyTLBR) delete boardObj[line][column].onlyTLBR
        if(cellObj.onlyTRBL) delete boardObj[line][column].onlyTRBL
        if(cellObj.cannotMove) delete boardObj[line][column].cannotMove
        if(cellObj.onlyCapture) delete boardObj[line][column].onlyCapture
        if(cellObj.onlyCaptureTR) delete boardObj[line][column].onlyCaptureTR
        if(cellObj.onlyCaptureTL) delete boardObj[line][column].onlyCaptureTL
        if(cellObj.onlyTLBR) delete boardObj[line][column].onlyTLBR
        if(cellObj.onlyTRBL) delete boardObj[line][column].onlyTRBL
    });
    defendPieces = []
    attackingPieces = []
}