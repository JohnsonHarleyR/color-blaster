class ItemVisual {
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
    constructor(name, category, description, errorMessage, visual, count) {
        this.name = name;
        this.category = category;
        this.description = description;
        this.errorMessage = errorMessage;
        this.visual = visual;
        this.count = count;
        this.isSelected = false;
    }
}

var ItemCreator = {

    tileWidth: 35, // TODO set these the same as the canvas somehow
    tileHeight: 35,

    // visuals to grab
    key: undefined,

    load: function () {
        // add all the visuals
    },

    createItem(itemName) {
        let itemWidth = 35;
        if (itemName === 'Magic Key') {
            // create visual
            let url = "Images/inventory-menu/options1.png";
            let xPos = 0;
            let yPos = 0;
            let visualIndex = 0;
            let name = itemName;
            let category = 'Key';
            let description = 'A magical transportation device. It says, "Rub me like a genie." Umm, gross.';
            let errorMessage = "Cannot use that here.";
            return this.createItemInstance(url, xPos, yPos, visualIndex, name, category, description, errorMessage);
        } else if (itemName === 'Empty Vial') {
            // create visual
            let url = "Images/inventory-menu/options1.png";
            let xPos = 1 * itemWidth;
            let yPos = 0;
            let visualIndex = 0;
            let name = itemName;
            let category = 'Game';
            let description = "An empty vial that can be used for one level. Once you leave the room, it's gone! How odd.";
            let errorMessage = "Cannot use that here.";
            return this.createItemInstance(url, xPos, yPos, visualIndex, name, category, description, errorMessage);
        }
    },

    createItemInstance(url, xPos, yPos, visualIndex, name, category, description, errorMessage) {
        let visual = new ItemVisual(url, xPos, yPos, this.tileWidth, this.tileHeight, visualIndex);
        let item = new InventoryItem(name, category, description, errorMessage, visual, 1);
        return item;
    }
}

class ItemCategoryList {
    constructor(categoryName) {
        this.categoryName = categoryName;
        this.items = new Array();
    }
}

class InventoryMenu {
    constructor() {

        this.keyItems = new ItemCategoryList('Key');
        this.gameItems = new ItemCategoryList('Game');
        this.displayItems = new ItemCategoryList('Display');

        this.selectedIndex = 0;
        this.selectedCategoryIndex = 0;

        this.xSpaces = 5;
        this.ySpaces = 3;

        this.errorMessage = '';

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

        this.tileWidth = ItemCreator.tileWidth; // TODO set these the same as the canvas somehow
        this.tileHeight = ItemCreator.tileHeight;
        this.insideMargin = 10;
        this.descriptionHeight = 90;
        this.menuBoxHeight = (3 * this.tileHeight) +
            (this.insideMargin * 2) + this.descriptionHeight + this.insideMargin;

        this.menuBoxWidth = null;

        this.dw = null;
        this.dh = null;
        this.dx = null;
        this.dy = null;
    }

    getSelectedCategory() {
        let categories = this.getAllCategories();
        return categories[this.selectedCategoryIndex];
    }

    selectCategory(nextOrPrevious) {
        // erase error message
        this.errorMessage = '';

        let categories = this.getAllCategories();

        if (nextOrPrevious === 'next') {
            this.selectedCategoryIndex++;
            if (this.selectedCategoryIndex >= categories.length) {
                this.selectedCategoryIndex = 0;
            }
        } else if (nextOrPrevious === 'previous') {
            this.selectedCategoryIndex--;
            if (this.selectedCategoryIndex < 0) {
                this.selectedCategoryIndex = categories.length - 1;
            }
        }
    }

    getAllCategories() {
        return [this.keyItems, this.gameItems, this.displayItems];
    }

    selectItem(direction) {


        let categories = this.getAllCategories();
        let category = categories[this.selectedCategoryIndex];

        // deselect current item
        try {
            category.items[this.selectedIndex].isSelected = false;
        } catch {
            // nothing
        }

        if (direction != 'none') {
            // erase error message
            this.errorMessage = '';

            let tempIndex = this.selectedIndex + 1;
            let xPos = tempIndex % this.xSpaces;

            if (xPos === 0) {
                xPos = this.xSpaces;
            }

            let remainder = tempIndex - xPos;
            let yPos = remainder / this.xSpaces;

            if (direction === 'right') {
                xPos++;
                if (xPos > this.xSpaces) {
                    xPos = 1;
                }
            } else if (direction === 'left') {
                xPos--;
                if (xPos < 1) {
                    xPos = this.xSpaces;
                }
            } else if (direction === 'up') {
                yPos -= 1;
                if (yPos < 0) {
                    yPos = this.ySpaces - 1;
                }
            } else if (direction === 'down') {
                yPos += 1;
                if (yPos >= this.ySpaces) {
                    yPos = 0;
                }
            }

            // bring it together now
            remainder = yPos * this.xSpaces;
            let newIndex = remainder + xPos - 1;

            this.selectedIndex = newIndex;
        }

        // select item - if it exists
        try {
            category.items[this.selectedIndex].isSelected = true;
        } catch {
            // nothing
        }

    }

