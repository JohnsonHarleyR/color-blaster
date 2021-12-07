function getCharacterByName(name) {
    if (name === "Harley") {
        return MainCharacter;
    } else if (name === "Sarah") {
        return Sarah;
    } else if (name === "George") {
        return George;
    } else if (name === "Onorio") {
        return Onorio;
    }
}

class Visual {
    constructor(url, startX, startY, width, height, index) {
        this.url = url;
        this.startX = startX;
        this.startY = startY;
        this.width = width;
        this.height = height;
        this.image = new Image();
        this.image.src = url;
        this.index = index;
    }
}

class SpriteAnimation {
    constructor(name, sheetUrl, startX, startY, numberOfFrames,
         spriteWidth, spriteHeight) {
        this.name = name;
        this.frames = new Array();
        this.addFrames(sheetUrl, startX, startY, numberOfFrames,
            spriteWidth, spriteHeight);
    }

    addFrames(sheetUrl, startX, startY, numberOfFrames,
        spriteWidth, spriteHeight) {
        let currentX = startX;
        let currentY = startY;
        for (let i = 0; i < numberOfFrames; i++) {
            this.frames.push(
                new Visual(sheetUrl, currentX, currentY,
                     spriteWidth, spriteHeight, i)
            );
            currentX += spriteWidth;
        }
    }

}

// TODO make animation for both entering AND coming out of pipe

class Pipe { // for a particular character animation
    constructor() { // TODO allow position to be defined in constructor
        this.Xi = 0;
        this.Yi = 0;

        this.state = 0; // 0 is invisible, 1 is growing up, 2 is growing down, 3 is fully grown
        this.isGrown = false;
        this.showPipe = false;

        this.sheetUrl = "images/pipe-sprites/pipe-grow.png";
        this.pipeFrontUrl = "images/pipe-sprites/pipe-front-animate.png"
        this.spriteWidth = 58;
        this.spriteHeight = 64;

        this.displayWidth = 42;
        this.displayHeight = 44;

        this.xOffset = 0;
        this.yOffset = 10;

        this.tileWidth = 35; // TODO: Make this consistent with game canvas
        this.tileHeight = 35;

        this.pipeBottomX = 0;

        this.dx = 0;
        this.dy = 0;

        this.noPipe = new SpriteAnimation('noPipe', this.sheetUrl,
            0, 0, 1, this.spriteWidth, this.spriteHeight);

        this.growingUpPipe = new SpriteAnimation('growingUpPipe', this.sheetUrl,
            this.spriteWidth, 0, 6, this.spriteWidth, this.spriteHeight);

        this.growingDownPipe = new SpriteAnimation('growingDownPipe', this.sheetUrl,
            0, this.spriteHeight, 6, this.spriteWidth, this.spriteHeight);

        this.grownPipe = new SpriteAnimation('grownPipe', this.sheetUrl,
            0, this.spriteHeight, 1, this.spriteWidth, this.spriteHeight);

        this.animateFrontPipe = new SpriteAnimation('animateFrontPipe', this.pipeFrontUrl,
            0, 0, 1, this.spriteWidth, this.spriteHeight);


        this.animationChangeInterval = 0.2;
        this.lastTimeStamp = Date.now();
        this.secondsTowardInterval = 0;

        // this.currentState = this.standForward;
        // this.currentStateFrame = this.standForward.frames[0];
        // this.frameIndex = 0;
        this.currentState = this.noPipe;
        this.currentStateFrame = this.noPipe.frames[0];
        this.lastFrameIndex = 0;
    }

    drawPipe() {
        // only draw if show pipe is true
        if (this.showPipe === true) {

            // now check the animationInterval
            this.checkAnimationInterval();

            // draw the pipe
            this.dx = this.Xi * this.tileWidth + this.xOffset;
            this.dy = this.Yi * this.tileHeight + this.yOffset;

            let image = this.currentStateFrame.image;

            let isLoaded = image.complete && image.naturalHeight !== 0;
            if (!isLoaded) {
                image.addEventListener('load', function () {
                    Game.context.drawImage(image, this.currentStateFrame.startX, this.currentStateFrame.startY,
                        this.spriteWidth, this.spriteHeight, this.dx, this.dy, this.displayWidth, this.displayHeight);
                });
            } else {
                Game.context.drawImage(image, this.currentStateFrame.startX, this.currentStateFrame.startY,
                    this.spriteWidth, this.spriteHeight, this.dx, this.dy, this.displayWidth, this.displayHeight);
            }

            this.pipeBottomX = this.dy + this.displayHeight;

        }
    }

