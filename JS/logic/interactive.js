const verifiPlayerTime = (color) => {
    return color === 'white' && player === 'white' || color === 'black' && player === 'black'
}

const refresh = () => {
    cleanHelpers()
    letPlayable(true)
    cancelCastle()
}

const cleanHelpers = () => {
    helpersDots.forEach(div => {
        div.parentNode.removeChild(div)
    });
    helpersDots = []
}

//Show Path
const paintPath = (moves, captures) => {
    moves.forEach(c => {
        var help = document.createElement('div')
        helpersDots.push(help)
        c.cell.appendChild(help)
        help.classList.add('ball')
        c.cell.classList.add('path')
    })
    if (captures.length > 0) {
        captures.forEach(c => {
            var help = document.createElement('div')
            helpersDots.push(help)
            help.classList.add('ring')
            c.cell.appendChild(help)
            c.cell.classList.add('path')
        });
    }
    possiblePlays.push(moves, captures)
    letPlayable()
}

const letPlayable = (exclue = false) => {
    possiblePlays.forEach(arrayDivs => {
        arrayDivs.forEach(c => {
            let { column, line } = c
            if (exclue) {
                delete boardObj[line][column].possibleMove
                possiblePlays = []
            } else {
                boardObj[line][column].possibleMove = true
            }
        });
    });
}


const verificCastle = (divObj) => {
    const { line, column, piece } = divObj
    const color = piece.color

    const allPieces = boardObj.map(line =>
        line.map(cell => cell.piece && cell.piece.name === 'rook' && !cell.piece.firstPlay && cell.piece.color === color ? cell : null)
    );
    const filteredRooks = allPieces.flat().filter(cell => cell !== null);
    if (filteredRooks.length == 0) return
    filteredRooks.forEach(rookCell => {
        if (rookCell.column === 0) verificPossibleCastle('left', rookCell.column)
        if (rookCell.column === 7) verificPossibleCastle('right', rookCell.column)
    });

    function verificPossibleCastle(side, rookColumn) {
        var emptySpaces = true
        if(objCheck.length != 0) emptySpaces = false
        if (side === 'left') {
            for (let i = rookColumn + 1; i < column; i++) {
                if (boardObj[line][i].piece) emptySpaces = false
                if( color === 'white' &&  boardObj[line][i].whiteKingCannotStay) emptySpaces = false
                if( color === 'black' &&  boardObj[line][i].blackKingCannotStay) emptySpaces = false
            }
        } else {
            for (let i = rookColumn - 1; i > column; i--) {
                if (boardObj[line][i].piece) emptySpaces = false
                if( color === 'white' &&  boardObj[line][i].whiteKingCannotStay) emptySpaces = false
                if( color === 'black' &&  boardObj[line][i].blackKingCannotStay) emptySpaces = false
            }
        }

        if (emptySpaces) {
            var help = document.createElement('div')
            helpersDots.push(help)
            help.classList.add('square')
            if (side === 'left') {
                boardObj[line][column - 2].cell.appendChild(help)
                boardObj[line][column - 2].cell.classList.add('path')
                boardObj[line][column - 2].castle = true
                possibleCastle.left = boardObj[line][column - 2].cell
            } else {
                boardObj[line][column + 2].cell.appendChild(help)
                boardObj[line][column + 2].cell.classList.add('path')
                boardObj[line][column + 2].castle = true
                possibleCastle.right = boardObj[line][column + 2].cell
            }
        }
    }
}

const cancelCastle = () => {
    boardObj.forEach(line => {
        line.forEach(obj => {
            if (obj.castle) delete obj.castle
        });
    });
    possibleCastle = { left: null, right: null }
}

const getPieces = (color) => {
    const coloredPieces = boardObj.map(line =>
        line.map(cell => cell.piece && cell.piece.color === color ? cell : null)
    )
    var filteredPieces = coloredPieces.flat().filter(cell => cell !== null)
    return filteredPieces
}

// Promotion
var blackChoose = document.getElementById('promoteBlackArea')
var whiteChoose = document.getElementById('promoteWhiteArea')

