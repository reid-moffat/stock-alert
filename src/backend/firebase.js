import firebase from 'firebase/compat/app';
import {addDoc, collection, deleteDoc, doc, getDocs, getFirestore, setDoc, updateDoc} from "firebase/firestore"
import {createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword} from "firebase/auth";

const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID,
    measurementId: process.env.REACT_APP_MEASUREMENT_ID
};

const app = firebase.initializeApp(firebaseConfig)
const db = getFirestore();
const auth = getAuth(app);

export const signUp = async (email, password) => {
    createUserWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
            // Signed in
            const user = userCredential.user;
            const uid = user.uid;
            sessionStorage.setItem('uid', uid);
            await setDoc(doc(db, "users", uid), {email: email});
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode)
            console.log(errorMessage)
        });
}

export const signIn = async (email, password) => {
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            const uid = user.uid
            sessionStorage.setItem('uid', uid)
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode)
            console.log(errorMessage)
        });
}

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