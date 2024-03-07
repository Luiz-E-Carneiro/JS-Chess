const pawnPath = (divObj, helpKing = false) => {
    const { line, column, piece } = divObj;
    var color = piece.color
    var x
    color === 'white' ? x = 1 : x = -1

    var moves = []
    var captures = []

    if (!piece.firstPlay) {
        let inFront = boardObj[line - (1 * x)][column]
        let nextFront = boardObj[line - (2 * x)][column]
        if (!inFront.piece && nextFront.piece) moves.push(inFront)
        else if (!inFront.piece && !nextFront.piece) moves.push(inFront, nextFront)
    } else {
        let inFront = boardObj[line - (1 * x)][column]
        if (!inFront.piece) moves.push(inFront)
    }

    let getRight = true;
    let getLeft = true;

    if (column === 0 || column === 7) {
        getLeft = column === 0 ? false : getLeft;
        getRight = column === 7 ? false : getRight;
    }
    const checkAndPushCapture = (targetColumn) => {
        var diagonalCell = boardObj[line - (1 * x)][targetColumn]

        if (divObj.onlyCapture) {
            attackingPieces.forEach(piece => {
                if (diagonalCell.piece && diagonalCell.piece.color != color & diagonalCell.piece.name === piece.name) {
                    captures.push(diagonalCell);
                }
            });
        } else {
            if (diagonalCell.piece && diagonalCell.piece.color != color) {
                captures.push(diagonalCell);
            }
        }
    }
    if (!getLeft) {
        checkAndPushCapture(column + 1)
    } else if (!getRight) {
        checkAndPushCapture(column - 1)
    } else {
        checkAndPushCapture(column - 1)
        checkAndPushCapture(column + 1)
    }

    if (!helpKing) {
        if (divObj.onlyCapture) {
            paintPath([], captures)
        } else {
            paintPath(moves, captures)
        }
    }
    else {
        verificHelp(moves, captures, divObj)
    }
}

const rookPath = (divObj, helpKing = false) => {
    const { line, column, piece } = divObj;
    var color = piece.color
    var moves = []
    var captures = []
    //    onlyLR  ;   onlyUD  
    var cellsToPaint
    if (divObj.onlyUD) cellsToPaint = getVerticalHorizontal(line, column, color, ['up', 'down'], moves, captures)
    else if (divObj.onlyLR) cellsToPaint = getVerticalHorizontal(line, column, color, ['left', 'right'], moves, captures)
    else cellsToPaint = getVerticalHorizontal(line, column, color, ['left', 'right', 'up', 'down'], moves, captures)

    if (!helpKing) paintPath(cellsToPaint[0], cellsToPaint[1])
    else {
        verificHelp(cellsToPaint[0], cellsToPaint[1], divObj)
    }

}

const knightPath = (divObj, helpKing = false) => {
    const { line, column, piece } = divObj;
    var color = piece.color
    var moves = []
    var captures = []

    function addMove(row, col) {
        var cell = boardObj[row][col]
        if (cell && !cell.piece) moves.push(cell)
        else if (cell && cell.piece.color != color) captures.push(cell)
    }

    if (line + 2 <= 7) {
        if (column + 1 <= 7) addMove(line + 2, column + 1)
        if (column - 1 >= 0) addMove(line + 2, column - 1)
    }
    if (line - 2 >= 0) {
        if (column + 1 <= 7) addMove(line - 2, column + 1)
        if (column - 1 >= 0) addMove(line - 2, column - 1)
    }
    if (line + 1 <= 7) {
        if (column + 1 <= 7) addMove(line + 1, column + 2)
        if (column - 1 >= 0) addMove(line + 1, column - 2)
    }
    if (line - 1 >= 0) {
        if (column + 1 <= 7) addMove(line - 1, column + 2)
        if (column - 1 >= 0) addMove(line - 1, column - 2)
    }

    if (!helpKing) paintPath(moves, captures)
    else {
        verificHelp(moves, captures, divObj)
    }

}

const bishopPath = (divObj, helpKing = false) => {
    const { line, column, piece } = divObj;
    var color = piece.color
    var moves = []
    var captures = []
    //      onlyTLBR    ;   onlyTRBL
    var cellsToPaint
    if (divObj.onlyTLBR || divObj.onlyTRBL) {
        if (divObj.onlyTLBR) {
            cellsToPaint = getDiagonals(line, column, color, ['topLeft', 'bottomRight'], moves, captures)
        }
        else if (divObj.onlyTRBL) {
            cellsToPaint = getDiagonals(line, column, color, ['topRight', 'bottomLeft'], moves, captures)
        }
    } else {
        cellsToPaint = getDiagonals(line, column, color, ['topLeft', 'topRight', 'bottomLeft', 'bottomRight'], moves, captures)
    }

    if (!helpKing) paintPath(cellsToPaint[0], cellsToPaint[1])
    else {
        verificHelp(cellsToPaint[0], cellsToPaint[1], divObj)
    }

}

