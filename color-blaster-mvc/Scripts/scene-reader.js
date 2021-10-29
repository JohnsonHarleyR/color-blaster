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

    let conversation = new Conversation(levelNumber, "opening", dialogues);
    let animation = new OpeningAnimation(null); // temporary

    return new OpeningScene(levelNumber, actionOrder, conversation, animation);
}

function createSceneInformation(text) {
    // let text = fs.readFileSync(fileUrl);
    let lines = text.split("\n");

    // now turn it into information
    let actionOrder = new Array();
    let dialogues = new Array();
    let animations = new Array();
    for (let i = 0; i < lines.length; i++) {
        let splitArray = lines[i].split(" | ");
        actionOrder.push(splitArray[0].trim());
        if (splitArray[0].trim() === 'D') {
            dialogues.push(createDialogueFromLineArray(splitArray, i));
        }
        // TODO: create else for animation
    }
    return [actionOrder, dialogues, animations];
}

function getRegularConversation(levelNumber) {
    // NOTE: for this, there should be an animation where the npc faces the character,
    // then looks back to their original direction.
    let fileUrl = conversationUrl + 'script-level-' + levelNumber + '.txt';
    let text = fs.readFileSync(fileUrl);
    let lines = text.split("\n");

    // now turn it into a conversation
    let dialogues = new Array();
    for (let i = 0; i < lines.length; i++) {
        dialogues.push(createDialogueFromLine(lines[i], i));
    }
    return dialogues;
}

function createDialogueFromLine(line, dialogueIndex) {
    let splitArray = line.split(" | ");
    let character = getCharacterByName(splitArray[0]);
    let newDialogue = new Dialogue(character, splitArray[1],
        splitArray[2], dialogueIndex)
    return newDialogue;
}

// for a piece of dialogue in a conversation
function createDialogueFromLineArray(splitArray, dialogueIndex) {
    let character = getCharacterByName(splitArray[1]);
    let newDialogue = new Dialogue(character, splitArray[2],
        splitArray[3], dialogueIndex)
    return newDialogue;
}