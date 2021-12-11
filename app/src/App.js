import React, { useEffect, useState } from "react";
import "./App.css";
import twitterLogo from "./assets/twitter-logo.svg";
import CandyMachine from "./CandyMachine";
import { Screen, NavBar, Footer } from "@joshtsch/legos";
import avatar from "./assets/0.png";

// Constants
const TWITTER_HANDLE = "_buildspace";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  // State
  const [walletAddress, setWalletAddress] = useState(null);

  // Actions
  const checkIfWalletIsConnected = async () => {
    try {
      const { solana } = window;

      if (solana) {
        if (solana.isPhantom) {
          console.log("Phantom wallet found!");
          const response = await solana.connect({ onlyIfTrusted: true });
          console.log(
            "Connected with Public Key:",
            response.publicKey.toString()
          );

          /*
           * Set the user's publicKey in state to be used later!
           */
          setWalletAddress(response.publicKey.toString());
        }
      } else {
        alert("Solana object not found! Get a Phantom Wallet 👻");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const connectWallet = async () => {
    const { solana } = window;

    if (solana) {
      const response = await solana.connect();
      console.log("Connected with Public Key:", response.publicKey.toString());
      setWalletAddress(response.publicKey.toString());
    }
  };

  const renderNotConnectedContainer = () => (
    <button
      className="cta-button connect-wallet-button"
      onClick={connectWallet}
    >
      Connect to Wallet
    </button>
  );

  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    };
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);

  return (
    <Screen>
      <NavBar avatar={avatar} walletAddress={walletAddress} />
      <div
        style={{
          alignItems: "center",
          display: "flex",
          flexGrow: 1,
          justifyContent: "center",
          padding: "0 2.5rem",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: "60px",
              fontWeight: "bold",
              fontFamily: "Emilys Candy",
            }}
          >
            🍭 Candy Drop
          </p>
          <p style={{ fontSize: "25px" }}>NFT drop machine with fair mint</p>
          {!walletAddress && renderNotConnectedContainer()}
          <div style={{ width: "100%" }}>
            {walletAddress && <CandyMachine walletAddress={window.solana} />}
          </div>
        </div>
      </div>
      <Footer
        socialMedia={[
          {
            alt: "Twitter Logo",
            logo: twitterLogo,
            href: TWITTER_LINK,
          },
        ]}
      />
    </Screen>
  );
};

export default App;
