class OpeningAnimation {
    constructor(animations) {
        this.animations = animations;
        this.intervalIndex = 0;
    }

    getInterval() {
        if (this.animations === null) {
            return null;
        }
        try {
            return this.animations[this.intervalIndex];
        } catch (error) {
            return null;
        }
    }

    getNextInterval() {
        let animation = this.getInterval();
        if (animation != null) {
            this.intervalIndex++;
            if (!animation.complete) {
                return animation;
            } else if (this.intervalIndex >= this.animations.length) {
            return null;
            } else {
                return this.getInterval();
            }
        }
        return null;
    }
}

class OpeningAnimationInterval {
    // one of these will happen before dialogue - so if the index is 0 and a dialogue
    // index is 0, this will be performed before the dialogue continues.
    constructor(animationIndex, animationsAtOnce, character, animationType, keyword, newXi, newYi, secondsRequired) {
        this.animationIndex = animationIndex;
        this.animationsAtOnce = animationsAtOnce;
        this.started = false;
        this.complete = false;
        this.character = character;
        this.animationType = animationType;
        this.keyword = keyword;
        this.newXi = newXi;
        this.newYi = newYi;
        this.intervalCount = 0; // TODO eliminate

        this.secondsRequired = secondsRequired;
        this.secondsPassed = 0;
        this.lastTimeStamp = null;
    }

    startAnimation(game) {
        this.started = true;
        this.lastTimeStamp = Date.now();
        if (this.animationType === 'thought') {
            this.character.giveThought(this.keyword);
            this.showThought();
        } else if (this.animationType === 'pause') {
            console.log('seconds passed: ' + this.secondsPassed);
            this.requiredIntervals = parseInt(this.keyword);
            this.pauseCharacter();
        } else if (this.animationType === 'turn') {
            let stateName = '';
            if (this.keyword === 'backward') {
                stateName = 'standBackward';
            } else if (this.keyword === 'forward') {
                stateName = 'standForward';
            } else if (this.keyword === 'left') {
                stateName = 'standLeft';
            } else if (this.keyword === 'right') {
                stateName = 'standRight';
            }
            this.character.setState(stateName);
            this.complete = true;
        } else if (this.animationType === 'move') {
            let stateName = '';
            if (this.keyword === 'backward') {
                stateName = 'walkBackward';
            } else if (this.keyword === 'forward') {
                stateName = 'walkForward';
            } else if (this.keyword === 'left') {
                stateName = 'walkLeft';
            } else if (this.keyword === 'right') {
                stateName = 'walkRight';
            }
            this.character.setState(stateName);
            this.setRelativeCharacterGoalPositions(game, 'set');
        } else if (this.animationType === 'shoot') {
            //console.log('shooting color');
            game.inventory.activeSceneShootColor = this.keyword;
            game.shootBullet(this.character, 'scene');
        } else if (this.animationType === 'add block') {
            let block = new Block(game.tileWidth, game.tileHeight, this.newXi, this.newYi, this.keyword);
            game.blocks[this.newXi][this.newYi] = block;
            this.complete = true;
        } else if (this.animationType === 'pipe down') {
            this.character.pipeIsDuringScene = true;
            this.character.jumpDownPipeRight(game);
        }
    }

    continueAnimation(game) {
        if (this.started === false) {
            this.startAnimation(game);
        } else if (this.animationType === 'thought') {
            if (this.hasPassedTimeInterval()) {
                this.complete = true;
                this.character.giveThought(null);
            }
            //if (this.character.thoughts.currentThought === null) {
            //    this.complete = true;
            //}
        } else if (this.animationType === 'pause') {
            this.pauseCharacter();
        } else if (this.animationType === 'turn') {
            // nothing
        } else if (this.animationType === 'move') {
            if (this.keyword === 'backward') {
                if (this.character.y <= this.character.goalY) {
                    this.character.goalX = -100;
                    this.character.goalY = -100;
                    this.character.setState('standBackward');
                    this.complete = true;
                }
            } else if (this.keyword === 'forward') {
                if (this.character.y >= this.character.goalY) {
                    this.character.goalX = -100;
                    this.character.goalY = -100;
                    this.character.setState('standForward');
                    this.complete = true;
                }
            } else if (this.keyword === 'left') {
                if (this.character.x <= this.character.goalX) {
                    this.character.goalX = -100;
                    this.character.goalY = -100;
                    this.character.setState('standLeft');
                    this.complete = true;
                }
            } else if (this.keyword === 'right') {
                if (this.character.x >= this.character.goalX) {
                    this.character.goalX = -100;
                    this.character.goalY = -100;
                    this.character.setState('standRight');
                    this.complete = true;
                }
            }
        } else if (this.animationType === 'shoot') {
            if (game.inventory.activeSceneShootColor === null) {
                this.complete = true;
            }
        } else if (this.animationType === 'pipe down') {
            if (this.character.isFinishedWithPipe) {
                this.character.pipeIsDuringScene = false;
                this.character.isFinishedWithPipe = false;
                this.complete = true;
            }
        }
    }

    hasPassedTimeInterval() {
        let newTimeStamp = Date.now();
        let timePassed = (newTimeStamp - this.lastTimeStamp) / 1000;
        this.secondsPassed += timePassed;

        if (this.secondsPassed > this.secondsRequired) {
            console.log('seconds passed: ' + this.secondsPassed + '/' + this.secondsRequired);
            return true;
        } else {
            return false;
        }
    }

    pauseCharacter() {
        if (this.hasPassedTimeInterval()) {
            this.complete = true;
            console.log('pause complete');
        }
    }

    showThought() {
        if (this.character.type === 'human') {
            this.character.thoughts.changeCurrentThought(this.keyword);
            //this.character.giveThought(this.keyword);
        }
    }

    setRelativeCharacterGoalPositions(game, method) {
        if (method === 'reset') {
            this.character.goalX = -100;
            this.character.goalY = -100;
        }
        else {
            this.character.goalX = this.getRelativeCharacterGoalPositions(game, 'x');
            this.character.goalY = this.getRelativeCharacterGoalPositions(game, 'y');
        }

    }

    getRelativeCharacterGoalPositions(game, xOrY) {
        if (xOrY === 'x') {
            let offX = Math.round((this.character.currentStateFrame.width - game.tileWidth) / 2);
            return Math.round(this.newXi * game.tileWidth - offX);
        } else {
            let offY = Math.round((this.character.currentStateFrame.height - game.tileHeight) / 2);
            return Math.round(this.newYi * game.tileWidth - offY);
        }
    }
}

function CreateOpeningAnimation(dialogueIndexes, characters, characterTypes, animationTypes, 
keywords, newXs, newYs, seconds) {
    let animations = new Array();
    for (let i = 0; i < characters.length; i++) {
        animations.push(new OpeningAnimationInterval(dialogueIndexes[i], characters[i], characterTypes[i], 
            animationTypes[i], keywords[i], newXs[i], newYs[i]));
    }
    return new OpeningAnimation(animations);
}

function GetTestOpeningAnimation() {
    let dialogueIndexes = [
        0,
        0
    ];
    let characters = [
        MainCharacter, 
        Sarah
        ];
    let characterTypes = [
        'human',
        'human'
    ];
    let animationTypes = [
        'thought',
        'thought'
    ]
    let keywords = [
        'exclamation',
        'heart'
    ]
    let newXs = [
        -1,
        -1
    ];
    let newYs = [
        -1,
        -1
    ];
    return CreateOpeningAnimation(dialogueIndexes, characters, characterTypes, 
    animationTypes, keywords, newXs, newYs);
}