    drawPipeFront() {
        // only draw if show pipe is true
        if (this.showPipe === true) {

            // draw the pipe front
            this.dx = this.Xi * this.tileWidth + this.xOffset;
            this.dy = this.Yi * this.tileHeight + this.yOffset;

            let image = this.animateFrontPipe.frames[0].image;

            let isLoaded = image.complete && image.naturalHeight !== 0;
            if (!isLoaded) {
                image.addEventListener('load', function () {
                    Game.context.drawImage(image, this.dx, this.dy, this.displayWidth, this.displayHeight);
                });
            } else {
                Game.context.drawImage(image, this.dx, this.dy, this.displayWidth, this.displayHeight);
            }

        }
    }

    checkAnimationInterval() {
        let newTimeStamp = Date.now();
        let timePassed = (newTimeStamp - this.lastTimeStamp) / 1000;
        this.lastTimeStamp = newTimeStamp;
        this.secondsTowardInterval += timePassed;

        if (this.secondsTowardInterval > this.animationChangeInterval) {
            this.secondsTowardInterval = 0;

            // go to next frame in animation - change state, depending
            if (this.currentState === this.growingUpPipe ||
                this.currentState === this.growingDownPipe) {

                // increment index
                this.lastFrameIndex++;

                // check that it's not too far
                if (this.lastFrameIndex >= this.currentState.frames.length) {

                    // if it is, then set it to 0 and change the current state to either grown or none
                    this.lastFrameIndex = 0;

                    if (this.currentState == this.growingUpPipe) {
                        this.setAsGrown();

                    } else if (this.currentState = this.growingDownPipe) {
                        this.setAsNone();
                        this.showPipe = false;
                        // TODO also remove character from scene?
                    }

                }

                // set current state frame.
                this.currentStateFrame = this.currentState.frames[this.lastFrameIndex];
            }
        }

    }

    resetInterval() {
        this.lastTimeStamp = Date.now();
        this.secondsTowardInterval = 0;
    }

    setAsGrown() {
        this.currentState = this.grownPipe;
        this.currentStateFrame = this.grownPipe.frames[0];
        this.isGrown = true;
    }

    setAsGrowingUp() {
        this.showPipe = true;
        this.currentState = this.growingUpPipe;
        this.currentStateFrame = this.growingUpPipe.frames[0];
    }

    setAsGrowingDown() {
        this.currentState = this.growingDownPipe;
        this.currentStateFrame = this.growingDownPipe.frames[0];
        this.isGrown = false;
    }

    setAsNone() {
        this.currentState = this.noPipe;
        this.currentStateFrame = this.noPipe.frames[0];
    }
}

class Mood {
    constructor(name, visual) {
        this.name = name;
        this.visual = visual;
    }
}

class FaceSet {
    constructor(name, sheetUrl) {
       this.name = name;
       this.frames = new Array();
       this.startX = 0;
       this.startY = 0;
       this.framesPerRow = 4;
       this.rows = 2;
       this.spriteWidth = 210;
       this.spriteHeight = 210;

       this.normal = undefined;
       this.happy = undefined;
       this.laugh = undefined;
       this.surprised = undefined;
       this.sad = undefined;
       this.nervous = undefined;
       this.angry = undefined;
       this.flirty = undefined;

       this.nameArray = ["normal", "happy", "laugh", "surprised", 
        "sad", "nervous", "angry", "flirty"];

       this.addFrames(sheetUrl, this.startX, this.startY, this.framesPerRow,
           this.rows, this.spriteWidth, this.spriteHeight);

       this.setMoods();

       this.defineArray = [this.normal, this.happy, this.laugh, this.surprised,
        this.sad, this.nervous, this.angry, this.upset];
   }

   getMood(moodName) {
    for (let i = 0; i < this.nameArray.length; i++) {
        if (moodName === this.nameArray[i]) {
            return this.defineArray[i];
        }
    }
    return null;
   }

