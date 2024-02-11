const playAgainBtn = document.getElementById('playAgainBtn')
const pointsP1 = document.getElementById('pointsP1')
const pointsP2 = document.getElementById('pointsP2')
const result = document.getElementById('result')

const checkMate = (objKing) => {
    gameEnded = true
    let endGame = new Audio('./../../../../assets/sounds/game-end.mp3')
    endGame.play()
    objKing.cell.classList.add('checkMate')

    objKing.piece.color === 'white' ? result.innerText = 'Black Won' : result.innerText =  'White won'

    if (player === 'Player1' && defaultSides) {
        let score = Number(pointsP1.innerText)
        score++
        score < 9 ? pointsP1.innerText = '0' + score : pointsP1.innerText = score
    } else if (player === 'Player2' && defaultSides) {
        let score = Number(pointsP2.innerText)
        score++
        score < 9 ? pointsP2.innerText = '0' + score : pointsP2.innerText = score
    } else if (player === 'Player1' && !defaultSides) {
        let score = Number(pointsP2.innerText)
        score++
        score < 9 ? pointsP2.innerText = '0' + score : pointsP2.innerText = score
    } else if (player === 'Player2' && !defaultSides) {
        let score = Number(pointsP1.innerText)
        score++
        score < 9 ? pointsP1.innerText = '0' + score : pointsP1.innerText = score
    }
}

playAgainBtn.addEventListener('click', () => resetGame())

const resetGame = () => {
    boardArea.innerHTML = ''
    boardObj = JSON.parse(JSON.stringify(patternBoard))
    defaultSides ? defaultSides = false : defaultSides
    player = 'Player1'
    gameEnded = false
    helpersDots = []
    possibleCastle = { left: null, right: null }
    possiblePlays = []
    currentObj = ''

    let whiteName = document.getElementById('nameWhite')
    let blackName = document.getElementById('nameBlack')
    let saveName = whiteName.innerText
    whiteName.innerText = blackName.innerText
    blackName.innerText = saveName

    let caps = document.getElementsByClassName('capture-area')
    for (const cap of caps) {
        cap.innerHTML = ''
    }

    realoadBoard()
    gameRefrash()
    refrash()
}