const promotePawn = (cellObj) => {
    var color = cellObj.piece.color
    blackChoose.innerHTML = ''
    whiteChoose.innerHTML = ''
    var letter = color === 'white' ? 'W' : 'B'
    var pieces = [
        `assets/pieces/knight${letter}.png`,
        `assets/pieces/bishop${letter}.png`,
        `assets/pieces/rook${letter}.png`,
        `assets/pieces/queen${letter}.png`,
    ]
    var names = ['knight', 'bishop', 'rook', 'queen']
    for (let i = 0; i < 4; i++) {
        let backImg = document.createElement('div')
        backImg.classList.add('backImg')
        let img = document.createElement('img')
        img.src = pieces[i]
        backImg.appendChild(img)
        if (color === 'white') {
            whiteChoose.style.visibility = 'visible'
            whiteChoose.appendChild(backImg)
        } else {
            blackChoose.style.visibility = 'visible'
            blackChoose.appendChild(backImg)
        }
        backImg.addEventListener('click', function () {
            let childrens = cellObj.cell.children
            for (let j = 0; j < childrens.length; j++) {
                if (childrens[j].tagName.toLowerCase() === 'img') {
                    childrens[j].src = pieces[i]
                    cellObj.piece.name = names[i]
                    cellObj.piece.src = pieces[i]
                }
            }
            setTimeout(() => {
                this.parentNode.style.visibility = 'hidden'
            }, 150);

            gameRefresh()
        })
    }
}

// Point
const givePoint = () => {
    if (player === 'white' && defaultSides) {
        let score = Number(pointsP1.innerText) + 1
        pointsP1.innerText = score.toFixed(1)
    } else if (player === 'black' && defaultSides) {
        let score = Number(pointsP2.innerText) + 1
        pointsP2.innerText = score.toFixed(1)
    } else if (player === 'white' && !defaultSides) {
        let score = Number(pointsP2.innerText) + 1
        pointsP2.innerText = score.toFixed(1)
    } else if (player === 'black' && !defaultSides) {
        let score = Number(pointsP1.innerText) + 1
        pointsP1.innerText = score.toFixed(1)
    }
}

// Finish Game
const finishGame = (drownedKing = false, draw = false) => {
    if(drownedKing){
        result.innerText = 'King Drowned'
        addHalfPoints()
    } else if(draw){
        result.innerText = `${draw}`
        addHalfPoints()
    } else {
        declineSound.play()
        player === 'white' ? result.innerText = 'Black Won' : result.innerText = 'White won'
        player === 'white' ? player = 'black' : player = 'white'
        givePoint()
    }
    gameEnded = true
    whiteGiveUp.disabled = true
    blackGiveUp.disabled = true
    whiteDraw.disabled = true
    blackDraw.disabled = true
    stopTimerShaking()
}

// Reset Score
const resetScoreBtn = document.getElementById('resetBtn')
resetScoreBtn.addEventListener('click', function () {
    pointsP1.innerText = '0.0'
    pointsP2.innerText = '0.0'
})

// Change Names
var nameWhite = 'Player 1'
var nameBlack = 'Player 2'

const editWhiteName = document.getElementById('editWhiteName')
const editBlackName = document.getElementById('editBlackName')

var changingName = false

editWhiteName.addEventListener('click', () => changeName(editWhiteName, 'white'))
editBlackName.addEventListener('click', () => changeName(editBlackName, 'black'))

function changeName(btn, color) {
    if (!changingName) {

        btn.innerHTML = `<span class="material-symbols-outlined">done_outline</span>`

        let inputName = document.createElement('input')
        inputName.maxLength = 10
        inputName.classList.add('inputName')
        var name

        if (color === 'white') {
            editBlackName.disabled = true
            name = document.getElementById('nameWhite')

        } else {
            editWhiteName.disabled = true
            name = document.getElementById('nameBlack')
        }
        name.innerHTML = ''
        name.appendChild(inputName)
        inputName.focus()


    } else {
        let getInput = document.getElementsByClassName('inputName')[0]
        if (getInput.value.length === 0 || getInput.value === nameWhite || getInput.value === nameBlack) return

        editBlackName.disabled = false
        editWhiteName.disabled = false

        let newName = getInput.value
        let name

        if (color === 'white') {
            btn.innerHTML = `<span class="material-symbols-outlined" id="editWhiteName">edit</span>`
            name = document.getElementById('nameWhite')
            nameWhite = newName
        } else {
            btn.innerHTML = `<span class="material-symbols-outlined" id="editBlackName">edit</span>`
            name = document.getElementById('nameBlack')
            nameBlack = newName
        }
        name.innerText = newName
        changeNameBoard()
    }
    changingName ? changingName = false : changingName = true
}