   setMoods() {
    for (let i = 0; i < this.nameArray.length; i++) {
        let moodName = this.nameArray[i];
        let newMood = new Mood(this.nameArray[i], this.frames[i]);
        if (moodName === 'normal') {
            this.normal = newMood;
        } else if (moodName === 'happy') {
            this.happy = newMood;
        } else if (moodName === 'laugh') {
            this.laugh = newMood;
        } else if (moodName === 'surprised') {
            this.surprised = newMood;
        } else if (moodName === 'sad') {
            this.sad = newMood;
        } else if (moodName === 'nervous') {
            this.nervous = newMood;
        } else if (moodName === 'angry') {
            this.angry = newMood;
        } else if (moodName === 'flirty') {
            this.upset = newMood;
        }
    }
   }

   addFrames(sheetUrl, startX, startY, framesPerRow,
       rows, spriteWidth, spriteHeight) {
       let currentX = startX;
       let currentY = startY;
       for (let r = 0; r < rows; r++) {
            for (let i = 0; i < framesPerRow; i++) {
                this.frames.push(
                    new Visual(sheetUrl, currentX, currentY,
                            spriteWidth, spriteHeight, i)
                );
                currentX += spriteWidth;
            }
            currentX = 0;
            currentY += spriteHeight;
       }  
   }
}

class Thoughts {
    constructor() {
        this.spriteWidth = 30;
        this.spriteHeight = 30;

        this.thinking = this.getVisualByKeyword('thinking');
        this.exclamation = this.getVisualByKeyword('exclamation');
        this.question = this.getVisualByKeyword('question');
        this.heart = this.getVisualByKeyword('heart');
        this.frown = this.getVisualByKeyword('frown');

        this.currentThought = null;
        this.intervalsBetweenStateChange = 3;
        this.intervalCount = 0;

        // consider adding offset info based on character
        this.offX = 35;
        this.offY = 4;
    }

    // if 'showThought' is true, this will return an image - otherwise,
    // it will return null
    getThoughtImage() { 
        if (this.currentThought != null) {
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
            this.currentThought = null;
        }
    }

    changeCurrentThought(keyword) {
        if (keyword === 'thinking') {
            this.currentThought = this.thinking;
        } else if (keyword === 'exclamation') {
            this.currentThought = this.exclamation;
        } else if (keyword === 'question') {
            this.currentThought = this.question;
        } else if (keyword === 'heart') {
            this.currentThought = this.heart;
        } else if (keyword === 'frown') {
            this.currentThought = this.frown;
        } else if (keyword === null) {
            this.currentThought = null;
        }
    }

    getVisualByKeyword(keyword) {
        let startX = this.spriteWidth;
        let startY = this.spriteHeight;
        let url = "images/bubbles2.png";
        let index = 0;

        if (keyword === 'thinking') {
            startX = 0;
        } else if (keyword === 'question') {
            startX = this.spriteWidth;
        } else if (keyword === 'exclamation') {
            startX = this.spriteWidth * 2;
        } else if (keyword === 'heart') {
            startX = this.spriteWidth * 3;
        } else if (keyword === 'frown') {
            startX = this.spriteWidth * 4;
        }

        // return visual
        let newVisual = new Visual(url, startX, startY, 
            this.spriteWidth, this.spriteHeight, index);
        return newVisual;
    }
}

