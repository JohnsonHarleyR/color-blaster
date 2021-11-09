class Door {
    constructor(doorHex, tileWidth, tileHeight, 
        canvasWidth, canvasHeight) {
            this.doorHex = doorHex;
            this.tileWidth = tileWidth;
            this.tileHeight = tileHeight;
            this.canvasWidth = canvasWidth;
            this.canvasHeight = canvasHeight;

            this.width = this.getDoorWidth();
            this.height = this.getDoorHeight();
            this.x = this.getXPosition();
            this.y = this.getYPosition();
        }

        getDoorWidth() {
            return this.tileWidth * 2;
        }

        getDoorHeight() {
            return Math.round(this.tileHeight / 3);
        }

        getXPosition() {
            // find center of canvas
            let canvasCenter = this.canvasWidth / 2;
            // get half of door
            let halfWidth = this.width / 2;
            // subtract
            return Math.round(canvasCenter - halfWidth);
        }

        getYPosition() {
            return this.canvasHeight - this.height;
        }
}

class Vial {
    constructor(content, inventoryIndex) {
        this.content = content;
        this.inventoryIndex = inventoryIndex;
    }

    // get image information
    getImageUrl() {
        if (this.content === null) {
            return "images/empty-bottle.png";
        } else if (this.content === 'red') {
            return "images/red-bottle.png";
        } else if (this.content === 'yellow') {
            return "images/yellow-bottle.png";
        } else if (this.content === 'blue') {
            return "images/blue-bottle.png";
        }
    }
}

class RayDisplay {
    constructor(startX, startY,
        rayWidth, rayHeight, rayColor, 
        newBlockColor) {
            this.startX = startX;
            this.startY = startY;
            this.rayWidth = rayWidth;
            this.rayHeight = rayHeight;
            this.rayColor = rayColor;
            this.newBlockColor = newBlockColor;
        }
}

class Bullet {
    constructor(radius, x, y, xSpeed, ySpeed, color, mode) {
        this.radius = radius;
        this.x = x;
        this.y = y;
        this.xSpeed = xSpeed;
        this.ySpeed = ySpeed;
        this.color = color;
        this.mode = mode;
        this.hex = this.getHex(color);
        this.borderHex = this.getBorderHex(color);
    }

    getHex(color) {
        if (color === 'red') {
            return '#ff4040';
        } else if (color === 'yellow') {
            return '#fffc40';
        } else if (color === 'blue') {
            return '#408cff';
        }
    }

    getBorderHex(color) {
        if (color === 'red') {
            return '#8f0000';
        } else if (color === 'yellow') {
            return '#aba800';
        } else if (color === 'blue') {
            return '#002e73';
        }
    }

}

class BlobThoughts {
    constructor(desiredColor) {
        this.desiredColor = desiredColor;
        this.spriteWidth = 30;
        this.spriteHeight = 30;

        this.desireThought = this.getVisualByKeyword(desiredColor);
        this.happyThought = this.getVisualByKeyword('happy');
        this.sadThought = this.getVisualByKeyword('sad');

        this.currentThought = this.desireThought;
        this.showThought = true;
        this.intervalsBetweenStateChange = 5;
        this.intervalCount = 0;

        // consider adding offset info based on blob
        this.offX = 5;
        this.offY = -4;
    }

    // if 'showThought' is true, this will return an image - otherwise,
    // it will return null
    getThoughtImage() { 
        if (this.showThought) {
            return this.currentThought.image;
        } else {
            return null;
        }
    }

    changeState() { // this is for making the bubble show and disappear
        // add to interval count
        this.intervalCount++;

        // check if it's time for change
        if (this.intervalCount >= this.intervalsBetweenStateChange) {
            this.intervalCount = 0; // reset counter
            if (this.showThought === true) { // change whether to show thought
                this.showThought = false;

                // if the thought was a sad thought, change it back to desire thought
                // (this thought should only show for a second)
                if (this.currentThought === this.sadThought) {
                    this.changeCurrentThought('desire');
                }
            } else {
                this.showThought = true;
            }
        }
    }

