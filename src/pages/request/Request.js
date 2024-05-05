import styles from "./Request.module.css";
import React from "react";
import TransactionForm from "./TransactionForm";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useCollection } from "../../hooks/useCollection";
import TransactionList from "./TransactionList";

export default function Request() {
  const { user } = useAuthContext();
  const { documents, error } = useCollection(
    "transactions",
    ["uid", "==", user.uid],
    ["createdAt", "desc"]
  );
  return (
    <div className={styles.bg}>
      <div className="card-content">
        <div className={styles.container}>
          {/* <div className={styles.content}>
        {error && <p>{error}</p>}
        {documents && <TransactionList transactions={documents} />}
      </div> */}
          <div className={styles.sidebar}>
            <TransactionForm uid={user.uid} />
          </div>
        </div>
      </div>
    </div>
  );
}