class Character {
    constructor(lives, startXi, startYi, spriteWidth, spriteHeight, 
        sheetUrl, faceSetUrl, walkSpeed, name, species, isNpc) {
            this.lives = lives;
            this.startXi = startXi;
            this.startYi = startYi;
            this.Xi = startXi;
            this.Yi = startYi;
            this.x = null;
            this.y = null;
            this.xOffset = -18;
            this.yOffset = -5;
            this.spriteWidth = spriteWidth;
            this.spriteHeight = spriteHeight;
            this.sheetUrl = sheetUrl;
            this.faceSetUrl = faceSetUrl;
            this.walkSpeed = walkSpeed;
            this.currentSpeed = 0;
            this.direction = 'forward';
            this.name = name;
            this.species = species;
        this.isNpc = isNpc;

        this.animatingPipe = false; // RESET ALL THIS AFTER FINISHING PIPE ANIMATION
        this.isJumping = false;
        this.isPastPeak = false;
        this.isDoneJumping = false;
        this.isDownPipe = false;
        this.allowDownAnimation = false;
        this.downPipeExtraFrame = 0;
        this.peakY = 0;
        this.jumpStartX = 0;
        this.jumpStartY = 0;
        this.isFinishedWithPipe = false;

        this.pipe = new Pipe();

            this.goalX = -100;
            this.goalY = -100;

            this.thoughts = new Thoughts();

            this.faceSet = new FaceSet(this.name, this.faceSetUrl);
            this.currentMood = null;
            
            this.standBackward = new SpriteAnimation('standBackward', this.sheetUrl, 
            0, (8 * this.spriteHeight), 1, this.spriteWidth, this.spriteHeight);

            this.standLeft = new SpriteAnimation('standLeft', this.sheetUrl, 
            0, (9 * this.spriteHeight), 1, this.spriteWidth, this.spriteHeight);

            this.standForward = new SpriteAnimation('standForward', this.sheetUrl,
            0, (10 * this.spriteHeight), 1, this.spriteWidth, this.spriteHeight);

            this.standRight = new SpriteAnimation('standRight', this.sheetUrl, 
            0, (11 * this.spriteHeight), 1, this.spriteWidth, this.spriteHeight);
            

            this.walkBackward = new SpriteAnimation('walkBackward', this.sheetUrl, 
            0, (8 * this.spriteHeight), 9, this.spriteWidth, this.spriteHeight);

            this.walkLeft = new SpriteAnimation('walkLeft', this.sheetUrl, 
            0, (9 * this.spriteHeight), 9, this.spriteWidth, this.spriteHeight);

            this.walkForward = new SpriteAnimation('walkForward', this.sheetUrl, 
            0, (10 * this.spriteHeight), 9, this.spriteWidth, this.spriteHeight);

            this.walkRight = new SpriteAnimation('walkRight', this.sheetUrl, 
            0, (11 * this.spriteHeight), 9, this.spriteWidth, this.spriteHeight);
        

            this.shootBackward = new SpriteAnimation('shootBackward', this.sheetUrl, 
            0, (17 * this.spriteHeight), 13, this.spriteWidth, this.spriteHeight);

            this.shootLeft = new SpriteAnimation('shootLeft', this.sheetUrl, 
            0, (18 * this.spriteHeight), 13, this.spriteWidth, this.spriteHeight);

            this.shootForward = new SpriteAnimation('shootForward', this.sheetUrl, 
            0, (19 * this.spriteHeight), 13, this.spriteWidth, this.spriteHeight);

            this.shootRight = new SpriteAnimation('shootRight', this.sheetUrl, 
            0, (20 * this.spriteHeight), 13, this.spriteWidth, this.spriteHeight);
            

            this.collapse = new SpriteAnimation('collapse', this.sheetUrl, 
                0, (21 * this.spriteHeight), 6, this.spriteWidth, this.spriteHeight);



        this.marioLeft = new SpriteAnimation('marioLeft', this.sheetUrl,
            (6 * this.spriteWidth), (13 * this.spriteHeight), 1, this.spriteWidth, this.spriteHeight);

        this.marioRight = new SpriteAnimation('marioRight', this.sheetUrl,
            (6 * this.spriteWidth), (15 * this.spriteHeight), 1, this.spriteWidth, this.spriteHeight);

        this.disappear = new SpriteAnimation('disappear', this.sheetUrl,
            (7 * this.spriteWidth), (15 * this.spriteHeight), 1, this.spriteWidth, this.spriteHeight);
        
            this.animationChangeInterval = 0.5;
            this.lastTimeStamp = Date.now();
            this.secondsTowardInterval = 0;

            // this.currentState = this.standForward;
            // this.currentStateFrame = this.standForward.frames[0];
            // this.frameIndex = 0;
            this.currentState = this.standForward;
            this.currentStateFrame = this.standForward.frames[0];
            this.lastFrameIndex = 0;
            //this.frameIndex = 0;

    }

