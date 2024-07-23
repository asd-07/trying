import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  updatePassword,
  updateProfile
} from "firebase/auth";
import { auth, db } from "../firebase"; // Replace with your Firebase configuration
import { setDoc, doc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const userAuthContext = createContext();

export function UserAuthContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function logIn(email, password) {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      return userCredential.user;
    } catch (error) {
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function signUp(email, password, additionalData) {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await setDoc(doc(db, "users", user.uid), {
        ...additionalData,
        email,
        uid: user.uid,
      });
      setUser(user);
      return user;
    } finally {
      setLoading(false);
    }
  }

  function logOut() {
    setLoading(true);
    return signOut(auth).finally(() => setLoading(false));
  }

  function googleSignIn() {
    setLoading(true);
    const googleAuthProvider = new GoogleAuthProvider();
    return signInWithPopup(auth, googleAuthProvider).finally(() => setLoading(false));
  }

  function changePassword(newPassword) {
    setLoading(true);
    if (user) {
      return updatePassword(auth.currentUser, newPassword).finally(() => setLoading(false));
    }
    return Promise.reject(new Error("No user is logged in"));
  }

  async function changeProfilePicture(file) {
    setLoading(true);
    setError(null); // Reset error before new operation
    const storage = getStorage();
    if (user) {
      const userId = user.uid; // Use user ID for unique path
      const storageRef = ref(storage, `profilePictures/${userId}`);
      try {
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        await updateProfile(auth.currentUser, { photoURL: downloadURL });
        setUser({ ...user, photoURL: downloadURL }); // Update user state with new photo URL
        setLoading(false);
        return downloadURL;
      } catch (error) {
        setError(error);
        setLoading(false);
        throw error;
      }
    } else {
      setLoading(false);
      return Promise.reject(new Error("No user is logged in"));
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <userAuthContext.Provider
      value={{
        user,
        logIn,
        signUp,
        logOut,
        googleSignIn,
        changePassword,
        changeProfilePicture,
        loading,
        error,
      }}
    >
      {children}
    </userAuthContext.Provider>
  );
}

export function useUserAuth() {
  return useContext(userAuthContext);
}
