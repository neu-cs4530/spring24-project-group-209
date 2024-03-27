import { arrayUnion, doc, getDoc, getFirestore, increment, setDoc, updateDoc } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { useToast } from "@chakra-ui/react";
import activeUsers from "../frontend/src/activeUsers.json";
import { app } from "./firebaseInit";

export const handleJoin = (userName: string, pass: string) => {
    const auth = getAuth();
    const db = getFirestore(app);
    const toast = useToast();
    createUserWithEmailAndPassword(auth, userName, pass)
        .then(async (userCredential: { user: any; }) => {

            const user = userCredential.user;
            await setDoc(doc(db, "users", user), {
                currency: 2000,
                inventory: [],
                lastLogin: Date.now(),
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
                    .then(async (userCredential: { user: any; }) => {
                        // Signed in 
                        const user = userCredential.user;
                        const curUser = { userName: user };
                        const fs = require("fs");
                        let usersJson = fs.readFileSync("activeUsers.json", "utf-8");
                        let users = JSON.parse(usersJson);
                        users.push(curUser);
                        usersJson = JSON.stringify(users);
                        fs.writeFileSync("activeUsers.json", usersJson, "utf-8");

                        const db = getFirestore(app);
                        const cred = user;
                        if (cred) {
                            const docRef = doc(db, "users", cred.credential);
                            const docSnap = await getDoc(docRef);
                            if (docSnap.exists()) {
                                if ((docSnap.data().lastLogin.valueOf() / 1000) < (Date.now() / 1000 - 86400)) {
                                    updateDoc(docRef, { currency: increment(2000), lastLogin: Date.now() });
                                }
                            }
                            else {
                                throw new Error("User data not found");
                            }
                        }
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

export const getCurrency = async (userName: string) => {
    const db = getFirestore(app);
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
export const updateCurrency = (userName: string, newValue: number) => {
    const db = getFirestore(app);
    const cred = activeUsers.find((user: { username: string; }) => user.username === userName);
    if (cred) {
        const userRef = doc(db, "users", cred.credential);
        updateDoc(userRef, { currency: newValue });
    }
    else {
        throw new Error("User not found");
    }
}

//Option for updating currency based on running net total earned/lossed in session
export const updateCurrencyIncrement = (userName: string, newValue: number) => {
    const db = getFirestore(app);
    const cred = activeUsers.find((user: { username: string; }) => user.username === userName);
    if (cred) {
        const userRef = doc(db, "users", cred.credential);
        updateDoc(userRef, { currency: increment(newValue) });
    }
    else {
        throw new Error("User not found");
    }
}

export const getInventory = async (userName: string) => {
    const db = getFirestore(app);
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

export const updateInventory = (userName: string, newValue: number) => {
    const db = getFirestore(app);
    const cred = activeUsers.find((user: { username: string; }) => user.username === userName);
    if (cred) {
        const userRef = doc(db, "users", cred.credential);
        updateDoc(userRef, { inventory: arrayUnion(newValue) });
    }
    else {
        throw new Error("User not found");
    }
}