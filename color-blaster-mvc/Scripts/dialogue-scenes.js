class OpeningScene {
    constructor(levelNumber, actionOrder, conversation, animation) {
        this.levelNumber = levelNumber;
        this.actionOrder = actionOrder;
        this.conversation = conversation;
        this.animation = animation;

        this.actionIndex = 0;
        this.conversationIndex = 0;
        this.animationIndex = 0;

        this.repeatConvoSeen = false;
    }


}

function getRepeatSceneConversation(level) {
    let dialogues = new Array();
    dialogues.push(new Dialogue(MainCharacter, 'surprised', "Woah, didn't that already happen? Deja vu.", 0));
    dialogues.push(new Dialogue(MainCharacter, 'happy', "Either the magic here has funky side-effects, or there were some lazy programmers.", 1));
    return new Conversation(level, 'opening', dialogues);
}

//function getOpeningScene(levelNumber) {
//    //if (levelNumber === 1) {
//    //  let conversation = getOpeningConversation(levelNumber);
//    //    //return new OpeningScene(levelNumber, getOpeningConversation1(), GetTestOpeningAnimation());
//    //    return new OpeningScene(levelNumber, conversation, GetTestOpeningAnimation());
//    //}

//    let conversation = getOpeningConversation(levelNumber);
//    //return new OpeningScene(levelNumber, getOpeningConversation1(), GetTestOpeningAnimation());
//    //let animation = GetTestOpeningAnimation();
//    let animation = null;
//    if (conversation === null && animation === null) {
//        return null;
//    }
//    return new OpeningScene(levelNumber, conversation, animation);
//}

function createConversation(levelNumber, type, characters, moods, lines) {
    let dialogues = new Array();
    for (let i = 0; i < lines.length; i++) {
        dialogues.push(new Dialogue(characters[i], moods[i], lines[i], i));
    }
    return new Conversation(levelNumber, type, dialogues);
}

function getOpeningConversation1() {
 var testDialogue1 = new Dialogue(Sarah, "happy",
 "Harley! Oh my god, I found you!", 0);
 var testDialogue2 = new Dialogue(MainCharacter, "flirty",
 "Hey Sarah, I'm happy to see you!", 1);
  var testDialogue3 = new Dialogue(MainCharacter, "surprised",
 "Wait, why are you here? I barely know why I'M here!", 2);
 var testDialogue4 = new Dialogue(Sarah, "nervous",
 "Did you have one of those weird visions too?", 3);
  var testDialogue5 = new Dialogue(Sarah, "happy",
 "I guess I'm here for... Maintenance and plumbing?", 4);
   var testDialogue6 = new Dialogue(MainCharacter, "laugh",
 "That's funny, well I'm glad you're here.", 5);
 var testDialogue7 = new Dialogue(Sarah, "happy",
 "Yeah.", 6);
 var testDialogue8 = new Dialogue(Sarah, "angry",
 "Not that I liked being sucked into some strange world...", 7);
  var testDialogue9 = new Dialogue(Sarah, "normal",
 "Anyway, did your dream vision say why you are here?", 8);
  var testDialogue10 = new Dialogue(MainCharacter, "surprised",
 "Umm something to do with being an artist?", 9);
   var testDialogue11 = new Dialogue(MainCharacter, "surprised",
 "I guess I'm supposed to shoot colors at things with this gun.", 10);
var testDialogue12 = new Dialogue(Sarah, "sad",
 "*sigh* You'd think those visions would explain things more.", 11);
 var testDialogue13 = new Dialogue(Sarah, "happy",
 "Hey, why don't you use that fancy gun to help us get to that door over there?", 12);
 var testDialogue14 = new Dialogue(MainCharacter, "flirty",
 "Ok.", 13);
  var testDialogue15 = new Dialogue(MainCharacter, "nervous",
 "Maybe we can figure out what the heck is actually happening.", 14);
 var testDialogue16 = new Dialogue(Sarah, "flirty",
 "We will. It will be alright, sweetness.", 15);
   var testDialogue17 = new Dialogue(MainCharacter, "flirty",
 "<3", 16);
 var testDialogueArray = [testDialogue1, testDialogue2, testDialogue3, testDialogue4,
        testDialogue5, testDialogue6, testDialogue7, testDialogue8, testDialogue9,
        testDialogue10, testDialogue11, testDialogue12, testDialogue13, testDialogue14,
        testDialogue15, testDialogue16, testDialogue17];
var opening1 = new Conversation(1, "opening", testDialogueArray);
return opening1;
}