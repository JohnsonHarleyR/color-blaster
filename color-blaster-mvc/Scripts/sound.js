function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);

    this.play = function () {
        this.sound.play();
    }

    this.stop = function () {
        this.sound.pause();
    }
}

//function createGameSounds() {
//    shootBullet = new sound('files/sounds/shoot-bullet1.wav');
//    absorbColor = new sound('files/sounds/absorb-color2.wav');

//    testSound1 = new sound('files/sounds/level-completed2.wav');
//}

function playSound(keyword) {
    let newSound = getSound(keyword);
    newSound.play();
}

function getSound(keyword) {
    let url = getSoundUrlByKeyword(keyword);
    return new sound(url);
}

function getSoundUrlByKeyword(keyword) {

    if (keyword === 'shoot') {
        return 'files/sounds/shoot-bullet2.wav';

    } else if (keyword === 'absorb') {
        return 'files/sounds/absorb-color2.wav';
    } else if (keyword === 'absorb fail') {
        return 'files/sounds/error6.wav';
    } else if (keyword === 'shoot fail') {
        return 'files/sounds/error2.wav';
    } else if (keyword === 'blob happy') {
        return 'files/sounds/blob-happy2.wav';
    } else if (keyword === 'blob sad') {
        return 'files/sounds/blob-sad3.wav';
    } else if (keyword === 'select vial') {
        return 'files/sounds/select2.wav';
    } else if (keyword === 'select absorb') {
        return 'files/sounds/select1.wav';
    } else if (keyword === 'select absorb fail') {
        return 'files/sounds/error7.wav';
    }
}


// Tutorial from: https://www.w3schools.com/graphics/game_sound.asp

// Places to find sounds:
//
// https://mixkit.co/free-sound-effects/game/