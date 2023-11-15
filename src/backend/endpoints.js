import { getFunctions, httpsCallable } from "firebase/functions";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";

export const signUp = async (email, password) => {
    const result = await httpsCallable(getFunctions(), 'createAccount')({ email, password });
    console.log(`Sign up response: ${JSON.stringify(result, null, 4)}`);
}

export const signIn = async (email, password) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    console.log(`Sign in result: ${JSON.stringify(result, null, 4)}`);
}

export const forgotPassword = async (email) => {
    const result = httpsCallable(getFunctions(), 'sendPasswordResetEmail')({ email });
    console.log(`Password reset email response: ${JSON.stringify(result, null, 4)}`);
}

export const getAlerts = async () => {
    const result = await httpsCallable(getFunctions(), 'getAlerts')();
    console.log(`Get alerts result: ${JSON.stringify(result, null, 4)}`);
    return result.data;
}

export const addAlert = async (data) => {
    const result = await httpsCallable(getFunctions(), 'addAlert')(data);
    console.log(`Add alerts result: ${JSON.stringify(result, null, 4)}`);
    return result.data;
}
