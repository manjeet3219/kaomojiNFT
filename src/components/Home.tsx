import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import WalletButton from "./WalletButton";
import "../styles/Home.scss";
import kaomoji from "../../artifacts/contracts/kaomoji.sol/Kaomoji.json";

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT!;

const Home: React.FC = () => {
    const [account, setAccount] = useState<string>("");
    const [balance, setBalance] = useState<string>("0");
    const [provider, setProvider] = useState<ethers.BrowserProvider | null>(
        null
    );
    const [contract, setContract] = useState<ethers.Contract | null>(null);

    useEffect(() => {
        const init = async () => {
            if (window.ethereum) {
                const prov = new ethers.BrowserProvider(window.ethereum);
                setProvider(prov);
                const signer = await prov.getSigner()
                const nftContract = new ethers.Contract(
                    CONTRACT_ADDRESS,
                    kaomoji.abi,
                    signer
                );
                setContract(nftContract);
            }
        }
        init();
    }, []);

    const connectWallet = async () => {
        if (!window.ethereum) return;
        const [account] = await window.ethereum.request({
            method: "eth_requestAccounts",
        });
        setAccount(account);
        updateBalance(account);
    };

    const updateBalance = async (addr: string) => {
        if (!provider) return;
        const bal = await provider.getBalance(addr);
        setBalance(ethers.formatEther(bal));
    };

    const mintNFT = async () => {
        if (!contract || !account) return;
        try {
            const tx = await contract.payToMint(account, "test.png", {
                value: ethers.parseEther("0.1"),
            });
            await tx.wait();
            alert("Minted NFT successfully!");
        } catch (err: any) {
            console.error(err);
            alert("Mint failed: " + err.message);
        }
    };

    return (
        <div className="home-container">
            <h1>Kaomoji NFT</h1>
            {!account ? (
                <WalletButton onClick={connectWallet} label="Connect Wallet" />
            ) : (
                <div className="wallet-info">
                    <p>Connected: {account}</p>
                    <p className="balance">ETH Balance: {balance}</p>
                    <WalletButton
                        onClick={mintNFT}
                        label="Mint NFT (0.1 ETH)"
                    />
                </div>
            )}
        </div>
    );
};

export default Home;