var nameP1 = document.getElementById('nameP1')
var nameP2 = document.getElementById('nameP2')

const changeNameBoard = () => {
    if (defaultSides) {
        if (nameP1.innerText !== nameWhite) nameP1.innerText = nameWhite
        if (nameP2.innerText !== nameBlack) nameP2.innerText = nameBlack
    } else {
        if (nameP1.innerText !== nameBlack) nameP1.innerText = nameBlack
        if (nameP2.innerText !== nameWhite) nameP2.innerText = nameWhite
    }
}

// Give Up

const whiteGiveUp = document.getElementById('whiteGiveUp')
const blackGiveUp = document.getElementById('blackGiveUp')

whiteGiveUp.addEventListener('click', () => finishGame())
blackGiveUp.addEventListener('click', () => finishGame())
let declineSound = new Audio('./../assets/sounds/decline.mp3')

// Offer Draw
const whiteDraw = document.getElementById('whiteDraw')
const blackDraw = document.getElementById('blackDraw')

const whiteDrawArea = document.getElementById('whiteDrawArea')
const blackDrawArea = document.getElementById('blackDrawArea')

whiteDraw.addEventListener('click', () => offerDraw('white'))
blackDraw.addEventListener('click', () => offerDraw('black'))

function offerDraw(color) {
    let acceptDraw = document.createElement('button')
    acceptDraw.innerHTML = `<span class="material-symbols-outlined">done_outline</span>`
    acceptDraw.classList.add('act-draw')
    let denyDraw = document.createElement('button')
    denyDraw.innerHTML = `<span class="material-symbols-outlined">close</span>`
    denyDraw.classList.add('act-draw')

    acceptDraw.addEventListener('click', () => draw(acceptDraw, denyDraw))
    denyDraw.addEventListener('click', () => resetDraw(acceptDraw, denyDraw))

    if (color === 'white') {
        blackDraw.style.display = 'none'
        blackDrawArea.appendChild(acceptDraw)
        blackDrawArea.appendChild(denyDraw)
    } else {
        whiteDraw.style.display = 'none'
        whiteDrawArea.appendChild(acceptDraw)
        whiteDrawArea.appendChild(denyDraw)
    }
}

const resetDraw = (btn1, btn2) => {
    blackDraw.style.display = 'flex'
    whiteDraw.style.display = 'flex'
    btn1.parentNode.removeChild(btn1)
    btn2.parentNode.removeChild(btn2)
}

// SET TIMER
var whiteMinutes = document.getElementById('whiteMinutes')
var whiteSeconds = document.getElementById('whiteSeconds')
var blackMinutes = document.getElementById('blackMinutes')
var blackSeconds = document.getElementById('blackSeconds')

var whiteLine = document.getElementById('whiteLine')
var blackLine = document.getElementById('blackLine')

var mins = document.getElementsByClassName('min')
var increments = document.getElementsByClassName('increments')

var whiteWidthLine
var blackWidthLine

var timing
var decreasingLine

for (let min of mins) {
    min.addEventListener('click', function () {
        if (min.value != 0) {
            for (let btn of increments) {
                if (btn.value == increment) continue
                btn.disabled = false
                time = min.value
            }
        } else {
            for (let btn of increments) {
                btn.disabled = true
            }
        }
        setTimers(min.value)
        selectBtn(mins, this)
    })
}

for (let incr of increments) {
    incr.addEventListener('click', function () {
        increment = Number(incr.value)
        selectBtn(increments, this)
    })
}

function selectBtn(buttons, selected) {
    for (let btn of buttons) {
        btn.disabled = false
    }
    selected.disabled = true
}

const setTimers = (minutes) => {
    minutes < 10 ? whiteMinutes.innerText = "0" + minutes : whiteMinutes.innerText = minutes
    minutes < 10 ? blackMinutes.innerText = "0" + minutes : blackMinutes.innerText = minutes
}

