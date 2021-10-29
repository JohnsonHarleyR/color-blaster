var levelTileWidth = 0;
var levelTileHeight = 0;

function getTileColors(level) {
    let array = ['red', 'orange', 'yellow', 'green', 
'blue', 'purple'];
if (level.generateWhite === true) {
    array.push('white');
}
    if (level.generateBlack === true) {
        array.push('black');
    }
    return array;
}

class Level {
    constructor(columns, rows, 
        generateWhite, generateBlack, 
        blocksForScore, vialCount, vialColorsToFill, 
        blobCount, maxBlobSpeed, randomizeBlobSpeed, 
        blobsMustBeInBlocks) {
        this.columns = columns;
        this.rows = rows;
        this.generateWhite = generateWhite;
        this.generateBlack = generateBlack;
        this.blocksForScore = blocksForScore;
        this.vialCount = vialCount;
        this.vialColorsToFill = vialColorsToFill;
        this.blobCount = blobCount;
        this.maxBlobSpeed = maxBlobSpeed;
        this.randomizeBlobSpeed = randomizeBlobSpeed;
        this.blobsMustBeInBlocks = blobsMustBeInBlocks;
        this.isSpecialLevel = false;
    }
}

class SpecialLevel extends Level {
    constructor(columns, rows, 
        blocksForScore, vialCount, vialColorsToFill, 
        blobColors, blobDesiredColors, blobSpeeds,
        map, openingScene) {

        super(columns, rows, 
            false, false, 
            blocksForScore, vialCount, vialColorsToFill, 
            blobColors.length, 3, false, 
            false);

        this.blobColors = blobColors;
        this.blobDesiredColors = blobDesiredColors;
        this.blobSpeeds = blobSpeeds;
        this.map = map;
        this.openingScene = openingScene;

        this.isSpecialLevel = true;
    }
}

class LevelMap {
    constructor(grid) {
            this.grid = grid;
            this.items = [
                null, // 0
                "red block", // 1
                "orange block", // 2
                "yellow block", // 3
                "green block", // 4
                "blue block", // 5
                "purple block", // 6
                "white block", // 7
                "black block", // 8
                "blob", // 9
                "npc sarah", // 10
                "npc george", // 11
                "npc onorio" // 12
            ]
        }

}

var allLevels = new Array();

// var Level1 = new Level(10, 14, true, false, 3, 
//     5, ['red', 'yellow', 'blue']);
// allLevels.push(Level1);

function generateAllLevels(gameType) {
    allLevels = new Array();
    if (gameType === 'adventure') {
        generateAdventureLevels();
    } else {
        generateArcadeLevels();
    }
    // generateFirst10();
    // generateSecond10();
    // generateThird10();
}