    changeCurrentThought(keyword) {
        if (keyword === 'desire') {
            this.currentThought = this.desireThought;
        } else if (keyword === 'happy') {
            this.currentThought = this.happyThought;
            playSound('blob happy');
        } else if (keyword === 'sad') {
            this.currentThought = this.sadThought;
            playSound('blob sad');
        }
    }

    getVisualByKeyword(keyword) {
        let startX = 0;
        let startY = 0;
        let url = "images/bubbles.png";
        let index = 0;

        if (keyword === 'red') {
            startX = 0;
            startY = 0;
        } else if (keyword === 'orange') {
            startX = this.spriteWidth * 1;
            startY = 0;
        } else if (keyword === 'yellow') {
            startX = this.spriteWidth * 2;
            startY = 0;
        } else if (keyword === 'green') {
            startX = this.spriteWidth * 3;
            startY = 0;
        } else if (keyword === 'blue') {
            startX = this.spriteWidth * 4;
            startY = 0;
        } else if (keyword === 'purple') {
            startX = 0;
            startY = this.spriteHeight;
        } else if (keyword === 'white') {
            startX = this.spriteWidth * 1;
            startY = this.spriteHeight;
        } else if (keyword === 'black') {
            startX = this.spriteWidth * 2;
            startY = this.spriteHeight;
        } else if (keyword === 'happy') {
            startX = this.spriteWidth * 3;
            startY = this.spriteHeight;
        } else if (keyword === 'sad') {
            startX = this.spriteWidth * 4;
            startY = this.spriteHeight;
        }

        // return visual
        let newVisual = new Visual(url, startX, startY, 
            this.spriteWidth, this.spriteHeight, index);
        return newVisual;
    }
}

class Blob {
    constructor(Xi, Yi, speed, color, 
        desiredColor, tileWidth, tileHeight) {
        this.Xi = Xi,
        this.Yi = Yi,
        this.x = null;
        this.y = null;
        this.positionBeforeExitX = null;
        this.positionBeforeExitY = null;
        this.xOffset = 6;
        this.yOffset = -3;
        this.leftEmptyPixels = 2;
        this.rightEmptyPixels = 2;
        this.topEmptyPixels = 17;
        this.speed = speed;
        this.originalSpeed = speed;
        this.color = color;
        this.desiredColor = desiredColor;

        this.canHurtPlayer = true;

        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;

        this.spriteWidth = 24;
        this.spriteHeight = 32;

        this.backward = undefined;
        this.right = undefined;
        this.forward = undefined;
        this.left = undefined;

        this.setAnimationImages(this.color);
        this.setXYByTilePosition(Xi, Yi);

        this.frameChangeInterval = 0.5;
        this.lastTimeStamp = Date.now();
        this.secondsTowardInterval = 0;

        this.currentState = this.noDirection;
        this.currentStateFrame = this.noDirection.frames[0];
        this.lastFrameIndex = 0;

        this.thoughts = new BlobThoughts(desiredColor);

        this.direction = 'none';
        this.xSpeed = 0;
        this.ySpeed = 0;
        this.goalX = 0;
        this.goalY = 0;
        this.lessThanGoalX = true; // for movement - what to check
        this.lessThanGoalY = true; 

        this.moveChangeInterval = this.calculateMoveChangeInterval();
        this.secondsTowardMoveInterval = 0;
    }

    calculateMoveChangeInterval() {
        let interval = 1.5;
        if (this.speed === 1) {
            interval = 1.5;
        } else if (this.speed === 2) {
            interval = 1.25;
        } else if (this.speed === 3) {
            interval = 1;
        }
        return interval;
    }

