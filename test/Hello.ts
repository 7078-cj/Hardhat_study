import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = await network.connect();

describe("Hello Contract", function () {
  it("Should return Hello World", async function () {
    // Deploy contract
    const Hello = await ethers.getContractFactory("Hello");
    const hello = await Hello.deploy();
    await hello.waitForDeployment();

    // Call the public variable (getter function is auto-generated)
    const message = await hello.welcome();

    expect(message).to.equal("Hello World");
  });
});