    addItem(itemName, category) {
        // get correct array
        let categoryItems = this.getCategoryItemsByName(category);

        // see if item exists in array
        let alreadyExists = false;
        for (let i = 0; i < categoryItems.items.length; i++) {
            if (categoryItems.items[i].name === itemName) {
                // if it does exist, just add to the count
                categoryItems.items[i].count++;
                alreadyExists = true;
                break;
            }
        }

        // if the item didn't exist in the array, add an item to that array
        if (!alreadyExists) {
            let newItem = ItemCreator.createItem(itemName);
            categoryItems.items.push(newItem);
        }
    }

    removeItem(itemName, category) {
        // get correct array
        let categoryItems = this.getCategoryItemsByName(category);
        let index = 0;

        // see if item exists in array
        let alreadyExists = false;
        for (let i = 0; i < categoryItems.items.length; i++) {
            if (categoryItems.items[i].name === itemName) {
                // if it does exist, just add to the count
                categoryItems.items[i].count++;
                alreadyExists = true;
                index = i;
                break;
            }
        }

        // if the item exists - remove it
        if (alreadyExists) {
            // if the item is above 1, just turn the count to 1 less
            if (categoryItems.items[index].count > 1) {
                categoryItems.items[index].count--;
            } else { // otherwise, remove the item from the array
                categoryItems.items.splice(index, 1);
                // if the selected index was that one, then set it back to 0
                if (this.selectedIndex === index) {
                    this.selectedIndex = 0;
                }
            }
        }
    }

    getCategoryItemsByName(category) {
        if (category === 'Game') {
            return this.gameItems;
        } else if (category === 'Display') {
            return this.displayItems;
        } else if (category === 'Key') {
            return this.keyItems;
        } else {
            return null;
        }
    }

