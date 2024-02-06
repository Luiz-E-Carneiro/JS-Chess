// Board Style
const defaultStyle = document.getElementById('defaultStyle')
const _3Dstyle = document.getElementById('_3Dstyle')
const board = document.getElementById('board')
const captureArea = document.getElementsByClassName('capture-area')

defaultStyle.addEventListener('click', function () {
    console.log(board.className);
    if (board.className === 'board') return
    board.classList.add('board')
    board.classList.remove('board3D')
    for (const div of captureArea) {
        div.classList.remove('hidden')
    }

})

_3Dstyle.addEventListener('click', function () {
    if (board.className === 'board3D') return
    board.classList.remove('board')
    board.classList.add('board3D')
    for (const div of captureArea) {
        div.classList.add('hidden')
    }
})

// Color Board
const defaultColor = document.getElementById('defaultColor')
const blueColor = document.getElementById('blueColor')
var currentColor = 'default'

defaultColor.addEventListener('click', function () {
    if (currentColor === 'default') return
    currentColor = 'default'
    document.documentElement.style.setProperty('--black_cell', '#885e3f');
    document.documentElement.style.setProperty('--white_cell', '#c8ac74');
})

blueColor.addEventListener('click', function() {
    if(currentColor === 'blue') return
    currentColor = 'blue'
    document.documentElement.style.setProperty('--black_cell', '#0c193b');
    document.documentElement.style.setProperty('--white_cell', '#0e3dfb78');
})

// Reset Score
const resetScoreBtn = document.getElementById('resetBtn')
resetScoreBtn.addEventListener('click', function(){
    pointsP1.innerText = '00'
    pointsP2.innerText = '00'
})