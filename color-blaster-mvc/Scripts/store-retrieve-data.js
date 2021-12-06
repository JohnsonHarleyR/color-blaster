class GameData {
    constructor(levelNumber, totalSeconds, inventoryMenu,
        score, livesLeft, showOpeningScene) {
        this.levelNumber = levelNumber;
        this.totalSeconds = totalSeconds;
        this.inventoryMenuStorage = new InventoryItemStorage(inventoryMenu);
            this.score = score;
        this.livesLeft = livesLeft;
        this.showOpeningScene = showOpeningScene;
    }
}

class InventoryItemStorage {
    constructor(inventoryMenu) {
        this.gameItems = inventoryMenu.gameItems;
        this.displayItems = inventoryMenu.displayItems;
        this.houseItems = inventoryMenu.houseItems;

        this.blocksRed = inventoryMenu.blocksRed;
        this.blocksOrange = inventoryMenu.blocksOrange;
        this.blocksYellow = inventoryMenu.blocksYellow;
        this.blocksGreen = inventoryMenu.blocksGreen;
        this.blocksBlue = inventoryMenu.blocksBlue;
        this.blocksPurple = inventoryMenu.blocksPurple;
        this.blocksBlack = inventoryMenu.blocksBlack;
        this.blocksWhite = inventoryMenu.blocksWhite;

        this.blobsRed = inventoryMenu.blobsRed;
        this.blobsOrange = inventoryMenu.blobsOrange;
        this.blobsYellow = inventoryMenu.blobsYellow;
        this.blobsGreen = inventoryMenu.blobsGreen;
        this.blobsBlue = inventoryMenu.blobsBlue;
        this.blobsPurple = inventoryMenu.blobsPurple;
        this.blobsBlack = inventoryMenu.blobsBlack;
        this.blobsWhite = inventoryMenu.blobsWhite;
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
    closeMenu();
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
    if (game.level.openingScene === null) {
        game.inScene = false;
    } else {
        game.inScene = true;
    }
}

function loadInventoryMenuItems(game, itemStorage) {
    game.inventory.menu.gameItems = itemStorage.gameItems;
    game.inventory.menu.displayItems = itemStorage.displayItems;
    game.inventory.menu.houseItems = itemStorage.houseItems;

    game.inventory.menu.selectedIndex = 0;
    game.inventory.menu.selectedCategoryIndex = 0;

    game.inventory.menu.blocksRed = itemStorage.blocksRed;
    game.inventory.menu.blocksOrange = itemStorage.blocksOrange;
    game.inventory.menu.blocksYellow = itemStorage.blocksYellow;
    game.inventory.menu.blocksGreen = itemStorage.blocksGreen;
    game.inventory.menu.blocksBlue = itemStorage.blocksBlue;
    game.inventory.menu.blocksPurple = itemStorage.blocksPurple;
    game.inventory.menu.blocksBlack = itemStorage.blocksBlack;
    game.inventory.menu.blocksWhite = itemStorage.blocksWhite;

    game.inventory.menu.blobsRed = itemStorage.blobsRed;
    game.inventory.menu.blobsOrange = itemStorage.blobsOrange;
    game.inventory.menu.blobsYellow = itemStorage.blobsYellow;
    game.inventory.menu.blobsGreen = itemStorage.blobsGreen;
    game.inventory.menu.blobsBlue = itemStorage.blobsBlue;
    game.inventory.menu.blobsPurple = itemStorage.blobsPurple;
    game.inventory.menu.blobsBlack = itemStorage.blobsBlack;
    game.inventory.menu.blobsWhite = itemStorage.blobsWhite;
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
        loadInventoryMenuItems(game, data.inventoryMenuStorage);
        game.totalSeconds = data.totalSeconds;
        game.score = data.score;
        game.character.lives = data.livesLeft;
        //game.clearedBlocks = data.clearedBlocks;
        //game.helpedBlobs = data.helpedBlobs;
        game.goToLevel(data.levelNumber, data.showOpeningScene);
        game.updateScoreText();

        // close modal
        closeNewOrSaveModal(game);
    }
}

function saveGame(game) {
    closeMenu();
    // create game data
    let data = new GameData(game.levelNumber, game.totalSecondsPassed, game.inventory.menu,
        game.score, game.livesLeft, game.showOpeningScene);
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