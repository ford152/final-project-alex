
'use client'

import { ConnectKitButton } from "connectkit";
import styles from "./Navbar.module.css";
export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <a href="https://alchemy.com/?a=create-web3-dapp" target={"_blank"}>
        <p>Alex's Final Project</p>
      </a>
      <ConnectKitButton />
    </nav>
  );
}
