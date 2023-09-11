// TODO remove
import firebase from 'firebase/compat/app';
import {addDoc, collection, deleteDoc, doc, getDocs, getFirestore, setDoc, updateDoc} from "firebase/firestore"
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";


// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFunctions, httpsCallable } from "firebase/functions";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import 'firebase/functions';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAoggCGTMuz7vSAOyfi1F16EVn07j1Ou4A",
    authDomain: "stock-alert-2042e.firebaseapp.com",
    projectId: "stock-alert-2042e",
    storageBucket: "stock-alert-2042e.appspot.com",
    messagingSenderId: "811152286829",
    appId: "1:811152286829:web:814cff3192cafeda0ecb64"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore();
const auth = getAuth(app);



export const newAlert = async (stock, current, target, date) => {
    await addDoc(collection(db, `users/${sessionStorage.getItem('uid')}/alerts`), {
        stock: stock,
        current: current,
        target: target,
        date: date
    })
}

export const getAlerts = async (uid) => {
    const querySnapshot = await getDocs(collection(db, `users/${uid}/alerts`));
    const list = [];
    querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        list.push(doc.data())
    });
    return list
}

export const deleteAlert = async (alertid) => {
    await deleteDoc(doc(db, `users/${sessionStorage.getItem('uid')}/alerts/${alertid}`))
}

export const updatePrice = async (newPrice, alertid) => {
    await updateDoc(doc(db, `users/${sessionStorage.getItem('uid')}/alerts/${alertid}`), {
        target: newPrice
    })
}

export default firebase;

export { auth };