// level generation
function generateArcadeLevels() {
    let columns = 10;
    let rows = 12;
    let generateWhite = true;
    let generateBlack = false;
    let blocksForScore = 3;
    let vialCount = 5;
    let vialColorsToFill = ['red', 'yellow', 'blue'];
    let blobCount = 1;
    let maxBlobSpeed = 1;
    let randomizeBlobSpeed = true;
    let blobsMustBeInBlocks = true;

    for (let i = 1; i <= 200; i++) {

        // set conditions for changing level stuff
        if (i % 10 === 0) { // ADDING ROWS
            if (i === 20) { // don't add extra rows until level 20 - add 2 rows on 20 then 1 row from then on
                rows += 2;
            } else if (i != 10) { // dont add one at level 10 (reasons to do with canvas.js)
                rows++;
            }
        }

        if (i % 12 === 0) { // ADDING BLOBS
            if (blobCount < 5 || (i > 100 && i < 150)) {
                blobCount++;
            }
        }

        if (i === 15) { // ADD BLACK
            generateBlack = true;
        }

        if (i === 40) { // REMOVE WHITE
            generateWhite = false;
        }

        if (i % 55 === 0) { // INCREASE BLOB SPEED
            if (maxBlobSpeed != 3) {
                maxBlobSpeed++;
            }
        }

        if (i === 120) { // NO RANDOM BLOB SPEED
            randomizeBlobSpeed = false;
        }

        if (i === 70) { // ALLOW BLOBS OUTSIDE BLOCK AREA
            blobsMustBeInBlocks = false;
        }

        if (i % 25 === 0) { // REMOVE A VIAL UNTIL THERE ARE 3 LEFT
            if (vialCount != 3) {
                vialCount--;
            }
        }

        // determine vial information
        if (i % 10 === 0 || i % 10 === 1) {
            if (vialCount === 5) {
                vialColorsToFill = ['red', 'yellow', 'blue'];
            } else if (vialCount === 4) {
                vialColorsToFill = ['red', 'yellow', 'blue'];
            } else if (vialCount === 3) {
                let existing = new Array();
                existing.push(getRandomColor());
                existing = getRandomColorNotExisting(existing);
                vialColorsToFill = existing;
            }
        } else if (i % 10 === 2 || i === 2) {
            if (vialCount === 5) {
                let existing = new Array();
                existing.push(getRandomColor());
                existing = getRandomColorNotExisting(existing);
                vialColorsToFill = existing;
            } else if (vialCount === 4) {
                let existing = new Array();
                existing.push(getRandomColor());
                vialColorsToFill = existing;
            } else if (vialCount === 3) {
                let existing = new Array();
                vialColorsToFill = existing;
            }
        } else if (i % 10 === 3 || i === 3) {
            if (vialCount === 5) {
                let existing = ['red', 'yellow', 'blue'];
                existing = getRandomColorNotExisting(existing);
                vialColorsToFill = existing;
            } else if (vialCount === 4) {
                vialColorsToFill = ['red', 'yellow', 'blue'];
            } else if (vialCount === 3) {
                let existing = new Array();
                existing.push(getRandomColor());
                existing = getRandomColorNotExisting(existing);
                vialColorsToFill = existing;
            }
        } else if (i % 10 === 4 || i === 4) {
            if (vialCount === 5) {
                let existing = new Array();
                existing.push(getRandomColor());
                existing.push(getRandomColor());
                existing.push(getRandomColor());
                vialColorsToFill = existing;
            } else if (vialCount === 4) {
                let existing = new Array();
                existing.push(getRandomColor());
                existing.push(getRandomColor());
                vialColorsToFill = existing;
            } else if (vialCount === 3) {
                let existing = new Array();
                existing.push(getRandomColor());
                vialColorsToFill = existing;
            }
        } else if (i % 10 === 5 || i === 5) {
            if (vialCount === 5) {
                let existing = new Array();
                existing.push(getRandomColor());
                existing.push(getRandomColor());
                existing.push(getRandomColor());
                existing.push(getRandomColor());
                vialColorsToFill = existing;
            } else if (vialCount === 4) {
                let existing = new Array();
                existing.push(getRandomColor());
                existing.push(getRandomColor());
                existing.push(getRandomColor());
                vialColorsToFill = existing;
            } else if (vialCount === 3) {
                let existing = new Array();
                existing.push(getRandomColor());
                existing.push(getRandomColor());
                vialColorsToFill = existing;
            }
        }
        else if (i % 10 === 6 || i === 6) {
            if (vialCount === 5) {
                let existing = new Array();
                let color1 = getRandomColor();
                existing.push(color1);
                existing.push(color1);
                let color2 = color1;
                do {
                    color2= getRandomColor();
                } while(color2 === color1);
                existing.push(color2);
                existing.push(color2);
                vialColorsToFill = existing;
            } else if (vialCount === 4) {
                let existing = new Array();
                let color1 = getRandomColor();
                existing.push(color1);
                existing.push(color1);
                let color2 = color1;
                do {
                    color2= getRandomColor();
                } while(color2 === color1);
                existing.push(color2);
                vialColorsToFill = existing;
            } else if (vialCount === 3) {
                let existing = new Array();
                let color1 = getRandomColor();
                existing.push(color1);
                existing.push(color1);
                vialColorsToFill = existing;
            }
        }
        else if (i % 10 === 7 || i === 7) {
            if (vialCount === 5) {
                let existing = new Array();
                let color1 = getRandomColor();
                existing.push(color1);
                existing.push(color1);
                existing.push(color1);
                existing.push(color1);
                vialColorsToFill = existing;
            } else if (vialCount === 4) {
                let existing = new Array();
                let color1 = getRandomColor();
                existing.push(color1);
                existing.push(color1);
                existing.push(color1);
                vialColorsToFill = existing;
            } else if (vialCount === 3) {
                let existing = new Array();
                let color1 = getRandomColor();
                existing.push(color1);
                existing.push(color1);
                vialColorsToFill = existing;
            }
        }
        else if (i % 10 === 8 || i === 8) {
            if (vialCount === 5) {
                let existing = new Array();
                vialColorsToFill = existing;
            } else if (vialCount === 4) {
                let existing = new Array();
                vialColorsToFill = existing;
            } else if (vialCount === 3) {
                let existing = new Array();
                vialColorsToFill = existing;
            }
        }
        else if (i % 10 === 9 || i === 9) {
            if (vialCount === 5) {
                let existing = new Array();
                existing.push(getRandomColor());
                existing.push(getRandomColor());
                existing.push(getRandomColor());
                existing.push(getRandomColor());
                existing.push(getRandomColor());
                vialColorsToFill = existing;
            } else if (vialCount === 4) {
                let existing = new Array();
                existing.push(getRandomColor());
                existing.push(getRandomColor());
                existing.push(getRandomColor());
                existing.push(getRandomColor());
                vialColorsToFill = existing;
            } else if (vialCount === 3) {
                let existing = new Array();
                existing.push(getRandomColor());
                existing.push(getRandomColor());
                existing.push(getRandomColor());
                vialColorsToFill = existing;
            }
        }

        // create level
        let newLevel = new Level(columns, rows, generateWhite,
                generateBlack, blocksForScore, vialCount, 
                vialColorsToFill, blobCount, maxBlobSpeed,
                randomizeBlobSpeed, blobsMustBeInBlocks);

        // // set any special levels
        // if (i === 1) {
        //     newLevel = simpleLevel;
        // } else if (i === 2) {
        //     newLevel = rainbowWallLevel;
        // } else if (i === 3) {
        //     newLevel = learnerLevel;
        // } else {
        //     newLevel = new Level(columns, rows, generateWhite,
        //         generateBlack, blocksForScore, vialCount, 
        //         vialColorsToFill, blobCount, maxBlobSpeed,
        //         randomizeBlobSpeed, blobsMustBeInBlocks);
        // }

        allLevels.push(newLevel);
    }

}

