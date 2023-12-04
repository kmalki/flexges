
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const functions = require("firebase-functions"),
    PubSub = require(`@google-cloud/pubsub`),
    admin = require("firebase-admin");

const app = admin.initializeApp();
const firestore = app.firestore();

const FieldValue = require('firebase-admin').firestore.FieldValue;

firestore.settings({ timestampsInSnapshots: true });

const roomsRef = firestore.collection("rooms");

exports.countRoom = functions.region('europe-west1').pubsub.topic("projetannuel-309416-topic-firestore").onPublish(async (message) => {
    const roomName = message.attributes.roomName;
    const roomId = message.attributes.roomId;
    const enterpriseName = message.attributes.enterpriseName;
    const event = message.attributes.event;
    var increment = 0;
    switch(event){
        case 'ENTER' :
            increment = 1;
            break;
        case 'EXIT' :
            increment = -1;
            break;
    }
    await roomsRef.doc(roomId).get().then((doc) => {
            doc.ref.update({current: FieldValue.increment(increment)});
    })
});