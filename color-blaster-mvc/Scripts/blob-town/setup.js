var BlobTown = {

    inBlobTown: false,

    load: function (game) {

    },

    enterTown: function (game) {
        this.inBlobTown = true;
        // TODO show character at starting point
    },

    exitTown: function (game) {
        this.inBlobTown = false;
    },

    gameLoop: function (game) {

    }
}