    checkPipeAnimation(game) {
        if (this.animatingPipe) {
            // show pipe
            this.pipe.drawPipe();

            // check pipe state - start jumping after pipe is grown
            if (this.pipe.isGrown) {
                if (this.isJumping == false) {
                    // set state to jumping.
                    if (this.currentState === this.standRight) {
                        this.isJumping = true;
                        this.setState('marioRight');
                        this.jumpStartX = this.x;
                        this.jumpStartY = this.y;
                    }
                }

                // if state is jumping and they're not beyond the peak, set new position
                if (this.isJumping) {
                    let addX = 2;
                    let subtractY = 6;

                    // determine end x mark
                    let pipeCenterX = this.pipe.dx + (this.pipe.spriteWidth / 2) - (this.spriteWidth / 2 + 6);
                    let jumpPeakX = ((pipeCenterX - this.jumpStartX) / 2) + this.jumpStartX;

                    // check if it's now past peak
                    if (!this.isPastPeak) {
                        if ((this.currentState == this.marioRight && this.x >= jumpPeakX) || 
                            (this.currentState == this.marioLeft && this.x <= jumpPeakX)) {
                            this.isPastPeak = true;
                            this.x = jumpPeakX;
                            this.peakY = this.y;
                        } 
                    }

                    if (this.isPastPeak) { // once the character is past the peak jumping point

                        if (this.y > this.peakY + 8) { // for animation purposes
                            this.currentStateFrame = this.standForward.frames[0];
                        }

                        if (((this.currentState == this.marioRight && this.x >= pipeCenterX) ||
                            (this.currentState == this.marioLeft && this.x <= pipeCenterX)) && 
                            !this.isDoneJumping) {
                            // THE MOMENT THE CHARACTER IS LANDING IN THE PIPE
                            this.isDoneJumping = true;
                            this.x = pipeCenterX;
                            //
                            addX = 0;
                            subtractY = 0;

                        } else {
                            // if it's done jumping, make the character go downward
                            if (this.isDoneJumping) {

                                // if the character's feet are the same as the bottom of the pipe, make the character disappear
                                if (this.y + this.spriteHeight >= this.pipe.pipeBottomX - 2 &&
                                    this.downPipeExtraFrame === 0) {
                                    addX = 0;
                                    subtractY = 0;
                                    this.setState('disappear');
                                    this.x = this.jumpStartX;
                                    this.y = this.jumpStartY;

                                    // reset most of it
                                    //this.animatingPipe = false; // RESET ALL THIS AFTER FINISHING PIPE ANIMATION
                                    this.isJumping = false;
                                    //this.isPastPeak = false;
                                    //this.isDoneJumping = false;
                                    this.isDownPipe = true;
                                    this.peakY = 0;
                                    this.jumpStartX = 0;
                                    this.jumpStartY = 0;
                                    

                                } else {
                                    addX = 0;
                                    subtractY = -5;
                                }

                                if (this.isDownPipe) {
                                    if (this.downPipeExtraFrame === 1) {
                                        // start animating the pipe to go down
                                        this.pipe.setAsGrowingDown();
                                        this.downPipeExtraFrame = 0;
                                    } else {
                                        this.downPipeExtraFrame = 1;
                                    }
                                }
                                
                            } else {
                                subtractY = subtractY * -1;
                            }
                        }
                        
                        
                    }


                    if (this.currentState === this.marioLeft) {
                        addX = addX * -1;
                    }
                    // change the position
                    this.x += addX;
                    this.y -= subtractY;
                }
            }

            if (this.downPipeExtraFrame === 1 && this.allowDownAnimation === true) {
                // start animating the pipe to go down
                this.pipe.setAsGrowingDown();
                this.downPipeExtraFrame = 0;
            } else if (this.downPipeExtraFrame === 1) {
                this.allowDownAnimation = true;
            }

            if (this.animatingPipe && this.isDownPipe && !this.pipe.showPipe) {
                this.animatingPipe = false;
                this.isDownPipe = false;
                this.isDoneJumping = false;
                this.isFinishedWithPipe = true;
                this.isPastPeak = false;
                this.allowDownAnimation = false;
                console.log('finished with pipe animation');

                // also, if this is an npc, then remove them from NPCs
                if (this.isNpc) {
                    let npcIndex = null;
                    for (let i = 0; i < game.npcs.length; i++) {
                        if (game.npcs[i].name === this.name) {
                            npcIndex = i;
                            break;
                        }
                    }
                    if (npcIndex != null) {
                        game.npcs.splice(npcIndex, 1);
                    }
                }
            }
        }
        
    }

    drawPipeFront() {
        if (this.animatingPipe && this.pipe.currentState == this.pipe.grownPipe && this.isPastPeak) {
            this.pipe.drawPipeFront();
        }
    }

