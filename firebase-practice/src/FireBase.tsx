import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyC7IT7tMtvVzSI2tj7JSPfdU3tZSgXCcG4",
  authDomain: "fir-practice-d0e2e.firebaseapp.com",
  projectId: "fir-practice-d0e2e",
  storageBucket: "fir-practice-d0e2e.appspot.com",
  messagingSenderId: "116460764746",
  appId: "1:116460764746:web:73f450e7b7442ff3a230b3",
}
const FireBasApp = initializeApp(firebaseConfig)
export const authService = getAuth(FireBasApp)