async function generateAdventureLevels() {
    // test a level
    //allLevels.push(chessLevel);

    // order the levels
    allLevels.push(simpleLevel); // 1/10
    allLevels.push(michiganLevel); // 1/10
    allLevels.push(meetOnorioLevel); // 1/10
    allLevels.push(rainbowWallLevel); // 2/10
    allLevels.push(learnerLevel); // 3/10
    allLevels.push(pGYLevel); // 3/10
    allLevels.push(jailHouseLevel); // 4/10
    allLevels.push(ninjaStarLevel); // 5/10
    allLevels.push(chessLevel); // 5/10

    // loop through levels and add opening conversations
    for (let i = 0; i < allLevels.length; i++) {
        let openingScene = getOpeningScene(i + 1);
        allLevels[i].openingScene = openingScene;
    }
}


// SPECIAL LEVELS

// Simple Level - difficulty: 1/10
var simpleMap = new LevelMap([
    [9, 5, 0, 0, 0, 0, 0, 0, 1, 9],
    [5, 7, 0, 0, 0, 0, 0, 0, 7, 1],
    [0, 0, 0, 0, 0, 0, 0, 10, 0, 0],
    [0, 0, 0, 0, 3, 3, 0, 0, 0, 0],
    [0, 0, 0, 1, 2, 2, 1, 0, 0, 0],
    [0, 0, 6, 1, 0, 0, 1, 6, 0, 0],
    [0, 5, 6, 0, 0, 0, 0, 6, 5, 0],
    [4, 5, 0, 0, 0, 0, 0, 0, 5, 4],
    [4, 3, 0, 0, 0, 0, 0, 0, 3, 4],
    [9, 3, 0, 0, 0, 0, 0, 0, 3, 9],
    [3, 7, 0, 0, 0, 0, 0, 0, 7, 3],
    [7, 0, 0, 0, 3, 3, 0, 0, 0, 7],
    [0, 0, 0, 5, 4, 4, 5, 0, 0, 0],
    [0, 0, 1, 6, 0, 0, 6, 1, 0, 0],
]);
var simpleLevel = new SpecialLevel(
    10, 12, 3, 5,
    ["red", "yellow", "blue"],
    ["white", "white", "yellow", "yellow"],
    ["red", "blue", "green", "green"],
    [1, 1, 1, 1], simpleMap, null);

