const getVerticalHorizontal = (line, column, color, directions, moves, captures) => {
    for (let i = 0; i < directions.length; i++) {
        let j = 1;
        let stopCondition = false;

        while (!stopCondition) {
            let cell = '';
            switch (directions[i]) {
                case 'left':
                    if (column - j >= 0) {
                        cell = boardObj[line][column - j];
                        stopCondition = column - j === 0;
                    } else stopCondition = true
                    break;

                case 'right':
                    if (column + j <= 7) {
                        cell = boardObj[line][column + j];
                        stopCondition = column + j === 7;
                    } else stopCondition = true
                    break;

                case 'up':
                    if (line - j >= 0) {
                        cell = boardObj[line - j][column];
                        stopCondition = line - j === 0;
                    } else stopCondition = true
                    break;

                case 'down':
                    if (line + j <= 7) {
                        cell = boardObj[line + j][column];
                        stopCondition = line + j === 7;
                    } else stopCondition = true
                    break;

                default:
                    alert('Something went wrong, try agin please. . .')
                    return;
            }
            if (cell === '') continue
            if (!cell.piece) {
                moves.push(cell);
            } else {
                if (cell.piece.color !== color) {
                    captures.push(cell);
                }
                stopCondition = true;
            }
            j++;
        }
    }
    return [moves, captures]
}

const getDiagonals = (line, column, color, directions, moves, captures) => {
    var moves = moves
    var captures = captures
    for (let direc of directions) {
        let j = 1;
        let stopCondition = false;

        while (!stopCondition) {
            let cell = '';
            switch (direc) {
                case 'topLeft':
                    if (line - j >= 0 && column - j >= 0) {
                        cell = boardObj[line - j][column - j];
                        stopCondition = column + j === 0 || line + j === 0;
                    } else stopCondition = true
                    break;

                case 'bottomRight':
                    if (line + j <= 7 && column + j <= 7) {
                        cell = boardObj[line + j][column + j];
                        stopCondition = column + j === 7 || line + j === 7;
                    } else stopCondition = true
                    break;

                case 'topRight':
                    if (line - j >= 0 && column + j <= 7) {
                        cell = boardObj[line - j][column + j];
                        stopCondition = line - j === 0
                        stopCondition = column + j === 7;
                    } else stopCondition = true
                    break;

                case 'bottomLeft':
                    if (line + j <= 7 && column - j >= 0) {
                        cell = boardObj[line + j][column - j];
                        stopCondition = line + j === 7
                        stopCondition = column - j === 0;
                    } else stopCondition = true
                    break;

                default:
                    alert('something went wrong, try agin please. . .')
                    return;
            }
            if (cell === '') continue
            if (!cell.piece) {
                moves.push(cell);
            } else {
                if (cell.piece.color !== color) {
                    captures.push(cell);
                }
                stopCondition = true;
            }
            j++;
        }
    }
    return ([moves, captures])
}

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
    if (currentObj.piece.firstPlay === false && currentObj.piece.name === 'pawn' || currentObj.piece.name === 'rook' || currentObj.piece.name === 'king') {
        boardObj[newLine][newColumn].piece = { name: name, color: color, firstPlay: true, src: `./../assets/pieces/${name}${WB}.png` }
    } else if (currentObj.piece.name === 'pawn') {
        boardObj[newLine][newColumn].piece = { name: name, color: color, firstPlay: true, src: `./../assets/pieces/${name}${WB}.png` }
        if (newLine === 0 || newLine === 7) promotePawn(boardObj[newLine][newColumn])
    } else {
        boardObj[newLine][newColumn].piece = { name: name, color: color, firstPlay: true, src: `./../assets/pieces/${name}${WB}.png` }
    }
    boardObj[line][column].piece = false

    gameRefrash()

    //Sound
    let captureSound = new Audio('./../../assets/sounds/capture.mp3')
    captureSound.play
    let whiteMoveSound = new Audio('./../../assets/sounds/move-self.mp3')
    let blackMoveSound = new Audio('./../../assets/sounds/move-opponent.mp3')
    let checkSound = new Audio('./../../../assets/sounds/move-check.mp3')
    
    if (captured) captureSound.play()
    if(booleanCheck) checkSound.play()
    else player === 'Player1' ? whiteMoveSound.play() : blackMoveSound.play()
}

function gameRefrash() {
    refrash()
    resetCheck()
    resetBlockedCells()
    resetLimits()

    validateCheck()
    verificCheck()
}