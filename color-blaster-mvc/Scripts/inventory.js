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

class InventoryItem {
    constructor(name, description, visual, count) {
        this.name = name;
        this.description = description;
        this.visual = visual;
        this.count = count;
        this.isSelected = false;
    }
}

class InventoryMenu {
    constructor() {
        this.items = new Array();
        
        this.blocksRed = 0;
        this.blocksOrange = 0;
        this.blocksYellow = 0;
        this.blocksGreen = 0;
        this.blocksBlue = 0;
        this.blocksPurple = 0;
        this.blocksBlack = 0;
        this.blocksWhite = 0;

        this.blobsRed = 0;
        this.blobsOrange = 0;
        this.blobsYellow = 0;
        this.blobsGreen = 0;
        this.blobsBlue = 0;
        this.blobsPurple = 0;
        this.blobsBlack = 0;
        this.blobsWhite = 0;

        this.tileWidth = 35; // TODO set these the same as the canvas somehow
        this.tileHeight = 35;
        this.insideMargin = 10;
        this.menuBoxHeight = (3 * this.tileHeight) +
            (this.insideMargin * 2) + 50;

        this.menuBoxWidth = null;

        this.dw = null;
        this.dh = null;
        this.dx = null;
        this.dy = null;
    }

    drawMenu(context) {
        // first fill canvas with transparent gray
        context.beginPath();
        context.fillStyle = "rgba(46, 49, 49, 0.6)";
        context.fillRect(0, 0,
            context.canvas.width, context.canvas.height);

        // draw the box
        let boxStartX = 20;
        let boxWidth = context.canvas.width - (boxStartX * 2);
        this.menuBoxWidth = boxWidth;
        let boxStartY = context.canvas.height / 2 - this.menuBoxHeight;
        let boxHeight = this.menuBoxHeight;
        context.fillStyle = "#c5fcf9";
        context.fillRect(boxStartX, boxStartY,
            boxWidth, boxHeight);

        context.lineWidth = "4";
        context.strokeStyle = "#083835";
        context.rect(boxStartX + 2, boxStartY + 2,
            boxWidth - 4, boxHeight - 4);
        context.stroke();
        context.lineWidth = "2";
        context.strokeStyle = "#26807a";
        context.stroke();

        // now draw text
        //let textStartX = this.dx + this.dw + this.insideMargin;
        //let textStartY = this.dy + this.insideMargin;
        //let textWidth = boxWidth - this.dw - (this.insideMargin * 3);
        //this.wrapText(context, textStartX, textStartY, textWidth, 20);

        // TODO draw icon to go next
    }

    wrapText(context, x, y, maxWidth, lineHeight) {
        context.fillStyle = "#083835";
        context.font = "15px serif";

        // first draw the name
        y += lineHeight;
        context.fillText(this.character.name, x, y);
        context.fillText(this.character.name, x, y);
        context.fillText(this.character.name, x, y);
        // let { width } = context.measureText(this.character.name);
        // context.fillRect(x, y, width, 2);

        let words = this.text.split(' ');
        let line = "";
        let doFillText = false;
        for (let i = 0; i <= words.length; i++) {
            if (i != words.length) {
                let testLine = line + words[i] + ' ';
                let metrics = context.measureText(testLine);
                let testWidth = metrics.width;
                if (testWidth > maxWidth && i > 0) {
                    y += lineHeight;
                    doFillText = true;
                } else {
                    line = testLine;
                }
                if (doFillText) {
                    context.fillText(line, x, y);
                    context.fillText(line, x, y);
                    doFillText = false;
                    line = words[i] + ' ';
                }
            } else {
                y += lineHeight;
                let metrics = context.measureText(line);
                let testWidth = metrics.width;
                if (testWidth > maxWidth && i > 0) {
                    console.log('too wide');
                }
                context.fillText(line, x, y);
                context.fillText(line, x, y);
            }


        }
    }
}

