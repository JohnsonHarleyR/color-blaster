class GameData {
    constructor(levelNumber, totalSeconds, 
        score, livesLeft, clearedBlocks, helpedBlobs) {
            this.levelNumber = levelNumber;
            this.totalSeconds = totalSeconds;
            this.score = score;
            this.livesLeft = livesLeft;
            this.clearedBlocks = clearedBlocks;
            this.helpedBlobs = helpedBlobs;
    }
}

function showGameTypeModal(game) {
    gameTypeModal = document.getElementById('gameTypeModal');
    gameTypeModal.style.display = "block";

    game.levelStarted = false;

    arcadeBtn = document.getElementById('arcadeBtn');
    adventureBtn = document.getElementById('adventureBtn');

    arcadeBtn.addEventListener('click', function() { game.setGameType('arcade'); });
    adventureBtn.addEventListener('click', function() { game.setGameType('adventure'); });
}

// when the page loads, open the model
function showNewOrSaveModal(game) {
    newOrLoadModal = document.getElementById('newOrLoadModal');
    newOrLoadModal.style.display = "block";
    console.log('store retrieve loaded');

    game.levelStarted = false;
    game.allowDialogue = false;

    newGameBtn = document.getElementById('newGameBtn');
    loadGameBtn = document.getElementById('loadGameBtn');
    saveGameBtn = document.getElementById('saveGameBtn');

    newGameBtn.addEventListener('click', function() { newGame(game); });
    loadGameBtn.addEventListener('click', function() { loadGame(game); });
    saveGameBtn.addEventListener('click', function() { saveGame(game); });
}

function closeNewOrSaveModal(game) {
    document.getElementById('errorLoading').style.display = 'none';
    newOrLoadModal.style.display = "none";
    game.levelStarted = true;
    game.allowDialogue = true;
    game.inScene = true;
}

function newGame(game) {
    game.newOrLoadChosen = true;
    // basically just close the modal and start from the beginning
    closeNewOrSaveModal(game); // HACK may need to change this if we ever give the ability to start 
    // a new game at any point
}

function loadGame(game) {
    game.newOrLoadChosen = true;
    let dataString;
    if (game.gameType === 'arcade') {
        dataString= localStorage.getItem('gameData-arcade');
    } else {
        dataString= localStorage.getItem('gameData-adventure');
    }
     
    let data = JSON.parse(dataString);
    console.log('retrieving data');
    console.log('result: ' + data);

    // if the data is null, let user know
    if (data === null) {
        document.getElementById('errorLoading').style.display = 'block';
    } else { // othewise load game data
        game.totalSeconds = data.totalSeconds;
        game.score = data.score;
        game.character.lives = data.livesLeft;
        game.clearedBlocks = data.clearedBlocks;
        game.helpedBlobs = data.helpedBlobs;
        game.goToLevel(data.levelNumber);
        game.updateScoreText();

        // close modal
        closeNewOrSaveModal(game);
    }
}

function saveGame(game) {
    // create game data
    let data = new GameData(game.levelNumber, game.totalSecondsPassed, 
    game.score, game.livesLeft, game.clearedBlocks, game.helpedBlobs);
    let dataString = JSON.stringify(data);
    // store data
    if (game.gameType === 'arcade') {
        localStorage.setItem('gameData-arcade', dataString);
    } else {
        localStorage.setItem('gameData-adventure', dataString);
    }
    
    // alert user
    game.levelStarted = false;
    saveModal.style.display = 'block';
}

// variables
var gameTypeModal;
var newOrLoadModal;
var newGameBtn;
var loadGameBtn;
var saveGameBtn;