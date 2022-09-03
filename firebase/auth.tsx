import { FirebaseError } from "@firebase/util";
import { getAuth, signInWithPopup, GoogleAuthProvider, UserCredential, NextOrObserver } from "firebase/auth";
import { User } from "../models/user";
import { FIRESTORE_addUser, FIRESTORE_loadSingleUser, FIRESTORE_updateUser } from "./db";

export const AUTH_init = (
    setAuthUid: Function, 
    setAuthUsername: Function, 
    setAuthEmail: Function,
    setAuthPhotoURL: Function
) => {
    const auth = getAuth();

    auth.onAuthStateChanged(async (user) => {
        console.log('auth user changed: ', user);

        if (user === null) {
            setAuthUid(undefined);
            setAuthUsername(undefined);
            setAuthEmail(undefined);
            setAuthPhotoURL(undefined);
        }
        else {
            // Signed in.
            // console.dir(user);
    
            setAuthUid(user.uid);
            setAuthUsername(user.displayName);
            setAuthEmail(user.email);
            setAuthPhotoURL(user.photoURL);
    
            const signedInUser = new User(
                null,
                null,
                user.uid,
                user.displayName,
                '',
                '',
                user.email,
                user.photoURL,
                new Date(),
                new Date(),
                [],
            );
    
            // Get current user
            const foundUser = await FIRESTORE_loadSingleUser('authUid', user.uid);
            if (foundUser === null) {
                // User does not exist, create them.
                await FIRESTORE_addUser(signedInUser);
            } else {
                // Update user.dateLastActive.
                signedInUser.docId = foundUser.docId;
                signedInUser.visibleId = foundUser.visibleId;
                signedInUser.dateJoined = foundUser.dateJoined;
                signedInUser.jobLocations = foundUser.jobLocations;
    
                await FIRESTORE_updateUser(signedInUser);
            }
        }
        
    });
}

export const AUTH_signInWithGoogle = async (
    setAuthUid: Function, 
    setAuthUsername: Function, 
    setAuthEmail: Function,
    setAuthPhotoURL: Function) => {
    
    const auth = getAuth();

    // const result: UserCredential = await 
    try {
        signInWithPopup(auth, new GoogleAuthProvider()).then((result: any) => {
            console.log('sign in with popup result: ', result);
        })
        .catch(err => {
            console.error("Caught sign in error 1: ", err);
        });
    } catch(err) {
        console.error("Caught sign in error 2: ", err);
    }

}