    canJumpRight(game) {
        // don't let it be too close to the top
        if (this.Yi < 2) {
            return false;
        }

        // make sure character isn't too close to edge
        if (this.Xi >= game.level.columns - 1) {
            return false;
        }

        // check the tile right of the character and also right then up one - check all blocks and blobs
        for (let i = 0; i < game.blobs.length; i++) {
            let checkX = this.Xi + 1;
            let checkY = this.Yi;

            if (game.blobs[i].Xi === checkX && game.blobs[i].Yi === checkY) {
                return false;
            }

            checkY++;
            if (game.blobs[i].Xi === checkX && game.blobs[i].Yi === checkY) {
                return false;
            }
            //checkY++;
            //checkY++;
            //if (game.blobs[i].Xi === checkX && game.blobs[i].Yi === checkY) {
            //    return false;
            //}
        }

        // now check blocks
        let rows = game.level.rows;
        if (rows < 14) {
            rows = 14;
        }
        for (let x = 0; x < game.level.columns; x++) {
            for (let y = 0; y < rows; y++) {
                let checkX = this.Xi + 1;
                let checkY = this.Yi;

                if (game.blocks[x][y] != null && game.blocks[x][y].x === checkX && game.blocks[x][y].y === checkY) {
                    return false;
                }

                checkY++;
                if (game.blocks[x][y] != null && game.blocks[x][y].x === checkX && game.blocks[x][y].y === checkY) {
                    return false;
                }

                //checkY++;
                //checkY++;
                //if (game.blocks[x][y] != null && game.blocks[x][y].Xi === checkX && game.blocks[x][y].Yi === checkY) {
                //    return false;
                //}

            }
        }

        // also check npcs
        for (let i = 0; i < game.npcs.length; i++) {
            let checkX = this.Xi + 1;
            let checkY = this.Yi;

            if (game.npcs[i].name === this.name) {
                continue;
            }

            if ((game.npcs[i].Xi === checkX && game.npcs[i].Yi === checkY) || 
                (game.npcs[i].Xi === checkX && game.npcs[i].Yi - 1 === checkY)) {
                return false;
            }

            checkY++;
            if ((game.npcs[i].Xi === checkX && game.npcs[i].Yi === checkY) ||
                (game.npcs[i].Xi === checkX && game.npcs[i].Yi - 1 === checkY)) {
                return false;
            }

            //checkY++;
            //checkY++;
            //if ((game.npcs[i].Xi === checkX && game.npcs[i].Yi === checkY) ||
            //    (game.npcs[i].Xi === checkX && game.npcs[i].Yi - 1 === checkY)) {
            //    return false;
            //}
        }


        // if it's an npc, check for main character collision too
        if (this.isNpc) {
            let checkX = this.Xi + 1;
            let checkY = this.Yi;

            if ((MainCharacter.Xi === checkX && MainCharacter.Yi === checkY) ||
                (MainCharacter.Xi === checkX && MainCharacter.Yi - 1 === checkY)) {
                return false;
            }

            checkY++;
            if ((MainCharacter.Xi === checkX && MainCharacter.Yi === checkY) ||
                (MainCharacter.Xi === checkX && MainCharacter.Yi - 1 === checkY)) {
                return false;
            }
        }

        // if false hasn't been returned yet, return true
        return true;

    }

    jumpDownPipeRight(game) {
        // first check to make sure it's ok to jump down it
        if (this.canJumpRight(game)) {
            // make sure isFinishedWithPipe is false
            this.isFinishedWithPipe = false;

            // face right
            this.animatingPipe = true;
            this.setState('standRight');

            // set pipe position
            this.pipe.Xi = this.Xi + 1;
            this.pipe.Yi = this.Yi;

            // start pipe growing animation
            this.pipe.setAsGrowingUp();

            // return true
            return true;
        } else {
            console.log('could not jump down pipe');
            return false;
        }


    }

        resetInterval() {
            this.lastTimeStamp = Date.now();
            this.secondsTowardInterval = 0;
        }

        giveThought(thoughtType) {
            this.resetInterval();
            this.thoughts.changeCurrentThought(thoughtType);
    }

