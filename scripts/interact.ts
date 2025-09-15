
import { network } from "hardhat";

const { ethers } = await network.connect();

async function main() {
 const [owner, other] = await ethers.getSigners();
  console.log("Owner account:", owner.address);
  console.log("Other account:", other.address);

  // 1. Deploy Twitter contract
  const Twitter = await ethers.getContractFactory("Twitter");
  const twitter = await Twitter.deploy();
  await twitter.waitForDeployment();
  console.log("Twitter deployed to:", await twitter.getAddress());

  // Check initial max tweet length
  let maxLen = await twitter.MAX_TWEET_LENGTH();
  console.log("Initial MAX_TWEET_LENGTH:", maxLen.toString());

  // 2. Create a tweet within the limit
  let tx = await twitter.createTweet("Hello Web3 from the owner!");
  await tx.wait();

  // 3. Try to create a tweet longer than MAX_TWEET_LENGTH
  try {
    const longTweet = "a".repeat(300); // 300 chars > 280
    tx = await twitter.createTweet(longTweet);
    await tx.wait();
  } catch ( err: any) {
    console.log("❌ Failed to create tweet over limit (expected):", err.message);
  }

  // 4. Change MAX_TWEET_LENGTH (only owner can do this)
  tx = await twitter.changeTweetLength(500);
  await tx.wait();

  maxLen = await twitter.MAX_TWEET_LENGTH();
  console.log("Updated MAX_TWEET_LENGTH by owner:", maxLen.toString());

  // 5. Try to change MAX_TWEET_LENGTH as non-owner
  try {
    tx = await twitter.connect(other).changeTweetLength(1000);
    await tx.wait();
  } catch ( err: any) {
    console.log("❌ Non-owner cannot change tweet length (expected):", err.message);
  }

  // 6. Verify tweets
  const firstTweet = await twitter.getTweet(owner.address, 0);
  console.log("First tweet:", {
    author: firstTweet.author,
    content: firstTweet.content,
    timestamp: firstTweet.timestamp.toString(),
    likes: firstTweet.likes.toString(),
  });

  const allTweets = await twitter.getAllTweets(owner.address);
    console.log("All tweets:", allTweets);
  }

// Run script
main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