    hasPassedMoveChangeInterval() {
        let newTimeStamp = Date.now();
        let timePassed = (newTimeStamp - this.lastTimeStamp) / 1000;
        this.secondsTowardMoveInterval += timePassed;

        if (this.secondsTowardMoveInterval > this.moveChangeInterval) {
            this.secondsTowardMoveInterval = 0;
            return true;
        } else {
            return false;
        }
    }

    setMoveDirection(direction, goalX, goalY) {
        this.direction = direction;
        this.goalX = goalX;
        this.goalY = goalY;
        if (direction === 'none') {
            this.xSpeed = 0;
            this.ySpeed = 0;
            //this.currentState = this.noDirection;
        } else if (direction === 'forward') {
            this.xSpeed = 0;
            this.ySpeed = this.speed;
            this.lessThanGoalY = false; // check for greater than
            this.currentState = this.forward;
            this.currentStateFrame = this.currentState.frames[this.lastFrameIndex];
        } else if (direction === 'backward') {
            this.xSpeed = 0;
            this.ySpeed = this.speed * -1;
            this.lessThanGoalY = true; // check for less than
            this.currentState = this.backward;
            this.currentStateFrame = this.currentState.frames[this.lastFrameIndex];
        } else if (direction === 'left') {
            this.xSpeed = this.speed * -1;
            this.ySpeed = 0;
            this.lessThanGoalX = true; // check for less than
            this.currentState = this.left;
            this.currentStateFrame = this.currentState.frames[this.lastFrameIndex];
        } else if (direction === 'right') {
            this.xSpeed = this.speed;
            this.ySpeed = 0;
            this.lessThanGoalX = false; // check for greater than
            this.currentState = this.right;
            this.currentStateFrame = this.currentState.frames[this.lastFrameIndex];
        } 
    }

    getNewDirectionCoordinates(direction) {
        let x;
        let y;
        if (direction === 'forward') {
            x = this.x;
            y = this.y + this.tileHeight;
        } else if (direction === 'backward') {
            x = this.x;
            y = this.y - this.tileHeight;
        } else if (direction === 'left') {
            x = this.x - this.tileWidth;
            y = this.y;
        } else if (direction === 'right'){
            x = this.x + this.tileWidth;
            y = this.y;
        } else {
            x = this.x;
            y = this.y;
        }
        return [x, y];
    }

    changeCurrentThought(keyword) {
        if (keyword === 'happy') {
            this.canHurtPlayer = false;
            this.positionBeforeExitX = this.x;
            this.positionBeforeExitY = this.y;
        }
        this.thoughts.changeCurrentThought(keyword);
    }

    hasPassedTimeInterval() {
        let newTimeStamp = Date.now();
        let timePassed = (newTimeStamp - this.lastTimeStamp) / 1000;
        this.lastTimeStamp = newTimeStamp;
        this.secondsTowardInterval += timePassed;

        if (this.secondsTowardInterval > this.frameChangeInterval) {
            this.secondsTowardInterval = 0;
            // also change blob thought state
            this.thoughts.changeState();
            return true;
        } else {
            return false;
        }
    }

    setXYByTilePosition(Xi, Yi) {
        // start figuring through multiplication
        this.x = Xi * this.tileWidth + this.xOffset;
        this.y = Yi * this.tileHeight + this.yOffset;
    }

    setAnimationImages(color) {
        // first determine x and y offset on spreadsheet
        // this will be where that color sprite begins on the sprite sheet
        let adds = this.getAnimationOffsets(color);
        let addX = adds[0];
        let addY = adds[1];
        let sheetUrl = "images/slime.png";
        
        // create animations for each direction
        this.noDirection = new SpriteAnimation('none', sheetUrl, 
        addX, addY + (2 * this.spriteHeight), 3, this.spriteWidth, this.spriteHeight);

        this.backward = new SpriteAnimation('backward', sheetUrl,
        addX, addY, 3, this.spriteWidth, this.spriteHeight);

        this.right = new SpriteAnimation('right', sheetUrl, 
        addX, addY + this.spriteHeight, 3, this.spriteWidth, this.spriteHeight);

        this.forward = new SpriteAnimation('forward', sheetUrl, 
        addX, addY + (2 * this.spriteHeight), 3, this.spriteWidth, this.spriteHeight);

        this.left = new SpriteAnimation('left', sheetUrl, 
        addX, addY + (3 * this.spriteHeight), 3, this.spriteWidth, this.spriteHeight);
        
        
    }

