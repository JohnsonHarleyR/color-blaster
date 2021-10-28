class Report {
    constructor(levelScore, totalScore, blocksCleared, blobsHelped) {
        this.levelScore = levelScore;
        this.totalScore = totalScore;
        this.blocksCleared = blocksCleared;
        this.blobsHelped = blobsHelped;

        this.redBlobsHelped = 0;
        this.orangeBlobsHelped = 0;
        this.yellowBlobsHelped = 0;
        this.greenBlobsHelped = 0;
        this.blueBlobsHelped = 0;
        this.purpleBlobsHelped = 0;
        this.whiteBlobsHelped = 0;
        this.blackBlobsHelped = 0;
        this.setBlobCounts();

        this.redBlocksCleared = 0;
        this.orangeBlocksCleared = 0;
        this.yellowBlocksCleared = 0;
        this.greenBlocksCleared = 0;
        this.blueBlocksCleared = 0;
        this.purpleBlocksCleared = 0;
        this.whiteBlocksCleared = 0;
        this.blackBlocksCleared = 0;
        this.setBlockCounts();

        this.totalBlobCount = blobsHelped.length;
        this.totalBlockCount = blocksCleared.length;
    }

    setBlobCounts() {
        for (let i = 0; i < this.blobsHelped.length; i++) {
            this.addToBlobCount(this.blobsHelped[i].color);
        }
    }

    addToBlobCount(color) {
        if (color === 'red') {
            this.redBlobsHelped++;
        } else if (color === 'orange') {
            this.orangeBlobsHelped++;
        } else if (color === 'yellow') {
            this.yellowBlobsHelped++;
        } else if (color === 'green') {
            this.greenBlobsHelped++;
        } else if (color === 'blue') {
            this.blueBlobsHelped++;
        } else if (color === 'purple') {
            this.purpleBlobsHelped++;
        } else if (color === 'white') {
            this.whiteBlobsHelped++;
        } else if (color === 'black') {
            this.blackBlobsHelped++;
        }
    }

    setBlockCounts() {
        for (let i = 0; i < this.blocksCleared.length; i++) {
            this.addToBlockCount(this.blocksCleared[i].color);
        }
    }

    addToBlockCount(color) {
        if (color === 'red') {
            this.redBlocksCleared++;
        } else if (color === 'orange') {
            this.orangeBlocksCleared++;
        } else if (color === 'yellow') {
            this.yellowBlocksCleared++;
        } else if (color === 'green') {
            this.greenBlocksCleared++;
        } else if (color === 'blue') {
            this.blueBlocksCleared++;
        } else if (color === 'purple') {
            this.purpleBlocksCleared++;
        } else if (color === 'white') {
            this.whiteBlocksCleared++;
        } else if (color === 'black') {
            this.blackBlocksCleared++;
        }
    }

    getColorCount(color, items) {
        let count = 0;
        for (let i = 0; i < items.length; i++) {
            if (items[i].color === color) {
                count++;
            }
        }
        return count;
    }
}

function displayProgress(game) {
    // disallow dialogue until button is pressed
    game.allowDialogue = false;
    
    // create color array to make this faster
    let colorArray = ['red', 'orange', 'yellow', 'green', 
            'blue', 'purple', 'white', 'black'];

    // create report
    let report = new Report(game.levelScore, game.score, 
        game.clearedBlocks, game.helpedBlobs);

    // store counts inside arrays
    let blobCounts = [report.redBlobsHelped, report.orangeBlobsHelped, 
        report.yellowBlobsHelped, report.greenBlobsHelped, report.blueBlobsHelped, 
        report.purpleBlobsHelped, report.whiteBlobsHelped, report.blackBlobsHelped];

    let blockCounts = [report.redBlocksCleared, report.orangeBlocksCleared, 
        report.yellowBlocksCleared, report.greenBlocksCleared, report.blueBlocksCleared,
        report.purpleBlocksCleared, report.whiteBlocksCleared, report.blackBlocksCleared];

    // insert all the level progress
    document.getElementById('levelNumber').innerHTML = game.levelNumber;
    //document.getElementById('levelScore').innerHtml = game.levelScore;
    //document.getElementById('totalScore').innerHtml = game.totalScore;

    for (let i = 0; i < colorArray.length; i++) {
        let blobCount = document.getElementById(colorArray[i] + 'BlobCount');
        blobCount.innerHTML = blobCounts[i];

        let blockCount = document.getElementById(colorArray[i] + 'BlockCount');
        blockCount.innerHTML = blockCounts[i];
    }
    
    document.getElementById('blobTotal').innerHTML = report.totalBlobCount;
    document.getElementById('blockTotal').innerHTML = report.totalBlockCount;


    // show the modal
    document.getElementById('progressModal').style.display = 'block';
}


// class Report {
//     constructor(levelScore, totalScore, clearedBlocks, blobsHelped) {
//         this.levelScore = levelScore;
//         this.totalScore = totalScore;
//         this.clearedBlocks = clearedBlocks;
//         this.blobsHelped = blobsHelped;

//         this.redBlobsHelped = this.getColorCount('red', blobsHelped);
//         this.orangeBlobsHelped = this.getColorCount('orange', blobsHelped);
//         this.yellowBlobsHelped = this.getColorCount('yellow', blobsHelped);
//         this.greenBlobsHelped = this.getColorCount('green', blobsHelped);
//         this.blueBlobsHelped = this.getColorCount('blue', blobsHelped);
//         this.purpleBlobsHelped = this.getColorCount('purple', blobsHelped);
//         this.whiteBlobsHelped = this.getColorCount('white', blobsHelped);
//         this.blackBlobsHelped = this.getColorCount('black', blobsHelped);

//         this.redBlocksCleared = this.getColorCount('red', clearedBlocks);
//         this.orangeBlocksCleared = this.getColorCount('orange', clearedBlocks);
//         this.yellowBlocksCleared = this.getColorCount('yellow', clearedBlocks);
//         this.greenBlocksCleared = this.getColorCount('green', clearedBlocks);
//         this.blueBlocksCleared = this.getColorCount('blue', clearedBlocks);
//         this.purpleBlocksCleared = this.getColorCount('purple', clearedBlocks);
//         this.whiteBlocksCleared = this.getColorCount('white', clearedBlocks);
//         this.blackBlocksCleared = this.getColorCount('black', clearedBlocks);

//         this.totalBlobCount = blobsHelped.length;
//         this.totalBlockCount = clearedBlocks.length;
//     }

//     getColorCount(color, items) {
//         let count = 0;
//         for (let i = 0; i < items.length; i++) {
//             if (items[i].color === color) {
//                 count++;
//             }
//         }
//         return count;
//     }
// }