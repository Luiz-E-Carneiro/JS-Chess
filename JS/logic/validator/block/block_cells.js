var cellsBlocked = {
    black: [],
    white: []
}
const blockCellsToKing = (cellsArray, pieceObj) => {
    var color = pieceObj.piece.color
    var piece = pieceObj.piece

    if (piece.name === 'pawn' || piece.name === 'knight' || piece.name === 'king') {
        cellsArray.forEach(objSpot => {
            if (color === 'white') {
                objSpot.blackKingCannotStay = true
                cellsBlocked.white.push(objSpot)
            }
            else if (color === 'black') {
                objSpot.whiteKingCannotStay = true
                cellsBlocked.black.push(objSpot)
            }

            if (objSpot.piece.name === 'king' && objSpot.piece.color !== color) {
                objCheck.push({ attackPiece: pieceObj, cellsUntilKing: objSpot, objKing: objSpot })
                booleanCheck = true
            }
        });
    } else {
        if (cellsArray.length > 0) {
            cellsArray.forEach(direction => {
                direction.forEach(objSpot => {
                   
                    if (color === 'white') {
                        objSpot.blackKingCannotStay = true
                        cellsBlocked.white.push(objSpot)
                    }
                    else if (color === 'black') {
                        objSpot.whiteKingCannotStay = true
                        cellsBlocked.black.push(objSpot)
                    }

                    if (objSpot.piece.name === 'king' && objSpot.piece.color !== color) {
                        objCheck.push({ attackPiece: pieceObj, cellsUntilKing: direction, objKing: objSpot })
                        booleanCheck = true
                        let cellToBase = direction[direction.length-2]
                        if(direction.length === 1)blockOppositeCell(objSpot, pieceObj)
                        else blockOppositeCell(objSpot, cellToBase)
                    }
                });
            });
        }
    }
}

const blockOppositeCell = (kingObj, basedCell) => {
    let kingColor   = kingObj.piece.color
    let kingColumn  = kingObj.column
    let kingLine    = kingObj.line
    let basedColumn = basedCell.column
    let basedLine   = basedCell.line
    let newColumn
    let newLine

    if(kingColumn != 7 && kingColumn != 0) {
        if(basedColumn > kingColumn) {
            newColumn = kingColumn - 1
        } else if (basedColumn === kingColumn){
            newColumn = kingColumn
        } else {
            newColumn = kingColumn + 1
        }
    }
    if(kingLine != 7 && kingLine != 0) {
        if(basedLine > kingLine) {
            newLine = kingLine - 1
        } else if (basedLine === kingLine){
            newLine = kingLine
        } else {
            newLine = kingLine + 1
        }
    }

    if(kingColor === 'white'){
        boardObj[newLine][newColumn].whiteKingCannotStay = true
        cellsBlocked.white.push(boardObj[newLine][newColumn])
    }else {
        boardObj[newLine][newColumn].blackKingCannotStay = true
        cellsBlocked.black.push(boardObj[newLine][newColumn])
    }
}

const resetBlockedCells = () => {

    reset(cellsBlocked.black, 'black')
    reset(cellsBlocked.white, 'white')
   
        cellsBlocked = {
            black: [],
            white: []
        }

    function reset(arrayCellsObj, color) {
        arrayCellsObj.forEach(cellObj => {
            color === 'white' ? delete cellObj.whiteKingCannotStay : delete cellObj.blackKingCannotStay  
            delete cellObj.cannotMove
        })
    }
}

