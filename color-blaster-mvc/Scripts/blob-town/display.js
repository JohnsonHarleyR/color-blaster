class TownDisplay {
    constructor(tileWidth) {
        this.tileWidth = tileWidth;

        this.modal = undefined;

        this.canvas = undefined;
        this.context = undefined;

        this.currentArea = undefined;

        this.mainArea = new TownArea(15, 15, '#6bd0ff', '#ffffff');

        this.load();
    }

    load() {
        this.modal = document.getElementById('townModal');

        this.canvas = document.getElementById('townCanvas');;
        this.context = this.canvas.getContext("2d");

        this.setArea('mainArea');

        this.hideModal();
    }

    showModal() {
        this.modal.style.display = 'block';
    }

    hideModal() {
        this.modal.style.display = 'none';
    }

    setArea(name) {
        if (name === 'mainArea') {
            this.currentArea = this.mainArea;
        }

        let width = this.currentArea.tilesX * this.tileWidth;
        let height = this.currentArea.tilesY * this.tileWidth;

        this.modal.style.width = '100%';
        this.modal.style.height = '100%';
        this.context.canvas.width = width;
        this.context.canvas.height = height;
    }

    drawGrid() {
        this.context.beginPath();

        //     this.context.canvas.width, this.context.canvas.height);
        this.context.clearRect(0, 0,
            this.context.canvas.width, this.context.canvas.height);

        // draw background
        this.context.fillStyle = this.currentArea.backgroundColor;
        this.context.fillRect(0, 0,
            this.context.canvas.width, this.context.canvas.height);

        // now draw grid
        //console.log('drawing grid');
        let color = this.currentArea.gridColor; // gray

        for (let Xi = 1; Xi < this.currentArea.tilesX; Xi++) {
            let x = Xi * this.tileWidth;
            let yStart = 0;
            let yEnd = this.context.canvas.height;

            this.context.strokeStyle = color;
            this.context.beginPath();
            this.context.lineWidth = 1;
            this.context.moveTo(x, yStart);
            this.context.lineTo(x, yEnd);
            this.context.stroke();


        }

        for (let Yi = 1; Yi < this.currentArea.tilesY; Yi++) {
            let y = Yi * this.tileWidth;
            let xStart = 0;
            let xEnd = this.context.canvas.width;

            this.context.strokeStyle = color;
            this.context.beginPath();
            this.context.lineWidth = 1;
            this.context.moveTo(xStart, y);
            this.context.lineTo(xEnd, y);
            this.context.stroke();
        }
    }

}

class TownArea {
    constructor(tilesX, tilesY, backgroundColor, gridColor) {
        this.tilesX = tilesX;
        this.tilesY = tilesY;

        this.backgroundColor = backgroundColor;
        this.gridColor = gridColor;

    }
}