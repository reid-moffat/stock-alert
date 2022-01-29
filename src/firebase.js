import firebase from 'firebase'
import {addDoc, collection, deleteDoc, doc, getDocs, getFirestore, setDoc, updateDoc} from "firebase/firestore"
import {createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword} from "firebase/auth";

const firebaseConfig = {
    apiKey: process.env.DB_API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID,
    measurementId: process.env.MEASUREMENT_ID
};

!firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app()

const db = getFirestore();
const auth = getAuth();

const signUp = async (email, password) => {
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
            // ..
        });
}

const signIn = async (email, password) => {
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            const uid = user.uid
            sessionStorage.setItem('uid', uid)
            // ...
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
        });
}

const newAlert = async (stock, current, target, date) => {
    await addDoc(collection(db, `users/${sessionStorage.getItem('uid')}/alerts`), {
        stock: stock,
        current: current,
        target: target,
        date: date
    })
}

const getAlerts = async (uid) => {
    return await getDocs(query(collection(db, `users/${uid}/alerts`)))
}

const deleteAlert = async (alertid) => {
    await deleteDoc(doc(db, `users/${sessionStorage.getItem('uid')}/alerts/${alertid}`))
}

const updatePrice = async (newPrice, alertid) => {
    await updateDoc(doc(db, `users/${sessionStorage.getItem('uid')}/alerts/${alertid}`), {
        target: newPrice
    })
}
