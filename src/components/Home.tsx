import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import WalletButton from "./WalletButton";
import "../styles/Home.scss";
import kaomoji from "../../artifacts/contracts/kaomoji.sol/Kaomoji.json";

const CONTRACT_ADDRESS = import.meta.env.VITE_LOCAL_CONTRACT!;
const CONTENT_CID = "bafybeidyph5rfkohkqvnyrbzl4tz2v2vt6bxgf2eeotjodxmi4avb62dkm"; 

const Home: React.FC = () => {
    const [account, setAccount] = useState<string>("");
    const [balance, setBalance] = useState<string>("0");
    const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
    const [contract, setContract] = useState<ethers.Contract | null>(null);
    const [totalSupply, setTotalSupply] = useState<number>(0);
    const [minting, setMinting] = useState(false);

    useEffect(() => {
        const init = async () => {
            if (window.ethereum) {
                const prov = new ethers.BrowserProvider(window.ethereum);
                setProvider(prov);
                const signer = await prov.getSigner();
                const nftContract = new ethers.Contract(
                    CONTRACT_ADDRESS,
                    kaomoji.abi,
                    signer
                );
                setContract(nftContract);
                updateSupply(nftContract);
            }
        };
        init();
    }, []);

    const updateSupply = async (nftContract?: ethers.Contract) => {
        const c = nftContract || contract;
        if (!c) return;
        const supply = await c.totalSupply();
        setTotalSupply(Number(supply));
    };

    const connectWallet = async () => {
        if (!window.ethereum) return;
        const [addr] = await window.ethereum.request({
            method: "eth_requestAccounts",
        });
        setAccount(addr);
        updateBalance(addr);
    };

    const updateBalance = async (addr: string) => {
        if (!provider) return;
        const bal = await provider.getBalance(addr);
        setBalance(ethers.formatEther(bal));
    };

    const mintNFT = async () => {
        if (!contract || !account) return;
        try {
            setMinting(true);
            const nextId = totalSupply;
            const metadataURI = `${CONTENT_CID}/${nextId}.json`;

            const tx = await contract.payToMint(account, metadataURI, {
                value: ethers.parseEther("1"), 
            });
            await tx.wait();
            alert(`Minted Kaomoji #${nextId} successfully!`);

            await updateSupply(); 
        } catch (err: any) {
            console.error(err);
            alert("Mint failed: " + (err.message || err));
        } finally {
            setMinting(false);
        }
    };

    return (
        <div className="home-container">
            <h1 className="title">Kaomoji NFT</h1>
            {!account ? (
                <WalletButton onClick={connectWallet} label="Connect Wallet" />
            ) : (
                <>
                    <div className="wallet-info">
                        <p>Connected: {account}</p>
                        <p>Balance: {balance} ETH</p>
                    </div>

                    <button
                        className="mint-button"
                        onClick={mintNFT}
                        disabled={minting}
                    >
                        {minting ? "Minting..." : "Mint New Kaomoji (1 ETH)"}
                    </button>

                    <div className="gallery">
                        {Array.from({ length: totalSupply }).map((_, i) => (
                            <NFTCard key={i} tokenId={i} />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

interface NFTCardProps {
    tokenId: number;
}

const NFTCard: React.FC<NFTCardProps> = ({ tokenId }) => {
    const imageURI = `https://gateway.pinata.cloud/ipfs/${CONTENT_CID}/${tokenId}.webp`;

    return (
        <div className="nft-card">
            <img
                src={imageURI}
                alt={`Kaomoji #${tokenId}`}
            />
            <h3>Kaomoji #{tokenId}</h3>
        </div>
    );
};

export default Home;
