import { getFunctions, httpsCallable } from "firebase/functions";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";


export const signIn = async (email, password) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    console.log(`Sign in result: ${JSON.stringify(result, null, 4)}`);
}



export const addAlert = async (data) => {
    const result = await httpsCallable(getFunctions(), 'addAlert')(data);
    console.log(`Add alerts result: ${JSON.stringify(result, null, 4)}`);
    return result.data;
}