        setState(stateName) {
            // TODO: Add more states
            console.log('Setting character ' + this.name + ' state to ' + stateName);
            if (stateName === 'standBackward') {
                this.currentSpeed = 0;
                this.direction = 'backward';
                this.currentState = this.standBackward;
                this.currentStateFrame = this.standBackward.frames[0];
                this.lastFrameIndex = 0;
            } else if (stateName === 'standForward') {
                this.currentSpeed = 0;
                this.direction = 'forward';
                this.currentState = this.standForward;
                this.currentStateFrame = this.standForward.frames[0];
                this.lastFrameIndex = 0;
            } else if (stateName === 'standLeft') {
                this.currentSpeed = 0;
                this.direction = 'left';
                this.currentState = this.standLeft;
                this.currentStateFrame = this.standLeft.frames[0];
                this.lastFrameIndex = 0;
            } else if (stateName === 'standRight') {
                this.currentSpeed = 0;
                this.direction = 'right';
                this.currentState = this.standRight;
                this.currentStateFrame = this.standRight.frames[0];
                this.lastFrameIndex = 0;
            } else if (stateName === 'marioLeft') {
                this.currentSpeed = 0;
                this.direction = 'left';
                this.currentState = this.marioLeft;
                this.currentStateFrame = this.marioLeft.frames[0];
                this.lastFrameIndex = 0;
            } else if (stateName === 'marioRight') {
                this.currentSpeed = 0;
                this.direction = 'right';
                this.currentState = this.marioRight;
                this.currentStateFrame = this.marioRight.frames[0];
                this.lastFrameIndex = 0;
            } else if (stateName === 'walkBackward') {
                this.direction = 'backward';
                this.currentState = this.walkBackward;
                this.currentSpeed = this.walkSpeed;
            } else if (stateName === 'walkForward') {
                this.direction = 'forward';
                this.currentState = this.walkForward;
                this.currentSpeed = this.walkSpeed;
            } else if (stateName === 'walkLeft') {
                this.direction = 'left';
                this.currentState = this.walkLeft;
                this.currentSpeed = this.walkSpeed;
            } else if (stateName === 'walkRight') {
                this.direction = 'right';
                this.currentState = this.walkRight;
                this.currentSpeed = this.walkSpeed;
            }
            else if (stateName === 'disappear') {
                this.currentState = this.disappear;
                this.currentStateFrame = this.disappear.frames[0];
                this.lastFrameIndex = 0;
                this.currentSpeed = 0;
            }
        }

        setMood(moodName) {
            if (moodName === null || moodName === 'none') {
                this.currentMood = null;
            } else {
                this.currentMood = this.faceSet.getMood(moodName);
            }
        }

        checkAnimationInterval(interval) {
            let newTimeStamp = Date.now();
            let timePassed = (newTimeStamp - this.lastTimeStamp) / 1000;
            this.lastTimeStamp = newTimeStamp;
            this.secondsTowardInterval += timePassed;

            if (this.secondsTowardInterval > this.animationChangeInterval) {
                this.secondsTowardInterval = 0;
                if (interval.animationType === 'thought') {
                    // also change the state
                    this.thoughts.changeState();
                } else if (interval.animationType === 'pause') {
                    interval.intervalCount++;
                }
                
                return true;
            } else {
                return false;
            }
        }

        resetPosition(columnCount) {
            this.x = null;
            this.y = null;
            if (!this.isNpc) {
                this.startXi = (columnCount - 1) / 2;
            }
            this.Xi = this.startXi;
            this.Yi = this.startYi;
            // this.x = (this.startXi * tileWidth);
            // this.y = (this.startYi * tileHeight);
            this.direction = 'forward';
            this.currentState = this.standForward;
            this.currentStateFrame = this.standForward.frames[0];
            this.lastFrameIndex = 0;
            this.frameIndex = 0;
            this.currentSpeed = 0;
        }
}

var MainCharacter = new Character(3, 4.5, 0, 64, 64, "images/main-character.png", 
"images/facesets/faceset-main.jpg", 5, "Harley", "human", false);
var Sarah = new Character(3, 4.5, 0, 64, 64, "images/sarah-character.png", 
"images/facesets/faceset-sarah.jpg", 5, "Sarah", "human", true);
var George = new Character(3, 4.5, 0, 64, 64, "images/george-character.png",
    "images/facesets/faceset-george.jpg", 5, "George", "human", true);
var Onorio = new Character(3, 4.5, 0, 64, 64, "images/onorio-character.png",
    "images/facesets/faceset-onorio.jpg", 5, "Onorio", "human", true);