// Timing Game
const timer = (start, stop = false) => {
    if (whiteMinutes.innerText === "00") return
    player === "white" ? decreaseTime(whiteMinutes, whiteSeconds) : decreaseTime(blackMinutes, blackSeconds)
    player === "white" ? decreaseLine(whiteMinutes, whiteSeconds, whiteLine, whiteWidthLine) : decreaseLine(blackMinutes, blackSeconds, blackLine, blackWidthLine)
    if (start) {
        timing = setInterval(() => {
            if (whiteMinutes.innerText === "00" && whiteSeconds.innerText === "00" || blackMinutes.innerText === "00" && blackSeconds.innerText === "00") {
                finishGame()
                clearInterval(timing)
            } else {
                player === 'white' ? decreaseTime(whiteMinutes, whiteSeconds) : decreaseTime(blackMinutes, blackSeconds)
                player === "white" ? decreaseLine(whiteMinutes, whiteSeconds, whiteLine, whiteWidthLine) : decreaseLine(blackMinutes, blackSeconds, blackLine, blackWidthLine)
            }
        }, 1000)
    } else if (stop) {
        clearInterval(timing)
    }
}

function decreaseTime(minutesElement, secondsElement) {
    let secs = parseInt(secondsElement.innerText)
    let mins = parseInt(minutesElement.innerText)

    secs--
    if (secs === -1) {
        secs = 59
        if (mins !== 0) mins--
    }
    minutesElement.innerText = (mins < 10 ? "0" + mins : mins)
    secondsElement.innerText = (secs < 10 ? "0" + secs : secs)
}

// Increment
const incrementation = () => {
    if (increment === 0) return
    player === 'white' ? addSeconds(whiteMinutes, whiteSeconds) : addSeconds(blackMinutes, blackSeconds)
}

function addSeconds(minutesElement, secondsElement) {
    let secs = parseInt(secondsElement.innerText)
    let mins = parseInt(minutesElement.innerText)
    let addition = secs + increment
    if (addition >= 60) {
        let rest = addition - 60
        mins++
        minutesElement.innerText = (mins < 10 ? "0" + mins : mins)
        secondsElement.innerText = (rest < 10 ? "0" + rest : rest)
    } else {
        secondsElement.innerText = (addition < 10 ? "0" + addition : addition)
    }
}

// Timer Icon

var timerWhite = document.getElementById('iconTimerWhite')
var timerBlack = document.getElementById('iconTimerBlack')

const timerShaking = () => {
    if (!gameEnded) {
        if (player === 'white') {
            timerWhite.style.animation = `shaking 1s linear infinite`
            timerBlack.style.animation = 'none'
        } else {
            timerBlack.style.animation = `shaking 1s linear infinite`
            timerWhite.style.animation = 'none'
        }
    }
    else {
        timerBlack.style.animation = 'none'
        timerWhite.style.animation = 'none'
    }
}

const stopTimerShaking = () => {
    timerBlack.style.animation = 'none'
    timerWhite.style.animation = 'none'
}

// Lines 

function decreaseTime(minutesElement, secondsElement) {
    let secs = parseInt(secondsElement.innerText)
    let mins = parseInt(minutesElement.innerText)

    secs--
    if (secs === -1) {
        secs = 59
        if (mins !== 0) mins--
    }
    minutesElement.innerText = (mins < 10 ? "0" + mins : mins)
    secondsElement.innerText = (secs < 10 ? "0" + secs : secs)
}

// Decrease Line
const decreaseLine = (minutesElement, secondsElement, lineElement, line) => {
    let secs = parseInt(secondsElement.innerText)
    let mins = parseInt(minutesElement.innerText)

    let currentWidth = mins * 60 + secs
    let newPercent = ruleOfThree(currentWidth, line)
    if (newPercent <= 35 && newPercent > 15) {
        lineElement.style.backgroundColor = "#f96209"
    } else if (newPercent <= 15) {
        lineElement.style.backgroundColor = "#d1120b"
    }
    lineElement.style.width = `${newPercent}%`
}

function ruleOfThree(width, line) {
    return (width * 100) / line
}