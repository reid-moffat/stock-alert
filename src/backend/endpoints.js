import {getFunctions, httpsCallable} from "firebase/functions";
import {signInWithEmailAndPassword} from "firebase/auth";
import {auth} from "./firebase";

export const signUp = async (email, password) => {
    const addMessage = httpsCallable(getFunctions(), 'createAccount');
    const rsp = await addMessage({ email, password });
    console.log(`Sign up response: ${JSON.stringify(rsp, null, 4)}`);
}

export const signIn = async (email, password) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    console.log("Sign in result: " + JSON.stringify(result, null, 4));
}
