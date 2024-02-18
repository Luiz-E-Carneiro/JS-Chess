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
    document.documentElement.style.setProperty('--black_cell', '#885e3f')
    document.documentElement.style.setProperty('--white_cell', '#c8ac74')
})

blueColor.addEventListener('click', function () {
    if (currentColor === 'blue') return
    currentColor = 'blue'
    document.documentElement.style.setProperty('--black_cell', '#0c193b')
    document.documentElement.style.setProperty('--white_cell', '#0e3dfb78')
})

// Reset Score
const resetScoreBtn = document.getElementById('resetBtn')
resetScoreBtn.addEventListener('click', function () {
    pointsP1.innerText = '0.0'
    pointsP2.innerText = '0.0'
})

// Timers
var timerWhite = document.getElementById('timerWhite')
var timerBlack = document.getElementById('timerBlack')

const timerShaking = () => {
    if (!gameEnded) {
        if (player === 'Player1') {
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

// Change Names
var nameWhite = 'Player 1'
var nameBlack = 'Player 2'

const editWhiteName = document.getElementById('editWhiteName')
const editBlackName = document.getElementById('editBlackName')

var changingName = false


editWhiteName.addEventListener('click', ()=> changeName(editWhiteName, 'white'))
editBlackName.addEventListener('click', ()=> changeName(editBlackName, 'black'))

function changeName(btn, color) {
    if(!changingName){

        btn.innerHTML = `<span class="material-symbols-outlined">done_outline</span>`

        let inputName = document.createElement('input')
        inputName.maxLength = 10
        inputName.classList.add('inputName')
        var name

        if(color === 'white'){
            editBlackName.disabled = true
            name = document.getElementById('nameWhite')
            
        }else {
            editWhiteName.disabled = true
            name = document.getElementById('nameBlack')
        }
        name.innerHTML = ''
        name.appendChild(inputName)
        inputName.focus()


    } else {
        let getInput = document.getElementsByClassName('inputName')[0]
        console.log(getInput.value);
        console.log(nameBlack);
        console.log(nameWhite);
        if(getInput.value.length === 0 || getInput.value === nameWhite || getInput.value === nameBlack) return
        
        editBlackName.disabled = false
        editWhiteName.disabled = false

        let newName = getInput.value
        let name 

        if(color ===  'white'){
            btn.innerHTML = `<span class="material-symbols-outlined" id="editWhiteName">edit</span>` 
            name = document.getElementById('nameWhite')    
            nameWhite = newName
        }else {
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
    if(defaultSides){
        if(nameP1.innerText !== nameWhite) nameP1.innerText = nameWhite 
        if(nameP2.innerText !== nameBlack) nameP2.innerText = nameBlack 
    } else {
        if(nameP1.innerText !== nameBlack) nameP1.innerText = nameBlack 
        if(nameP2.innerText !== nameWhite) nameP2.innerText = nameWhite 
    }
}

// Give Up Fuction

const whiteGiveUp = document.getElementById('whiteGiveUp')
const blackGiveUp = document.getElementById('blackGiveUp')

whiteGiveUp.addEventListener('click', ()=> giveUp('White'))
blackGiveUp.addEventListener('click', ()=> giveUp('Black'))
let declineSound = new Audio('./../assets/sounds/decline.mp3')

function giveUp(color) {
    declineSound.play()
    gameEnded = true
    color === 'White' ? result.innerText = 'Black Won' : result.innerText = 'White won'
    whiteGiveUp.disabled = true
    blackGiveUp.disabled = true
    givePoint()
}

// Offer Draw

const whiteDraw = document.getElementById('whiteDraw')
const blackDraw = document.getElementById('blackDraw')

function offerDraw(color) {
    
    if(color === 'white'){
        blackDraw
    }

    function allow(params) {
        
    }

    function allowAcceptDraw(btn) {
        btn.innerHTML =  `<span class="material-symbols-outlined">done_outline</span>
                          <span class="text">Accept Draw</span>`
    }

}

/**
 * <span class="material-symbols-outlined">handshake</span>
                        <span class="text">Offer Draw</span>
 */