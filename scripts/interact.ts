
import { network } from "hardhat";

const { ethers } = await network.connect();

async function main() {
  // 1. Get deployer (first Hardhat account)
  const [deployer] = await ethers.getSigners();
  console.log("Using account:", deployer.address);

  // 2. Deploy Twitter contract
  const Twitter = await ethers.getContractFactory("Twitter");
  const twitter = await Twitter.deploy();
  await twitter.waitForDeployment();
  console.log("Twitter deployed to:", await twitter.getAddress());

  // 3. Create tweets
  let tx = await twitter.createTweet("Hello blockchain world!");
  await tx.wait();

  tx = await twitter.createTweet("Second tweet, GM!");
  await tx.wait();

  console.log("Tweets created ✅");

  // 4. Get single tweet
  const firstTweet = await twitter.getTweet(deployer.address, 0);
  console.log("First tweet:", firstTweet);

  // 5. Get all tweets
  const allTweets = await twitter.getAllTweets(deployer.address);
  console.log("All tweets:", allTweets);
}

// Run script
main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
