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

function createGameSounds() {
    shootBullet = new sound('files/sounds/shoot-bullet1.wav');
    absorbColor = new sound('files/sounds/absorb-color1.wav');

    testSound1 = new sound('files/sounds/level-completed2.wav');
}

var shootBullet;
var absorbColor;

var testSound1;

// Tutorial from: https://www.w3schools.com/graphics/game_sound.asp

// Places to find sounds:
//
// https://mixkit.co/free-sound-effects/game/