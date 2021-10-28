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
    constructor(dialogueIndex, character, characterType, animationType, keyword, newX, newY, seconds) {
        this.dialogueIndex = dialogueIndex;
        this.started = false;
        this.complete = false;
        this.character = character;
        this.characterType = characterType;
        this.animationType = animationType;
        this.keyword = keyword;
        this.newX = newX;
        this.newY = newY;
        this.intervalCount = 0;
        this.seconds = seconds;
    }

    startAnimation(game) {
        this.started = true;
        if (this.animationType === 'thought') {
            this.showThought();
        } else if (this.animationType === 'pause') {
            this.requiredIntervals = parseInt(keyword);
            this.pauseCharacter();
        } else if (this.animationType === 'direction') {
            this.character.direction = keyword;
        } else if (this.animationType === 'move') {
            // TODO write stuff for this
        }
    }

    continueAnimation(game) {
        if (this.started === false) {
            this.startAnimation(game);
        } else if (this.animationType === 'thought') {
            if (this.character.thoughts.currentThought === null) {
                this.complete = true;
            }
        } else if (this.animationType === 'pause') {
            this.pauseCharacter();
        } else if (this.animationType === 'direction') {

        } else if (this.animationType === 'move') {

        }
    }

    pauseCharacter() {
        this.character.checkAnimationInterval(this);
        if (this.intervalCount >= this.requiredIntervals) {
            this.complete = true;
        }
    }

    showThought() {
        if (this.character.type === 'human') {
            this.character.giveThought(this.keyword);
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