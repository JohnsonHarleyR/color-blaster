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
    constructor(url, startX, startY, width, height, index)
    {
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