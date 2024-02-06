var helpKingObjs = []

const helpKing = (color) => {
    var piecesToVerify = getPieces(color)
    for (let obj of piecesToVerify) {
        switch (obj.piece.name) {
            case 'pawn':
                pawnPath(obj, true)
                break;
            case 'rook':
                rookPath(obj, true)
                break;
            case 'knight':
                knightPath(obj, true)
                break;
            case 'bishop':
                bishopPath(obj, true)
                break;
            case 'queen':
                queenPath(obj, true)
                break;
            case 'king':
                kingPath(obj, true)
                break;

            default:
                alert('Something went wrong, try again please!')
                break;
        }
    }
}

const verificHelp = (moves, captures, pieceObj) => {
    let { cellsUntilKing, attackPiece } = objCheck[0]

    captures.forEach(cap => {
        if (cap === attackPiece) helpKingObjs.push({ helpPiece: pieceObj, helpCell: cap })
    })
    if (cellsUntilKing.length != undefined) {
        moves.forEach(move => {
            cellsUntilKing.forEach(cell => {
                if (cell === move) helpKingObjs.push({ helpPiece: pieceObj, helpCell: move })
            });
        });
    }
}