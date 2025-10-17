import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.connect();

describe("Kaomoji", function () {
    it("Should mint and transfer NFT to recipient", async function () {
        let signers = await ethers.getSigners();

        const Kaomoji = await ethers.getContractFactory("Kaomoji");
        const kaomoji = await Kaomoji.deploy(signers[0].address);
        await kaomoji.waitForDeployment();

        const recipient = signers[1].address;
        const uri = "test.png";

        let balance = await kaomoji.balanceOf(recipient);
        expect(balance).to.equal(0);
        let totalSupply = await kaomoji.totalSupply();
        expect(totalSupply).to.equal(0);

        const mintToken = await kaomoji.payToMint(recipient, uri, {
            value: ethers.parseEther("0.12"),
        });
        await mintToken.wait();

        balance = await kaomoji.balanceOf(recipient);
        expect(balance).to.equal(1);
        totalSupply = await kaomoji.totalSupply();
        expect(totalSupply).to.equal(1);

        expect(await kaomoji.isOwned(uri)).to.equal(true);
    });
});