    getAnimationOffsets(color) {
        let offX = 0;
        let offY = 0;

        if (color === 'black') {
            offX = 0;
            offY = 0;
        } else if (color === 'blue') {
            offX = 3 * this.spriteWidth * 1;
            offY = 0;
        } else if (color === 'purple') {
            offX = 3 * this.spriteWidth * 2;
            offY = 0;
        } else if (color === 'white') {
            offX = 3 * this.spriteWidth * 3;
            offY = 0;
        } else if (color === 'red') {
            offX = 0;
            offY = 4 * this.spriteHeight;
        } else if (color === 'orange') {
            offX = 3 * this.spriteWidth * 1;
            offY = 4 * this.spriteHeight;
        } else if (color === 'yellow') {
            offX = 3 * this.spriteWidth * 2;
            offY = 4 * this.spriteHeight;
        } else if (color === 'green') {
            offX = 3 * this.spriteWidth * 3;
            offY = 4 * this.spriteHeight;
        }

        return [offX, offY];
    }

    setAddColor(bullet) {
        this.color = this.getAddResult(bullet.color, this.color);
        this.setAnimationImages(this.color);
        this.currentState = this.noDirection;
        this.lastFrameIndex = 0;
        this.currentStateFrame = this.currentState.frames[this.lastFrameIndex];

        // tODO change thought bubble and do actions potentially
        if (this.color === this.desiredColor) {
            this.changeCurrentThought('happy');
            this.thoughts.showThought = true;
            this.thoughts.intervalCount = 0;
            this.direction = 'exit';
        } else {
            this.changeCurrentThought('sad');
        }
    }

    setSubtractColor(bullet) {
        let result = this.getSubtractResult(bullet.color, this.color);
        this.color = result[0];
        this.setAnimationImages(this.color);
        this.currentState = this.noDirection;
        this.lastFrameIndex = 0;
        this.currentStateFrame = this.currentState.frames[this.lastFrameIndex];

        // tODO change thought bubble and do actions potentially
        if (this.color === this.desiredColor) {
            this.changeCurrentThought('happy');
            this.thoughts.showThought = true;
            this.thoughts.intervalCount = 0;
            this.direction = 'exit';
        } else {
            this.changeCurrentThought('sad');
        }
    }

    getHex(color) {
        if (color === 'red') {
            return '#ff4040';
        } else if (color === 'orange') {
            return '#ff9640';
        } else if (color === 'yellow') {
            return '#fffc40';
        } else if (color === 'green') {
            return '#3ae857';
        } else if (color === 'blue') {
            return '#408cff';
        } else if (color === 'purple') {
            return '#a23ae8';
        } else if (color === 'white') {
            return '#ededed';
        } else if (color === 'black') {
            return '#3b3b3b';
        }
    }

