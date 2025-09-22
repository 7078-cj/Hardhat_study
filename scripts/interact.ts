import { network } from "hardhat";

const { ethers } = await network.connect({
  network: "sepolia",
  chainType: "op",
});

async function main() {
  // Deploy Profile contract
  const Profile = await ethers.getContractFactory("Profile");
  const profile = await Profile.deploy();
  await profile.waitForDeployment();
  console.log("✅ Profile deployed at:", await profile.getAddress());

  // Deploy Posts contract, passing Profile’s address
  const Posts = await ethers.getContractFactory("Posts");
  const posts = await Posts.deploy(await profile.getAddress());
  await posts.waitForDeployment();
  console.log("✅ Posts deployed at:", await posts.getAddress());
}

// Run the script
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
