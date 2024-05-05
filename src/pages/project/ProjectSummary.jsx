import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useFirestore } from "../../hooks/useFirestore";
import { useLogout } from "../../hooks/useLogout";
import firebase from "firebase/app";
import "firebase/firestore";
import styles from "./ProjectSummary.module.css"; // Import the CSS module

export default function ProjectSummary({ project }) {
  const { addDocument } = useFirestore(project.name);
  const { logout } = useLogout();
  const { user } = useAuthContext();
  const history = useHistory();
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // State to track loading status

  const handleApprove = async () => {
    if (isEnrolled || isConfirming || isLoading) {
      return; // Disable button if already enrolled, confirming, or loading
    }

    setIsConfirming(true);
    setIsLoading(true); // Set loading to true when confirming

    const shouldEnroll = window.confirm("Are you sure you want to enroll?");

    setIsConfirming(false);

    if (shouldEnroll) {
      try {
        const firestore = firebase.firestore();
        const electiveRef = firestore.collection("electives").doc(project.id);
        const userRef = firestore.collection("users").doc(user.uid);

        const didEnroll = await firestore.runTransaction(
          async (transaction) => {
            const electiveDoc = await transaction.get(electiveRef);
            if (!electiveDoc.exists) {
              throw new Error("Elective document does not exist!");
            }

            const electiveData = electiveDoc.data();
            if (electiveData.slots === 0) {
              return false;
            }

            transaction.update(electiveRef, {
              slots: firebase.firestore.FieldValue.increment(-1),
            });

            await transaction.update(userRef, {
              isEnroll: true,
              elective: project.name,
              subjectCode: project.details,
            });

            return true;
          }
        );

        if (didEnroll) {
          setIsEnrolled(true);
          logout();
          window.alert("You have successfully enrolled")
        } else {
        
          alert("No available slots for enrollment.");
          setIsEnrolled(false);
          // window.location.reload()  
        }
      } catch (error) {
        console.error("Error enrolling:", error);
        alert("An error occurred while enrolling. Please try again.");
        setIsEnrolled(false);
      } finally {
        setIsLoading(false); // Reset loading to false after transaction completes
      }
    } else {
      setIsConfirming(false);
      setIsLoading(false); // Reset loading to false if enrollment is canceled
    }
  };
   const [slots, setSlots] = useState(0); // State to track available slots

   useEffect(() => {
     const fetchSlots = async () => {
       try {
         const electiveDoc = await firebase
           .firestore()
           .collection("electives")
           .doc(project.id)
           .get();
         const electiveData = electiveDoc.data();
         setSlots(electiveData.slots);
       } catch (error) {
         console.error("Error fetching slots:", error);
       }
     };
     fetchSlots();
   }, [project.id]);

  return (
    <div>
      {isLoading && (
        <div className={styles.overlay}>
          <div className={styles.loader}>Loading...</div>
        </div>
      )}
      <button
        className="btn"
        onClick={handleApprove}
        disabled={slots === 0 || isEnrolled || isLoading}
      >
        Enroll
      </button>

      {isEnrolled && (
        <div className={styles.overlay}>
          <div className="confirmation-box">
            <p>You have successfully enrolled</p>
          </div>
        </div>
      )}
    </div>
  );
}
