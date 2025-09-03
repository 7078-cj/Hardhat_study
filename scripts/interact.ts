
import { network } from "hardhat";

const { ethers } = await network.connect();

async function main() {
  // 1. Deploy contract
  const Contract = await ethers.getContractFactory("MyContract");
  const contract = await Contract.deploy();
  await contract.waitForDeployment();

  console.log("Contract deployed to:", await contract.getAddress());

  // 2. Call public variable
  await contract.set("hello world");
  let message = await contract.get();
  console.log("Message:", message);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
