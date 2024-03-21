// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { DocumentData, DocumentReference, arrayUnion, doc, getDoc, getFirestore, setDoc, updateDoc } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { useToast } from "@chakra-ui/react";
import activeUsers from "../frontend/src/activeUsers.json";
import { set } from "ramda";
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
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const toast = useToast();
export const auth = getAuth();

const handleJoin = (userName: string, pass: string) => {
  createUserWithEmailAndPassword(auth, userName, pass)
    .then(async (userCredential: { user: any; }) => {

      const user = userCredential.user;
      await setDoc(doc(db, "users", user), {
        currency: 0,
        inventory: [],
      })

      const curUser = { "username": userName, "credential": user };
      const fs = require("fs");
      let usersJson = fs.readFileSync("activeUsers.json", "utf-8");
      let users = JSON.parse(usersJson);
      users.push(curUser);
      usersJson = JSON.stringify(users);
      fs.writeFileSync("activeUsers.json", usersJson, "utf-8");
    })
    .catch((error: { code: any; message: any; }) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      if (errorCode == 'auth/email-already-in-use') {
        signInWithEmailAndPassword(auth, userName, pass)
          .then((userCredential: { user: any; }) => {
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
          .catch((error: { code: any; message: any; }) => {
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

const getCurrency = async (userName: string) => {
  const cred = activeUsers.find((user: { username: string; }) => user.username === userName);
  if (cred) {
    const docRef = doc(db, "users", cred.credential);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data().currency;
    }
    else {
      throw new Error("User data not found");
    }
  }
  else {
    throw new Error("User not found");
  }
}
// Option for updating currency based on local total being tracked and then updating
const updateCurrency = (userName: string, newValue : number) => {
  const cred = activeUsers.find((user: { username: string; }) => user.username === userName);
  if (cred) {
    const userRef = doc(db, "users", cred.credential);
    updateDoc(userRef, {currency: newValue}); 
  }
  else {
    throw new Error("User not found");
  }
 }
// Option for updating currency based on running net total earned/lossed in session
//  const updateCurrency = (userName: string, newValue : number) => {
//   const cred = activeUsers.find((user: { username: string; }) => user.username === userName);
//   if (cred) { 
//     const userRef = doc(db, "users", cred.credential);
//     updateDoc(userRef, {currency: increment(newValue)}); 
//   }
//   else {
//     throw new Error("User not found");
//   }
//  }

 const getInventory = async (userName: string) => {
  const cred = activeUsers.find((user: { username: string; }) => user.username === userName);
  if (cred) {
    const docRef = doc(db, "users", cred.credential);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data().inventory;
    }
    else {
      throw new Error("User data not found");
    }
  }
  else {
    throw new Error("User not found");
  }
}

const updateInventory =  (userName: string, newValue : number) => {
  const cred = activeUsers.find((user: { username: string; }) => user.username === userName);
  if (cred) {
    const userRef = doc(db, "users", cred.credential);
    updateDoc(userRef, {inventory: arrayUnion(newValue)}); 
  }
  else {
    throw new Error("User not found");
  }
 }

