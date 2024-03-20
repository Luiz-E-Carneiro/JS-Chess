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

var firstMovePawn = ''
//Sounds
let captureSound = new Audio('./../../assets/sounds/capture.mp3')
let whiteMoveSound = new Audio('./../../assets/sounds/move-self.mp3')
let blackMoveSound = new Audio('./../../assets/sounds/move-opponent.mp3')
let checkSound = new Audio('./../../assets/sounds/move-check.mp3')

const movePiece = (newSpot) => {
    let capturedAreas = document.getElementsByClassName('capture-area')
    let capturedWhite = capturedAreas[0]
    let capturedBlack = capturedAreas[1]
    var img
    var captured = false
    // Delete img    
    {
        function deletePiece(childrens, newS = false) {
            for (let i = 0; i < childrens.length; i++) {
                if (childrens[i].tagName.toLowerCase() === 'img') {
                    img = childrens[i]
                    childrens[i].parentNode.removeChild(childrens[i])
                    if (newS) {
                        let imgConteiner = document.createElement('div')
                        imgConteiner.classList.add('image-container')
                        imgConteiner.appendChild(img)
                        newSpot.piece.color === 'white' ? capturedWhite.appendChild(imgConteiner) : capturedBlack.appendChild(imgConteiner)
                        captured = true
                    }
                }
            }
        }
    }
    const { column, line } = { ...currentObj }
    const { name, color } = currentObj.piece

    if (!newSpot.piece && currentObj.piece.name === 'pawn' && newSpot.column != column) {
        if (column - 1 >= 0) {
            if (boardObj[line][column - 1].piece.firstMove) {
                deletePiece(boardObj[line][column - 1].cell.children, true)
                boardObj[line][column - 1].piece = false
            }
        }
        if (column + 1 <= 7) {
            if (boardObj[line][column + 1].piece.firstMove) {
                deletePiece(boardObj[line][column + 1].cell.children, true)
                boardObj[line][column + 1].piece = false
            }
        }
        deletePiece(currentObj.cell.children)

    } else {
        deletePiece(newSpot.cell.children, true)
        deletePiece(currentObj.cell.children)
    }
    // Add img in the new cell
    newSpot.cell.appendChild(img)

    //50 Moves Verify
    _50Moves(name, newSpot.piece.name)

    // get infos in main obj (boardObj)
    var newColumn = newSpot.column
    var newLine = newSpot.line
    var WB = color === 'white' ? 'W' : 'B'
    // Piece Check
    if (currentObj.piece.firstPlay === false && currentObj.piece.name === 'pawn' && newSpot.line === 3 || newSpot.line === 4) {
        boardObj[newLine][newColumn].piece = { name: name, color: color, firstPlay: true, firstMove: true, src: `./../assets/pieces/${name}${WB}.png` }
        if (firstMovePawn != '') disableFirstMove()
        firstMovePawn = boardObj[newLine][newColumn]
    } else if (currentObj.piece.firstPlay === false && currentObj.piece.name === 'rook' || currentObj.piece.name === 'king') {
        boardObj[newLine][newColumn].piece = { name: name, color: color, firstPlay: true, src: `./../assets/pieces/${name}${WB}.png` }
        disableFirstMove()
    } else if (currentObj.piece.name === 'pawn') {
        boardObj[newLine][newColumn].piece = { name: name, color: color, firstPlay: true, src: `./../assets/pieces/${name}${WB}.png` }
        if (newLine === 0 || newLine === 7) promotePawn(boardObj[newLine][newColumn])
        disableFirstMove()
    } else {
        boardObj[newLine][newColumn].piece = { name: name, color: color, firstPlay: true, src: `./../assets/pieces/${name}${WB}.png` }
        disableFirstMove()
    }
    boardObj[line][column].piece = false

    if (captured) captureSound.play()
    else player === 'white' ? whiteMoveSound.play() : blackMoveSound.play()

    // Game Started
    if (!gameStarted) {
        startGame()
    } else {
        // Give Up disabled 
        whiteGiveUp.disabled ? whiteGiveUp.disabled = false : whiteGiveUp.disabled = true
        blackGiveUp.disabled ? blackGiveUp.disabled = false : blackGiveUp.disabled = true
    }

    incrementation()
    gameVerifications()
    verifyRepetition(currentObj, newSpot)
    gameRefresh()
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
    if(rep1 === 3 && rep2 === 3){
        finishGame(false, 'Draw: Repetition')
    }
}

function startGame() {
    gameStarted = true
    for (let btn of mins) {
        btn.disabled = true
    }
    for (let btn of increments) {
        btn.disabled = true
    }
    whiteDraw.disabled = false
    blackDraw.disabled = false
    blackGiveUp.disabled = false
    timer(true)

    whiteWidthLine = time * 60
    blackWidthLine = time * 60
}

function disableFirstMove() {
    if (firstMovePawn === '') return
    delete firstMovePawn.piece.firstMove
    firstMovePawn = ""
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

const gameVerifications = () => {
    let playedColor = player
    let otherColor = player === 'white' ? 'black' : 'white'

    var playedPieces = getPieces(playedColor)
    var otherPieces = getPieces(otherColor)

    verificationDrownedKing(otherPieces)
    verifyPiecesAmount(playedPieces, otherPieces)
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

    } else if (array1.length === 1 && array2.length === 3 || array1.length === 3 && array2.length === 1) {
        let justOne, withouKing
        if (array1 > 1) {
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

const verificationDrownedKing = (pieces) => {
    if (verifyDrownedKing(pieces)) {
        finishGame(true)
    }
}

const verifyDrownedKing = (arrayPieces) => {
    let notDrowned = true

    arrayPieces.forEach(pieceObj => {

        switch (pieceObj.piece.name) {
            case 'pawn':
                if (pawnPath(pieceObj, false, true)) notDrowned = false
                break;
            case 'kight':
                if (knightPath(pieceObj, false, true)) notDrowned = false
                break;
            case 'bishop':
                if (bishopPath(pieceObj, false, true)) notDrowned = false

                break;
            case 'rook':
                if (rookPath(pieceObj, false, true)) notDrowned = false

                break;
            case 'queen':
                if (queenPath(pieceObj, false, true)) notDrowned = false

                break;
            case 'king':
                if (kingPath(pieceObj, false, true)) notDrowned = false
                break;
        }
    });

    return notDrowned
}

function gameRefresh() {
    refresh()
    resetLimits()
    resetCheck()
    resetBlockedCells()

    validateCheck()
    verificCheck()
}