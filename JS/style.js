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