// Michigan Level - difficulty: 1/10
var michiganMap = new LevelMap([
    [9, 0, 8, 0, 0, 0, 10, 8, 0, 9],
    [0, 0, 8, 0, 0, 0, 0, 8, 0, 0],
    [2, 1, 0, 3, 0, 0, 5, 0, 1, 6],
    [2, 0, 0, 4, 3, 5, 4, 0, 0, 6],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 7, 7, 0, 0, 0, 0],
    [0, 0, 0, 5, 5, 3, 3, 0, 0, 0],
    [0, 0, 5, 4, 0, 0, 4, 3, 0, 0],
    [0, 5, 4, 0, 0, 0, 0, 4, 3, 0],
    [5, 4, 0, 0, 0, 0, 0, 0, 4, 3],
    [4, 0, 0, 0, 0, 0, 0, 0, 0, 4],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [4, 3, 0, 0, 0, 0, 0, 0, 5, 4],
    [9, 4, 0, 0, 0, 0, 0, 0, 4, 9],
]);

var michiganLevel = new SpecialLevel(
    10, 12, 3, 5,
    ["red", "yellow", "blue"],
    ["white", "white", "white", "white"],
    ["blue", "yellow", "red", "red"],
    [1, 1, 1, 1], michiganMap, null);

// Meet Onorio Level - difficulty: 1/10
var meetOnorioMap = new LevelMap([
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 12, 0, 0, 0, 0, 0, 10, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 2, 1, 2, 2, 1, 2, 1, 1],
    [0, 0, 0, 2, 7, 7, 2, 0, 0, 0],
    [0, 9, 0, 2, 7, 7, 2, 0, 9, 0],
    [0, 0, 0, 1, 2, 2, 1, 0, 0, 0],
    [0, 0, 1, 6, 5, 5, 6, 1, 0, 0],
    [0, 1, 6, 0, 0, 0, 0, 6, 1, 0],
    [1, 6, 0, 0, 0, 0, 0, 0, 6, 1],
    [6, 0, 0, 0, 0, 0, 0, 0, 0, 6],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
]);
var meetOnorioLevel = new SpecialLevel(
    10, 12, 3, 5,
    ["red", "blue", "yellow"],
    ["yellow", "purple"],
    ["orange", "blue"],
    [1, 1], meetOnorioMap, null);

// Rainbow Wall Level - difficulty: 2/10
var rainbowWallMap = new LevelMap([
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 10, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [7, 0, 7, 0, 7, 0, 7, 0, 7, 0],
    [1, 7, 1, 7, 1, 7, 1, 7, 1, 7],
    [2, 9, 2, 1, 2, 1, 2, 1, 9, 1],
    [3, 2, 3, 2, 3, 2, 3, 2, 3, 2],
    [9, 3, 4, 3, 4, 3, 4, 3, 4, 9],
    [5, 4, 5, 4, 5, 4, 5, 4, 5, 4],
    [6, 9, 6, 5, 6, 5, 6, 5, 9, 5],
    [8, 6, 8, 6, 8, 6, 8, 6, 8, 6],
    [0, 8, 0, 8, 0, 8, 0, 8, 0, 8],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
]);
var rainbowWallLevel = new SpecialLevel(
    10, 15, 3, 5,
    ["red", "yellow", "blue"],
    ["red", "orange", "yellow", "green", "blue", "purple"],
    ["white", "red", "orange", "yellow", "green", "blue"],
    [1, 1, 1, 1, 1, 1], rainbowWallMap, null);

