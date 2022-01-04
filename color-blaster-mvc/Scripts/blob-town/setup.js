var BlobTown = {

    //inBlobTown: false,

    display: undefined,

    load: function (game) {
        this.display = new TownDisplay(game.tileWidth);
    },

    enterTown: function (game) {
        //this.inBlobTown = true;
        // display the modal and town canvas
        this.display.showModal();

        // TODO show character at starting point
    },

    exitTown: function (game) {
        //this.inBlobTown = false;

        this.display.hideModal();
    },

    gameLoop: function (game) {
        // draw background grid
        this.display.drawGrid();
    }
}