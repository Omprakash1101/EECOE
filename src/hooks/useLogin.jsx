import { useState, useEffect } from "react";
import { auth, fireStore } from "../firebaseDatabase/config";
import { useAuthContext } from "./useAuthContext";
import { useHistory } from "react-router-dom";

export const useLogin = () => {
  const [isCancelled, setIsCancelled] = useState(false);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const { dispatch } = useAuthContext();
  const history = useHistory();
  const login = async (email, password, teml) => {
    if(!teml){
    setError(null);
    setIsPending(true);

    try {
      const res = await auth.signInWithEmailAndPassword(email, password);

      // Check if user document exists in Firestore
      const userDoc = await fireStore
        .collection("users")
        .doc(res.user.uid)
        .get();
      if (!userDoc.exists) {
        // User document does not exist, display alert and delete user from authentication
        alert("Please Register again. You had a network error 🐛💻 while registering");
        await auth.currentUser.delete();
        history.push("/signup");
        window.location.reload();

        return;
      }

      dispatch({ type: "LOGIN", payload: res.user });

      if (!isCancelled) {
        setIsPending(false);
        setError(null);
      }
    } catch (err) {
      if (!isCancelled) {
        setError(err.message);
        setIsPending(false);
      }
    }
  }};

  useEffect(() => {
    return () => setIsCancelled(false);
  }, []);

  return { login, isPending, error };
};
