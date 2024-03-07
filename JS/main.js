var defaultSides = true // Plyer1 = white & Player2 = black
var player = 'white'
var gameEnded = false
var gameStarted = false
var helpersDots = []
var possibleCastle = { left: null, right: null }
var possiblePlays = []
var currentObj = ''
var time = 0
var increment = 0
var moves50 = 0

const allowPlay = () => {
    boardObj.forEach(line => {
        line.forEach(obj => {
            let cell = obj.cell
            cell.addEventListener('click', function () {
                if (gameEnded) return
                if (obj.castle) {
                    castle(obj)
                    player === 'white' ? player = 'black' : player = 'white'
                    timerShaking()
                } else if (obj.possibleMove) {
                    movePiece(obj)
                    refrash()
                    player === 'white' ? player = 'black' : player = 'white'
                    timerShaking()
                } else {
                    if (currentObj === obj) {
                        currentObj = ''
                        refrash()
                    } else {
                        currentObj = obj
                        if (verifiPlayerTime(obj.piece.color) && !obj.cannotMove) {
                            if (!needHelp(obj)) verificCell(currentObj)
                        } else {
                            refrash()
                        }
                    }
                }
            })
        });
    });
}

const verificCell = (divObj) => {
    refrash()
    let { cell, piece } = divObj
    var img = false

    let elementosFilhos = cell.children;
    for (let i = 0; i < elementosFilhos.length; i++) {
        if (elementosFilhos[i].tagName.toLowerCase() === 'img') {
            img = true
        }
    }
    if (img) verificPieceToPath(divObj, piece)

}

const verificPieceToPath = (divObj, piece) => {
    switch (piece.name) {
        case 'pawn':
            pawnPath(divObj)
            break;
        case 'rook':
            rookPath(divObj)
            break;
        case 'knight':
            knightPath(divObj)
            break;
        case 'bishop':
            bishopPath(divObj)
            break;
        case 'queen':
            queenPath(divObj)
            break;
        case 'king':
            kingPath(divObj)
            break;

        default:
            alert('Something went wrong, try again please!')
            break;
    }
}