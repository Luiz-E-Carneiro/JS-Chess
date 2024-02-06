const pawnBlock = (divObj) => {
    const { line, column, piece } = divObj;
    var color = piece.color
    var x
    color === 'white' ? x = 1 : x = -1
    var spots = []

    let getRight = true;
    let getLeft = true;

    if (column === 0 || column === 7) {
        getLeft = column === 0 ? false : getLeft;
        getRight = column === 7 ? false : getRight;
    }
    const checkAndPushCapture = (targetColumn) => {
        if(line === 0 || line === 7) return
        var diagonalCell = boardObj[line - (1 * x)][targetColumn];
        spots.push(diagonalCell)
    };
    if (!getLeft) {
        checkAndPushCapture(column + 1);
    } else if (!getRight) {
        checkAndPushCapture(column - 1);
    } else {
        checkAndPushCapture(column - 1);
        checkAndPushCapture(column + 1);
    }
    blockCellsToKing(spots, divObj)
}

const rookBlock = (divObj) => {
    const { line, column, piece } = divObj;
    var color = piece.color

    blockVerticalHorizontal(line, column, color, ['left', 'right', 'up', 'down'], piece)
}

const knightBlock = (divObj) => {
    const { line, column, piece } = divObj;
    var spots = []
    function addMove(row, col) {
        var cell = boardObj[row][col]
        if (cell) spots.push(cell)
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
    blockCellsToKing(spots, divObj)
}

const bishopBlock = (divObj) => {
    const { line, column, piece } = divObj;
    var color = piece.color

    blockDiagonals(line, column, color, ['topLeft', 'topRight', 'bottomLeft', 'bottomRight'], piece)
}

const kingBlock = (divObj) => {
    const { line, column, piece } = divObj;
    var spots = []
    let directions = [[0, 1], [1, 0], [1, 1]]

    for (let d of directions) {
        for (let i = 0; i < d.length; i++) {
            if (line + d[0] <= 7 && column + d[1] <= 7) addMove(line + d[0], column + d[1])
            if (line + d[0] <= 7 && column - d[1] >= 0) addMove(line + d[0], column - d[1])
            if (line - d[0] >= 0 && column + d[1] <= 7) addMove(line - d[0], column + d[1])
            if (line - d[0] >= 0 && column - d[1] >= 0) addMove(line - d[0], column - d[1])
        }
    }
    function addMove(row, col) {
        var cell = boardObj[row][col]
        if (cell) spots.push(cell)
    }
    blockCellsToKing(spots, divObj)
}

const queenBlock = (divObj) => {
    const { line, column, piece } = divObj
    var color = piece.color

    blockVerticalHorizontal(line, column, color, ['left', 'right', 'up', 'down'], piece)
    blockDiagonals(line, column, color, ['topLeft', 'topRight', 'bottomLeft', 'bottomRight'], piece)
}