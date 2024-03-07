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
    deletePiece(newSpot.cell.children, true)
    deletePiece(currentObj.cell.children)
    const { column, line } = { ...currentObj }
    const { name, color } = currentObj.piece
    // Add img in the new cell
    newSpot.cell.appendChild(img)
    // get infos in main obj (boardObj)
    var newColumn = newSpot.column
    var newLine = newSpot.line
    var WB = color === 'white' ? 'W' : 'B'
    // Piece Check
    if (currentObj.piece.firstPlay === false && currentObj.piece.name === 'pawn') {
        boardObj[newLine][newColumn].piece = { name: name, color: color, firstPlay: true, firstMove: true, src: `./../assets/pieces/${name}${WB}.png` }
    } else if (currentObj.piece.firstPlay === false && currentObj.piece.name === 'rook' || currentObj.piece.name === 'king') {
        boardObj[newLine][newColumn].piece = { name: name, color: color, firstPlay: true, src: `./../assets/pieces/${name}${WB}.png` }
    } else if (currentObj.piece.name === 'pawn') {
        boardObj[newLine][newColumn].piece = { name: name, color: color, firstPlay: true, firstMove: false, src: `./../assets/pieces/${name}${WB}.png` }
        if (newLine === 0 || newLine === 7) promotePawn(boardObj[newLine][newColumn])
    } else {
        boardObj[newLine][newColumn].piece = { name: name, color: color, firstPlay: true, src: `./../assets/pieces/${name}${WB}.png` }
    }
    boardObj[line][column].piece = false

    gameRefrash()

    if (booleanCheck) checkSound.play()
    else if (captured) captureSound.play()
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

function gameRefrash() {
    refrash()
    resetLimits()
    resetCheck()
    resetBlockedCells()

    validateCheck()
    verificCheck()
}