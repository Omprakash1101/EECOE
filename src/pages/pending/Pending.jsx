import React, { useState, useEffect } from "react";
import "./Pending.css";
import ProjectSummary from "../project/ProjectSummary";
import { useAuthContext } from "../../hooks/useAuthContext";
import { fireStore } from "../../firebaseDatabase/config";
import Footer from "./Footer";

export default function Pending() {
  const { user } = useAuthContext();
  const [electiveDocuments, setElectiveDocuments] = useState(null);
  const [electiveError, setElectiveError] = useState(null);
  const [userDocument, setUserDocument] = useState(null);
  const [userError, setUserError] = useState(null);
  const [filter, setFilter] = useState("all");

  // useEffect(() => {
  //   const fetchElectiveDocuments = async () => {
  //     try {
  //       const electiveRef = fireStore.collection("electives");
  //       const snapshot = await electiveRef.get();
  //       const data = snapshot.docs.map((doc) => ({
  //         id: doc.id,
  //         ...doc.data(),
  //       }));
  //       setElectiveDocuments(data);
  //     } catch (error) {
  //       setElectiveError(error.message);
  //     }
  //   };

  //   const fetchUserDocument = async () => {
  //     try {
  //       const userRef = fireStore.collection("users").doc(user.uid);
  //       const doc = await userRef.get();
  //       setUserDocument(doc.exists ? doc.data() : null);
  //     } catch (error) {
  //       setUserError(error.message);
  //     }
  //   };

  //   fetchElectiveDocuments();
  //   fetchUserDocument();
  // }, [user.uid]);
  const projects = electiveDocuments
    ? electiveDocuments.filter((document) => {
        switch (filter) {
          default:
            // Add a check for document and assignedUsersList
            if (!document || !document.assignedUsersList) return false;

            const isNotAssignedToUserDepartment =
              !document.assignedUsersList.some(
                (assignedUser) =>
                  assignedUser?.uid.toLowerCase() ===
                  userDocument?.department.toLowerCase()
              );
            const isUserInSameSemester =
              userDocument?.semester === document.semester;
            return isNotAssignedToUserDepartment && isUserInSameSemester;
        }
      })
    : null;

  return true? (
    
    <div className="pending-page">
      <h2 className="page-title">Electives </h2>
      {electiveError && <p className="error">{electiveError}</p>}
      {userError && <p className="error">{userError}</p>}
      <table className="project-table">
        <thead>
          <tr>
            <th>Elective Name</th>
            <th>Subject Code</th>
            {/* <th>Seats Available</th> */}
            <th>Click to Enroll</th>
          </tr>
        </thead>
        <tbody>
          {projects &&
            projects.map((project) => (
              <tr key={project.id}>
                <td className="td1">{project.name}</td>
                <td>{project.details}</td>
                {/* <td>{project.slots}</td> */}
                <td>
                  <ProjectSummary project={project} />
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <Footer />

    </div>
  ) : (
    <div className=" pending-page signup-form">
      
      <h2>Chooser is closed!</h2>
      <Footer />
    </div>
    

  );
  
}
