class Conversation {
    constructor(levelNumber, type, dialogues) {
        this.levelNumber = levelNumber;
        this.type = type;
        this.dialogues = dialogues;
        this.index = 0;
    }

    getDialogue() {
        if (this.dialogues.length > 0) {
            return this.dialogues[this.index];
        }
            return null;
        }

    getNextDialogue() {
        this.dialogues[this.index].complete = true;
        this.index++;
        if (this.index >= this.dialogues.length) {
            this.index = 0;
            return null;
        } else {
            return this.dialogues[this.index];
        }
    }
}

class Dialogue {
    constructor(character, moodName, text, dialogueIndex) {
        this.character = character;
        this.moodName = moodName;
        this.text = text;
        this.complete = false;
        this.dialogueIndex = dialogueIndex;

        this.insideMargin = 10;
        this.dialogueBoxHeight = character.faceSet.normal.visual.height / 2 + 
                (this.insideMargin * 2) + 15;

        this.dialogueBoxWidth = null;

        this.dw = null;
        this.dh = null;
        this.dx = null;
        this.dy = null;

    }

    drawDialogueBox(context) {
        // first fill canvas with transparent gray
        context.beginPath();
        context.fillStyle = "rgba(46, 49, 49, 0.6)";
        context.fillRect(0, 0,
            context.canvas.width, context.canvas.height);
        
        // draw the box
        let boxStartX = 20;
        let boxWidth = context.canvas.width - (boxStartX * 2);
        this.dialogueBoxWidth = boxWidth;
        let boxStartY = context.canvas.height / 2 - this.dialogueBoxHeight;
        let boxHeight = this.dialogueBoxHeight;
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

        // draw mood image
        this.drawMood(context, boxStartX, boxStartY);

        // now draw text
        let textStartX = this.dx + this.dw + this.insideMargin;
        let textStartY = this.dy + this.insideMargin;
        let textWidth = boxWidth - this.dw - (this.insideMargin * 3);
        this.wrapText(context, textStartX, textStartY, textWidth, 20);

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

    drawMood(context, boxX, boxY) {
        // set the character's mood
        this.character.currentMood = 
            this.character.faceSet.getMood(this.moodName);

        // now draw it
        let sx = this.character.currentMood.visual.startX;
        let sy = this.character.currentMood.visual.startY;

        let sw = this.character.currentMood.visual.width;
        let sh = this.character.currentMood.visual.height;

        this.dw = this.character.currentMood.visual.width / 2;
        this.dh = this.dw;

        this.dx = boxX + this.insideMargin;
        this.dy = boxY + (this.dialogueBoxHeight / 2) - (this.dh / 2);

        let image = this.character.currentMood.visual.image;
        let isLoaded = image.complete && image.naturalHeight !== 0;
        if (!isLoaded) {
            image.addEventListener('load', function() {
                context.drawImage(image, sx, sy, sw, sh,
                     this.dx, this.dy, this.dw, this.dh);
            });
        } else {
                context.drawImage(image, sx, sy, sw, sh, 
                    this.dx, this.dy, this.dw, this.dh);
        }

    }
}
