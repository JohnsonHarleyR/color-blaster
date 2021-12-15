var beginningPath = window.location.pathname;
var fileReader = new FileReader();
var conversationUrl = "files/conversations/";
var conversationFileStart = 'script-level-';
fixBeginningPath();

function fixBeginningPath() {
    let endLength = 11;
    let endIndex = beginningPath.length - endLength + 1;
    beginningPath = beginningPath.substring(0, endIndex);
}

//var fs = require('fs');

function getConversation(levelNumber, type) {
    if (type === 'opening') {
        getOpeningConversation(levelNumber);
    }
    
}



//async function getTextFromFile(fileUrl) {
//    try {
//        let client = new XMLHttpRequest();
//        client.open('GET', fileUrl);
//        client.onreadystatechange = function() {
//            text = client.responseText;
//            console.log('response: ' + client.responseText);
//        }
//        client.send();
//    } catch (error) {
//        console.log('error: ' + error);
//        return;
//    }
//}

function getOpeningScene(levelNumber) {
    let text = openingDialogueTexts[levelNumber - 1];
    if (text === null || text.trim() === "") {
        return null;
    }
    let sceneInformation = createSceneInformation(text);

    let actionOrder = sceneInformation[0];
    let dialogues = sceneInformation[1];
    let animationIntervals = sceneInformation[2];
    let startAtEnd = sceneInformation[3];
    let endInfo = sceneInformation[4];

    let conversation = new Conversation(levelNumber, "opening", dialogues);
    let animation = new OpeningAnimation(animationIntervals);

    return new OpeningScene(levelNumber, actionOrder, conversation, animation, startAtEnd, endInfo);
}

function createSceneInformation(text) {
    // let text = fs.readFileSync(fileUrl);
    let lines = text.split("\n");

    // now turn it into information
    let actionOrder = new Array();
    let dialogues = new Array();
    let animations = new Array();
    let animationIndex = 0

    let startAtEnd = false;
    let endInfo = new Array(); // TODO create methods to move characters to correct positions

    for (let i = 0; i < lines.length; i++) {
        let splitArray = lines[i].split(" | ");
        actionOrder.push(splitArray[0].trim());
        if (splitArray[0].trim() === 'D') {
            dialogues.push(createDialogueFromLineArray(splitArray, i));
        } else if (splitArray[0].trim() === 'A') {
            animations.push(createAnimationIntervalFromLineArray(splitArray, animationIndex));
            animationIndex++;

        } else if (splitArray[0].trim() === '***') {
            startAtEnd = true;
        } else if (splitArray[0].trim() === 'E') {
            endInfo.push(createEndInfoFromLine(splitArray));

        }
    }
    return [actionOrder, dialogues, animations, startAtEnd, endInfo];
}

function createEndInfoFromLine(splitArray) {
    let character = getCharacterByName(splitArray[1]);
    let newXi = null;
    let newYi = null;
    if (splitArray[2] != 'null' && splitArray[3] != 'null') {
        newXi = parseFloat(splitArray[2].trim());
        newYi = parseFloat(splitArray[3].trim());
    }
    return {
        character: character,
        Xi: newXi,
        Yi: newYi
    }
}

function createDialogueFromLine(line, sceneIndex) {
    let splitArray = line.split(" | ");
    let character = getCharacterByName(splitArray[0]);
    let newDialogue = new Dialogue(character, splitArray[1],
        splitArray[2], sceneIndex)
    return newDialogue;
}

function createAnimationIntervalFromLineArray(splitArray, sceneIndex) {
    let character = getCharacterByName(splitArray[1]);
    let animationsAtOnce = parseInt(splitArray[2].trim());
    let animationType = splitArray[3].trim();
    let keyword = splitArray[4].trim();
    if (keyword === 'null') { keyword = null; }
    let newX;
    let newY;
    if (splitArray[5].trim() === 'null') { newX = -1; newY = -1; }
    else {
        newX = parseFloat(splitArray[5].trim());
        newY = parseFloat(splitArray[6].trim());
    }
    let interval;
    if (splitArray[7].trim() === 'null') {
        interval = -1;
    } else {
        interval = parseFloat(splitArray[7].trim());
    }
    return new OpeningAnimationInterval(sceneIndex, animationsAtOnce, character,
        animationType, keyword, newX, newY, interval);
}

// for a piece of dialogue in a conversation
function createDialogueFromLineArray(splitArray, sceneIndex) {
    let character = getCharacterByName(splitArray[1]);
    let newDialogue = new Dialogue(character, splitArray[2],
        splitArray[3], sceneIndex)
    return newDialogue;
}