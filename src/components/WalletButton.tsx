import React from "react";

interface WalletButtonProps {
  onClick: () => void;
  label: string;
}

const WalletButton: React.FC<WalletButtonProps> = ({ onClick, label }) => {
  return <button onClick={onClick}>{label}</button>;
};

export default WalletButton;
