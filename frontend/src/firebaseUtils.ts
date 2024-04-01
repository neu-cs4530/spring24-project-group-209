import {
  arrayUnion,
  doc,
  getDoc,
  getFirestore,
  increment,
  setDoc,
  updateDoc,
} from '@firebase/firestore';
// import {
//   getAuth,
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
//   UserCredential,
// } from '@firebase/auth';
import { getApp } from '@firebase/app';

// export const handleLogin = (userName: string, pass: string): boolean => {
//
//   const db = getFirestore(getApp());
//   createUserWithEmailAndPassword(auth, userName, pass)
//     .then((userCredential: UserCredential) => {
//       const user = userCredential.user;
//       setDoc(doc(db, 'users', user.uid), {
//         // Use user.uid as the path for the document reference
//         currency: 2000,
//         inventory: [],
//         lastLogin: Date.now(),
//       });

//       return;
//     })
//     .catch((error: { code: string; message: string }) => {
//       const errorCode = error.code;
//       console.log(errorCode);
//       if (errorCode == 'auth/email-already-in-use') {
//         signInWithEmailAndPassword(auth, userName, pass)
//           .then((userCredential: UserCredential) => {
//             // Signed in
//             const user = userCredential.user;
//             if (user) {
//               return;
//             }
//           })
//           .catch((errorSignin: { code: never; message: never }) => {
//             if (errorSignin) {
//               return;
//             }
//           });
//       }
//     });
//   if (auth.currentUser) {
//     return true;
//   } else {
//     return false;
//   }
// };
export const updateLoginTime = async (userName: string) => {
  const db = getFirestore(getApp());
  const docRef = doc(db, 'users', userName);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    if (docSnap.data().lastLogin.valueOf() / 1000 < Date.now() / 1000 - 86400) {
      updateDoc(docRef, { currency: increment(2000), lastLogin: Date.now() });
    }
  } else {
    throw new Error('User data not found');
  }
};

export const handleLogin = async (userName: string, pass: string): Promise<boolean> => {
  const db = getFirestore(getApp());
  const docRef = doc(db, 'users', userName);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    if (docSnap.data().password == pass) {
      return true;
    } else {
      return false;
    }
  } else {
    await setDoc(docRef, {
      // Use user.uid as the path for the document reference
      activeSkin: 'defaultSkin',
      currency: 2000,
      inventory: ['defaultSkin'],
      lastLogin: Date.now(),
      password: pass,
    });
    updateLoginTime(userName);
    return true;
  }
};

export const getCurrency = async (userName: string) => {
  const db = getFirestore(getApp());

  const cred = userName;
  if (cred) {
    const docRef = doc(db, 'users', cred);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data().currency;
    } else {
      throw new Error('User data not found');
    }
  } else {
    throw new Error('User not found');
  }
};
// Option for updating currency based on local total being tracked and then updating
export const updateCurrency = (userName: string, newValue: number) => {
  const db = getFirestore(getApp());

  if (userName) {
    const userRef = doc(db, 'users', userName);
    updateDoc(userRef, { currency: newValue });
  } else {
    throw new Error('User not found');
  }
};

//Option for updating currency based on running net total earned/lossed in session
export const updateCurrencyIncrement = (userName: string, newValue: number) => {
  const db = getFirestore(getApp());

  const cred = userName;
  if (cred) {
    const userRef = doc(db, 'users', cred);
    updateDoc(userRef, { currency: increment(newValue) });
  } else {
    throw new Error('User not found');
  }
};

export const getInventory = async (userName: string) => {
  const db = getFirestore(getApp());

  const cred = userName;
  if (cred) {
    const docRef = doc(db, 'users', cred);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data().inventory;
    } else {
      throw new Error('User data not found');
    }
  } else {
    throw new Error('User not found');
  }
};

export const updateInventory = (userName: string, newValue: number) => {
  const db = getFirestore(getApp());

  const cred = userName;
  if (cred) {
    const userRef = doc(db, 'users', cred);
    updateDoc(userRef, { inventory: arrayUnion(newValue) });
    updateDoc(userRef, { activeSkin: newValue });
  } else {
    throw new Error('User not found');
  }
};
