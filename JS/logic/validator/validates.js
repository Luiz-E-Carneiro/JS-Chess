

const validateCheck = () => {
    var whitePieces = getPieces('white')
    var blackPieces = getPieces('black')

    blockCells(whitePieces)
    blockCells(blackPieces)

    function blockCells(objs) {
        for (let obj of objs) {
            switch (obj.piece.name) {
                case 'pawn':
                    pawnBlock(obj)
                    break;
                case 'rook':
                    rookBlock(obj)
                    break;
                case 'knight':
                    knightBlock(obj)
                    break;
                case 'bishop':
                    bishopBlock(obj)
                    break;
                case 'queen':
                    queenBlock(obj)
                    break;
                case 'king':
                    kingBlock(obj)
                    break;

                default:
                    alert('Something went wrong, try again please!')
                    break;
            }
        }
    }
}