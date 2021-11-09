var Inventory = {
    shootOrAbsorb: undefined,
    vials: undefined,
    activeVial: undefined,
    absorbColors: undefined,
    absorbColorElements: undefined,
    activeAbsorbColorIndex: undefined,
    allowAbsorbSelect: false,
    activeSceneShootColor: null,

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