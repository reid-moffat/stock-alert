import firebase from 'firebase/compat/app';
import {addDoc, collection, deleteDoc, doc, getDocs, getFirestore, setDoc, updateDoc, query} from "firebase/firestore"
import {createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword} from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyD8FI9mWCuCnt7AD3Rhupxy0JmNpA2BCH8",
  authDomain: "stock-alert-3acd3.firebaseapp.com",
  projectId: "stock-alert-3acd3",
  storageBucket: "stock-alert-3acd3.appspot.com",
  messagingSenderId: "775617567958",
  appId: "1:775617567958:web:af9c038eddbdef25aa3d77",
  measurementId: "G-T0LDF0MTP8"
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
    var list = []
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