    getAddResult(color1, color2) {
        // sort an array to put strings together and get the correct result
        let sortArray = [color1, color2];
        sortArray.sort()
        let colorString = sortArray[0] + sortArray[1];
    
        if (colorString === "redred") {
            return "red";
        } else if (colorString === "orangered") {
            return "orange";
        } else if (colorString === "redyellow") {
            return "orange";
        } else if (colorString === "greenred") {
            return "black";
        } else if (colorString === "bluered") {
            return "purple";
        } else if (colorString === "purplered") {
            return "purple";
        } else if (colorString === "redwhite" || colorString === "invisiblered") {
            return "red";
        } else if (colorString === "blackred") {
            return "black";
        } else if (colorString === "orangeyellow") {
            return "orange";
        } else if (colorString === "blueorange") {
            return "black";
        } else if (colorString === "yellowyellow") {
            return "yellow";
        } else if (colorString === "greenyellow") {
            return "green";
        } else if (colorString === "blueyellow") {
            return "green";
        } else if (colorString === "purpleyellow") {
            return "black";
        } else if (colorString === "whiteyellow" || colorString === "invisibleyellow") {
            return "yellow";
        } else if (colorString === "blackyellow") {
            return "black";
        } else if (colorString === "bluegreen") {
            return "green";
        } else if (colorString === "blueblue") {
            return "blue";
        } else if (colorString === "bluepurple") {
            return "purple";
        } else if (colorString === "bluewhite" || colorString === "blueinvisible") {
            return "blue";
        } else if (colorString === "blackblue") {
            return "black";
        }
    }

    getSubtractResult(color1, color2) {
        // store the color being absorbed - which should be color 2
        let chosen = color1;
    
        // sort an array to put strings together and get the correct result
        let sortArray = [color1, color2];
        sortArray.sort()
        let colorString = sortArray[0] + sortArray[1];
    
    
        // the first instance will be the new block color,
        // the second will be the absorbed color
        let resultArray = new Array();
    
        if (colorString === "redred") {
            resultArray.push("white");
            resultArray.push("red");
        } else if (colorString === "orangered") {
            resultArray.push("yellow");
            resultArray.push("red");
        } else if (colorString === "redyellow") {
            if (chosen === "red") {
                resultArray.push("yellow");
                resultArray.push("none");
            } else {
                resultArray.push("red");
                resultArray.push("none");
            }
        } else if (colorString === "greenred") {
            resultArray.push("green");
            resultArray.push("none");
        } else if (colorString === "bluered") {
            if (chosen === "blue") {
                resultArray.push("red");
                resultArray.push("none");
            } else {
                resultArray.push("blue");
                resultArray.push("none");
            }
        } else if (colorString === "purplered") {
            resultArray.push("blue");
            resultArray.push("red");
        } else if (colorString === "redwhite") {
            resultArray.push("white");
            resultArray.push("none");
        } else if (colorString === "blackred") {
            resultArray.push("green");
            resultArray.push("red");
        } else if (colorString === "orangeyellow") {
            resultArray.push("red");
            resultArray.push("yellow");
        } else if (colorString === "blueorange") {
            resultArray.push("orange");
            resultArray.push("none");
        } else if (colorString === "yellowyellow") {
            resultArray.push("white");
            resultArray.push("yellow");
        } else if (colorString === "greenyellow") {
            resultArray.push("blue");
            resultArray.push("yellow");
        } else if (colorString === "blueyellow") {
            if (chosen === "blue") {
                resultArray.push("yellow");
                resultArray.push("none");
            } else {
                resultArray.push("blue");
                resultArray.push("none");
            }
        } else if (colorString === "purpleyellow") {
            resultArray.push("purple");
            resultArray.push("none");
        } else if (colorString === "whiteyellow") {
            resultArray.push("white");
            resultArray.push("none");
        } else if (colorString === "blackyellow") {
            resultArray.push("purple");
            resultArray.push("yellow");
        } else if (colorString === "bluegreen") {
            resultArray.push("yellow");
            resultArray.push("blue");
        } else if (colorString === "blueblue") {
            resultArray.push("white");
            resultArray.push("blue");
        } else if (colorString === "bluepurple") {
            resultArray.push("red");
            resultArray.push("blue");
        } else if (colorString === "bluewhite") {
            resultArray.push("white");
            resultArray.push("none");
        } else if (colorString === "blackblue") {
            resultArray.push("orange");
            resultArray.push("blue");
        }
    
        return resultArray;
    }
}

