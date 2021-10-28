///const { response } = require("express");

async function loadAll() {
    loadAllOpeningText();
    // .then(result => {
    //     Game.load();
    // });
    // loadAllOpeningText()
    // .then(result => {
    //     Game.load();
    // });
    const test = await Promise.all(promises);
    console.log(test);
}

const promises = [];

async function loadAllOpeningText() {
        let fileUrl = conversationUrl + 'script-level-1.txt';
        let textPromise = getOpeningText(fileUrl)
        .then(response => { console.log(response)} );
        promises.push(textPromise);
        //let text = await getOpeningText(fileUrl);
        console.log(textPromise);
        //return text;

    // return new Promise((resolve, reject) => {
    //     let counter = 0;
    //     do {
    //         let fileUrl = conversationUrl + 'script-level-' + (counter + 1) + '.txt';
    //         getOpeningText(fileUrl)
    //         .then(text => {
    //             console.log(text);
    //             counter++;
    //         })
    //     } while (counter < 200);
    //     // for (let i = 0; i < 200; i++) {
    //     //     let fileUrl = conversationUrl + 'script-level-' + (levelNumber + 1) + '.txt';
    //     //     let result = getOpeningText(fileUrl);
    //     //     console.log(result);
    //     // }
    //     return resolve(true);
    //});
}

// async function loadAllOpeningText() {
//     let counter = 0;
//     do {
//         let fileUrl = conversationUrl + 'script-level-' + (counter + 1) + '.txt';
//         let text = await getOpeningText(fileUrl);
//         console.log(text);
//         counter++;
//     } while (counter < 200);
//     return true;
//     // return new Promise((resolve, reject) => {
//     //     let counter = 0;
//     //     do {
//     //         let fileUrl = conversationUrl + 'script-level-' + (counter + 1) + '.txt';
//     //         getOpeningText(fileUrl)
//     //         .then(text => {
//     //             console.log(text);
//     //             counter++;
//     //         })
//     //     } while (counter < 200);
//     //     // for (let i = 0; i < 200; i++) {
//     //     //     let fileUrl = conversationUrl + 'script-level-' + (levelNumber + 1) + '.txt';
//     //     //     let result = getOpeningText(fileUrl);
//     //     //     console.log(result);
//     //     // }
//     //     return resolve(true);
//     //});
// }

async function getOpeningText(fileUrl) {
    try {
        let result = $.ajax({
            url: fileUrl,
            type: 'get',
            dataType: 'json',
        })
        return result;
    }
    catch (error)
    {
        console.log(error);
    }

}

// const getOpeningText = function(fileUrl) {
//     return new Promise((resolve, reject) => {
//         try {

//             let client = new XMLHttpRequest();
//             client.open('GET', fileUrl);
//             client.onreadystatechange = function() {
//                 console.log('response: ' + client.responseText);
//                 return resolve(client.responseText);
//             }
//             client.send();
//         } catch (error) {
//             console.log('error: ' + error);
//             return reject(error);
//         }
//     });
// }