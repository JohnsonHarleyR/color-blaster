var LevelDesigner = {
    tileWidth: Game.tileWidth,
    tileHeight: Game.tileHeight,

    level: undefined,

    blobOrBlock: 'block',
    selectedMain: 'red',
    selectedDesired: 'orange',

    selectedVial: undefined,
    selectedVialColor: 'red',

    colorArray: ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'white', 'black'],

    CreateLevel: function() {
        this.level = new SpecialLevel(Game.level.columns, Game.level.rows,
            Game.level.blobOrBlock, Game.level.vialCount, 
            Game.level.vialColorsToFill, new Array(), new Array(), 
            new Array(), this.createMap(Game.level.columns, Game.level.rows));
        Game.level = this.level;
        this.setup();
        Game.context.canvas.addEventListener('click', LevelDesigner.addItemToCanvas);
    },

    showLevelSetup: function() {
        // show blob properties
        let blobColors = '[';
        let blobColorsString = 'var blobColors = ';
        let blobDesiredColors = '[';
        let blobDesiredColorsString = 'var blobDesiredColors = ';
        let blobSpeeds = '[';
        let blobSpeedsString = 'var blobSpeeds = ';
        // loop through blobs
        for (let i = 0; i < Game.blobs.length; i++) {
            let blob = Game.blobs[i];
            blobColors += '"' + blob.color + '"';
            blobDesiredColors += '"' + blob.desiredColor + '"';
            blobSpeeds += blob.speed;
            if (i != Game.blobs.length - 1) {
                blobColors += ', ';
                blobDesiredColors += ', ';
                blobSpeeds += ', ';
            }
        }
        // add end to strings
        blobColors += ']';
        blobDesiredColors += ']';
        blobSpeeds += ']';
        blobColorsString += blobColors + ';';
        blobDesiredColorsString += blobDesiredColors + ';';
        blobSpeedsString += blobSpeeds + ';';

        // log
        console.log(blobColorsString);
        console.log(blobDesiredColorsString);
        console.log(blobSpeedsString);

        // show the map
        LevelDesigner.updateMap();
        let mapString = 'var map = new LevelMap([\n';
        let rows = LevelDesigner.level.rows;
        if (rows < 14) {
            rows = 14;
        }
        let columns = LevelDesigner.level.columns;
        for (let y = 0; y < rows; y++) {
            let lineString = "\t["
            for (let x = 0; x < columns; x++) {
                let mapPosition = LevelDesigner.level.map.grid[y][x];
                lineString += mapPosition;
                if (x != columns - 1) {
                    lineString += ', ';
                }
            }
            lineString += ']';
            if (y != rows.length - 1) {
                lineString += ',';
            }
            lineString += '\n';
            mapString += lineString;
        }
        mapString += ']);';
        console.log(mapString);

        let vialColors = LevelDesigner.level.vialColorsToFill;
        let vialColorsString = '[';
        for (let i = 0; i < vialColors.length; i++) {
            vialColorsString += '"' + vialColors[i] + '"';
            if (i != vialColors.length - 1) {
                vialColorsString += ', ';
            }
        }
        vialColorsString += ']';

        // get blocks for score
        let blocksForScore = document.getElementById('blocksForScore').value;

        // show the level creation
        let levelString = 'var newLevel = new SpecialLevel(\n' + 
        LevelDesigner.level.columns + ', ' + LevelDesigner.level.rows + 
        ', ' + blocksForScore + ', ' +
         LevelDesigner.level.vialCount + ',\n' + 
        vialColorsString + ',\n' + blobColors + ',\n' + blobDesiredColors + ',\n' +
        blobSpeeds + ', map, null);';
        console.log(levelString);

    },

    updateMap: function() {
        // recreate the map just in case
        let mapGrid = this.createMapGrid(this.level.columns, this.level.rows);
        this.level.map.grid = mapGrid;

        // first loop through blocks
        let rows = this.level.rows;
        if (rows < 14) {
            rows = 14;
        }
        let columns = this.level.columns;
        for (let x = 0; x < columns; x++) {
            for (let y = 0; y < rows; y++) {
                let block = Game.blocks[x][y];
                if (block === null) {
                    this.level.map.grid[y][x] = 00;
                } else if (block.color === 'red') {
                    this.level.map.grid[y][x] = 01;
                } else if (block.color === 'orange') {
                    this.level.map.grid[y][x] = 02;
                } else if (block.color === 'yellow') {
                    this.level.map.grid[y][x] = 03;
                } else if (block.color === 'green') {
                    this.level.map.grid[y][x] = 04;
                } else if (block.color === 'blue') {
                    this.level.map.grid[y][x] = 05;
                } else if (block.color === 'purple') {
                    this.level.map.grid[y][x] = 06;
                } else if (block.color === 'white') {
                    this.level.map.grid[y][x] = 07;
                } else if (block.color === 'black') {
                    this.level.map.grid[y][x] = 08;
                }
            }
        }
        // now go through blobs
        for (let i = 0; i < Game.blobs.length; i++) {
            let blob = Game.blobs[i];
            // get map position and store value
            this.level.map.grid[blob.Yi][blob.Xi] = 9;
        }
    },

    createMap: function(columns, rows) {
        let grid = this.createMapGrid(columns, rows);
        let levelMap = new LevelMap(grid);
        return levelMap;
    },

    createMapGrid: function(columns, rows) {
        let mapGrid = new Array();
        if (rows < 14) {
            rows = 14;
        }
        for (let y = 0; y < rows; y++) {
            let yArray = new Array();
            for (let x = 0; x < columns; x++) {
                yArray.push(00);
            }
            mapGrid.push(yArray);
        }
        return mapGrid;
    },

    emptyCanvas: function() {
        // empty everything on canvas
        Game.blobs = new Array();
        Game.blocks = new Array();
        let rows = Game.level.rows;
        if (rows < 14) {
            rows = 14;
        }
        for (let x = 0; x < Game.level.columns; x++) {
            let yArray = new Array();
            for (let y = 0; y < rows; y++) {
                yArray.push(null);
            }
            Game.blocks.push(yArray);
        }
    },

    addItemToCanvas: function(evt) {
        Game.levelStarted = false;
        console.log('adding to canvas');
        let relativePos = LevelDesigner.getRelativeClickPos(evt);
        console.log('Relative position: ' + relativePos.x + ', ' + relativePos.y);
        // clear out square
        LevelDesigner.clearPosition(relativePos);
        // only add if the main selection is not 'none'
        if (LevelDesigner.selectedMain != 'none') {
            // add according to whether blob or block is selected
            if (LevelDesigner.blobOrBlock === 'block') {
                LevelDesigner.addBlock(relativePos);
            } else {
                LevelDesigner.addBlob(relativePos);
            }
        }

    },

    clearPosition: function(relativePos) {
        // first clear blocks at that position
        Game.blocks[relativePos.x][relativePos.y] = null;
        // now loop through blobs - if there's one at that position, clear it
        for (let i = 0; i < Game.blobs.length; i++) {
            if (Game.blobs[i].Xi === relativePos.x && 
                Game.blobs[i].Yi === relativePos.y) {
                    Game.blobs.splice(i, 1);
                    break;
                }
        }
    },

    addBlock: function(relativePos) {
        console.log('adding block');
        let newBlock = new Block(this.tileWidth, this.tileHeight, 
            relativePos.x, relativePos.y, this.selectedMain);
        Game.blocks[relativePos.x][relativePos.y] = newBlock;
    },

    addBlob: function(relativePos) {
        console.log('adding blob');
        try {
            let blobSpeed = parseInt(document.getElementById('blobSpeed').value);
            if (isNaN(blobSpeed)) {
                throw 'Error: Blob speed is not a number!';
            }
            let newBlob = new Blob(relativePos.x, relativePos.y, blobSpeed, 
                this.selectedMain, this.selectedDesired, 
                this.tileWidth, this.tileHeight);
            Game.blobs.push(newBlob);

        } catch(ex) {
            console.log(ex);
        }
    },

    getRelativeClickPos: function(evt) {
        let mousePos = this.getMousePos(Game.context.canvas, evt);
        //console.log('Mouse position: ' + mousePos.x + ', ' + mousePos.y);
        let columns = this.level.columns;
        let rows = this.level.rows;
        if (rows < 14) {
            rows = 14;
        }
        // determine x
        let xPos = 0;
        let xStart = 0;
        for (let x = 0; x < columns; x++) {
            let xEnd = xStart + this.tileWidth;
            if (mousePos.x >= xStart && mousePos.x < xEnd) {
                xPos = x;
                break;
            } else {
                xStart = xEnd;
            }
        }
        // determine y
        let yPos = 0;
        let yStart = 0;
        for (let y = 0; y < rows; y++) {
            let yEnd = yStart + this.tileHeight;
            if (mousePos.y >= yStart && mousePos.y < yEnd) {
                yPos = y;
                break;
            } else {
                yStart = yEnd;
            }
        }
        // return result
        return {
            x: xPos,
            y: yPos
        };
    },

    getMousePos: function(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
            x: Math.round((evt.clientX - rect.left) / (rect.right - rect.left) * canvas.width),
            y: Math.round((evt.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height)
        };
    },

    addVial: function() {
        LevelDesigner.level.vialCount++;
        Game.inventory.load(LevelDesigner.level);
        Game.showInventory();
        LevelDesigner.addVialListeners();
        //let selectString = 'vial' + (Game.inventory.vials.length - 1);
        //let vial = document.getElementById(selectString);
        //vial.addEventListener('click', function(){ LevelDesigner.selectVial(Game.inventory.vials.length - 1); });
    },

    removeVial: function() {
        LevelDesigner.level.vialCount--;
        if (LevelDesigner.level.vialColorsToFill.length > LevelDesigner.level.vialCount) {
            LevelDesigner.level.vialColorsToFill.splice(LevelDesigner.level.vialColorsToFill.length - 1, 1);
        }
        Game.inventory.activeVial = Game.inventory.vials[0];
        LevelDesigner.selectedVial = Game.inventory.activeVial;
        Game.inventory.load(LevelDesigner.level);
        Game.showInventory();
        LevelDesigner.addVialListeners();
    },

    selectVial: function(index) {
        // loop through all vials
        for (let i = 0; i < this.level.vialCount; i++) {
            let vial = document.getElementById('vial' + i);
            vial.className = "vial";
        }
        // now select correct element
        let vial = document.getElementById('vial' + index);
        vial.className = "vial selected";
        Game.inventory.activeVial = Game.inventory.vials[index];
        LevelDesigner.selectedVial = Game.inventory.activeVial;
    },

    addVialListeners: function() {
        for (let i = 0; i < this.level.vialCount; i++) {
            let vial = document.getElementById('vial' + i);
            vial.addEventListener('click', function(){ LevelDesigner.selectVial(i); });
        }
    },

    changeVialColor: function() {
        console.log('changing vial color');
        // change the color of the selected vial
        LevelDesigner.selectedVial.content = LevelDesigner.selectedVialColor;
        LevelDesigner.setVialColorsToFill();
        Game.inventory.load(LevelDesigner.level);
        Game.showInventory();
        LevelDesigner.addVialListeners();
    },

    setVialColorsToFill: function() {
        // create array
        let newArray = new Array();
        let vials = Game.inventory.vials;
        for (let i = 0; i < vials.length; i++) {
            if (vials[i].content != null) {
                newArray.push(vials[i].content);
            }
        }
        // set array
        LevelDesigner.level.vialColorsToFill = newArray;
    },

    setup: function() {
        this.emptyCanvas();

        // clear left of canvas to let the change things about the level
        let levelProperties = document.getElementById('inventoryDisplayDiv');
        levelProperties.innerHTML = '<div id="changeProperties">' + 
        'Columns<br><input id="levelColumns" type="text" value="' + this.level.columns + '"><br>' +
        'Rows<br><input id="levelRows" type="text" value="' + this.level.rows + '"><br>' +
        '<button id="changeDimensionsBtn">Set Dimensions</button><br>' +
        '<br><button id="showCodeBtn">Show Code</button>' +
        '<div id="inventoryDisplay"><div id="selectedVial"></div></div><br>' +
        '<button id="addVialBtn">+</button><button id="removeVialBtn">-</button><br>' +
        '<div id="redVialColor" class="color-box red selected"></div>' + 
        '<div id="yellowVialColor" class="color-box yellow"></div>' + 
        '<div id="blueVialColor" class="color-box blue"></div>' + 
        '<div id="noVialColor" class="color-box none">N</div>' + 
        '<button id="changeVialBtn">Make Color</button>' +
        '</div>';

        Game.showInventory();

        // clear side next to canvas and add select options
        let selectColors = document.getElementById('infoDisplayDiv');
        document.getElementById('moveToArea').innerHTML = selectColors.innerHTML;
        selectColors.innerHTML = '<div id="selectStuff"><div class="design selected" id="blockSelect">Block </div>' + 
        '<div class="design" id="blobSelect">Blob</div><br>' + 
        '<table><tr>' + 
        '<td>Main Color<br><div id="main-red" class="color-box red selected"></div></div><div id="main-orange" class="color-box orange"></div><div id="main-yellow" class="color-box yellow"></div><div id="main-green" class="color-box green"></div><div id="main-blue" class="color-box blue"></div><div id="main-purple" class="color-box purple"></div></div><div id="main-white" class="color-box white"></div></div><div class="color-box black" id="main-black"></div><div class="color-box none" id="main-none"><sub>N</sub></div></div></td>' +
        '<td>Desired Color<br><div id="desired-red" class="color-box red"></div><div id="desired-orange" class="color-box orange selected"></div><div id="desired-yellow" class="color-box yellow"></div></div><div id="desired-green" class="color-box green"></div></div><div id="desired-blue" class="color-box blue"></div></div><div id="desired-purple" class="color-box purple"></div></div><div id="desired-white" class="color-box white"></div></div><div id="desired-black" class="color-box black"></div></div></td>' +
        '</tr></table>' + 
        'Blob Speed<br><input id="blobSpeed" type="text" value="' + this.level.maxBlobSpeed + '"><br>' + 
        'Blocks for Score<br><input id="blocksForScore" type="text" value="3"></div>';

        // add event listeners.
        this.addVialListeners();
        document.getElementById('redVialColor').addEventListener('click', function() { 
            document.getElementById('redVialColor').className = "color-box red selected";
            document.getElementById('yellowVialColor').className = "color-box yellow";
            document.getElementById('blueVialColor').className = "color-box blue";
            document.getElementById('noVialColor').className = "color-box none";
            LevelDesigner.selectedVialColor = 'red';
        });
        document.getElementById('yellowVialColor').addEventListener('click', function() { 
            document.getElementById('redVialColor').className = "color-box red";
            document.getElementById('yellowVialColor').className = "color-box yellow selected";
            document.getElementById('blueVialColor').className = "color-box blue";
            document.getElementById('noVialColor').className = "color-box none";
            LevelDesigner.selectedVialColor = 'yellow';
        });
        document.getElementById('blueVialColor').addEventListener('click', function() { 
            document.getElementById('redVialColor').className = "color-box red";
            document.getElementById('yellowVialColor').className = "color-box yellow";
            document.getElementById('blueVialColor').className = "color-box blue selected";
            document.getElementById('noVialColor').className = "color-box none";
            LevelDesigner.selectedVialColor = 'blue';
        });
        document.getElementById('noVialColor').addEventListener('click', function() { 
            document.getElementById('redVialColor').className = "color-box red";
            document.getElementById('yellowVialColor').className = "color-box yellow";
            document.getElementById('blueVialColor').className = "color-box blue";
            document.getElementById('noVialColor').className = "color-box none selected";
            LevelDesigner.selectedVialColor = null;
        });
        document.getElementById('changeVialBtn').addEventListener('click', LevelDesigner.changeVialColor);
        document.getElementById('addVialBtn').addEventListener('click', LevelDesigner.addVial);
        document.getElementById('removeVialBtn').addEventListener('click', LevelDesigner.removeVial);
        document.getElementById('showCodeBtn').addEventListener('click', LevelDesigner.showLevelSetup);
        document.getElementById('changeDimensionsBtn').addEventListener('click', function(){
            try {
                console.log('setting dimensions');
                let columnInput = document.getElementById('levelColumns');
                let rowInput = document.getElementById('levelRows');
                let columns = parseInt(columnInput.value);
                if (isNaN(columns)) {
                    throw 'Error: Column input is not a number!';
                }
                let rows = parseInt(rowInput.value);
                if (isNaN(rows)) {
                    throw 'Error: Row input is not a number!';
                }
                LevelDesigner.level.columns = columns;
                LevelDesigner.level.rows = rows;
                LevelDesigner.emptyCanvas();
                Game.setCanvas();
                Game.createDoor();
            } catch (ex) {
                console.log(ex);
            }
        });
        document.getElementById('blockSelect').addEventListener('click', function() { LevelDesigner.changeBlockOrBlob('block'); })
        document.getElementById('blobSelect').addEventListener('click', function() { LevelDesigner.changeBlockOrBlob('blob'); })
        for (let i = 0; i <= this.colorArray.length; i++) {
            let color;
            if (i === this.colorArray.length) {
                color = 'none';
            } else {
                color = this.colorArray[i];
            }
            let main = document.getElementById('main-' + color);
            main.addEventListener('click', function() { 
                // loop through all main colors and deselect them
                for (let i = 0; i < LevelDesigner.colorArray.length; i++) {
                    let item = document.getElementById('main-' + LevelDesigner.colorArray[i]);
                    item.className = "color-box " + LevelDesigner.colorArray[i];
                    //item.addEventListener('click', function() { LevelDesigner.selectMainColor(LevelDesigner.colorArray[i]); });
                }
                document.getElementById('main-none').className = "color-box none";
                // now select correct element
                LevelDesigner.selectedMain = color;
                let item = document.getElementById('main-' + color);
                item.className = "color-box " + color + " selected";    
            });
            if (i != this.colorArray.length) {
                let desired = document.getElementById('desired-' + color);
                desired.addEventListener('click', function() { 
                    // loop through all main colors and deselect them
                    for (let i = 0; i < LevelDesigner.colorArray.length; i++) {
                        let item = document.getElementById('desired-' + LevelDesigner.colorArray[i]);
                        item.className = "color-box " + LevelDesigner.colorArray[i];
                        //item.addEventListener('click', function() { LevelDesigner.selectMainColor(LevelDesigner.colorArray[i]); });
                    }
                    // now select correct element
                    LevelDesigner.selectedDesired = color;
                    let item = document.getElementById('desired-' + color);
                    item.className = "color-box " + color + " selected";    
                });
            }
            
        }

    },

    changeBlockOrBlob: function(whichOne) {
        if (whichOne === 'block') {
            document.getElementById('blockSelect').className = "design selected";
            document.getElementById('blobSelect').className = "design";
            this.blobOrBlock = "block";
        } else {
            document.getElementById('blockSelect').className = "design";
            document.getElementById('blobSelect').className = "design selected";
            this.blobOrBlock = "blob";
        }
    },

    selectMainColor: function(color) {
        // loop through all main colors and deselect them
        for (let i = 0; i < this.colorArray.length; i++) {
            let item = document.getElementById('main-' + this.colorArray[i]);
            item.className = "color-box " + this.colorArray[i];
            //item.addEventListener('click', function() { LevelDesigner.selectMainColor(LevelDesigner.colorArray[i]); });
        }
        // now select correct element
        this.selectMainColor = color;
        let item = document.getElementById('main-' + color);
        item.className = "color-box " + color + " selected";
    },

    selectDesiredColor: function(color) {
        // loop through all main colors and deselect them
        for (let i = 0; i < this.colorArray.length; i++) {
            let item = document.getElementById('desired-' + this.colorArray[i]);
            item.className = "color-box " + this.colorArray[i];
            //item.addEventListener('click', function() { LevelDesigner.selectDesiredColor(LevelDesigner.colorArray[i]); });
        }

        // now select correct element
        this.selectDesiredColor = color;
        let item = document.getElementById('desired-' + color);
        item.className = "color-box " + color + " selected";
    }

}