    drawMenu(context) {
        // select item just in case
        this.selectItem('none');

        // first fill canvas with transparent gray
        context.beginPath();
        context.fillStyle = "rgba(46, 49, 49, 0.6)";
        context.fillRect(0, 0,
            context.canvas.width, context.canvas.height);

        // draw the box
        let boxStartX = 20;
        let outlineColor = '#083835';

        let boxWidth = context.canvas.width - (boxStartX * 2);
        this.menuBoxWidth = boxWidth;
        let boxStartY = context.canvas.height / 2 - this.menuBoxHeight;
        let boxHeight = this.menuBoxHeight;
        context.fillStyle = "#c5fcf9";
        context.fillRect(boxStartX, boxStartY,
            boxWidth, boxHeight);

        context.lineWidth = "4";
        context.strokeStyle = outlineColor;
        context.rect(boxStartX + 2, boxStartY + 2,
            boxWidth - 4, boxHeight - 4);
        context.stroke();
        context.lineWidth = "2";
        context.strokeStyle = "#26807a";
        context.stroke();

        context.closePath();

        // draw all the items for current category plus empty
        let betweenMargin = 5;
        let category = this.getSelectedCategory();
        let drawItemIndex = 0;

        let insideFill = '#70ccc7';
        let selectOutlineColor = '#f2e129';

        let itemsFirstStartX = 0;
        let itemsFirstStartY = 0;
        let itemsEndX = 0;
        let itemsEndY = 0;

        // do a 5 x 3 grid
        for (let y = 0; y < this.ySpaces; y++) {
            for (let x = 0; x < this.xSpaces; x++) {
                context.beginPath();

                // determine start x and y
                let startX = boxStartX + (betweenMargin * 2) + (x * betweenMargin) + (x * this.tileWidth);
                let startY = boxStartY + (betweenMargin * 2) + (y * betweenMargin) + (y * this.tileHeight);

                // if x and y are 0. set that info
                if (x === 0 && y === 0) {
                    itemsFirstStartX = startX;
                    itemsFirstStartY = startY;
                }

                // if they're the end, then set end x and y for items
                if (x === this.xSpaces - 1 && y === this.ySpaces - 1) {
                    itemsEndX = startX + this.tileWidth;
                    itemsEndY = startY + this.tileHeight;
                }

                // draw background square
                context.fillStyle = insideFill;
                context.fillRect(startX, startY,
                    this.tileWidth, this.tileHeight);

                // determine if there's an item to put there - if so, draw it
                if (category.items.length > 0 && drawItemIndex < category.items.length) {
                    let visual = category.items[drawItemIndex].visual;
                    let image = visual.image;
                    if (image != null) { // only do it if it's not null - meaning it's supposed to be shown
                        let isLoaded = image.complete && image.naturalHeight !== 0;
                        if (!isLoaded) {
                            image.addEventListener('load', function () {
                                context.drawImage(image, visual.startX, visual.startY, visual.width, visual.height,
                                    startX, startY, this.tileWidth, this.tileHeight);
                            });
                        } else {
                            context.drawImage(image, visual.startX, visual.startY, visual.width, visual.height,
                                startX, startY, this.tileWidth, this.tileHeight);
                        }
                    }
                    // if there's more than one, put a x2 or whatever
                    if (category.items[drawItemIndex].count > 1) {
                        let count = category.items[drawItemIndex].count;
                        let iText = 'x' + count;
                        let iStartX = startX + 2;
                        let iStartY = startY + (this.tileHeight - 2);
                        context.fillStyle = outlineColor;
                        context.font = "10px serif";
                        context.fillText(iText, iStartX, iStartY);
                        context.fillText(iText, iStartX, iStartY);
                    }
                }

                // draw outline - depending if it's a selected item or not
                let currentOutlineColor = outlineColor;
                if (this.selectedIndex === drawItemIndex && category.items.length > 0) {
                    currentOutlineColor = selectOutlineColor;
                }
                context.lineWidth = "2";
                context.strokeStyle = currentOutlineColor;
                context.rect(startX, startY, this.tileWidth, this.tileHeight);
                context.stroke();


                // increase the drawItemIndex
                drawItemIndex++;

                context.closePath();
            }
        }

        // draw categories
        let maxCategoryWidth = 0;
        let categories = this.getAllCategories();
        // determine which category text has the widest text - use that for size of boxes.
        maxCategoryWidth = boxStartX + this.menuBoxWidth - itemsEndX - (3 * betweenMargin);

        // use that width to draw the category names (make sure none of them are larger than the given area)
        let lastCategoryY = 0;
        let lastCategoryX = 0;
        let doDrawError = false;
        for (let i = 0; i < categories.length; i++) { // draw for each category
            // draw box first
            let cFillColor = outlineColor;
            let cTextColor = "#ffffff";
            // fill with different colors if selected
            if (category.categoryName === categories[i].categoryName) {
                cTextColor = selectOutlineColor;
                doDrawError = true;
            }
            
            let cStartX = itemsEndX + betweenMargin;
            let cStartY = itemsFirstStartY + (i * 25); // the number here represents how far to space them vertically
            let cWidth = maxCategoryWidth; // give it space at edges
            let cHeight = 20;

            if (i === categories.length - 1) {
                lastCategoryX = cStartX;
                lastCategoryY = cStartY;
            }

            context.beginPath();
            context.fillStyle = cFillColor;
            context.fillRect(cStartX, cStartY,
                cWidth, cHeight);
            context.closePath();

            // draw category name
            context.beginPath();
            context.fillStyle = cTextColor;
            context.font = "15px serif";
            context.fillText(categories[i].categoryName, cStartX + betweenMargin, cStartY + (cHeight - 5));
            context.fillText(categories[i].categoryName, cStartX + betweenMargin, cStartY + (cHeight - 5));
            context.closePath();

            
            
        }

        // draw error message if there's supposed to be one
        if (doDrawError) {
            context.beginPath();
            // TODO modify fill color for error message
            this.wrapText(context, "", this.errorMessage, lastCategoryX, lastCategoryY,
                maxCategoryWidth, 20, insideFill);
            context.closePath();
        }


        // draw description
        if (category.items.length > 0) {
            context.beginPath()
            let description = '';
            let name = '';
            let selectedIndex = this.selectedIndex;
            try {
                description = category.items[selectedIndex].description;
                name = category.items[selectedIndex].name;
            } catch {

            }
            let descriptionStartX = itemsFirstStartX;
            let descriptionStartY = itemsEndY + betweenMargin;
            let descriptionWidth = boxWidth - (2 * betweenMargin);
            this.wrapText(context, name, description, descriptionStartX, descriptionStartY,
                descriptionWidth, 20, "#083835");
            context.closePath();
        }
        //let description = category.items[this.selectedIndex].description;
        //let descriptionStartX = itemsFirstStartX;
        //let descriptionStartY = itemsEndY + betweenMargin;
        //let descriptionWidth = boxWidth - (2 * betweenMargin);
        //this.wrapText(context, description, descriptionStartX, descriptionStartY,
        //    descriptionWidth, 20);
    }

    wrapText(context, name, text, x, y, maxWidth, lineHeight, textColor) {
        context.fillStyle = textColor;
        context.font = "15px serif";

        // first draw the name
         y += lineHeight;
        context.fillText(name, x, y);
        context.fillText(name, x, y);
        context.fillText(name, x + 1, y);
        context.fillText(name, x + 1, y);

        let words = text.split(' ');
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

    testAddItems() {
        this.addItem('Magic Key', 'Key');
        this.addItem('Empty Vial', 'Game');
        this.addItem('Empty Vial', 'Game');
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