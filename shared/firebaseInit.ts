// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { useToast } from "@chakra-ui/react";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD9U0yWAUwL4gPcgR91xdcX7ywqO2gq2Nc",
  authDomain: "fswe-group-209.firebaseapp.com",
  projectId: "fswe-group-209",
  storageBucket: "fswe-group-209.appspot.com",
  messagingSenderId: "623540812339",
  appId: "1:623540812339:web:7dc06f966796892e014146",
  measurementId: "G-R2MKL7L24L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const handleJoin = (userName: string, pass: string) => {
  const toast = useToast();
  const auth = getAuth();
  const db = getFirestore();
  createUserWithEmailAndPassword(auth, userName, pass)
    .then((userCredential) => {
      
      const user = userCredential.user;
      return db.collection("users").doc(user).set({
        currency : 0,
        inventory : [],
      })

      const curUser = { userName: user };
      const fs = require("fs");
      let usersJson = fs.readFileSync("activeUsers.json", "utf-8");
      let users = JSON.parse(usersJson);
      users.push(curUser);
      usersJson = JSON.stringify(users);
      fs.writeFileSync("activeUsers.json", usersJson, "utf-8");
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      if (errorCode == 'auth/email-already-in-use') {
        signInWithEmailAndPassword(auth, userName, pass)
          .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;

            const curUser = { userName: user };
            const fs = require("fs");
            let usersJson = fs.readFileSync("activeUsers.json", "utf-8");
            let users = JSON.parse(usersJson);
            users.push(curUser);
            usersJson = JSON.stringify(users);
            fs.writeFileSync("activeUsers.json", usersJson, "utf-8");
            // ...
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            toast({
              title: 'Unable to join town',
              description: 'Incorrect password or username already in use. Please try again.',
              status: 'error',
            });
            return;
          });
      }
      // ..
    });
}