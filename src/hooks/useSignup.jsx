import { useState, useEffect } from "react";
import { auth, fireStore } from "../firebaseDatabase/config";
import { useAuthContext } from "./useAuthContext";

export const useSignup = () => {
  const [isCancelled, setIsCancelled] = useState(false);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const { dispatch } = useAuthContext();
const signup = async (
  {
    email,
    password,
    displayName,
    registerNumber,
    department,
    year,
    section,
    semester,
    isEnroll,
  },
  handleDownloadPassword
) => {
  setError(null);
  setIsPending(true);

  let userCreated = false;
  let userRef; // Define userRef outside the transaction

  try {
    // Create user in Firebase Authentication
    const res = await auth.createUserWithEmailAndPassword(email, password);
    if (!res) {
      throw new Error("Could not complete signup");
    }
    userCreated = true;

    // Update user profile
    await auth.currentUser.updateProfile({ displayName });

    // Define userRef
    userRef = fireStore.collection("users").doc(auth.currentUser.uid);

    // Perform user document creation in Firestore using a transaction
    await fireStore.runTransaction(async (transaction) => {
      // Check if user document already exists
      const doc = await transaction.get(userRef);
      if (doc.exists) {
        throw new Error("User document already exists");
      }

      // Set user document within the transaction
      transaction.set(userRef, {
        displayName: displayName,
        email: email,
        registerNumber: registerNumber,
        department: department,
        isEnroll: isEnroll,
        section: section,
        semester: semester,
        year: year,
      });
    });

    // Check if user document is created outside the transaction
    const newDoc = await userRef.get();
    if (!newDoc.exists) {
      throw new Error("User document not created");
    }

    // If everything succeeded, dispatch user login action
    dispatch({ type: "LOGIN", payload: auth.currentUser });

    // Perform any additional actions after successful signup
    handleDownloadPassword();

    if (!isCancelled) {
      setIsPending(false);
      setError(null);
    }
  } catch (err) {
    // Rollback if an error occurs
    if (userCreated) {
      // Delete user from Firebase Authentication
      await auth.currentUser.delete();
    }

    if (!isCancelled) {
      setError(err.message);
      setIsPending(false);
    }
  }
};





  useEffect(() => {
    return () => setIsCancelled(false);
  }, []);

  return { signup, error, isPending };
};
