import {
  arrayUnion,
  doc,
  getDoc,
  getFirestore,
  increment,
  setDoc,
  updateDoc,
} from '@firebase/firestore';
import { getApp } from '@firebase/app';

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
      activeSkin: 'SKIN1',
      currency: 6000,
      inventory: ['SKIN1'],
      lastLogin: Date.now(),
      password: pass,
    });
    updateLoginTime(userName);
    return true;
  }
};

export const getCurrency = async (userName: string): Promise<number> => {
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

export const getInventory = async (userName: string): Promise<string[]> => {
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
export const getActiveSkin = async (userName: string): Promise<string> => {
  const db = getFirestore(getApp());

  const cred = userName;
  if (cred) {
    const docRef = doc(db, 'users', cred);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data().activeSkin;
    } else {
      throw new Error('User data not found');
    }
  } else {
    throw new Error('User not found');
  }
};

export const updateInventory = (userName: string, newValue: string) => {
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
