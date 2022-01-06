import firebase from "firebase/app";
import "firebase/messaging";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBwl7MkF5KrDREPzDKIQSxH0sBE93JNSpw",
    authDomain: "farenow-e023a.firebaseapp.com",
    projectId: "farenow-e023a",
    storageBucket: "farenow-e023a.appspot.com",
    messagingSenderId: "604353431757",
    appId: "1:604353431757:web:5dbf862d8c308c80e28184",
    measurementId: "G-1X3ZF9YVWE"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

export const getToken = async () => {
    let currentToken = "";

    try {
        currentToken = await messaging.getToken({ vapidKey: "BPCx5OIllrTpV_q1JisNn3o23k1co5usAIwFHCEByNN6aHvucTDL0l9idRk9H2ESXxECuIdybu3MInYYyrVqQ9s" });
        if (currentToken) {
            return currentToken;
        }
    } catch (error) {
        console.log("An error occurred while retrieving token. ", error);
    }

    return currentToken;
};

export const onMessageListener = () => {
    return new Promise((resolve) => {
        messaging.onMessage((payload) => {
            resolve(payload);
        });
    });
}