// Learner Level - difficulty: 2/10
var learnerMap = new LevelMap([
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 11, 0, 0, 0, 0, 0, 10, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [5, 6, 5, 6, 5, 6, 5, 6, 5, 6],
    [4, 3, 4, 3, 4, 3, 4, 3, 4, 3],
    [9, 2, 1, 2, 1, 2, 1, 2, 1, 9],
    [9, 1, 2, 1, 2, 1, 2, 1, 2, 9],
    [3, 4, 3, 4, 3, 4, 3, 4, 3, 4],
    [6, 5, 6, 5, 6, 5, 6, 5, 6, 5],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
]);
var learnerLevel = new SpecialLevel(
    10, 12, 3, 5,
    ["red", "blue", "yellow",],
    ["orange", "orange", "red", "red"],
    ["red", "red", "orange", "orange"],
    [1, 1, 1, 1], learnerMap, null);

// PGY Level - difficulty 3/10
var pGYMap = new LevelMap([
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [7, 0, 0, 0, 0, 0, 0, 8, 6, 6],
    [6, 7, 0, 0, 0, 0, 0, 8, 2, 5],
    [4, 6, 7, 0, 0, 0, 0, 6, 5, 2],
    [3, 4, 6, 7, 0, 0, 0, 8, 8, 6],
    [0, 3, 4, 6, 7, 0, 0, 0, 0, 0],
    [0, 0, 3, 4, 6, 7, 0, 0, 0, 0],
    [0, 0, 0, 3, 4, 6, 7, 0, 0, 0],
    [9, 0, 0, 0, 3, 4, 6, 7, 0, 0],
    [0, 0, 0, 0, 0, 3, 4, 6, 7, 0],
    [0, 0, 9, 0, 0, 0, 3, 4, 6, 7],
    [0, 0, 0, 0, 0, 0, 0, 3, 4, 6],
    [0, 0, 0, 0, 0, 0, 0, 0, 3, 4],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 3],
]);
var pGYLevel = new SpecialLevel(
    10, 14, 3, 3,
    ["yellow", "yellow", "yellow"],
    ["black", "green"],
    ["purple", "yellow"],
    [2, 2], pGYMap, null);

// Jailhouse Level - difficulty: 4/10
var jailHouseLevelMap = new LevelMap([
    [2, 2, 3, 1, 0, 0, 1, 3, 2, 2],
    [5, 5, 6, 0, 0, 0, 0, 6, 5, 5],
    [0, 0, 1, 0, 0, 0, 0, 1, 0, 0],
    [9, 0, 1, 0, 0, 0, 0, 1, 0, 9],
    [5, 5, 6, 0, 0, 0, 0, 6, 5, 5],
    [0, 0, 5, 0, 8, 7, 0, 5, 0, 0],
    [9, 0, 5, 0, 7, 8, 0, 5, 0, 9],
    [3, 3, 4, 0, 0, 0, 0, 4, 3, 3],
    [0, 0, 3, 0, 0, 0, 0, 3, 0, 0],
    [9, 0, 3, 0, 0, 0, 0, 3, 0, 9],
    [1, 1, 2, 3, 4, 4, 3, 2, 1, 1],
    [0, 0, 1, 2, 0, 0, 2, 1, 0, 0],
    [9, 0, 1, 2, 0, 9, 2, 1, 0, 9],
    [3, 3, 2, 1, 6, 6, 1, 2, 3, 3],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
]);
var jailHouseLevel = new SpecialLevel(
    10, 15, 3, 3,
    [],
    ["yellow", "yellow", "red", "red", "purple", "blue", "purple", "blue", "white"],
    ["orange", "green", "purple", "orange", "black", "white", "blue", "purple", "black"],
    [1, 1, 1, 1, 1, 1, 1, 1, 1], jailHouseLevelMap, null);

