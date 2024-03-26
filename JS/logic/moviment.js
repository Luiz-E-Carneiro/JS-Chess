var firstMovePawn = ''
//Sounds
let captureSound = new Audio('assets/sounds/capture.mp3')
let whiteMoveSound = new Audio('assets/sounds/move-self.mp3')
let blackMoveSound = new Audio('assets/sounds/move-opponent.mp3')
let checkSound = new Audio('assets/sounds/move-check.mp3')

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
    
    //50 Moves Verify
    _50Moves(name, newSpot.piece.name)

    incrementation()
    verifyRepetition(currentObj, newSpot)
    gameRefresh()
    gameVerifications()
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

const gameVerifications = () => {
    let playedColor = player
    let otherColor = player === 'white' ? 'black' : 'white'

    var playedPieces = getPieces(playedColor)
    var otherPieces = getPieces(otherColor)

    verificationDrownedKing(otherPieces)
    verifyPiecesAmount(playedPieces, otherPieces)
}

const verificationDrownedKing = (pieces) => {
    if (verifyDrownedKing(pieces)) {
        finishGame(true)
    }
}


function gameRefresh() {
    resetBlockedCells()
    refresh()
    resetLimits()
    resetCheck()

    validateCheck()
    verificCheck()
}