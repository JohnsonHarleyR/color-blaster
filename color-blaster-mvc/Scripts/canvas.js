        // TODO fix animation skipping - also slow down frames
        // TODO collision check on bottom of canvas
        // TODO add scrolling to canvas so there's no scroll bar
        // TODO add space at end of level to walk through door

var Game = {
    canvasId: 'gameCanvas',
    canvasBackgroundColor: '#6bd0ff',
    canvasGridColor: '#ffffff',

    gameType: 'arcade',
    levelStarted: false,

    inBlobTown: false,

    levelText: undefined,
    scoreText: undefined,

    timestamp: Date.now(),
    totalSecondsPassed: 0,
    secondsTowardInterval: 0,
    animationInterval: 0.02,

    tileWidth: 35,
    tileHeight: 35,
    spaceAtEdges: 3,

    bulletRadius: 3,

    canvas: undefined,
    context: undefined,

    level: undefined,
    levels: allLevels,
    levelNumber: 1,

    character: undefined,
    allowExit: true,

    npcs: undefined,
    npcsMoving: false,

    showOpeningScene: true,

    newOrLoadChosen: false,
    openingScene: null,
    currentAnimationInterval: null,
    inScene: false,

    currentConversation: null,
    currentDialogue: null,
    allowDialogue: false,

    blobs: undefined,
    levelHelpedBlobs: undefined,
    helpedBlobs: undefined,

    inventory: undefined,
    showInventoryMenu: false,

    showItem: false,
    itemToShow: null,

    bullets: undefined,
    bulletSpeed: 9,

    absorbRay: undefined,
    rayDisplay: undefined,
    emptyAbsorbHex: 'grey',
    rayWidth: 6,
    raySecondsPassed: 0,
    raySecondsInterval: 0.2,
    confusedImage: undefined,

    blocks: undefined,
    levelClearedBlocks: undefined,
    clearedBlocks: undefined,

    door: undefined,
    doorColor: '#004666',

    levelScore: 0,
    score: 0,

    whiteValue: 1,
    primaryValue: 3,
    secondaryValue: 6,
    blackValue: 12,

    keyPresses: undefined,

    disallowMovement: false,
    progressDisplayed: false,

    load: function() {
        // set level tile width and height for level generation
        levelTileWidth = this.tileWidth;
        levelTileHeight = this.tileHeight;

        //createGameSounds();

        console.log('loading');
        generateAllLevels(this.gameType);
        this.character = MainCharacter;
        this.npcs = new Array();
        this.blobs = new Array();
        this.levelHelpedBlobs = new Array();
        this.helpedBlobs = new Array();
        this.levels = allLevels;
        this.level = this.levels[0];
        this.scoreText = document.getElementById('scoreText');
        this.levelText = document.getElementById('levelText');
        this.inventory = Inventory;
        this.bullets = new Array();
        this.absorbRay = null;
        this.rayDisplay = null;
        this.confusedImage = new Image();
        this.confusedImage.src = "images/confused.png";
        this.blocks = new Array();
        this.levelClearedBlocks = new Array();
        this.clearedBlocks = new Array();
        this.keyPresses = new Object();
        this.inventory.load(this.level);
        this.showInventory();

        // turn blocks array into a grid map
        let rows = this.level.rows;
        if (rows < 14) {
            rows = 14;
        }
        for (let x = 0; x < this.level.columns; x++) {
            let yArray = new Array();
            for (let y = 0; y < rows; y++) {
                yArray.push(null);
            }
            this.blocks.push(yArray);
        }

        // once everything is loaded, run
        this.run();
    },

    run: function() {
        console.log('running');
        this.canvas = $('#' + this.canvasId);
        this.context = this.canvas[0].getContext("2d");

        // set the canvas and adjust the frame around it
        this.setCanvas();
        this.setGameArea();

        // load the level
        this.loadLevel();

        // blob world stuff
        BlobTown.load(this);

        // // draw character on canvas
        // this.drawCharacter();

        // // generate blocks
        // this.fillWithBlocks();

        // // create door and draw it
        // this.createDoor();
        // this.drawDoor();
        
        // // generate blobs
        // this.generateBlobs();

        // start animation loop
        window.requestAnimationFrame(this.gameLoop);

        // add event listeners for keys
        window.addEventListener('keydown', this.keyDownListener, false);
        window.addEventListener('keyup', this.keyUpListener, false);

        // // test blob
        // let testBlob = new Blob(1, 1, 1, 'yellow', 'orange', this.tileWidth, this.tileHeight);
        // this.blobs.push(testBlob);
        // let testBlob2 = new Blob(8, 1, 1, 'red', 'purple', this.tileWidth, this.tileHeight);
        // this.blobs.push(testBlob2);

        // ask to load or start new game
        showGameTypeModal(this);

        // progressModal.style.display = 'block';
    },

    setGameType: function(gameType) {
        this.gameType = gameType;
        this.load();
        gameTypeModal.style.display = "none";
        this.gameModeChosen = true;
        showNewOrSaveModal(this);
    },

    goToBlobTown: function () {
        this.inBlobTown = true;
        // call BlobTown functions
        BlobTown.enterTown(this);
    },

    returnFromBlobTown: function () {
        this.inBlobTown = false;
        // call BlobTown functions
        BlobTown.exitTown();
    },

    goToNextLevel: function(showOpening) {
        // make sure a next level exists
        if (this.levelNumber != this.levels.length) {
            if (showOpening === false) {
                this.showOpeningScene = false;
            } else {
                this.showOpeningScene = true;
            }
            
            // increment and set next level
            this.level = this.levels[this.levelNumber];
            this.levelNumber++;
            // set level score back to 0
            this.levelScore = 0;
            // load the level
            this.loadLevel();
        }
    },

    displayProgress: function() { // TODO show progress modal
        displayProgress(this);
    },

    loadLevel: function() {

        // make sure the main character is standing forward


        // make sure absorb color selected is displayed properly - starting with red.
        this.inventory.absorbColorElements[0].className = "absorb-color selected";
        this.inventory.absorbColorElements[1].className = "absorb-color";
        this.inventory.absorbColorElements[2].className = "absorb-color";

        this.npcs = new Array();
        this.blobs = new Array();
        this.blocks = new Array();
        this.levelHelpedBlobs = new Array();
        this.levelClearedBlocks = new Array();
        this.inventory.load(this.level);
        this.showInventory();

        // turn blocks array into a grid map
        let rows = this.level.rows;
        if (rows < 14) {
            rows = 14;
        }
        for (let x = 0; x < this.level.columns; x++) {
            let yArray = new Array();
            for (let y = 0; y < rows; y++) {
                yArray.push(null);
            }
            this.blocks.push(yArray);
        }

        // set the canvas and adjust the frame around it
        this.setCanvas();
        this.setGameArea();

        // draw character on canvas
        this.character.resetPosition(this.level.columns);
        this.drawCharacter();

        // make sure it's not a special level first
        if (!this.level.isSpecialLevel) {
            // generate blocks
            this.fillWithBlocks();

            // generate blobs
            this.generateBlobs();

        } else { // if it is, do it differently
            let map = this.level.map;
            let blobIndex = 0; // NOTE if level setup is messed up, this can cause issues
            // the number of blobs on the map must match the blob indexes for colors and speeds
            // loop through map - use y and then x for loop
            for (let y = 0; y < map.grid.length; y++) {
                for (let x = 0; x < map.grid[y].length; x++) {
                    // if it's a block
                    if (map.items[map.grid[y][x]] != null && 
                        map.items[map.grid[y][x]].includes('block')) {
                            let gridString = map.items[map.grid[y][x]];
                            let stringEnd = gridString.length;
                            stringEnd = stringEnd - 6;
                            let blockColor = gridString.substring(0, stringEnd);
                            // create block
                            let newBlock = new Block(this.tileWidth, this.tileHeight, 
                                x, y, blockColor);
                            // add block and put on canvas
                            this.blocks[x][y] = newBlock;
                            this.drawBlock(newBlock);
                    } else if (map.items[map.grid[y][x]] != null && 
                        map.items[map.grid[y][x]].includes('blob')) {
                        // create blob
                        let newBlob = new Blob(x, y, 
                            this.level.blobSpeeds[blobIndex], 
                                this.level.blobColors[blobIndex], 
                                this.level.blobDesiredColors[blobIndex], 
                                this.tileWidth, this.tileHeight);
                        // add blob
                        this.blobs.push(newBlob);
                        // draw blob
                        this.drawBlob(newBlob);
                        // add to count
                        blobIndex++;
                    // if it's an npc
                    } if (map.items[map.grid[y][x]] != null && 
                        map.items[map.grid[y][x]].includes('npc')) {
                        if (map.items[map.grid[y][x]].includes('sarah')) {
                            Sarah.startXi = x;
                            Sarah.startYi = y;
                            Sarah.resetPosition(this.level.columns);
                            this.npcs.push(Sarah);
                        } else if (map.items[map.grid[y][x]].includes('george')) {
                            George.startXi = x;
                            George.startYi = y;
                            George.resetPosition(this.level.columns);
                            this.npcs.push(George);
                        } else if (map.items[map.grid[y][x]].includes('onorio')) {
                            Onorio.startXi = x;
                            Onorio.startYi = y;
                            Onorio.resetPosition(this.level.columns);
                            this.npcs.push(Onorio);
                        }
                    }
                }
            }
        }

        // create door and draw it
        this.createDoor();
        this.drawDoor();

        // update level number display
        this.levelText.innerHTML = this.levelNumber;

        // show opening scene if there is one
        if (this.level.isSpecialLevel) {
            this.setOpeningScene();
        } else {
            this.openingScene = null;
            this.currentConversation = null;
            this.currentDialogue = null;
            this.currentAnimationInterval = null;
            this.inScene = false;
        }
    },

    keyDownListener: function (event) {
        if (Game.levelStarted === false && Game.inScene === true) {
            if ((event.key != 'Enter' && event.key != ' ') ||
                Game.allowDialogue === false) {
                return;
            }
        }

        if (this.keyPresses === undefined) {
            this.keyPresses = new Object();
        }

        //console.log(this.keyPresses);
        this.keyPresses[event.key] = true;
        console.log('Key pressed: "' + event.key + '"');

        // determine action
        if (event.key === 'Enter') {
            if (Game.currentDialogue != null && Game.allowDialogue) {
                //Game.endCurrentDialogue();
                Game.getNextDialogue();
                if (!Game.showOpeningScene && Game.currentDialogue === null) {
                    Game.openingScene.repeatConvoSeen = true;
                    Game.currentConversation = null;
                }
            } else if (Game.showInventoryMenu) {
                Game.inventory.menu.useItem(Game);
            } else  if (instructionsModal.style.display != "none") { // this should only do something if a modal is displayed
                //console.log('instruction modal');
                instructionsModal.style.display = "none";
                Game.levelStarted = true;
            } else if (deathModal.style.display != "none") {
                //console.log('death modal');
                deathModal.style.display = "none";
                Game.levelStarted = true;
            } else if (progressModal.style.display != "none") {
                //console.log('progress modal');
                progressModal.style.display = "none";
                Game.levelStarted = true;
            } else if (saveModal.style.display != "none") {
                //console.log(saveModal.style.display != "none");
                //console.log('save modal');
                saveModal.style.display = "none";
                Game.levelStarted = true;
                saveModal.focus();
            }
            
        } else if (event.key === 'i' || event.key === 'I') {
            // show the menu inventory - or close it
            if (!Game.showInventoryMenu && !Game.inScene) {
                Game.disallowMovement = true;
                Game.showInventoryMenu = true;
                Game.levelStarted = false;
            } else if (Game.showInventoryMenu && !Game.inScene) {
                Game.disallowMovement = false;
                Game.showInventoryMenu = false;
                Game.levelStarted = true;
            }
        } else if (event.key === 'ArrowUp' || event.key === 'ArrowDown' ||
            event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            // do something different if the inventory menu is open
            if (Game.showInventoryMenu) {
                if (event.key === 'ArrowUp') {
                    Game.inventory.menu.selectItem('up');
                } else if (event.key === 'ArrowDown') {
                    Game.inventory.menu.selectItem('down');
                } else if (event.key === 'ArrowLeft') {
                    Game.inventory.menu.selectItem('left');
                } else if (event.key === 'ArrowRight') {
                    Game.inventory.menu.selectItem('right');
                }
            } else {
                if (Game.disallowMovement) {
                    return;
                }
                Game.changeSpriteState(event.key, 'start'); 
            }
              
        } else if (event.key === ' ' || event.key === 'Spacebar') {

            // do something different if the inventory menu is open
            if (Game.showInventoryMenu) {
                Game.inventory.menu.useItem(Game);

            // if dialogue is happening, go to next dialogue
            } else if (Game.currentDialogue != null && Game.allowDialogue) {
                //Game.endCurrentDialogue();
                Game.getNextDialogue();
                if (!Game.showOpeningScene && Game.currentDialogue === null) {
                    Game.openingScene.repeatConvoSeen = true;
                    Game.currentConversation = null;
                }
            } else {
                // determine if they're shooting or absorbing
                Game.setShootOrAbsorb();

                if (Game.inventory.shootOrAbsorb === 'shoot') {
                    Game.shootBullet(Game.character, 'normal');
                } else {
                    // do absorb actions
                    Game.shootAbsorbRay();
                }
            }

        } else if (event.key === 'a' || event.key === 'A') {
            // check if the inventory is open or not
            if (Game.showInventoryMenu) {
                Game.inventory.menu.selectCategory('previous');
            } else {
                Game.inventory.selectVial('up');
                playSound('select vial');
                Game.showInventory();
            }
        } else if (event.key === 'z' || event.key === 'Z') {
            // check if the inventory is open or not
            if (Game.showInventoryMenu) {
                Game.inventory.menu.selectCategory('next');
            } else {
                Game.inventory.selectVial('down');
                playSound('select vial');
                Game.showInventory();
            }


        } else if (event.key === "q" || event.key === "Q") {
            Game.inventory.selectAbsorbColor('up', Game.levelStarted);
        } else if (event.key === 'w' || event.key === 'W') {
            Game.inventory.selectAbsorbColor('down', Game.levelStarted);
        }

        

        
    },

    keyUpListener: function (event) {

        Game.keyPresses[event.key] = false;
        //console.log('Key up: ' + event.key);

        // determine action
        if (event.key === 'ArrowUp' || event.key === 'ArrowDown' ||
        event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            Game.changeSpriteState(event.key, 'stop');
        }
    },

    gameLoop: function() {
        let newTimestamp = Date.now();
        let timePassed = (newTimestamp - Game.timestamp) / 1000;
        Game.timestamp = newTimestamp;
        Game.secondsTowardInterval += timePassed;
        Game.totalSecondsPassed += timePassed;

        // if not in blob town, do one thing, otherwise call the game loop in blob town
        if (!Game.inBlobTown) {
            if (Game.absorbRay != null && Game.rayDisplay != null) {
                Game.raySecondsPassed += timePassed;
            } else {
                Game.raySecondsPassed = 0;
            }

            if (Game.secondsTowardInterval > Game.animationInterval) {
                //console.log('interval achieved at ' + Game.totalSecondsPassed);
                Game.secondsTowardInterval = 0;

                Game.drawGrid();
                Game.redrawBlocks();
                Game.continueSpriteFrames(Game.character);
                Game.moveCharacter(Game.character, Game.character.goalX, Game.character.goalY);
                if (Game.npcsMoving) {
                    for (let i = 0; i < Game.npcs.length; i++) {
                        Game.continueSpriteFrames(Game.npcs[i]);
                        Game.moveCharacter(Game.npcs[i], Game.npcs[i].goalX, Game.npcs[i].goalY);
                    }
                }
                Game.moveBlobs();
                // TEST
                //Game.testDrawPipe();
                Game.drawBlobsAndCharacter();
                Game.drawBullets();
                Game.moveBullets();
                Game.drawRay();
                Game.drawDoor();
                Game.checkBlobCharacterCollision();
                Game.checkDoorCollision();
                if (Game.level.isSpecialLevel) {
                    if (Game.inScene && Game.gameModeChosen & Game.newOrLoadChosen) {
                        if (!Game.showOpeningScene && Game.level.openingScene.startAtEndOnReturn) {
                            Game.inScene = false;
                        } else {
                            Game.showNextInScene();
                        }
                    } else {
                        Game.showDialogue();
                        if (Game.currentConversation != null && Game.currentConversation.type === 'exit') {
                            if (Game.currentDialogue != null && !Game.currentDialogue.complete) {
                                Game.allowDialogue = true;
                            } else if (Game.currentAnimationInterval != null) {
                                Game.allowDialogue = false;
                                Game.performExitAnimation();
                            }

                        }

                        if (Game.showInventoryMenu) {
                            Game.inventory.menu.drawMenu(Game.context);
                        }
                    }
                }
            }
        } else { // if in blob town
            if (Game.secondsTowardInterval > Game.animationInterval) {

                Game.secondsTowardInterval = 0;

                // call the blob town game loop instead
                BlobTown.gameLoop(this);
            }
        }

        window.requestAnimationFrame(Game.gameLoop);
    },

    generateBlobs: function() {
        // clear blobs
        this.blobs.length = 0;

        // generate all blobs for the level
        for (let i = 0; i < this.level.blobCount; i++) {
            this.generateBlob();
        }
    },

    generateBlob: function() {
        // loop until one is found that isn't in wrong position
        let collidesWithCharacter = false;
        let newBlob = null;
        do {
            // get colors allowed for blob
            let possibleColors = getTileColors(this.level);

            // loop until coordinate is found that isn't taken
            let Xi;
            let Yi;
            let positionTaken = false;
            do {
                // determine Xi
                Xi = Math.floor(Math.random() * this.level.columns);

                // determine Yi
                let rows = this.level.rows;
                if (rows < 14) {
                    rows = 14;
                }
                // generate Yi - check for if it must be in blocks
                if (this.level.blobsMustBeInBlocks) {
                    let isInBlocks = false;
                    let minYi = this.spaceAtEdges + 1;
                    let maxYi = rows - this.spaceAtEdges - 2;
                    do {
                        Yi = Math.floor(Math.random() * this.level.rows);
                        if (Yi >= minYi && Yi <= maxYi) {
                            isInBlocks = true;
                        }
                    } while (!isInBlocks);
                    
                } else {
                    rows--; // don't allow blob in last row.
                    Yi = Math.floor(Math.random() * this.level.rows);
                }

                // check other blobs
                for (let i = 0; i < this.blobs.length; i++) {
                    if (this.blobs[i].Xi === Xi && this.blobs[i].Yi === Yi) {
                        positionTaken = true;
                        break;
                    }
                }

            } while (positionTaken);


            // determine blob color
            let blobColorIndex = Math.floor(Math.random() * possibleColors.length);
            let blobColor = possibleColors[blobColorIndex];

            // determine desired color
            let desiredColorIndex = 0;
            do {
                desiredColorIndex = Math.floor(Math.random() * possibleColors.length);
            } while (desiredColorIndex === blobColorIndex);
            let desiredColor = possibleColors[desiredColorIndex];

            // determine speed
            let blobSpeed = this.level.maxBlobSpeed;
            if (this.level.randomizeBlobSpeed) {
                blobSpeed = Math.ceil(Math.random() * this.level.maxBlobSpeed);
            }

            // create the blob
            newBlob = new Blob(Xi, Yi, blobSpeed, blobColor, desiredColor, 
                this.tileWidth, this.tileHeight);

            // check if it collides with the character
            collidesWithCharacter = this.isBlobCharacterCollision(newBlob);
        } while (collidesWithCharacter);

        // once one has been created, clear that block space
        this.blocks[newBlob.Xi][newBlob.Yi] = null;

        // add new blob to the list
        this.blobs.push(newBlob);
    },

    canMoveBlobInDirection(blob, direction) {
        //console.log('checking blob direction: ' + direction);
        // get new coordinates for direction
        let testPosition = blob.getNewDirectionCoordinates(direction);
        let newX = testPosition[0];
        let newY = testPosition[1];

        // make sure it's a valid position - if not, return false
        let maxX = this.context.canvas.width - blob.spriteWidth + blob.rightEmptyPixels;
        let maxY = this.context.canvas.height - blob.spriteHeight;
        if (newX < 0 || newX >= maxX || 
            newY < 0 || newY >= maxY) {
                return false;
        }

        // now check for block collision and npc collision
        let isBlockCollision = this.isBlockCollision('blob', newX, 
            newY, blob);

        let newRelatives = this.getRelativePosition(newX, newY);
        
        let isNpcCollision = false;
        for (let i = 0; i < this.npcs.length; i++) {
            if (this.isBlobNpcCollision(this.npcs[i], newRelatives[0],
                 newRelatives[1])) {
                isNpcCollision = true;
                console.log("Npc blob collision detected");
                break;
                // also check pipe if it's visible
                if (this.npcs[i].pipe.state != 0) {
                    if (newRelatives[0] === this.npcs[i].pipe.Xi || newRelatives[1] === this.npcs[i].pipe.Yi) {
                        isNpcCollision = true;
                        break;
                    }
                }
            }
        }

        // return block result as answer
        if (isBlockCollision || isNpcCollision) {
            return false;
        }

        // also check pipe with main character
        if (this.character.pipe.state != 0) {
            if (newRelatives[0] === this.character.pipe.Xi || newRelatives[1] === this.character.pipe.Yi) {
                isNpcCollision = true;
            }
        }

        //console.log(testPosition);
        return true;
    },

    moveBlobs() {
        // if the level hasn't started, don't move any blobs
        if (this.levelStarted === false) {
            return;
        }

        for (let i = 0; i < this.blobs.length; i++) {
            this.moveBlob(this.blobs[i]);
        }
    },

    moveBlobTowardExit(blob) {
        // don't allow character exit until blob is finished
        this.allowExit = false;

        // get exit position
        let exitX = this.door.x + this.tileWidth - (blob.spriteWidth / 2);
        let exitY = this.context.canvas.height - 1;

        let halfExitX;
        if (exitX >= blob.positionBeforeExitX) {
            let halfAmount = Math.floor((exitX - blob.positionBeforeExitX) / 2);
            halfExitX = blob.positionBeforeExitX + halfAmount;
        } else {
            let halfAmount = Math.floor((blob.positionBeforeExitX - exitX) / 2);
            halfExitX = blob.positionBeforeExitX - halfAmount;
        }

        let halfExitY;
        if (exitY >= blob.positionBeforeExitY) {
            let halfAmount = Math.floor((exitY - blob.positionBeforeExitY) / 2)
            halfExitY = blob.positionBeforeExitY + halfAmount;
        } else {
            let halfAmount = Math.floor((blob.positionBeforeExitY - exitY) / 2);
            halfExitY = blob.positionBeforeExitY - halfAmount;
        }

        // first go toward x
        if (blob.x != halfExitX && blob.x != exitX && blob.y != halfExitY) {
            if (exitX >= blob.x) { // move right
                blob.setMoveDirection('right', halfExitX, blob.y); // set properties
                // now move blob a little
                this.moveBlob(blob);
                blob.direction = 'exit'; // set direction to exit again
            } else if (halfExitX < blob.x) { // move left
                blob.setMoveDirection('left', halfExitX, blob.y); // set properties
                // now move blob a little
                this.moveBlob(blob);
                blob.direction = 'exit'; // set direction to exit again
            }
        } else if (blob.x === halfExitX && blob.y != halfExitY) { // otherwise head toward y
            if (halfExitY >= blob.y) { // move forward
                blob.setMoveDirection('forward', blob.x, halfExitY); // set properties
                // now move blob a little
                this.moveBlob(blob);
                blob.direction = 'exit'; // set direction to exit again
            } else if (exitY < blob.y) { // move backward
                blob.setMoveDirection('forward', blob.x, halfExitY); // set properties
                // now move blob a little
                this.moveBlob(blob);
                blob.direction = 'exit'; // set direction to exit again
            }
        } else if (blob.x != exitX && blob.y === halfExitY) {
            if (exitX >= blob.x) { // move right
                blob.setMoveDirection('right', exitX, blob.y); // set properties
                // now move blob a little
                this.moveBlob(blob);
                blob.direction = 'exit'; // set direction to exit again
            } else if (exitX < blob.x) { // move left
                blob.setMoveDirection('left', exitX, blob.y); // set properties
                // now move blob a little
                this.moveBlob(blob);
                blob.direction = 'exit'; // set direction to exit again
            }
        } else { // otherwise head toward y
            if (exitY >= blob.y) { // move forward
                blob.setMoveDirection('forward', blob.x, exitY); // set properties
                // now move blob a little
                this.moveBlob(blob);
                blob.direction = 'exit'; // set direction to exit again
            } else if (exitY < blob.y) { // move backward
                blob.setMoveDirection('forward', blob.x, exitY); // set properties
                // now move blob a little
                this.moveBlob(blob);
                blob.direction = 'exit'; // set direction to exit again
            }
        }

        // check if it's at exit position - if so, remove blob
        // and add it to helped blobs
        if (blob.x === exitX && blob.y === exitY) {
            this.addBlobToScore(blob);
            this.levelHelpedBlobs.push(blob);
            for (let i = 0; i < this.blobs.length; i++) {
                if (this.blobs[i] === blob) {
                    this.blobs.splice(i, 1);
                    break;
                }
            }
            this.allowExit = true;
        }
    },

    moveBlob(blob) {
        // if the blob's direction is set to none but it is happy, then set the direction to 'exit'
        if (blob.direction === 'none' && 
        blob.thoughts.currentThought === blob.thoughts.happyThought) {
            blob.direction = 'exit';
        }
        // if the blob's direction is set to none, get new direction
         else if (blob.direction === 'none' && blob.hasPassedMoveChangeInterval()) {
            // this also checks the thought interval count so it waits a little before moving again
            this.setBlobDirection(blob);
        }

            // if it's still none, just return
            if (blob.direction === 'none') {
                return;
            }

        // if it's set to move blob to exit, do that
        if (blob.direction === 'exit') {
            blob.speed = 2;
            this.moveBlobTowardExit(blob);
        }



        // otherwise, start moving blob in direction
        blob.x += blob.xSpeed;
        blob.y += blob.ySpeed;

        // now check goals - if anything exceeds it, it's done moving
        // so set the blob's direction to 'none' again
        if (blob.xSpeed != 0 && blob.lessThanGoalX) {
            if (blob.x <= blob.goalX) {
                blob.x = blob.goalX;
                blob.setMoveDirection('none', blob.x, blob.y);
            }
        } else if (blob.xSpeed != 0 && !blob.lessThanGoalX) {
            if (blob.x >= blob.goalX) {
                blob.x = blob.goalX;
                blob.setMoveDirection('none', blob.x, blob.y);
            }
        }

        if (blob.ySpeed != 0 && blob.lessThanGoalY) {
            if (blob.y <= blob.goalY) {
                blob.y = blob.goalY;
                blob.setMoveDirection('none', blob.x, blob.y);
            }
        } else if (blob.ySpeed != 0 && !blob.lessThanGoalY) {
            if (blob.y >= blob.goalY) {
                blob.y = blob.goalY;
                blob.setMoveDirection('none', blob.x, blob.y);
            }
        }

    },

    setBlobDirection(blob) {
        // only do this if the blob doesn't have a direction
        if (blob.direction != 'none') {
            return;
        }

        // generate a random direction and check it
        // do this 4 times - if nothing is chosen, set direction to none.
        let directions = ['forward', 'backward', 'left', 'right'];
        let newDirection = 'none';
        for (let i = 0; i < 4; i++) {
            // grab a random direction from the options left
            let randomIndex = this.getRandomDirectionIndex(directions);
            let randomDirection = directions[randomIndex];

            // see if it can move in that direction
            if (this.canMoveBlobInDirection(blob, randomDirection)) {
                newDirection = randomDirection;
                break;
            } else { // if not, remove direction from list of directions and try again
                directions.splice(randomIndex, 1);
            }
        }
        // now set the new direction for the blob
        let newCoordinates = blob.getNewDirectionCoordinates(newDirection);
        blob.setMoveDirection(newDirection, newCoordinates[0], newCoordinates[1]);
    },

    getRandomDirection(directions) {
        let index = Math.floor(Math.random * directions.length);
        return directions[index];
    },

    getRandomDirectionIndex(directions) {
        let index = Math.floor(Math.random() * directions.length);
        return index;
    },

    drawBlob: function(blob) {
        let sx = blob.currentStateFrame.startX;
        let sy = blob.currentStateFrame.startY;

        let sw = blob.currentStateFrame.width;
        let sh = blob.currentStateFrame.height;

        let offX = Math.round((blob.currentStateFrame.width - this.tileWidth) / 2);
        let offY = Math.round((blob.currentStateFrame.height - this.tileHeight) / 2);

        let dx = blob.x;
        let dy = blob.y;

        if (dx < blob.xOffset) {
            dx = blob.xOffset;
        } else if ((dx + sw) > this.canvas.width) {
            dx = this.canvas.width - sw;
        }

        if (dy < blob.yOffset) { // there is space at the top of the sprite so that's why it's negative
            dy = blob.yOffset;
        } else if ((dy + sh) > this.canvas.height) {
            dy = this.canvas.height - sh;
        }

        blob.x = dx;
        blob.y = dy;

        let dw = sw;
        let dh = sh;

        //dx = Math.round(dx - ((this.tileWidth - dw) / 2)); // subtract any extra pixels
        
        let image = blob.currentStateFrame.image;
        let isLoaded = image.complete && image.naturalHeight !== 0;
        if (!isLoaded) {
            image.addEventListener('load', function() {
                Game.context.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
                Game.drawThought(blob, dx, dy);
            });
        } else {
                Game.context.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
                Game.drawThought(blob, dx, dy);
        }
    },

    drawThought(blob, blobDx, blobDy) {
        let sx = blob.thoughts.currentThought.startX;
        let sy = blob.thoughts.currentThought.startY;

        let sw = blob.thoughts.currentThought.width;
        let sh = blob.thoughts.currentThought.height;

        let dx = blobDx + blob.thoughts.offX;
        let dy = blobDy + blob.thoughts.offY;

        let dw = sw;
        let dh = sh;

        //dx = Math.round(dx - ((this.tileWidth - dw) / 2)); // subtract any extra pixels
        
        let image = blob.thoughts.getThoughtImage();
        if (image != null) { // only do it if it's not null - meaning it's supposed to be shown
            let isLoaded = image.complete && image.naturalHeight !== 0;
            if (!isLoaded) {
                image.addEventListener('load', function() {
                    Game.context.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
                });
            } else {
                Game.context.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
            }
        }
        
    },
    
    drawCharacterThought(character, characterDx, characterDy) {
        
        if (character.thoughts.currentThought != null) {
            // set thought offset according to position
            if (character.direction === "forward") {
                    character.thoughts.offX = 35;
                    character.thoughts.offY = 4;
            } else if (character.direction === "right") {
                    character.thoughts.offX = 33;
                    character.thoughts.offY = 4;
            } else if (character.direction === "left") {
                    character.thoughts.offX = 32;
                    character.thoughts.offY = 4;
            } else if (character.direction === "backward") {
                    character.thoughts.offX = 33;
                    character.thoughts.offY = -2;
            }

            let sx = character.thoughts.currentThought.startX;
            let sy = character.thoughts.currentThought.startY;

            let sw = character.thoughts.currentThought.width;
            let sh = character.thoughts.currentThought.height;

            let dx = characterDx + character.thoughts.offX;
            let dy = characterDy + character.thoughts.offY;

            let dw = sw;
            let dh = sh;

            //dx = Math.round(dx - ((this.tileWidth - dw) / 2)); // subtract any extra pixels
            
            let image = character.thoughts.getThoughtImage();
            if (image != null) { // only do it if it's not null - meaning it's supposed to be shown
                let isLoaded = image.complete && image.naturalHeight !== 0;
                if (!isLoaded) {
                    image.addEventListener('load', function() {
                        Game.context.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
                    });
                } else {
                    Game.context.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
                }
            }

            
        }
    },

    changeBlobFrame: function(blob) {
        // only do this if enough time has passed for the blob
        if (blob.hasPassedTimeInterval()) {
            let newIndex = blob.lastFrameIndex + 1;
            if (newIndex >= blob.currentState.frames.length - 1) {
                newIndex = 0;
            }
            blob.currentStateFrame = blob.currentState.frames[newIndex];
            blob.lastFrameIndex = newIndex;
        }
    },

    drawBlobsAndCharacter() {
        // sort blobs into those behind and in front of character
        let behindBlobs = new Array();
        let inFrontBlobs = new Array();
        for (let i = 0; i < this.blobs.length; i++) {
            if (this.blobs[i].y < this.character.y + (this.character.spriteHeight / 2)) {
                behindBlobs.push(this.blobs[i]);
            } else {
                inFrontBlobs.push(this.blobs[i]);
            }
        }

        // sort npcs into those behind and in front
        let behindNpcs = new Array();
        let inFrontNpcs = new Array();
        for (let i = 0; i < this.npcs.length; i++) {
            let npcY;
            let characterY;
            if (this.npcs[i].species === "human") {
                npcY = this.npcs[i].y + this.npcs[i].spriteHeight / 2 + 8;
                characterY = this.character.y + (this.character.spriteHeight / 2);
            } else {
                npcY = this.npcs[i].y;
                characterY = this.character.y + (this.character.spriteHeight / 2);
            }

            if (this.npcs[i].y + this.npcs[i].spriteHeight <  this.character.y + this.character.spriteHeight) {
                behindNpcs.push(this.npcs[i]);
            } else {
                inFrontNpcs.push(this.npcs[i]);
            }
        }

        // now draw it all in correct order
        this.drawBlobs(behindBlobs);
        this.drawNpcs(behindNpcs);
        this.drawCharacter();
        this.drawNpcs(inFrontNpcs);
        this.drawBlobs(inFrontBlobs);
    },

    drawBlobs: function(blobs) {
        for (let i = 0; i < blobs.length; i++) {
            this.changeBlobFrame(blobs[i]);
            this.drawBlob(blobs[i]);
        }
    },

    showInventory: function() {
        // grab the container
        let container = document.getElementById('inventoryDisplay');

        // clear it out but then put selected div inside
        container.innerHTML = '';

        // loop through vials and display them accordingly
        for (let i = 0; i < this.inventory.vials.length; i++) {
            let htmlString = "";

            // add instruction if it's the first or last one
            if (i === 0) {
                htmlString += "<div class='selectInstruct'>A </div>";
            } else if (i === this.inventory.vials.length - 1) {
                htmlString += "<div class='selectInstruct'>Z </div>";
            }

            if (this.inventory.vials[i] === this.inventory.activeVial) {
                htmlString += '<img id="vial' + i + '" class="vial selected" src="' + 
            this.inventory.vials[i].getImageUrl() + '"><br>'
            } else {
                htmlString += '<img id="vial' + i + '" class="vial" src="' + 
                this.inventory.vials[i].getImageUrl() + '"><br>'
            }
            container.innerHTML += htmlString;
        }

    },

    setShootOrAbsorb: function() {
        if (this.inventory.activeVial.content === null) {
            this.inventory.shootOrAbsorb = 'absorb';
        } else {
            this.inventory.shootOrAbsorb = 'shoot';
        }
    },

    changeBlock: function(bullet, block) {
        if (this.inventory.shootOrAbsorb === 'shoot') {
            block.setAddColor(bullet);
        } else {
            block.setSubtractColor(bullet);
        }

        // destroy any blocks that can be destroyed
        this.destroyBlocks(block);

        // set shoot or absorb
        Game.setShootOrAbsorb();

    },

    shootBullet: function (character, mode) {
        if (this.level.isSpecialLevel && this.inScene === true && mode === 'normal') {
            return;
        }

        if (mode === 'scene') {
            // make sure player is able to shoot
            if (this.inventory.shootOrAbsorb === 'shoot' &&
                this.inventory.activeSceneShootColor != null) {
                let bullet = null;
                let radius = this.bulletRadius;
                let bulletX = 0;
                let bulletY = 0;
                let color = this.inventory.activeSceneShootColor;

                let xSpeed = 0;
                let ySpeed = 0;

                let characterX = character.x + (character.spriteWidth / 2);
                let characterY = character.y + (character.spriteHeight / 2) +
                    13;

                // first figure out the direction of the character
                if (character.direction === 'forward') {
                    bulletX = characterX;
                    bulletY = characterY;
                    ySpeed = this.bulletSpeed;
                } else if (character.direction === 'backward') {
                    bulletX = characterX;
                    bulletY = character.y + 10;
                    ySpeed = -1 * this.bulletSpeed;
                } else if (character.direction === 'left') {
                    bulletX = characterX - 10;
                    bulletY = characterY - 2;
                    xSpeed = -1 * this.bulletSpeed;
                } else if (character.direction === 'right') {
                    bulletX = characterX + 10;
                    bulletY = characterY - 2;
                    xSpeed = this.bulletSpeed;
                }

                // create bullet and add it to the list of bullets
                bullet = new Bullet(radius, bulletX, bulletY, xSpeed,
                    ySpeed, color, mode);
                this.bullets.push(bullet);

                // remove content from vial in inventory
                //this.inventory.activeSceneShootColor = null;

                // refresh inventory display
                //this.showInventory();

                // set new permissions for absorb color
                //this.inventory.setAbsorbPermission();


            }
        } else {
            // make sure player is able to shoot
            if (this.inventory.shootOrAbsorb === 'shoot' &&
                this.inventory.activeVial.content != null) {
                let bullet = null;
                let radius = this.bulletRadius;
                let bulletX = 0;
                let bulletY = 0;
                let color = this.inventory.activeVial.content;

                let xSpeed = 0;
                let ySpeed = 0;

                let characterX = character.x + (character.spriteWidth / 2);
                let characterY = character.y + (character.spriteHeight / 2) +
                    13;

                // first figure out the direction of the character
                if (character.direction === 'forward') {
                    bulletX = characterX;
                    bulletY = characterY;
                    ySpeed = this.bulletSpeed;
                } else if (character.direction === 'backward') {
                    bulletX = characterX;
                    bulletY = character.y + 10;
                    ySpeed = -1 * this.bulletSpeed;
                } else if (character.direction === 'left') {
                    bulletX = characterX - 10;
                    bulletY = characterY - 2;
                    xSpeed = -1 * this.bulletSpeed;
                } else if (character.direction === 'right') {
                    bulletX = characterX + 10;
                    bulletY = characterY - 2;
                    xSpeed = this.bulletSpeed;
                }

                // create bullet and add it to the list of bullets
                bullet = new Bullet(radius, bulletX, bulletY, xSpeed,
                    ySpeed, color, mode);
                this.bullets.push(bullet);

                // remove content from vial in inventory
                this.inventory.activeVial.content = null;

                // refresh inventory display
                this.showInventory();

                // set new permissions for absorb color
                this.inventory.setAbsorbPermission();


            }
        }

    },

    shootAbsorbRay: function() {
        // *** using a bullet object to do this - but it will look like a ray

        // make sure player is able to absorb
        if (this.inventory.shootOrAbsorb === 'absorb' &&
        this.inventory.activeVial.content === null) {
            this.absorbRay = null;
            let radius = this.bulletRadius;
            let rayX = 0;
            let rayY = 0;
            let color = this.inventory.absorbColors[this.inventory.activeAbsorbColorIndex];
            
            let xSpeed = 0;
            let ySpeed = 0;

            let characterX = this.character.x + (this.character.spriteWidth / 2);
            let characterY = this.character.y + (this.character.spriteHeight / 2) + 
                13;
    
            // first figure out the direction of the character
            if (this.character.direction === 'forward') {
                rayX = characterX;
                rayY = characterY;
                ySpeed = this.bulletSpeed;
            } else if (this.character.direction === 'backward') {
                rayX = characterX;
                rayY = this.character.y + 10;
                ySpeed = -1 * this.bulletSpeed;
            } else if (this.character.direction === 'left') {
                rayX = characterX - 10;
                rayY = characterY - 2;
                xSpeed = -1 * this.bulletSpeed;
            } else if (this.character.direction === 'right') {
                rayX = characterX + 10;
                rayY = characterY - 2;
                xSpeed = this.bulletSpeed;
            }

            // create bullet and store it as the absorb ray
            this.absorbRay = new Bullet(radius, rayX, rayY, xSpeed, 
                ySpeed, color);

            // move the ray until it hits something
            this.useRay();

            // refresh inventory display
            this.showInventory();

            // set new permissions for absorb color
            this.inventory.setAbsorbPermission();
        }
    },

    moveBullets: function() {
        let indexesToRemove = new Array();
        for (let i = 0; i < this.bullets.length; i++) {
            let bullet = this.bullets[i];
            bullet.x += bullet.xSpeed;
            bullet.y += bullet.ySpeed;

            let isBlockCollision = this.isBlockCollision('bullet', bullet.x, bullet.y, bullet);
            let isBlobCollision = this.isBulletBlobCollisionAll(bullet);
            console.log('blob bullet collision? ' + isBlobCollision);

            // check if the bullet is off the screen - remove if yes
            if (bullet.x < 0 || bullet.y < 0 || 
                bullet.x > this.context.canvas.width || 
                bullet.y > this.context.canvas.height) {
                indexesToRemove.push(i);
                // set the active vial back to the color it was
                this.inventory.activeVial.content = bullet.color;
                this.showInventory();
            } else if (isBlockCollision) { // now check for tile collision
                
                let relativePos = this.getRelativePosition(bullet.x, bullet.y);
                
                // check if the block color changes - if it doesn't,
                // set the active vial back to its normal content
                let block = this.blocks[relativePos[0]][relativePos[1]];

                // only do this if the block isn't null
                if (block != null) {
                    let originalBlockColor = block.color;
                
                    //change bullet stuff so it doesn't get drawn
                    this.changeBlock(bullet, block);
                    indexesToRemove.push(i);
    
                    if (originalBlockColor === block.color) {
                        // set the active vial back to the color it was
                        this.inventory.activeVial.content = bullet.color;
                        this.inventory.setAbsorbPermission();
                        this.showInventory();
                        //// play failure sound
                        playSound('shoot fail');
                    } else {
                        // play sound
                        playSound('shoot');
                    }

                    if (bullet.mode === 'scene') {
                        this.inventory.activeSceneShootColor = null;
                    }
                }
            } else if (isBlobCollision) { // if it collided with a blob
                console.log('bullet hit blob.');
                // get which blob is changing
                let blob = this.getBlobFromBulletCollision(bullet);

                let originalBlobColor = blob.color;
                
                //change bullet stuff so it doesn't get drawn
                // change the blob
                this.changeBlob('add', blob, bullet);
                indexesToRemove.push(i);
    
                if (originalBlobColor === blob.color) {
                    // set the active vial back to the color it was
                    this.inventory.activeVial.content = bullet.color;
                    this.showInventory();
                    this.inventory.setAbsorbPermission();
                    //// play failure sound
                    playSound('shoot fail');
                } else {
                    // play sound
                    playSound('shoot');
                }

                if (bullet.mode === 'scene') {
                    this.inventory.activeSceneShootColor = null;
                }
                
            }
        }

        // remove all bullets from list that must be removed, starting backwards
        for (let i = indexesToRemove.length - 1; i >= 0; i--) {
            this.bullets.splice(indexesToRemove[i], 1);
        }    

    },

    changeBlob(addOrSubtract, blob, bullet) {
        console.log('changing blob');
        if (addOrSubtract === 'add') {
            blob.setAddColor(bullet);
        } else if (addOrSubtract === 'subtract') {
            blob.setSubtractColor(bullet);
        }
        // redraw the blob
        this.drawBlob(blob);
    },

    isBulletBlobCollisionAll(bullet) {
        for (let i = 0; i < this.blobs.length; i++) {
            if (this.isBlobCollision('bullet', bullet.x, bullet.y, 
            bullet, this.blobs[i])) {
                return true;
            }
        }
        return false;
    },

    getBlobFromBulletCollision(bullet) {
        for (let i = 0; i < this.blobs.length; i++) {
            if (this.isBlobCollision('bullet', bullet.x, bullet.y, 
            bullet, this.blobs[i])) {
                return this.blobs[i];
            }
        }
        return null;
    },

    useRay: function() {
        // do all the moving before drawing
        let ray = this.absorbRay;
        let rayColor = this.emptyAbsorbHex; // TODO determine hex color for it
        console.log('ray color before: ' + this.emptyAbsorbHex);
        let startX = ray.x; // these are needed for drawing the beam
        let startY = ray.y;

        // keep moving until there's a collision
        let isBlockCollision;
        let isBlobCollision;
        let isOverEdge = false;
        do {
            ray.x += ray.xSpeed;
            ray.y += ray.ySpeed;

            // check if the ray is off the screen
            if (ray.x < 0 || ray.y < 0 || 
                ray.x > this.context.canvas.width || 
                ray.y > this.context.canvas.height) {
                    isOverEdge = true;
            }

            isBlockCollision = this.isBlockCollision('ray', ray.x, ray.y, ray);
            isBlobCollision = this.isBulletBlobCollisionAll(ray);
            if (isBlockCollision) { // check for tile collision
                
                isBlobCollision = false;
                let relativePos = this.getRelativePosition(ray.x, ray.y);
                let block = this.blocks[relativePos[0]][relativePos[1]];
                if (block != null) {
                    let absorbResult = block.getSubtractResult(ray.color, block.color);
                    let newBlockColor = absorbResult[0];
    
                    // get the new ray color to draw
                    if (absorbResult[1] != 'none') {
                        rayColor = block.getHex(absorbResult[1]);
                    }
    
                    let rayWidth = this.rayWidth;
                    let rayHeight = this.rayWidth;
                    startX = startX - Math.round(rayWidth / 2);
                    startY = startY  - Math.round(rayHeight / 2);
                    let newStartX;
                    let newStartY;
                    let endX;
                    let endY;
                    if (ray.x > startX) {
                        newStartX = startX;
                        endX = ray.x;
                        rayWidth = endX - newStartX;
                    } else if (ray.x < startX) {
                        newStartX = ray.x;
                        endX = startX;
                        rayWidth = endX - newStartX;
                    }
                    if (ray.y > startY) {
                        newStartY = startY;
                        endY = ray.y;
                        rayHeight = endY - newStartY;
                    } else if (ray.y < startY) {
                        newStartY = ray.y;
                        endY = startY;
                        rayHeight = endY - newStartY;
                    }

                    startX = newStartX;
                    startY = newStartY;
    
                    this.rayDisplay = new RayDisplay(startX, startY, 
                        rayWidth, rayHeight, rayColor, newBlockColor);
    
                    //console.log('ray color: ' + rayColor);
    
    
                    //change the block - if it's able to absorb
                    if (rayColor != this.emptyAbsorbHex) {

                        // play absorb sound
                        playSound('absorb');

                        this.changeBlock(ray, block);

                        // add new block color to vial
                        this.inventory.activeVial.content = absorbResult[1];

                        // set the inventory back to 'shoot'
                        this.inventory.shootOrAbsorb = 'shoot';
                    } else {
                        playSound('absorb fail');
                    }
                } else {
                    isBlockCollision = false;
                    isBlobCollision = false
                }
                
            }  else if (isBlobCollision) { // if it collided with a blob
                console.log('ray hit blob');
                isBlockCollision = false;
                let blob = this.getBlobFromBulletCollision(ray);
                if (blob != null) {
                    let absorbResult = blob.getSubtractResult(ray.color, blob.color);
                    let newBlobColor = absorbResult[0];
    
                    // get the new ray color to draw
                    if (absorbResult[1] != 'none') {
                        rayColor = blob.getHex(absorbResult[1]);
                    }
    
                    let rayWidth = this.rayWidth;
                    let rayHeight = this.rayWidth;
                    startX = startX - Math.round(rayWidth / 2);
                    startY = startY  - Math.round(rayHeight / 2);
                    let newStartX = startX;
                    let newStartY = startY;
                    let endX;
                    let endY;
                    if (ray.x > startX) {
                        newStartX = startX;
                        endX = ray.x;
                        rayWidth = endX - newStartX;
                    } else if (ray.x < startX) {
                        newStartX = ray.x;
                        endX = startX;
                        rayWidth = endX - newStartX;
                    }
                    if (ray.y > startY) {
                        newStartY = startY;
                        endY = ray.y;
                        rayHeight = endY - newStartY;
                    } else if (ray.y < startY) {
                        newStartY = ray.y;
                        endY = startY;
                        rayHeight = endY - newStartY;
                    }

                    startX = newStartX;
                    startY = newStartY;
    
                    this.rayDisplay = new RayDisplay(startX, startY, 
                        rayWidth, rayHeight, rayColor, newBlobColor);
    
                    console.log('ray color: ' + rayColor);
    
    
                    //change the block - if it's able to absorb
                    if (rayColor != this.emptyAbsorbHex) {

                        // play absorb sound
                        playSound('absorb');

                        this.changeBlob('subtract', blob, ray);

                        // add new block color to vial
                        this.inventory.activeVial.content = absorbResult[1];

                        // set the inventory back to 'shoot'
                        this.inventory.shootOrAbsorb = 'shoot';
                    } else {
                        playSound('absorb fail');
                    }

                } else {
                    isBlockCollision = false;
                }
            } 


        } while (!isBlockCollision && !isBlobCollision && !isOverEdge);


    },

    drawRay: function() {
        if (this.absorbRay != null && this.rayDisplay != null) {
            // draw the ray
            this.context.beginPath();
            this.context.fillStyle = this.rayDisplay.rayColor;
            
            this.context.fillRect(this.rayDisplay.startX,
                this.rayDisplay.startY,
                this.rayDisplay.rayWidth, 
                this.rayDisplay.rayHeight);

            // if the color is gray, draw question mark above character's head
            // TODO make question mark better
            if (this.rayDisplay.rayColor === this.emptyAbsorbHex) {
                let image = this.confusedImage;
                let newX = this.character.x + (this.character.spriteWidth / 2);

                let isLoaded = image.complete && image.naturalHeight !== 0;
                if (!isLoaded) {
                    this.context.drawImage(image, 
                        newX, this.character.y);
                } else {
                    this.context.drawImage(image, 
                        newX, this.character.y);
                }
            }
        }

        // if the ray display seconds has passed, reset array
        if (this.raySecondsPassed > this.raySecondsInterval) {
            this.absorbRay = null;
            this.rayDisplay = null;
        }

    },

    drawBullets: function() {
        // loop through list of bullets
        for (let i = 0; i < this.bullets.length; i++) {
            let bullet = this.bullets[i];
            // draw the bullet
            this.context.beginPath();
            this.context.arc(bullet.x, bullet.y, bullet.radius, 
                0, 2 * Math.PI, false);
            this.context.fillStyle = bullet.hex;
            this.context.fill();
            this.context.lineWidth = 2;
            this.context.strokeStyle = bullet.borderHex;
            this.context.stroke();
        }
    },

    // check if any blobs have collided with character - restart level if so
    checkBlobCharacterCollision: function() {
        if (this.levelStarted) {
            // loop through blobs
            let isCollision = false;
            for (let i = 0; i < this.blobs.length; i++) {
                // check collision
                isCollision = this.isBlobCharacterCollision(this.blobs[i]);
                if (isCollision && this.levelStarted === true) {
                    // also make sure the blob isn't happy - because then it's fine
                    if (this.blobs[i].thoughts.currentThought === 
                        this.blobs[i].thoughts.happyThought) {
                            isCollision = false;
                    } else {
                        break;
                    }
                }
            }

            // if there's a collision, end the level
            if (isCollision) {
                console.log('blob character collision');
                this.levelScore = 0;
                this.levelStarted = false;
                this.showCharacterDeath();
                this.goToLevel(this.levelNumber);
            }
        }

    },

    showCharacterDeath: function() {
        document.getElementById('characterDeathModal').style.display = 'block';
    },

    isBlobCharacterCollision: function(blob) {
        // store relevent blob values
        let blobLeftX = blob.x + blob.leftEmptyPixels + 1;
        let blobRightX = blob.x + blob.spriteWidth - blob.rightEmptyPixels - 1;
        let blobTopY = blob.y + blob.topEmptyPixels + 1;
        let blobBottomY = blob.y + blob.spriteHeight + 1;

        let characterLeftX = this.character.x - this.character.xOffset;
        let characterRightX = this.character.x + 
        this.character.spriteWidth + this.character.xOffset;
        let characterTopY = (this.character.y - this.character.yOffset) + 
        (this.character.spriteHeight / 2 + 4); // let it overlap if it's halfway
        let characterBottomY = this.character.y + this.character.spriteHeight;
        // the character bottom one doesn't need an offset, just the top

        if ((characterRightX > blobLeftX && characterRightX < blobRightX) || 
                (characterLeftX < blobRightX && characterLeftX > blobLeftX)) {
            if ((characterBottomY > blobTopY && characterBottomY < blobBottomY) || 
                (characterTopY < blobBottomY && characterTopY > blobTopY)) {

                    console.log('character blob collision');
                    return true;

                }
        }
    },

    isNpcCharacterCollision: function(character, npc, newX, newY) {
        if (npc.species === "human") {
            // store relevent values
            let npcLeftX = npc.x - npc.xOffset;
            let npcRightX = npc.x + 
                npc.spriteWidth + npc.xOffset;
            let npcTopY = (npc.y - npc.yOffset) + 
            (npc.spriteHeight / 2 + 8); // let it overlap if it's halfway
            let npcBottomY = npc.y + npc.spriteHeight;

            let characterLeftX = newX - character.xOffset;
            let characterRightX = newX + 
            character.spriteWidth + character.xOffset;
            let characterTopY = (newY - character.yOffset) + 
            (character.spriteHeight / 2 + 8); // let it overlap if it's halfway
            let characterBottomY = newY + character.spriteHeight;
            // the character bottom one doesn't need an offset, just the top

            if ((characterRightX >= npcLeftX && characterRightX <= npcRightX) || 
                    (characterLeftX <= npcRightX && characterLeftX >= npcLeftX)) {
                if ((characterBottomY >= npcTopY && characterBottomY <= npcBottomY) || 
                    (characterTopY <= npcBottomY && characterTopY >= npcTopY)) {

                        console.log('character npc collision');
                        return true;

                    }
            }
        }
        return false;
    },

    isBlobNpcCollision: function(npc, blobXi, blobYi) {
        if (npc.species === "human") {
            if ((blobXi === npc.Xi && blobYi === npc.Yi) || 
            (blobXi === npc.Xi && blobYi === npc.Yi - 1)) {
                return true;
            }
        } else {
            if (blobXi === npc.Xi && blobYi === npc.Yi) {
                return true;
            }
        }

        return false;

    },

    isBlobCollision(thingToCheck, itemX, itemY, item, blob) {
        // store relevent blob values
        let blobLeftX = blob.x + blob.leftEmptyPixels + 1;
        let blobRightX = blob.x + blob.spriteWidth - blob.rightEmptyPixels - 1;
        let blobTopY = blob.y + blob.topEmptyPixels + 1;
        let blobBottomY = blob.y + blob.spriteHeight + 1;
        
        if (thingToCheck === 'bullet') {

            let bulletLeftX = itemX - item.radius;
            let bulletRightX = itemX + item.radius;
            let bulletTopY = itemY - item.radius;
            let bulletBottomY = itemY + item.radius;

            if ((bulletRightX >= blobLeftX && bulletRightX <= blobRightX) || 
                (bulletLeftX <= blobRightX && bulletLeftX >= blobLeftX)) {
                if ((bulletBottomY >= blobTopY && bulletBottomY <= blobBottomY) || 
                    (bulletTopY <= blobBottomY && bulletTopY >= blobTopY)) {
                        return true;
                }
            }

        } else if (thingToCheck === 'ray') {

            let bulletLeftX = itemX - 1;
            let bulletRightX = itemX + 1;
            let bulletTopY = itemY - 1;
            let bulletBottomY = itemY + 1;

            if ((bulletRightX >= blobLeftX && bulletRightX <= blobRightX) || 
                (bulletLeftX <= blobRightX && bulletLeftX >= blobLeftX)) {
                if ((bulletBottomY >= blobTopY && bulletBottomY <= blobBottomY) || 
                    (bulletTopY <= blobBottomY && bulletTopY >= blobTopY)) {
                        return true;
                }
            }

        }
        return false;
    },

    isBlockCollision: function(thingToCheck, itemX, itemY, item) {
        // check for both character collision and paint bullet collision - 
        // store results in array. First item is character,second item is bullet.

        // loop through tiles and compare
        for (let Xi = 0; Xi < this.level.columns; Xi++) {
            //for (let Yi = 0; Yi < this.level.rows - 4; Yi++) { // for test
            let rows = this.level.rows;
            if (rows < 14) {
                rows = 14;
            }
            for (let Yi = 0; Yi < rows; Yi++) {
                
                let block = this.blocks[Xi][Yi];

                // if (Xi === 1 && Yi === 2 && block != null) {
                //     //test
                //     console.log('boop');
                // }

                // make sure the block exists
                if (block != null) {
                    // store relevent block values
                    let blockLeftX = block.x * this.tileWidth;
                    let blockRightX = (block.x + 1) * this.tileWidth - 1;
                    let blockTopY = block.y * this.tileHeight;
                    let blockBottomY = (block.y + 1) * this.tileHeight - 1;

                    // check character collision - only bother if collision hasn't been found
                    if (thingToCheck === 'character') {
                        let characterLeftX = itemX - this.character.xOffset;
                        let characterRightX = itemX + 
                        this.character.spriteWidth + this.character.xOffset;
                        let characterTopY = (itemY - this.character.yOffset) + 
                        (this.character.spriteHeight / 2); // let it overlap if it's halfway
                        let characterBottomY = itemY + this.character.spriteHeight;
                        // the character bottom one doesn't need an offset, just the top

                        if ((characterRightX > blockLeftX && characterRightX < blockRightX) || 
                                (characterLeftX < blockRightX && characterLeftX > blockLeftX)) {
                            if ((characterBottomY > blockTopY && characterBottomY < blockBottomY) || 
                                (characterTopY < blockBottomY && characterTopY > blockTopY)) {

                                    console.log('character collision');
                                    return true;

                                }
                        }

                    } else if (thingToCheck === 'bullet') {
                        // check bullet collision for all tiles
                        let bulletPosition = this.getRelativePosition(itemX, itemY);
                        if (bulletPosition[0] === Xi && 
                            bulletPosition[1] === Yi) {
                                return true;
                        }
                    } else if (thingToCheck === 'ray') {
                        // check bullet collision for all tiles
                        let bulletPosition = this.getRelativePosition(itemX, itemY);
                        if (bulletPosition[0] === Xi && 
                            bulletPosition[1] === Yi) {
                                return true;
                        }
                    } else if (thingToCheck === 'blob') {
                        let blob = item;
                        let blobLeftX = itemX + blob.leftEmptyPixels;
                        let blobRightX = itemX + blob.spriteWidth - blob.rightEmptyPixels;
                        let blobTopY = itemY + blob.topEmptyPixels;
                        let blobBottomY = itemY + blob.spriteHeight;

                        if ((blobRightX > blockLeftX && blobRightX < blockRightX) || 
                                (blobLeftX < blockRightX && blobLeftX > blockLeftX)) {
                            if ((blobBottomY > blockTopY && blobBottomY < blockBottomY) || 
                                (blobTopY < blockBottomY && blobTopY > blockTopY)) {

                                    //console.log('blob collision');
                                    return true;
                                }
                        }
                    }
                }

                
            }
        }
        return false;

    },

    checkDoorCollision: function () {
        let result = this.isDoorCollision();
        if (result && this.allowExit && !this.checkExitEvents()) {

            // display progress
            if (!this.progressDisplayed) {
                // set character so it is standing forward
                this.character.setState('standForward');
                // add level score to total score
                this.score += this.levelScore;
                // add level helped blobs to all helped blobs
                for (let i = 0; i < this.levelHelpedBlobs.length; i++) {
                    this.helpedBlobs.push(this.levelHelpedBlobs[i]);
                }
                // add level cleared blocks to all cleared blocks
                for (let i = 0; i < this.levelClearedBlocks.length; i++) {
                    this.clearedBlocks.push(this.levelClearedBlocks[i]);
                }

                this.progressDisplayed = true;
                this.displayProgress();

                // set it so the level hasn't loaded
                this.levelStarted = false;
                //this.goToNextLevel();
            }
        }
    },

    isDoorCollision: function() {
        // check for both character collision and paint bullet collision - 
        // store results in array. First item is character,second item is bullet.

        let characterX = this.character.x;
        let characterY = this.character.y;

        // store relevent door values
        let doorLeftX = this.door.x;
        let doorRightX = this.door.x + this.door.width;
        let doorTopY = this.door.y;
        let doorBottomY = this.door.y + this.door.height;

        // check character collision - only bother if collision hasn't been found
        let characterLeftX = characterX - this.character.xOffset;
        let characterRightX = characterX + 
        this.character.spriteWidth + this.character.xOffset;
        let characterTopY = characterY - this.character.yOffset; // let it overlap if it's halfway
        let characterBottomY = characterY + this.character.spriteHeight;
        // the character bottom one doesn't need an offset, just the top

        if ((characterRightX > doorLeftX && characterRightX < doorRightX) || 
                (characterLeftX < doorRightX && characterLeftX > doorLeftX)) {
            if ((characterBottomY > doorTopY && characterBottomY < doorBottomY) || 
                (characterTopY < doorBottomY && characterTopY > doorTopY)) {

                    console.log('character collision with door');
                    return true;

                }
        }
        return false;

    },

    checkExitEvents: function () {
        if (this.level.isSpecialLevel && this.levelNumber === 3) {
            if (this.blobs.length > 0) {
                console.log('too many blobs');
                this.changeSpriteState("ArrowDown", 'stop');
                this.showDialogueMessage('exit', this.character, "nervous",
                    "We should probably get rid of the blobs to protect Onorio.");
                this.disallowMovement = true;
                return true;
            }
        }
        return false;
    },

    showDialogueMessage: function (conversationType, character, moodName, text) {
        if (this.currentDialogue === null ||
            (this.currentDialogue != null && this.currentDialogue.text != text)) {
            this.allowDialogue = true;
            let newDialogue = new Dialogue(character, moodName, text, 0);
            let newDialogueArray = new Array();
            newDialogueArray.push(newDialogue);

            let newConversation = new Conversation(this.levelNumber, conversationType, newDialogueArray);
            this.currentConversation = newConversation;

            this.currentDialogue = this.currentConversation.dialogues[0];

            this.showDialogue();
        }

    },

    changeSpriteState(eventKey, action) {
        if (this.level.isSpecialLevel && this.inScene === true) {
            return;
        }

        if (this.disallowMovement === true) {
            return;
        }

        if (action === 'start') {

            // start with walking and standing
            if (eventKey == "ArrowUp") {
                this.character.currentState = 
                    this.character.walkBackward;  
                this.character.currentSpeed = 
                    this.character.walkSpeed;
                this.character.direction = 'backward';
            } else if (eventKey == "ArrowDown") {
                this.character.currentState = 
                    this.character.walkForward;  
                this.character.currentSpeed = 
                    this.character.walkSpeed;
                this.character.direction = 'forward';
            }else if (eventKey == "ArrowLeft") {
                this.character.currentState = 
                    this.character.walkLeft;  
                this.character.currentSpeed = 
                    this.character.walkSpeed;
                this.character.direction = 'left';
            }else if (eventKey == "ArrowRight") {
                this.character.currentState = 
                    this.character.walkRight;  
                this.character.currentSpeed = 
                    this.character.walkSpeed;
                this.character.direction = 'right';
            }
            //this.character.currentStateFrame = 
            //this.character.currentState.frames[1];
        //this.character.frameIndex = 1;
        } else if (action === 'stop') {
            // start with walking and standing
            if (eventKey == "ArrowUp") {
                this.character.currentState = 
                    this.character.standBackward;  
                this.character.currentSpeed = 0;
            } else if (eventKey == "ArrowDown") {
                this.character.currentState = 
                    this.character.standForward;  
                this.character.currentSpeed = 0;
            }else if (eventKey == "ArrowLeft") {
                this.character.currentState = 
                    this.character.standLeft;  
                this.character.currentSpeed = 0;
            }else if (eventKey == "ArrowRight") {
                this.character.currentState = 
                    this.character.standRight;
                this.character.currentSpeed = 0;  
            }
            this.character.currentStateFrame = 
            this.character.currentState.frames[0];
        this.character.frameIndex = 0;
        }

        // this.character.currentStateFrame = 
        //     this.character.currentState.frames[0];
        // this.character.frameIndex = 0;

    },

    continueSpriteFrames: function(character) {
        //this.character.lastFrameIndex = this.character.frameIndex;
        let animationLength = character.currentState.frames.length;
        let newIndex = character.currentStateFrame.index + 1;
        if (newIndex >= animationLength) {
            newIndex = 0;
        }

        character.currentStateFrame = character.currentState.frames[newIndex];
        //this.character.frameIndex = newIndex;
        //console.log('frame index: ' + this.character.frameIndex + 
        //'; animation length: ' + animationLength);
    },

    moveCharacter: function (character, goalX, goalY, mode) {
        // if the level hasn't started, don't move
        if (this.levelStarted === false && this.level.isSpecialLevel && this.inScene === true &&
            (this.currentAnimationInterval === null ||
                this.currentAnimationInterval.animationType != 'move')) {
            return;
        }

        if (this.showInventoryMenu) {
            return;
        }

        //console.log('moving');
        //console.log(this.character.direction);
        if (character.currentSpeed === 0 ||
            character.x === null ||
            character.y === null) { // if it's 0 just skip it all
            return;
        }
        // if goalX and goalY do not equal -1, which indicates normal movement, then
        // also snap character into place once it crosses that point
        let newPosition = [character.x, character.y];
        if (character.direction === 'forward') {
            let newY = character.y + character.currentSpeed;
            if (newY < character.yOffset) {
                newY = character.yOffset;
            } else if (newY + character.spriteHeight >
                this.context.canvas.height) {
                if (!this.inScene) {
                    newY = this.context.canvas.height - character.spriteHeight;
                }
            }
            if (goalY != -100 && newY > goalY) {
                newY = goalY;
            }
            newPosition[1] = newY;
        } else if (character.direction === 'backward') {
            let newY = character.y - character.currentSpeed;
            if (newY < character.yOffset) {
                newY = character.yOffset;
            } else if (newY >
                (this.context.canvas.height - character.spriteHeight)) {
                newY = this.context.canvas.height - character.spriteHeight;
            }
            if (goalY != -100 && newY < goalY) {
                newY = goalY;
            }
            newPosition[1] = newY;
        } else if (character.direction === 'left') {
            let newX = character.x - character.currentSpeed;
            if (newX < character.xOffset) {
                newX = character.xOffset;
            } else if (newX > this.context.canvas.width - character.xOffset) {
                newX = this.context.canvas.width - character.xOffset;
            }
            if (goalX != -100 && newX < goalX) {
                newX = goalX;
            }
            newPosition[0] = newX;
        } else if (character.direction === 'right') {
            // let maxPosition = this.context.canvas.width - this.character.spriteWidth - 
            // this.character.xOffset;
            let maxPosition = this.context.canvas.width - 46;
            // let maxPosition = 223;
            let newX = character.x + character.currentSpeed;
            if (newX < character.xOffset) {
                newX = character.xOffset;
            } else if (newX > maxPosition) {
                newX = maxPosition;
            }
            if (goalX != -100 && newX > goalX) {
                newX = goalX;
            }
            newPosition[0] = newX;
        }

        // check for tile and npc collision before bothering
        let isNpcCollision = false;
        let isMainCharacter = true;
        if (character.isNpc) {
            isMainCharacter = false;
            for (let i = 0; i < this.npcs.length; i++) {
                if (this.npcs[i].name != character.name) {
                    isNpcCollision = this.isNpcCharacterCollision(character, this.npcs[i], newPosition[0], newPosition[1]);
                    if (isNpcCollision) {
                        break;
                    }
                } else {
                    isNpcCollision = this.isNpcCharacterCollision(character, this.character, newPosition[0], newPosition[1]);
                    if (isNpcCollision) {
                        break;
                    }
                }

            }
        } else {
            for (let i = 0; i < this.npcs.length; i++) {
                isNpcCollision = this.isNpcCharacterCollision(character, this.npcs[i], newPosition[0], newPosition[1]);
                if (isNpcCollision) {
                    break;
                }
            }
        }

        if (isMainCharacter) {
            if (!this.isBlockCollision('character', newPosition[0], newPosition[1],
                character) && !isNpcCollision) {
                character.x = newPosition[0];
                character.y = newPosition[1];
                this.setCharacterRelativePositions(character);
            }
        } else {
            if (!isNpcCollision) {
                character.x = newPosition[0];
                character.y = newPosition[1];
                this.setCharacterRelativePositions(character);
            }
        }

        this.continueSpriteFrames(character);
    },

    // fill the entire board with random blocks
    fillWithBlocks: function() {
        // test
        //this.blocks[1][2] = new Block(this.tileWidth, this.tileHeight, 1, 2, 'blue');
        let rows = this.level.rows;
        if (rows < 14) {
            rows = 14;
        }
        for (let Xi = 0; Xi < this.level.columns; Xi++) {
            for (let Yi = this.spaceAtEdges; Yi < rows - this.spaceAtEdges; Yi++) {
                
                // // test
                // if (Xi != 5 && Yi != 4) {
                //     this.generateRandomBlock(Xi, Yi);
                // }

                this.generateRandomBlock(Xi, Yi);
            }
        }
    },

    // generate a random block - make sure it's not at the top of the canvas
    generateRandomBlock: function(Xi, Yi) {
        // generate a random color - use a loop until one is right
        let isValid = false;
        let block;
        do {

            let possibleColors = getTileColors(this.level);
            let chosenNumber = Math.floor(Math.random() * possibleColors.length);
            let chosenColor = possibleColors[chosenNumber];
    
            // create a block with that color
            block = this.createBlock(chosenColor, Xi, Yi);
            isValid = this.isBlockValid(block);

        } while (!isValid);

        // add to list and draw it once block is valid
        this.drawBlock(block);
        this.blocks[Xi][Yi] = block;
    },

    // check a new block to see if it has too many in a row
    isBlockValid: function(newBlock) {
        let blockInRowColorCount = this.countBlocksInRow(newBlock, null);

        // if the count is less than how many are needed for a score, it's valid
        if (blockInRowColorCount < this.level.blocksForScore) {
            return true;
        }
        return false;
    },

    // count how many blocks of one color are in a row, from a new block
    countBlocksInRow: function(newBlock, blocksInRow) { // uses recursion

        // count possible blocks around it in the same color
        let color = newBlock.color;
        let totalCount = 0;
        let coordinates = [
            [newBlock.x, newBlock.y - 1],
            [newBlock.x + 1, newBlock.y],
            [newBlock.x, newBlock.y + 1],
            [newBlock.x - 1, newBlock.y]
        ];

        // if blocksInRow is null, create new array and add 1 to the total count
        if (blocksInRow === null) {
            blocksInRow = new Array();
            blocksInRow.push(newBlock);
            totalCount++;
        }

        // loop through possible block positions
        let rows = Game.level.rows;
        if (rows < 14) {
            rows = 14;
        }
        for (let i = 0; i < coordinates.length; i++) {
            //console.log('first coordinates: ' + coordinates[i]);
            //console.log(coordinates[i][0] + ', ' + coordinates[i][1]);
            // check there's a valid block in that position, first
            if (coordinates[i][0] >= 0 && coordinates[i][0] < this.level.columns && 
                coordinates[i][1] >= 0 && coordinates[i][1] < rows) {
                    //console.log('Block: ' + this.blocks[coordinates[i][0]][coordinates[i][1]]);
                    // make sure it isn't a null block
                    if (this.blocks[coordinates[i][0]][coordinates[i][1]] != null) {
                        let compareBlock = this.blocks[coordinates[i][0]][coordinates[i][1]];
                        // now check for the same color and that it's not already in the list
                        //console.log('is contained? ' + !this.isContainedInBlockList(compareBlock, blocksInRow));
                        if (compareBlock.color === color && 
                            !this.isContainedInBlockList(compareBlock, blocksInRow)) {
                            // add block to list
                            blocksInRow.push(compareBlock);
                            // add to count
                            totalCount++;
                            // get count for that block just compared - and then add to total
                            let nextCount = this.countBlocksInRow(compareBlock, blocksInRow);
                            totalCount += nextCount;
                        }
                    }

            }
        }


        // temp
        return totalCount;
    },

    // see if there are any blocks to destroy
    destroyBlocks: function(changedBlock) {
        // get list of blocks that are the same color starting with this block
        let blockGroup = [changedBlock];
        blockGroup = this.getBlocksInRow(changedBlock, blockGroup);

        // count to make sure it has at least as many as is necessary to break them
        let neededCount = this.level.blocksForScore;

        // if it has the needed amount, clear those blocks
        if (blockGroup.length >= neededCount) {

            // start destroy animations
            for (let i = 0; i < blockGroup.length; i++) {
                this.blocks[blockGroup[i].x][blockGroup[i].y].startDestroy();
            }

            // // loop until all animations are finished
            // let isDone;
            // do {
            //     isDone = true;
            //     for (let i = 0; i < blockGroup.length; i++) {
            //         let block = this.blocks[blockGroup[i].x][blockGroup[i].y];
            //         block.destroyLoop();
            //         if (!block.isDestroyed) {
            //             isDone = false;
            //         }
            //     }
            // } while(!isDone);

            // // clear blocks
            // for (let i = 0; i < blockGroup.length; i++) {
            //     this.levelClearedBlocks.push(blockGroup[i]);
            //     this.blocks[blockGroup[i].x][blockGroup[i].y] = null;
            // }

            // // add to score too
            // this.addBlocksToScore(blockGroup);
        }
    },

    clearBlock: function(block) {
        this.levelClearedBlocks.push(block);
        this.addBlocksToScore([block]);
        this.blocks[block.x][block.y] = null;
    },

    // get list of blocks in a row starting with a block
    getBlocksInRow: function(newBlock, blocksInRow) { // uses recursion

        // count possible blocks around it in the same color
        let color = newBlock.color;
        let totalCount = 0;
        let coordinates = [
            [newBlock.x, newBlock.y - 1],
            [newBlock.x + 1, newBlock.y],
            [newBlock.x, newBlock.y + 1],
            [newBlock.x - 1, newBlock.y]
        ];

        // if blocksInRow is null, create new array and add 1 to the total count
        if (blocksInRow === null) {
            blocksInRow = new Array();
            blocksInRow.push(newBlock);
            totalCount++;
        }

        // loop through possible block positions
        let rows = Game.level.rows;
        if (rows < 14) {
            rows = 14;
        }
        for (let i = 0; i < coordinates.length; i++) {
            //console.log('first coordinates: ' + coordinates[i]);
            //console.log(coordinates[i][0] + ', ' + coordinates[i][1]);
            // check there's a valid block in that position, first
            if (coordinates[i][0] >= 0 && coordinates[i][0] < this.level.columns && 
                coordinates[i][1] >= 0 && coordinates[i][1] < rows) {
                    //console.log('Block: ' + this.blocks[coordinates[i][0]][coordinates[i][1]]);
                    // make sure it isn't a null block
                    if (this.blocks[coordinates[i][0]][coordinates[i][1]] != null) {
                        let compareBlock = this.blocks[coordinates[i][0]][coordinates[i][1]];
                        // now check for the same color and that it's not already in the list
                        //console.log('is contained? ' + !this.isContainedInBlockList(compareBlock, blocksInRow));
                        if (compareBlock.color === color && 
                            !this.isContainedInBlockList(compareBlock, blocksInRow)) {
                            // add block to list
                            blocksInRow.push(compareBlock);
                            // add to count
                            totalCount++;
                            // get count for that block just compared - and then add to total
                            let nextCount = this.getBlocksInRow(compareBlock, blocksInRow);
                            totalCount += nextCount;
                        }
                    }

            }
        }

        return blocksInRow;
    },

    isContainedInBlockList: function(block, list) {
        for (let i = 0; i < list.length; i++) {
            if (block.x === list[i].x && block.y === list[i].y) {
                return true;
            }
        }
        return false;
    },

    // create a block at a chosen position
    createBlock: function(color, Xi, Yi) {

        // create block
        let newBlock = new Block(this.tileWidth, this.tileHeight,
            Xi, Yi, color);

        // // add it to list of blocks
        // this.blocks.push(newBlock);

        // draw it on the page
        return newBlock;

    },

    drawBlock: function (block) {
        if (block.color === 'invisible') {
            return;
        }

        let x = block.x * this.tileWidth;
        let y = block.y * this.tileHeight;

        this.context.beginPath();
        this.context.fillStyle = block.hex;
        this.context.fillRect(x + 2, y + 2,
            this.tileWidth - 4, this.tileHeight - 4);

        this.context.lineWidth = "4";
        this.context.strokeStyle = block.borderHex;
        this.context.rect(x + 2, y + 2,
            this.tileWidth - 4, this.tileHeight - 4);
        this.context.stroke();
        //this.context.closePath();

        if (block.doHighlight) {
            //this.context.beginPath();
            this.context.lineWidth = "3.5";
            this.context.strokeStyle = block.highlightHex;
            this.context.rect(x, y,
                this.tileWidth, this.tileHeight);
            this.context.stroke();
        }

        // now check the destroy loop
        if (block.isDestroyed) {
            this.clearBlock(block);
        } else if (block.beingDestroyed) {
            block.destroyLoop();
        }
    },

    redrawBlocks: function() {
        // loop through blocks and redraw them
        let rows = this.level.rows;
        if (rows < 14) {
            rows = 14;
        }
        for (let Xi = 0; Xi < this.level.columns; Xi++) {
            for (let Yi = 0; Yi < rows; Yi++) {
                if (this.blocks[Xi][Yi] != null) {
                    this.drawBlock(this.blocks[Xi][Yi]);
                }
            }
        }
    },

    setCanvas: function() {
        console.log('setting canvas');
        let columns = this.level.columns;
        let rows = this.level.rows
        if (rows < 14) { // change dimensions for display reasons
            rows = 14;
            this.spaceAtEdges = 4;
        } else {
            this.spaceAtEdges = 3;
        }
        this.context.canvas.width = this.tileWidth * columns;
        this.context.canvas.height = this.tileHeight * rows;

        this.context.canvas.style.border = "2px solid #000000";
        this.drawGrid();
    },

    setCharacterRelativePositions: function(character) { // TODO test that this works right
        let x = character.x + (character.spriteHeight / 2);
        let y = character.y + (character.spriteHeight / 2);
        let divideX = Math.ceil(x / this.tileWidth) - 1;
        let divideY = Math.ceil(y / this.tileHeight) - 1;
        character.Xi = divideX;
        character.Yi = divideY;
    },

    getRelativePosition: function(x, y) {
        let Xi = Math.ceil(x / this.tileWidth) - 1;
        let Yi = Math.ceil(y / this.tileHeight) - 1;
        return [Xi, Yi];
    },

    drawCharacter: function() {

        // check the animation interval too for mood bubble, pauses, etc.
        //if (this.currentAnimationInterval != null) {
        //    this.character.checkAnimationInterval(this.currentAnimationInterval.animationType);
        //}

        let sx = this.character.currentStateFrame.startX;
        let sy = this.character.currentStateFrame.startY;

        let sw = this.character.currentStateFrame.width;
        let sh = this.character.currentStateFrame.height;

        let offX = Math.round((this.character.currentStateFrame.width - this.tileWidth) / 2);
        let offY = Math.round((this.character.currentStateFrame.height - this.tileHeight) / 2);

        let dx;
        let dy;
        if (this.character.x === null) {
            dx = Math.round(this.character.Xi * this.tileWidth - offX);
            this.character.x = dx;
        } else {
            dx = this.character.x;
        }

        if (this.character.y === null) {
            dy = Math.round(this.character.Yi * this.tileHeight - offY);
            this.character.y = dy;
        } else {
            dy = this.character.y;
        }

        let maxXPosition = 225;
        if (dx < this.character.xOffset) {
            dx = this.character.xOffset;
        } else if ((dx + sw) > this.canvas.width) {
            dx = this.canvas.width - sw;
        }

        if (dy < this.character.yOffset) { // there is space at the top of the sprite so that's why it's negative
            dy = this.character.yOffset;
        } else if ((dy + sh) > this.canvas.height) {
            dy = this.canvas.height - sh;
        }

        this.character.x = dx;
        this.character.y = dy;

        let dw = sw;
        let dh = sh;

        //dx = Math.round(dx - ((this.tileWidth - dw) / 2)); // subtract any extra pixels

        // also draw pipe if it's animating
        this.character.checkPipeAnimation();

        let image = this.character.currentStateFrame.image;
        let isLoaded = image.complete && image.naturalHeight !== 0;
        if (!isLoaded) {
            image.addEventListener('load', function() {
                Game.context.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
                Game.drawCharacterThought(Game.character, dx, dy);
            });
        } else {
                Game.context.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
                Game.drawCharacterThought(Game.character, dx, dy);
        }

        // draw pipe front if in the correct part of animation
        this.character.drawPipeFront();
        
    },

    drawNpcs: function(npcs) {
        for (let i = 0; i < npcs.length; i++) {
            this.drawNpc(npcs[i]);
        }
    },

    drawNpc: function(npc) {

        // check the animation interval too
        //if (this.currentAnimationInterval != null) {
        //    npc.checkAnimationInterval(this.currentAnimationInterval.animationType);
        //}

        let sx = npc.currentStateFrame.startX;
        let sy = npc.currentStateFrame.startY;

        let sw = npc.currentStateFrame.width;
        let sh = npc.currentStateFrame.height;

        let offX = Math.round((npc.currentStateFrame.width - this.tileWidth) / 2);
        let offY = Math.round((npc.currentStateFrame.height - this.tileHeight) / 2);

        let dx;
        let dy;
        if (npc.x === null) {
            dx = Math.round(npc.Xi * this.tileWidth - offX);
            npc.x = dx;
        } else {
            dx = npc.x;
        }

        if (npc.y === null) {
            dy = Math.round(npc.Yi * this.tileHeight - offY);
            npc.y = dy;
        } else {
            dy = npc.y;
        }

        let maxXPosition = 225;
        if (dx < npc.xOffset) {
            dx = npc.xOffset;
        } else if ((dx + sw) > this.canvas.width) {
            dx = this.canvas.width - sw;
        }

        if (dy < npc.yOffset) { // there is space at the top of the sprite so that's why it's negative
            dy = npc.yOffset;
        } else if ((dy + sh) > this.canvas.height) {
            dy = this.canvas.height - sh;
        }

        npc.x = dx;
        npc.y = dy;

        let dw = sw;
        let dh = sh;

        // also draw pipe if it's animating
        npc.checkPipeAnimation(this);

        //dx = Math.round(dx - ((this.tileWidth - dw) / 2)); // subtract any extra pixels

        let image = npc.currentStateFrame.image;
        let isLoaded = image.complete && image.naturalHeight !== 0;
        if (!isLoaded) {
            image.addEventListener('load', function() {
                Game.context.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
                Game.drawCharacterThought(npc, dx, dy);
            });
        } else {
                Game.context.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
                Game.drawCharacterThought(npc, dx, dy);
        }

        // draw pipe front if in the correct part of animation
        npc.drawPipeFront();
        
    },

    drawGrid: function() {
        this.context.beginPath();

        //     this.context.canvas.width, this.context.canvas.height);
        this.context.clearRect(0, 0, 
            this.context.canvas.width, this.context.canvas.height);

        // draw background
        this.context.fillStyle = this.canvasBackgroundColor;
        this.context.fillRect(0, 0, 
            this.context.canvas.width, this.context.canvas.height);

        // now draw grid
        //console.log('drawing grid');
        let color = this.canvasGridColor; // gray
        
        for (let Xi = 1; Xi < this.level.columns; Xi++) {
            let x = Xi * this.tileWidth;
            let yStart = 0;
            let yEnd = this.context.canvas.height;

            this.context.strokeStyle = color;
            this.context.beginPath();
            this.context.lineWidth = 1;
            this.context.moveTo(x, yStart);
            this.context.lineTo(x, yEnd);
            this.context.stroke();


        }

        let rows = this.level.rows;
        if (rows < 14) {
            rows = 14;
        }
        for (let Yi = 1; Yi < rows; Yi++) {
            let y = Yi * this.tileWidth;
            let xStart = 0;
            let xEnd = this.context.canvas.width;

            this.context.strokeStyle = color;
            this.context.beginPath();
            this.context.lineWidth = 1;
            this.context.moveTo(xStart, y);
            this.context.lineTo(xEnd, y);
            this.context.stroke();
        }

    },

    setGameArea: function() {
        let gameArea = document.getElementById('gameArea');
        let newWidth = this.context.canvas.width + 275;
        gameArea.style.width = newWidth + 'px';
        let height = this.context.canvas.height + 60;
        gameArea.style.height = height + 'px';
    },

    addBlobToScore: function(blob) {
        let multiplier = 3;
        let blobValue = 0;
        let blobColor = blob.color;
        if (blobColor === 'white') {
            console.log('white');
            blobValue = this.whiteValue * multiplier;
        } else if (blobColor === 'black') {
            blobValue = this.blackValue * multiplier;
            console.log('black');
        } else if (this.isPrimary(blobColor)) {
            blobValue = this.primaryValue * multiplier;
            console.log('primary');
        } else if (this.isSecondary(blobColor)) {
            blobValue = this.secondaryValue * multiplier;
            console.log('secondary');
        }

        // add to score
        this.levelScore += Math.round(blobValue);

        // update score
        this.updateScoreText();
    },

    addBlocksToScore: function(blocks) {
        // figure out the initial value of one block
        let blockValue = 0;
        let scoreToAdd = 0;
        let blockColor = blocks[0].color;
        console.log('block color: ' + blockColor);
        if (blockColor === 'white') {
            console.log('white');
            blockValue = this.whiteValue;
        } else if (blockColor === 'black') {
            blockValue = this.blackValue;
            console.log('black');
        } else if (this.isPrimary(blockColor)) {
            blockValue = this.primaryValue;
            console.log('primary');
        } else if (this.isSecondary(blockColor)) {
            blockValue = this.secondaryValue;
            console.log('secondary');
        }

        // loop through blocks - increase score with each block that is
        // past what is needed
        let multiplier = 1;
        for (let i = 0; i < blocks.length; i++) {
            if (i >= this.level.blocksForScore) {
                multiplier += 0.6;
            }
            scoreToAdd += blockValue * multiplier;
        }

        // add to score
        this.levelScore += Math.round(scoreToAdd);
        console.log('adding ' + Math.round(scoreToAdd));

        // update score
        this.updateScoreText();
    },

    updateScoreText: function() {
        this.scoreText.innerHTML = this.score + this.levelScore;
    },

    updateLevelText: function() {
        this.levelText.innerHTML = this.levelNumber;
    },

    isPrimary: function(color) {
        console.log('checking primary: ' + color);
        if (color === 'red' || color === 'yellow' || 
        color === 'blue') {
            console.log(true);
            return true;
        }
        console.log(false);
        return false;
    },

    isSecondary: function(color) {
        console.log('checking secondary: ' + color);
        if (color === 'orange' || color === 'green' || 
        color === 'purple') {
            console.log(true);
            return true;
        }
        console.log(false);
        return false;
    },

    createDoor: function() {
        // create new door
        this.door = new Door(this.doorColor, this.tileWidth,
            this.tileHeight, this.context.canvas.width, 
            this.context.canvas.height);
    },

    drawDoor: function() {
        this.context.beginPath();
        this.context.fillStyle = this.door.doorHex;
        this.context.fillRect(this.door.x, this.door.y,
            this.door.width, this.door.height);
    },
    
    showNextInScene: function () {

        if (this.openingScene === null) {
            return;
        }

        if (this.openingScene.animation != null &&
            this.openingScene.actionOrder[this.openingScene.actionIndex] === 'A') {
            // loop through the number of animations to do at once
            this.allowDialogue = false;
            let firstAnimation = this.openingScene.animation.animations[this.openingScene.animationIndex];
            let animationsAtOnce = firstAnimation.animationsAtOnce;
            let allComplete = true;
            for (let i = 0; i < animationsAtOnce; i++) {
                let animationIndex = firstAnimation.animationIndex + i;
                this.currentAnimationInterval = this.openingScene.animation.animations[animationIndex];
                if (!this.currentAnimationInterval.complete) {
                    allComplete = false;
                    if (this.currentAnimationInterval.animationType === 'move' &&
                        this.currentAnimationInterval.character.name != 'Harley') {
                        this.npcsMoving = true;
                    }
                    this.performAnimationInterval();
                } else {
                    if (this.currentAnimationInterval.animationType === 'move' &&
                        this.currentAnimationInterval.character.name != 'Harley') {
                        this.npcsMoving = false;
                    }
                    //this.openingScene.animationIndex++;
                    //this.openingScene.actionIndex++;
                    if (this.openingScene.animationIndex >= this.openingScene.animation.animations.length) {
                        this.openingScene.animationIndex = 0;
                    }
                    if (this.openingScene === null) {
                        this.currentAnimationInterval = null;
                    } else {
                        this.currentAnimationInterval = this.openingScene.animation.getNextInterval();
                        this.allowDialogue = true;
                    }
                }
            }
            if (allComplete) {
                this.openingScene.animationIndex += animationsAtOnce;
                this.openingScene.actionIndex += animationsAtOnce;
            }

        } else { // if it's dialogue

            if (this.currentDialogue != null && !this.currentDialogue.complete) {
                this.allowDialogue = true;
                this.showDialogue();
            }
            //else if (this.openingScene.conversation.dialogues[this.openingScene.conversationIndex].complete && 
            //    this.openingScene.conversationIndex === this.openingScene.conversation.dialogues.length - 1 &&
            //    !this.openingScene.animation.animations[this.openingScene.animationIndex].complete && 
            //    this.openingScene.actionOrder[this.openingScene.actionIndex] === 'D') {
            //    this.openingScene.actionIndex++;
            //    this.showNextInScene();
            //}
            else {
                if (this.currentDialogue === null) {
                    //this.levelStarted = true;
                    if (!this.showOpeningScene) {
                        this.openingScene.conversationIndex++;
                        this.openingScene.actionIndex++;
                    } else {
                        this.currentConversation = null;
                    }
                } else {
                    this.currentDialogue = this.currentConversation.getNextDialogue();
                }
            }
        }

        if (this.showOpeningScene === false && this.currentAnimationInterval === null && this.currentConversation === null && this.currentDialogue === null &&
            this.openingScene.animationIndex >= this.openingScene.animation.animations.length) { // for srepeat scenes
            if (this.openingScene.repeatConvoSeen) {
                console.log('scene complete');
                this.levelStarted = true;
                this.inScene = false;
                this.openingScene = null;
            } else { // if the end dialogue hasn't been seen yet
                this.currentConversation = getRepeatSceneConversation(this.levelNumber);
                this.currentDialogue = this.currentConversation.dialogues[0];
                this.showDialogue();
            }

        } else if ((this.openingScene.animation === null || this.openingScene.animation.animations === null ||
            this.openingScene.animation.animations.length === 0 ||
            this.openingScene.animation.animations[this.openingScene.animation.animations.length - 1].complete) &&
            (this.openingScene.conversation === null || this.openingScene.conversation.dialogues === null ||
                this.openingScene.conversation.dialogues.length === 0 ||
                this.openingScene.conversation.dialogues[this.openingScene.conversation.dialogues.length - 1].complete)) {
            console.log('scene complete');
            this.levelStarted = true;
            this.inScene = false;
            this.openingScene = null;
            this.showOpeningScene = false;
        }


        //if (this.currentAnimationInterval != null && !this.currentAnimationInterval.complete) {
        //    if (this.currentAnimationInterval.sceneIndex <= this.currentConversation.index) {
        //        this.allowDialogue = false;
        //        this.performAnimationInterval();
        //        if (this.currentAnimationInterval.complete) {
        //            if (this.openingScene === null) {
        //                this.currentAnimationInterval = null;
        //            } else {
        //                this.currentAnimationInterval = this.openingScene.animation.getNextInterval();
        //                this.allowDialogue = true;
        //            }
        //        }
        //    }
        //} else {
        //    if (this.currentDialogue != null && !this.currentDialogue.complete) {
        //        this.allowDialogue = true;
        //        this.showDialogue();
        //    } else {
        //        if (this.currentDialogue === null) {
        //            this.levelStarted = true;
        //            this.currentConversation = null;
        //        } else {
        //            this.currentDialogue = this.currentConversation.getNextDialogue();
        //        }
        //    } 
        //}

    },

    showDialogue: function() {
        if (this.currentDialogue != null && this.allowDialogue) {
            this.levelStarted = false;
            this.currentDialogue.drawDialogueBox(this.context);
        }
    },

    endCurrentDialogue: function () {
        this.currentDialogue.complete = true;
    },

    getNextDialogue: function () {
        this.currentDialogue.complete = true;
        if (this.currentConversation.type === 'exit') {
            this.currentDialogue = this.currentConversation.getNextDialogue();
            if (this.currentDialogue === null) {
                // add an animation that makes them walk away from the door
                let levelRows = this.level.rows;
                if (levelRows < 14) {
                    levelRows = 14;
                }
                let lastRowIndex = levelRows - 1;
                this.currentAnimationInterval = new OpeningAnimationInterval(0, 1, this.character, 'move', 'backward',
                    this.character.Xi, lastRowIndex - 1, null);
                this.performExitAnimation();
            }
        } else {
            this.currentDialogue = this.currentConversation.getNextDialogue();
            if (this.openingScene.conversationIndex >= this.openingScene.conversation.dialogues.length) {
                this.openingScene.conversationIndex++;
            }
            this.openingScene.actionIndex++;
            if (this.currentDialogue === null && this.currentAnimationInterval) {
                this.levelStarted = true;
                this.currentConversation = null;
            }
        }

    },

    performExitAnimation() {
        this.performAnimationInterval();
        if (this.currentAnimationInterval.complete) {
            this.currentAnimationInterval = null;
            this.character.goalX = -100;
            this.character.goalY = -100;
            this.levelStarted = true;
            this.inScene = false;
            this.allowDialogue = false;
            this.currentConversation = null;
            this.disallowMovement = false;
        }
    },

    setConversation: function(conversationType) {
        if (conversationType === "opening") {
            if (this.level.isSpecialLevel) {
                this.currentConversation = this.level.openingScene.conversation;
                this.currentDialogue = this.currentConversation.getDialogue();
            }
        } else {
            this.currentConversation = null;
            this.currentDialogue = null;
        }
    },

    setAnimationInterval(animationIndex) {
        if (this.level.openingScene.animation.animations != null &&
            this.level.openingScene.animation.animations.length != 0) {
            this.currentAnimationInterval = this.level.openingScene.animation.animations[animationIndex];
        }
    },

    performAnimationInterval: function() {
        this.currentAnimationInterval.continueAnimation(this);
    },

    setOpeningScene: function () {
        if (this.level.isSpecialLevel) {
            this.openingScene = this.level.openingScene;
            if (this.openingScene === null) {
                this.currentAnimationInterval = null;
                this.currentConversation = null;
                this.currentDialogue = null;
                this.inScene = false;
            } else {
                if (this.showOpeningScene) {
                    this.setConversation("opening");
                } else {
                    this.setConversation("none");
                }
                if (this.level.openingScene.animation != null) {
                    this.setAnimationInterval(0);
                }
                this.inScene = true;

                if (!this.showOpeningScene && this.openingScene.startAtEndOnReturn) {
                    let endInfo = this.openingScene.endInfo;
                    for (let i = 0; i < endInfo.length; i++) {
                        if (endInfo[i].Xi === null && endInfo[i].Yi === null) {
                            if (endInfo[i].character.isNpc) {
                                for (let n = 0; n < this.npcs.length; n++) {
                                    if (this.npcs[n].name === endInfo[i].character.name) {
                                        this.npcs.splice(n, 1);
                                        break;
                                    }
                                }
                            }
                        } else {
                            //endInfo[i].character.startXi = endInfo[i].Xi;
                            //endInfo[i].character.startYi = endInfo[i].Yi;
                            endInfo[i].character.Xi = endInfo[i].Xi;
                            endInfo[i].character.Yi = endInfo[i].Yi;
                            endInfo[i].character.x = null;
                            endInfo[i].character.y = null;
                        }
                    }
                    this.currentAnimationInterval = null;
                    this.currentConversation = null;
                    this.currentDialogue = null;
                    this.inScene = false;
                    this.openingScene = null;
                }
            }
        } else {
            this.inScene = false;
        }
    },

    //setOpeningScene: function () {
    //    if (this.level.isSpecialLevel && this.showOpeningScene) {
    //        this.openingScene = this.level.openingScene;
    //        if (this.openingScene === null) {
    //            this.currentAnimationInterval = null;
    //            this.currentConversation = null;
    //            this.currentDialogue = null;
    //            this.inScene = false;
    //        } else {
    //            this.setConversation("opening");
    //            if (this.level.openingScene.animation != null) {
    //                this.setAnimationInterval(0);
    //            }
    //            if (this.showOpeningScene) {
    //                this.inScene = true;
    //            } else {
    //                this.inScene = false;
    //            }
    //        }
    //    } else {
    //        this.inScene = false;
    //    }
    //},

    testStartConversation: function() {
        this.currentConversation = testConversation;
        this.currentDialogue = this.currentConversation.getDialogue();
    },

    testShowDialogue: function() {
        this.currentDialogue = testDialogue;
    },

    testHideDialogue: function() {
        this.currentDialogue = null;
    },

    testShowMood: function(character, dx, dy) {
        if (character.currentMood === null) {
            return;
        }

        let sx = character.currentMood.visual.startX;
        let sy = character.currentMood.visual.startY;

        let sw = character.currentMood.visual.width;
        let sh = character.currentMood.visual.height;

        let dw = sw;
        let dh = sh;

        let image = character.currentMood.visual.image;
        let isLoaded = image.complete && image.naturalHeight !== 0;
        if (!isLoaded) {
            image.addEventListener('load', function() {
                Game.context.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
            });
        } else {
                Game.context.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
        }
    },

    testDrawPipe: function() {
        //let newRelatives = this.getRelativePosition(2, 7);
        let xPos = 8 * this.tileWidth;
        let yPos = 2 * this.tileHeight;
        let image = new Image();
        image.src = "images/pipe-sprites/pipe-single1.png";

        let isLoaded = image.complete && image.naturalHeight !== 0;
        if (!isLoaded) {
            image.addEventListener('load', function () {
                Game.context.drawImage(image, 0, 0, 58, 64, xPos, yPos, 40, 44);
            });
        } else {
            Game.context.drawImage(image, 0, 0, 58, 64, xPos, yPos, 40, 44);
        }
    },


    // cheat testing methods
    skipToDoor: function() {
        let newY = this.context.canvas.height - (this.tileHeight * 3);
        this.character.y = newY;
    },

    goToLevel: function(levelNumber, showOpening) {
        this.levelNumber = levelNumber - 1;
        this.level = this.levels[levelNumber - 2];
        this.levelScore = 0;
        this.goToNextLevel(showOpening);
    },

    // TODO Implement this into the game with a button
    restartLevel: function () {
        if (this.inScene != true) {
            generateAllLevels(this.gameType);
            this.goToLevel(this.levelNumber, false);
        }
    }

}