class Block {
    constructor(width, height, x, y, color) {
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.color = color;
        this.hex = this.getHex(color);
        this.borderHex = this.getBorderHex(color);

        this.highlightHex = "#01fe01";

        this.doHighlight = false;
        this.beingDestroyed = false;
        this.isDestroyed = false;

        this.flickerInterval = 0.1;
        this.intervalsNeeded = 3;
        this.lastTimeStamp = Date.now();
        this.secondsTowardInterval = 0;
        this.intervalsPassed = 0;
    }

    startDestroy() {
        this.doHighlight = true;
        this.beingDestroyed = true;
        this.secondsTowardInterval = 0;
        this.intervalsPassed = 0;
        this.lastTimeStamp = Date.now();
    }

    destroyLoop() {
        if (this.hasPassedTimeInterval()) {
            this.intervalsPassed++;
            // // only flicker after 3 intervals
            // if (this.intervalsPassed >= 3) {
            //     // if flicker is on turn it off and vice versa
            // if (this.doHighlight) {
            //     this.doHighlight = false;
            // } else {
            //     this.doHighlight = true;
            // }
            // }
            if (this.doHighlight) {
                this.doHighlight = false;
            } else {
                this.doHighlight = true;
            }
            
            // after enough intervals, set it to destroyed
            if (this.intervalsPassed >= this.intervalsNeeded) {
                this.isDestroyed = true;
                this.beingDestroyed = false;
                this.doHighlight = true;
            }
        }
    }

    hasPassedTimeInterval() {
        let newTimeStamp = Date.now();
        let timePassed = (newTimeStamp - this.lastTimeStamp) / 1000;
        this.lastTimeStamp = newTimeStamp;
        this.secondsTowardInterval += timePassed;

        if (this.secondsTowardInterval > this.flickerInterval) {
            this.secondsTowardInterval = 0;
            return true;
        } else {
            return false;
        }
    }

    setAddColor(bullet) {
        this.color = this.getAddResult(bullet.color, this.color);
        this.hex = this.getHex(this.color);
        this.borderHex = this.getBorderHex(this.color);
    }

    setSubtractColor(bullet) {
        let result = this.getSubtractResult(bullet.color, this.color);
        this.color = result[0];
        this.hex = this.getHex(this.color);
        this.borderHex = this.getBorderHex(this.color);
    }

    getHex(color) {
        if (color === 'red') {
            return '#ff4040';
        } else if (color === 'orange') {
            return '#ff9640';
        } else if (color === 'yellow') {
            return '#fffc40';
        } else if (color === 'green') {
            return '#3ae857';
        } else if (color === 'blue') {
            return '#408cff';
        } else if (color === 'purple') {
            return '#a23ae8';
        } else if (color === 'white' || color === 'invisible') {
            return '#ededed';
        } else if (color === 'black') {
            return '#3b3b3b';
        }
    }

    getBorderHex(color) {
        if (color === 'red') {
            return '#8f0000';
        } else if (color === 'orange') {
            return '#964400';
        } else if (color === 'yellow') {
            return '#aba800';
        } else if (color === 'green') {
            return '#007013';
        } else if (color === 'blue') {
            return '#002e73';
        } else if (color === 'purple') {
            return '#3a0061';
        } else if (color === 'white' || color === 'invisible') {
            return '#b0b0b0';
        } else if (color === 'black') {
            return '#000000';
        }
    }