const blockVerticalHorizontal = (line, column, color, directions, piece) => {
    var pieceObj = boardObj[line][column]
    untilKing = {
        left: [],
        right: [],
        up: [],
        down: [],
    }
    let left = []
    let right = []
    let up = []
    let down = []

    for (let direc of directions) {
        let j = 1;
        let stopBoardCondition = false
        let stopConditionPiece = false
        while (!stopBoardCondition) {
            let cell = '';
            switch (direc) {
                case 'left':
                    if (column - j >= 0) {
                        cell = boardObj[line][column - j];
                        stopBoardCondition = column - j === 0;
                        untilKing.left.push(cell)
                        if (cell.piece.name === 'king' && cell.piece.color != color) {
                            verificDefendingPiece(untilKing.left, piece, direc)
                            stopBoardCondition = true
                        }
                    } else stopBoardCondition = true
                    break;

                case 'right':
                    if (column + j <= 7) {
                        cell = boardObj[line][column + j];
                        stopBoardCondition = column + j === 7;
                        untilKing.right.push(cell)
                        if (cell.piece.name === 'king' && cell.piece.color != color) {
                            verificDefendingPiece(untilKing.right, piece, direc)
                            stopBoardCondition = true
                        }
                    } else stopBoardCondition = true
                    break;

                case 'up':
                    if (line - j >= 0) {
                        cell = boardObj[line - j][column];
                        stopBoardCondition = line - j === 0;
                        untilKing.up.push(cell)
                        if (cell.piece.name === 'king' && cell.piece.color != color) {
                            verificDefendingPiece(untilKing.up, piece, direc)
                            stopBoardCondition = true
                        }
                    } else stopBoardCondition = true
                    break;

                case 'down':
                    if (line + j <= 7) {
                        cell = boardObj[line + j][column];
                        stopBoardCondition = line + j === 7;
                        untilKing.down.push(cell)
                        if (cell.piece.name === 'king' && cell.piece.color != color) {
                            verificDefendingPiece(untilKing.down, piece, direc)
                            stopBoardCondition = true
                        }
                    } else stopBoardCondition = true
                    break;

                default:
                    alert('Something went wrong, try agin please. . .')
                    return;
            }

            if (!stopConditionPiece && cell && !cell.piece) {
                if (direc === 'right') right.push(cell)
                if (direc === 'left') left.push(cell)
                if (direc === 'up') up.push(cell)
                if (direc === 'down') down.push(cell)
            }
            else if (!stopConditionPiece && cell && cell.piece) {
                if (direc === 'right') right.push(cell)
                if (direc === 'left') left.push(cell)
                if (direc === 'up') up.push(cell)
                if (direc === 'down') down.push(cell)
                stopConditionPiece = true
            }
            else stopConditionPiece = true
            j++;
        }
    }
    blockCellsToKing([right, left, up, down], pieceObj)
}
const blockDiagonals = (line, column, color, directions, piece) => {
    var pieceObj = boardObj[line][column]
    untilKing = {
        topLeft: [],
        topRight: [],
        bottomLeft: [],
        bottomRight: [],
    }
    let topLeft = []
    let topRight = []
    let bottomLeft = []
    let bottomRight = []

    for (let direc of directions) {
        let j = 1;
        let stopBoardCondition = false
        let stopConditionPiece = false
        while (!stopBoardCondition) {
            let cell = '';
            switch (direc) {
                case 'topLeft':
                    if (line - j >= 0 && column - j >= 0) {
                        cell = boardObj[line - j][column - j];
                        untilKing.topLeft.push(cell)
                        stopBoardCondition = column - j === 0 || line - j === 0;
                        if (cell.piece.name === 'king' && cell.piece.color != color) {
                            verificDefendingPiece(untilKing.topLeft, piece, direc)
                            stopBoardCondition = true
                        }
                    } else stopBoardCondition = true
                    break;

                case 'topRight':
                    if (line - j >= 0 && column + j <= 7) {
                        cell = boardObj[line - j][column + j];
                        untilKing.topRight.push(cell)
                        stopBoardCondition = column + j === 7 || line - j === 0;
                        if (cell.piece.name === 'king' && cell.piece.color != color) {
                            verificDefendingPiece(untilKing.topRight, piece, direc)
                            stopBoardCondition = true
                        }
                    } else stopBoardCondition = true
                    break;

                case 'bottomLeft':
                    if (line + j <= 7 && column - j >= 0) {
                        cell = boardObj[line + j][column - j];
                        untilKing.bottomLeft.push(cell)
                        stopBoardCondition = line + j === 7 || column - j === 0;
                        if (cell.piece.name === 'king' && cell.piece.color != color) {
                            verificDefendingPiece(untilKing.bottomLeft, piece, direc)
                            stopBoardCondition = true
                        }
                    } else stopBoardCondition = true
                    break;

                case 'bottomRight':
                    if (line + j <= 7 && column + j <= 7) {
                        cell = boardObj[line + j][column + j];
                        untilKing.bottomRight.push(cell)
                        stopBoardCondition = line + j === 7 || column + j === 7;
                        if (cell.piece.name === 'king' && cell.piece.color != color) {
                            verificDefendingPiece(untilKing.bottomRight, piece, direc)
                            stopBoardCondition = true
                        }
                    } else stopBoardCondition = true
                    break;

                default:
                    alert('something went wrong, try again please...');
                    return;
            }

            if (!stopConditionPiece && cell && !cell.piece) {
                if (direc === 'topRight') topRight.push(cell)
                if (direc === 'topLeft') topLeft.push(cell)
                if (direc === 'bottomLeft') bottomLeft.push(cell)
                if (direc === 'bottomRight') bottomRight.push(cell)
            }
            else if (!stopConditionPiece && cell && cell.piece) {
                if (direc === 'topRight') topRight.push(cell)
                if (direc === 'topLeft') topLeft.push(cell)
                if (direc === 'bottomLeft') bottomLeft.push(cell)
                if (direc === 'bottomRight') bottomRight.push(cell)
                stopConditionPiece = true
            }
            else stopConditionPiece = true
            j++;
        }
    }
    blockCellsToKing([topRight, topLeft, bottomLeft, bottomRight], pieceObj);
}