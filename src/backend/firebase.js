import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";

// Firebase configuration (API key is not private like typical API keys)
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

const auth = getAuth(app);

export { auth };
