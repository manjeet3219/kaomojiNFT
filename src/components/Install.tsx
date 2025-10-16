import React from "react";

const Install: React.FC = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Please install MetaMask to use this dApp.</h2>
      <a
        href="https://metamask.io/download/"
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: "#ff6f61", fontWeight: "bold" }}
      >
        Install MetaMask
      </a>
    </div>
  );
};

export default Install;
