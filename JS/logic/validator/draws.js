const draw = (btn1, btn2) => {
    btn1.parentNode.removeChild(btn1)
    btn2.parentNode.removeChild(btn2)
    blackDraw.style.display = 'flex'
    whiteDraw.style.display = 'flex'
    result.innerText = 'Draw'
    addHalfPoints()
}

const addHalfPoints = () => {
    gameEnded = true
    let drawSound = new Audio('./../assets/sounds/game-draw.mp3')
    drawSound.play()
    pointsP1.innerText = Number(pointsP1.innerText) + 0.5
    pointsP2.innerText = Number(pointsP2.innerText) + 0.5
    stopTimerShaking()
}

var movementHistory = {
    player1: {
        before: undefined,
        now: undefined
    },
    player2: {
        before: undefined,
        now: undefined
    }
}

let rep1 = 0
let rep2 = 0

const verifyRepetition = (lastPlace, currentPlace) => {
    if (player === 'white') {
        if (currentPlace === movementHistory.player1.before && lastPlace === movementHistory.player1.now) {
            rep1++
        } else {
            rep1 = 0
            rep2 = 0
        }
        movementHistory.player1.before = lastPlace
        movementHistory.player1.now = currentPlace
    } else {
        if (currentPlace === movementHistory.player2.before && lastPlace === movementHistory.player2.now) {
            rep2++
        } else {
            rep1 = 0
            rep2 = 0
        }
        movementHistory.player2.before = lastPlace
        movementHistory.player2.now = currentPlace
    }
    if (rep1 === 3 && rep2 === 3) {
        finishGame(false, 'Draw: Repetition')
    }
}


const verifyPiecesAmount = (array1, array2) => {
    if (array1.length === 1 && array2.length === 1) {
        finishGame(false, 'Draw: Insufficient Material')
    } else if (array1.length === 1 && array2.length === 2 || array1.length === 2 && array2.length === 1) {

        if (array1.length > 1) {
            array1.forEach(piecesObj => {
                if (piecesObj.piece.name === 'bishop' || piecesObj.piece.name === 'knight') {
                    finishGame(false, 'Draw: Insufficient Material')
                }
            });
        } else {
            array2.forEach(piecesObj => {
                if (piecesObj.piece.name === 'bishop' || piecesObj.piece.name === 'knight') {
                    finishGame(false, 'Draw: Insufficient Material')
                }
            });
        }

    } else if (array1.length === 2 && array2.length === 2) {
        let condition1 = false
        let condition2 = false
        array1.forEach(piecesObj => {
            if (piecesObj.piece.name === 'bishop' || piecesObj.piece.name === 'knight') {
                condition1 = true
            }
        });
        array2.forEach(piecesObj => {
            if (piecesObj.piece.name === 'bishop' || piecesObj.piece.name === 'knight') {
                condition2 = true
            }
        });

        if (condition1 && condition2) finishGame(false, 'Draw: Insufficient Material')

    } else if (array1.length === 2 && array2.length === 3 || array1.length === 3 && array2.length === 2) {
        let justOne
        let withouKing
        if (array1.length > array2.length) {
            withouKing = array1.filter(objPiece => objPiece.piece.name != 'king')
            justOne = array2
        } else {
            withouKing = array2.filter(objPiece => objPiece.piece.name != 'king')
            justOne = array1
        }

        if (
            withouKing[0].piece.name === 'knight' && withouKing[1].piece.name === 'knight' ||
            withouKing[0].piece.name === 'bishop' || withouKing[1].piece.name === 'bishop'
        ) {
            finishGame(false, 'Draw: Insufficient Material')
        }

    }
}

const verifyDrownedKing = (arrayPieces) => {
    let kingDrowned = true
    arrayPieces.forEach(pieceObj => {
        switch (pieceObj.piece.name) {
            case 'pawn':
                if (pawnPath(pieceObj, false, true)) kingDrowned = false
                break;
            case 'kight':
                if (knightPath(pieceObj, false, true)) kingDrowned = false
                break;
            case 'bishop':
                if (bishopPath(pieceObj, false, true)) kingDrowned = false
                break;
            case 'rook':
                if (rookPath(pieceObj, false, true)) kingDrowned = false
                break;
            case 'queen':
                if (queenPath(pieceObj, false, true)) kingDrowned = false
                break;
            case 'king':
                if (kingPath(pieceObj, false, true) ) kingDrowned = false
                break;
        }
    });
    return kingDrowned
}

function _50Moves(movedPiece, newSpotPiece) {
    if (movedPiece != 'pawn' && newSpotPiece == undefined) {
        moves50++
        if (moves50 === 50) {
            finishGame(false, 'Draw: 50 moves')
        }
    } else {
        moves50 = 0
    }
}