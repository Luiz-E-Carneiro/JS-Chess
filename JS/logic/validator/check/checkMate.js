const poitsP1 = document.getElementById('poitsP1')
const poitsP2 = document.getElementById('poitsP2')

const checkMate = (objKing) => {
    gameEnded = true
    let endGame = new Audio('./../../../../assets/sounds/game-end.mp3')
    endGame.play()
    objKing.cell.classList.add('checkMate')
    if(player === 'Player1'){
        poitsP1.innerText < 9 ? poitsP1.innerText = '0'+ poitsP1.innerText++ : poitsP1.innerText++  
    }else {

    }

}