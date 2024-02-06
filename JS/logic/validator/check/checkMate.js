const playAgainBtn = document.getElementById('playAgainBtn')
const pointsP1 = document.getElementById('pointsP1')
const pointsP2 = document.getElementById('pointsP2')
const result = document.getElementById('result')

const checkMate = (objKing) => {
    gameEnded = true
    let endGame = new Audio('./../../../../assets/sounds/game-end.mp3')
    endGame.play()
    objKing.cell.classList.add('checkMate')

    result.innerText = `Winner: ${player}`

    if (player === 'Player1') {
        let score = Number(pointsP1.innerText)
        score++
        score < 9 ? pointsP1.innerText = '0' + score : pointsP1.innerText = score
    } else {
        let score = Number(pointsP2.innerText)
        score++
        score < 9 ? pointsP2.innerText = '0' + score : pointsP2.innerText = score
    }
}

playAgainBtn.addEventListener('click', () => resetGame())

const resetGame = () => {
    boardArea.innerHTML = ''
    boardObj = JSON.parse(JSON.stringify(patternBoard))
    player = 'Player1'
    gameEnded = false
    helpersDots = []
    possibleCastle = { left: null, right: null }
    possiblePlays = []
    currentObj = ''

    let caps = document.getElementsByClassName('capture-area')
    for (const cap of caps) {
        cap.innerHTML = ''
    }

    realoadBoard()
    gameRefrash()
    refrash()
}