    getAddResult(color1, color2) {
        // sort an array to put strings together and get the correct result
        let sortArray = [color1, color2];
        sortArray.sort()
        let colorString = sortArray[0] + sortArray[1];
    
        if (colorString === "redred") {
            return "red";
        } else if (colorString === "orangered") {
            return "orange";
        } else if (colorString === "redyellow") {
            return "orange";
        } else if (colorString === "greenred") {
            return "black";
        } else if (colorString === "bluered") {
            return "purple";
        } else if (colorString === "purplered") {
            return "purple";
        } else if (colorString === "redwhite" || colorString === "invisiblered") {
            return "red";
        } else if (colorString === "blackred") {
            return "black";
        } else if (colorString === "orangeyellow") {
            return "orange";
        } else if (colorString === "blueorange") {
            return "black";
        } else if (colorString === "yellowyellow") {
            return "yellow";
        } else if (colorString === "greenyellow") {
            return "green";
        } else if (colorString === "blueyellow") {
            return "green";
        } else if (colorString === "purpleyellow") {
            return "black";
        } else if (colorString === "whiteyellow" || colorString === "invisibleyellow") {
            return "yellow";
        } else if (colorString === "blackyellow") {
            return "black";
        } else if (colorString === "bluegreen") {
            return "green";
        } else if (colorString === "blueblue") {
            return "blue";
        } else if (colorString === "bluepurple") {
            return "purple";
        } else if (colorString === "bluewhite" || colorString === "blueinvisible") {
            return "blue";
        } else if (colorString === "blackblue") {
            return "black";
        }
    }

    getSubtractResult(color1, color2) {
        // store the color being absorbed - which should be color 2
        let chosen = color1;
    
        // sort an array to put strings together and get the correct result
        let sortArray = [color1, color2];
        sortArray.sort()
        let colorString = sortArray[0] + sortArray[1];
    
    
        // the first instance will be the new block color,
        // the second will be the absorbed color
        let resultArray = new Array();
    
        if (colorString === "redred") {
            resultArray.push("white");
            resultArray.push("red");
        } else if (colorString === "orangered") {
            resultArray.push("yellow");
            resultArray.push("red");
        } else if (colorString === "redyellow") {
            if (chosen === "red") {
                resultArray.push("yellow");
                resultArray.push("none");
            } else {
                resultArray.push("red");
                resultArray.push("none");
            }
        } else if (colorString === "greenred") {
            resultArray.push("green");
            resultArray.push("none");
        } else if (colorString === "bluered") {
            if (chosen === "blue") {
                resultArray.push("red");
                resultArray.push("none");
            } else {
                resultArray.push("blue");
                resultArray.push("none");
            }
        } else if (colorString === "purplered") {
            resultArray.push("blue");
            resultArray.push("red");
        } else if (colorString === "redwhite") {
            resultArray.push("white");
            resultArray.push("none");
        } else if (colorString === "blackred") {
            resultArray.push("green");
            resultArray.push("red");
        } else if (colorString === "orangeyellow") {
            resultArray.push("red");
            resultArray.push("yellow");
        } else if (colorString === "blueorange") {
            resultArray.push("orange");
            resultArray.push("none");
        } else if (colorString === "yellowyellow") {
            resultArray.push("white");
            resultArray.push("yellow");
        } else if (colorString === "greenyellow") {
            resultArray.push("blue");
            resultArray.push("yellow");
        } else if (colorString === "blueyellow") {
            if (chosen === "blue") {
                resultArray.push("yellow");
                resultArray.push("none");
            } else {
                resultArray.push("blue");
                resultArray.push("none");
            }
        } else if (colorString === "purpleyellow") {
            resultArray.push("purple");
            resultArray.push("none");
        } else if (colorString === "whiteyellow") {
            resultArray.push("white");
            resultArray.push("none");
        } else if (colorString === "blackyellow") {
            resultArray.push("purple");
            resultArray.push("yellow");
        } else if (colorString === "bluegreen") {
            resultArray.push("yellow");
            resultArray.push("blue");
        } else if (colorString === "blueblue") {
            resultArray.push("white");
            resultArray.push("blue");
        } else if (colorString === "bluepurple") {
            resultArray.push("red");
            resultArray.push("blue");
        } else if (colorString === "bluewhite") {
            resultArray.push("white");
            resultArray.push("none");
        } else if (colorString === "blackblue") {
            resultArray.push("orange");
            resultArray.push("blue");
        }
    
        return resultArray;
    }
}

