import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("KaomoujiModule", (m) => {
    const deployer = m.getAccount(0)
    const kaomoji = m.contract("Kaomoji", [deployer]);

    return { kaomoji };
});