// Ninja Star Level - difficulty: 5/10
var ninjaStarMap = new LevelMap([
	[0, 8, 0, 0, 0, 0, 0, 0, 0, 0],
	[8, 2, 8, 0, 0, 0, 0, 0, 0, 0],
	[2, 9, 2, 8, 7, 0, 7, 8, 0, 0],
	[8, 2, 8, 7, 0, 7, 8, 4, 8, 0],
	[0, 8, 7, 0, 7, 8, 4, 9, 4, 8],
	[0, 0, 8, 7, 0, 7, 8, 4, 8, 0],
	[0, 8, 6, 8, 7, 0, 7, 8, 0, 0],
	[8, 6, 9, 6, 8, 7, 0, 7, 0, 0],
	[0, 8, 6, 8, 7, 0, 7, 8, 0, 0],
	[0, 0, 8, 7, 0, 7, 8, 3, 8, 0],
	[0, 0, 0, 0, 7, 8, 3, 9, 3, 8],
	[0, 0, 0, 0, 0, 0, 8, 3, 8, 0],
	[0, 0, 0, 0, 0, 0, 0, 8, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
]);
var ninjaStarLevel = new SpecialLevel(
    10, 12, 3, 4,
    [],
    ["black", "black", "black", "black"],
    ["green", "orange", "purple", "yellow"],
    [1, 1, 1, 1], ninjaStarMap, null);


// Chess Level - difficulty: 5/10
var chessLevelMap = new LevelMap([
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[7, 8, 7, 0, 0, 0, 0, 8, 7, 8],
	[8, 9, 8, 0, 0, 0, 0, 7, 9, 7],
	[7, 8, 7, 0, 0, 0, 0, 8, 7, 8],
	[8, 7, 8, 7, 8, 7, 8, 7, 8, 7],
	[7, 8, 7, 8, 7, 8, 7, 8, 7, 8],
	[8, 7, 8, 7, 8, 7, 8, 7, 8, 7],
	[7, 8, 7, 8, 7, 8, 7, 8, 7, 8],
	[8, 7, 8, 0, 0, 0, 0, 7, 8, 7],
	[7, 9, 7, 0, 0, 0, 0, 8, 9, 8],
	[8, 7, 8, 0, 0, 0, 0, 7, 8, 7],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
]);
var chessVialColors = ['red', 'yellow', 'blue'];
var chessBlobColors = ['black', 'white', 'black', 'white'];
var chessBlobDesired = ['white', 'black', 'white', 'black'];
var chessBlobSpeeds = [1, 1, 1, 1];
var chessLevel = new SpecialLevel(10, 14, 3, 3, chessVialColors,
    chessBlobColors, chessBlobDesired, chessBlobSpeeds, chessLevelMap, null);


// returns a random color added to the existing array
function getRandomColorNotExisting(existing) {
    let options = ["red", "yellow", "blue"];

    // remove existing from options
    for (let e = 0; e < existing.length; e++) {
        // loop through options
        for (let o = 0; o < options.length; o++) {
            if (existing[e] === options[o]) {
                options.splice(o, 1);
                break;
            }
        }
    }

    // now get a random option - if there are options left
    if (options.length === 0) {
        return existing;
    } else {
        let randomIndex = Math.floor(Math.random() * options.length);
        let randomChoice = options[randomIndex];
        existing.push(randomChoice);
    }
    return existing;
}

function getRandomColor() {
    let options = ["red", "yellow", "blue"];
    let randomIndex = Math.floor(Math.random() * options.length);
        return options[randomIndex];
}

function generateFirst10() {
    let columns = 10;
    let rows = 12;
    let generateWhite = true;
    let generateBlack = false;
    let blocksForScore = 3;
    let vialCount = 5;
    let vialColorsToFill = ['red', 'yellow', 'blue'];
    let blobCount = 1;
    let maxBlobSpeed = 1;
    let randomizeBlobSpeed = false;
    let blobsMustBeInBlocks = true;

    for (let i = 1; i <= 10; i++) {

        // set conditions for changing level stuff
        if (i === 2) {
            vialColorsToFill = ['red', 'yellow', 'blue', 'red'];
        } else if (i === 3) {
            vialColorsToFill = ['red', 'yellow', 'red', 'yellow'];
        } else if (i === 4) {
            vialColorsToFill = ['red', 'yellow', 'yellow', 'yellow'];
        } else if (i === 5) {
            vialColorsToFill = ['red', 'yellow', 'yellow', 'yellow', 'blue'];
        } else if (i === 6) {
            generateBlack = true;
            vialColorsToFill = ['red', 'yellow', 'blue'];
        } else if (i === 7) {
            vialColorsToFill = ['red', 'yellow', 'blue', 'blue'];
        } else if (i === 8) {
            vialColorsToFill = ['yellow', 'yellow', 'blue', 'blue'];
        } else if (i === 9) {
            vialColorsToFill = ['red', 'yellow', 'yellow', 'blue', 'blue'];
        } else if (i === 10) {
            vialColorsToFill = ['blue', 'red', 'red', 'blue', 'blue'];
        }

        // create level
        let newLevel;

        // test
        if (i === 1) {
            newLevel = learnerLevel;
        } else {
            newLevel = new Level(columns, rows, generateWhite,
                generateBlack, blocksForScore, vialCount, 
                vialColorsToFill, blobCount, maxBlobSpeed,
                randomizeBlobSpeed, blobsMustBeInBlocks);
        }

        allLevels.push(newLevel);
    }

}

function generateSecond10() {
    let columns = 10;
    let rows = 14;
    let generateWhite = true;
    let generateBlack = true;
    let blocksForScore = 3;
    let vialCount = 4;
    let vialColorsToFill = ['red', 'yellow', 'blue'];
    let blobCount = 1;
    let maxBlobSpeed = 1;
    let randomizeBlobSpeed = false;
    let blobsMustBeInBlocks = false;

    for (let i = 1; i <= 10; i++) {
        // set conditions for changing level stuff
        if (i === 2) {
            vialColorsToFill = ['red', 'blue', 'blue'];
        } else if (i === 3) {
            vialColorsToFill = ['red', 'yellow', 'blue', 'red'];
        } else if (i === 4) {
            vialColorsToFill = ['red', 'yellow', 'red', 'yellow'];
        } else if (i === 5) {
            vialColorsToFill = ['red', 'yellow', 'yellow', 'yellow'];
        } else if (i === 6) {
            blobCount = 2;
            blobsMustBeInBlocks = true;
            vialColorsToFill = ['red', 'yellow', 'blue'];
        } else if (i === 7) {
            vialColorsToFill = ['blue', 'yellow', 'blue'];
        } else if (i === 8) {
            vialColorsToFill = ['yellow', 'yellow', 'blue', 'blue'];
        } else if (i === 9) {
            vialColorsToFill = ['red', 'red', 'red', 'red'];
        }

        // create level
        let newLevel = new Level(columns, rows, generateWhite,
            generateBlack, blocksForScore, vialCount, 
            vialColorsToFill, blobCount, maxBlobSpeed, 
            randomizeBlobSpeed, blobsMustBeInBlocks);
        allLevels.push(newLevel);
    }

}

function generateThird10() {
    let columns = 10;
    let rows = 16;
    let generateWhite = false;
    let generateBlack = true;
    let blocksForScore = 3;
    let vialCount = 4;
    let vialColorsToFill = ['yellow', 'blue'];
    let blobCount = 2;
    let maxBlobSpeed = 2;
    let randomizeBlobSpeed = true;
    let blobsMustBeInBlocks = false;

    for (let i = 1; i <= 10; i++) {
        // set conditions for changing level stuff
        if (i === 2) {
            vialColorsToFill = ['red', 'blue', 'blue'];
        } else if (i === 3) {
            vialColorsToFill = ['red', 'yellow', 'blue', 'red'];
        } else if (i === 4) {
            vialColorsToFill = ['red', 'yellow', 'red', 'yellow'];
        } else if (i === 5) {
            vialColorsToFill = ['red', 'yellow', 'yellow', 'yellow'];
        } else if (i === 6) {
            blobsMustBeInBlocks = false;
            vialColorsToFill = ['red', 'yellow'];
        } else if (i === 7) {
            vialColorsToFill = ['red', 'yellow', 'blue'];
        } else if (i === 8) {
            vialColorsToFill = ['yellow', 'red', 'red', 'blue'];
        } else if (i === 9) {
            vialColorsToFill = ['blue', 'red', 'blue', 'red'];
        }

        // create level
        let newLevel = new Level(columns, rows, generateWhite,
            generateBlack, blocksForScore, vialCount, 
            vialColorsToFill, blobCount, maxBlobSpeed, 
            randomizeBlobSpeed, blobsMustBeInBlocks);
        allLevels.push(newLevel);
    }
}