const kingPath = (divObj, emptySpaces = false, scape = false) => {
    const { line, column, piece } = divObj;
    var color = piece.color
    var moves = []
    var captures = []
    let directions = [[0, 1], [1, 0], [1, 1]]

    for (let d of directions) {
        for (let i = 0; i < d.length; i++) {
            if (line + d[0] <= 7 && column + d[1] <= 7) addMove(line + d[0], column + d[1])
            if (line + d[0] <= 7 && column - d[1] >= 0) addMove(line + d[0], column - d[1])
            if (line - d[0] >= 0 && column + d[1] <= 7) addMove(line - d[0], column + d[1])
            if (line - d[0] >= 0 && column - d[1] >= 0) addMove(line - d[0], column - d[1])
        }
    }
    if (!piece.firstPlay) verificCastle(divObj)

    function addMove(row, col) {
        var cell = boardObj[row][col]
        if (cell && !cell.piece) {
            if (color === 'white' && !cell.whiteKingCannotStay) moves.push(cell)
            if (color === 'black' && !cell.blackKingCannotStay) moves.push(cell)
        }
        else if (cell && cell.piece.color != color) {
            if (color === 'white' && !cell.whiteKingCannotStay) captures.push(cell)
            if (color === 'black' && !cell.blackKingCannotStay) captures.push(cell)
        }
    }
    if (scape) {
        return moves.length > 0 || captures.length > 0
    }
    if (emptySpaces) {
        return moves.length === 0 && captures.length === 0
    } else {
        paintPath(moves, captures)
    }
}

const queenPath = (divObj, helpKing = false) => {
    const { line, column, piece } = divObj
    var color = piece.color
    var moves = []
    var captures = []

    var verticalHorizontal = [[], []]
    var diagonals = [[], []]

    if (divObj.onlyUD == true || divObj.onlyLR == true || divObj.onlyTLBR == true || divObj.onlyTRBL == true) {
        //    onlyLR  ;   onlyUD  
        if (divObj.onlyUD) {
            verticalHorizontal = getVerticalHorizontal(line, column, color, ['up', 'down'], moves, captures)
        } else if (divObj.onlyLR) {
            verticalHorizontal = getVerticalHorizontal(line, column, color, ['left', 'right'], moves, captures)
        }

        //      onlyTLBR    ;   onlyTRBL
        if (divObj.onlyTLBR) {
            diagonals = getDiagonals(line, column, color, ['topLeft', 'bottomRight'], moves, captures)
        } else if (divObj.onlyTRBL) {
            diagonals = getDiagonals(line, column, color, ['topRight', 'bottomLeft'], moves, captures)
        }
    } else {
        verticalHorizontal = getVerticalHorizontal(line, column, color, ['left', 'right', 'up', 'down'], moves, captures)
        diagonals = getDiagonals(line, column, color, ['topLeft', 'topRight', 'bottomLeft', 'bottomRight'], moves, captures)
    }
    var allMoves = verticalHorizontal[0].concat(diagonals[0])
    var allCaptures = verticalHorizontal[1].concat(diagonals[1])

    if (!helpKing) paintPath(allMoves, allCaptures)
    else {
        verificHelp(allMoves, allCaptures, divObj)
    }
}

const castle = (cellObj) => {
    var { line, column } = cellObj
    var color = cellObj.line === 0 ? 'black' : 'white'
    if (cellObj.cell === possibleCastle.left) changePieces('left', color)
    if (cellObj.cell === possibleCastle.right) changePieces('right', color)

    function changePieces(side, color) {
        var numberSide = side === 'left' ? 0 : 7
        var abbrevColor = color === 'white' ? 'W' : 'B'
        var objKing
        var objRook

        boardObj.forEach(line => {
            line.forEach(obj => {
                if (obj.piece.name === 'rook' && obj.column === numberSide && obj.piece.color === color) {
                    objRook = obj
                    boardObj[obj.line][obj.column].piece = false
                } else if (obj.piece.name === 'king' && obj.piece.color === color) {
                    objKing = obj
                    boardObj[obj.line][obj.column].piece = false
                }
            })
        });
        var imgKing = deletePiece(objKing.cell.children)
        var imgRook = deletePiece(objRook.cell.children)

        if (numberSide === 0) {
            boardObj[line][column].cell.appendChild(imgKing)
            boardObj[line][column].piece = { name: 'king', color: color, firstPlay: true, src: `./../assets/pieces/king${abbrevColor}.png` }

            boardObj[line][column + 1].cell.appendChild(imgRook)
            boardObj[line][column + 1].piece = { name: 'rook', color: color, firstPlay: true, src: `./../assets/pieces/rook${abbrevColor}.png` }

        }
        else if (numberSide === 7) {
            boardObj[line][column].cell.appendChild(imgKing)
            boardObj[line][column].piece = { name: 'king', color: color, firstPlay: true, src: `./../assets/pieces/king${abbrevColor}.png` }

            boardObj[line][column - 1].cell.appendChild(imgRook)
            boardObj[line][column - 1].piece = { name: 'rook', color: color, firstPlay: true, src: `./../assets/pieces/rook${abbrevColor}.png` }

        }

        function deletePiece(childrens) {
            for (let i = 0; i < childrens.length; i++) {
                if (childrens[i].tagName.toLowerCase() === 'img') {
                    let img = childrens[i]
                    childrens[i].parentNode.removeChild(childrens[i])
                    return img
                }
            }
        }

        //Sound
        let castleSound = new Audio('./../../assets/sounds/castle.mp3')
        castleSound.play()

        refrash()
    }
}


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
