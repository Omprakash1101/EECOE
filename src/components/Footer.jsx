import React from "react";
import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <p>
        For queries or errors, ask in our WhatsApp group:{" "}
        <a target="_blank" href="https://chat.whatsapp.com/EJ76PGwghQFBHX6ihBA9Bc">
          Helpline Group
        </a>
      </p>
    </footer>
  );
};

export default Footer;