var Inventory = {
    shootOrAbsorb: undefined,
    vials: undefined,
    activeVial: undefined,
    absorbColors: undefined,
    absorbColorElements: undefined,
    activeAbsorbColorIndex: undefined,
    allowAbsorbSelect: false,
    activeSceneShootColor: null,

    menu: new InventoryMenu(),

    load: function(firstLevel) {
        // set up absorb colors
        this.absorbColors = ['red', 'yellow', 'blue'];
        this.absorbColorElements = [document.getElementById('absorbRed'), 
            document.getElementById('absorbYellow'),
            document.getElementById('absorbBlue')];
        this.activeAbsorbColorIndex = 0; // default
        this.selectAbsorbColor('none', false);

        this.setLevel(firstLevel);
    },

    setLevel: function(level) {

        // create or reset the array of vials
        if (this.vials === undefined) {
            this.vials = new Array();
        } else {
            this.vials.length = 0;
        }

        // create vials
        for (i = 0; i < level.vialCount; i++) {
            this.vials.push(new Vial(null, i));
        }

        // fill vials
        for (i = 0; i < level.vialColorsToFill.length; i++) {
            this.vials[i].content = level.vialColorsToFill[i];
        }

        ////// set absorb color to first - make sure disabling is working if necessary
        //this.activeAbsorbColorIndex = 0;
        //this.selectAbsorbColor('none');

        // set active vial to the first one
        this.activeVial = this.vials[1];

        // determine whether to allow absorb select
        this.setAbsorbPermission();

        // if that vial isn't empty, set the default to shoot
        // otherwise, set default to absorb
        if (this.activeVial.content != null) {
            this.shootOrAbsorb = 'shoot';
        } else {
            this.shootOrAbsorb = 'absorb';
        }

    },

    selectVial: function(upOrDown) {
        let newIndex;
        if (upOrDown === 'up') {
            newIndex = this.activeVial.inventoryIndex - 1;
            if (newIndex < 0) {
                newIndex = this.vials.length - 1;
            }
        } else if (upOrDown === 'down') {
            newIndex = this.activeVial.inventoryIndex + 1;
            if (newIndex >= this.vials.length) {
                newIndex = 0;
            }
        }
        this.activeVial = this.vials[newIndex];

        // determine whether to shoot or absorb
        if (this.activeVial.content === null) {
            this.shootOrAbsorb = 'absorb';
        } else {
            this.shootOrAbsorb = 'shoot';
        }

        // determine whether to allow absorb select
        this.setAbsorbPermission();
    },

    selectAbsorbColor: function (upOrDown, levelStarted) {

        let newIndex = this.activeAbsorbColorIndex;

        // only do this if an empty vial is active (absorb allowed)
        if (this.allowAbsorbSelect === true) {
            if (upOrDown === 'up') {
                newIndex = this.activeAbsorbColorIndex - 1;
                if (newIndex < 0) {
                    newIndex = this.absorbColors.length - 1;
                }
            } else if (upOrDown === 'down') {
                newIndex = this.activeAbsorbColorIndex + 1;
                if (newIndex >= this.absorbColors.length) {
                    newIndex = 0;
                }
            }
            if (levelStarted) {
                playSound('select absorb');
            }
            this.activeAbsorbColorIndex = newIndex;
        } else {
            if (levelStarted) {
                playSound('select absorb fail');
            }
        }

        // loop through to show selection - first make them all not selected
        for (let i = 0; i < this.absorbColorElements.length; i++) {
            this.absorbColorElements[i].className = 'absorb-color';
        }

        // now select active
        this.absorbColorElements[newIndex].className += " selected";
    },

    setAbsorbPermission: function() {
        // determine whether to allow absorb select
        if (this.activeVial.content === null) {
            this.enableAbsorbSelect();
        } else {
            this.disableAbsorbSelect();
        }
    },

    disableAbsorbSelect: function() {
        this.allowAbsorbSelect = false;
        document.getElementById('absorbColorSelect')
        .style.opacity = "50%";
    },

    enableAbsorbSelect: function() {
        this.allowAbsorbSelect = true;
        document.getElementById('absorbColorSelect')
        .style.opacity = "100%";
    }

}

var InventoryMenuOptions = {
}