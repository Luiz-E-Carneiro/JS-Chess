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
    stopTimerShaking()
    givePoint()
}

playAgainBtn.addEventListener('click', () => resetGame())