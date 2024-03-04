const resetGame = () => {
    //Default
    timerBlack.style.animation = 'none'
    timerWhite.style.animation = 'none'
    boardArea.innerHTML = ''
    boardObj = JSON.parse(JSON.stringify(patternBoard))
    defaultSides ? defaultSides = false : defaultSides
    player = 'white'
    gameEnded = false
    gameStarted = false
    helpersDots = []
    possibleCastle = { left: null, right: null }
    possiblePlays = []
    currentObj = ''
    whiteGiveUp.disabled = false
    blackGiveUp.disabled = true
    result.innerText = ''

    blackGiveUp.disabled = true
    whiteGiveUp.disabled = true
    
    let caps = document.getElementsByClassName('capture-area')
    for (const cap of caps) {
        cap.innerHTML = ''
    }
    
    // Set Timers
    timer(false, true)

    whiteMinutes.innerText = (time < 10 ? "0" + time : time) 
    whiteSeconds.innerText = "00" 
    blackMinutes.innerText = (time < 10 ? "0" + time : time) 
    blackSeconds.innerText = "00" 
    
    // Change Names
    let whiteName = document.getElementById('nameWhite')
    let blackName = document.getElementById('nameBlack')
    let saveName = whiteName.innerText
    whiteName.innerText = blackName.innerText
    blackName.innerText = saveName
    
    
    for (let btn of mins) {
        if(btn.value != time) btn.disabled = false
    }
    for (let btn of increments) {
        if(btn.value != increment) btn.disabled = false

    }

    realoadBoard()
    gameRefrash()
    refrash()
}