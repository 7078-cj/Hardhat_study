
import { network } from "hardhat";

const { ethers } = await network.connect();

async function main() {
   const [owner, user1, user2] = await ethers.getSigners();
  console.log("Owner account:", owner.address);
  console.log("User1 account:", user1.address);
  console.log("User2 account:", user2.address);

  // 1. Deploy Twitter contract
  const Twitter = await ethers.getContractFactory("Twitter");
  const twitter = await Twitter.deploy();
  await twitter.waitForDeployment();
  console.log("Twitter deployed to:", await twitter.getAddress());

  // 2. Check initial max tweet length
  let maxLen = await twitter.MAX_TWEET_LENGTH();
  console.log("Initial MAX_TWEET_LENGTH:", maxLen.toString());

  // 3. Owner creates a tweet
  let tx = await twitter.connect(owner).createTweet("Hello from owner 🎉");
  await tx.wait();

  // 4. User1 creates a tweet
  tx = await twitter.connect(user1).createTweet("gm blockchain 🌍");
  await tx.wait();

  // 5. Get all tweets for User1
  let tweetsUser1 = await twitter.getAllTweets(user1.address);
  console.log("User1 tweets:", tweetsUser1.map(t => ({
    id: t.id.toString(),
    author: t.author,
    content: t.content,
    likes: t.likes.toString()
  })));

  // 6. User2 likes User1's tweet
  tx = await twitter.connect(user2).likeTweet(user1.address, 0);
  await tx.wait();

  // Check tweet after like
  let likedTweet = await twitter.getTweet(user1.address, 0);
  console.log("User1 tweet after like:", {
    id: likedTweet.id.toString(),
    author: likedTweet.author,
    content: likedTweet.content,
    likes: likedTweet.likes.toString()
  });

  // 7. User2 unlikes the tweet
  tx = await twitter.connect(user2).unlikeTweet(user1.address, 0);
  await tx.wait();

  // Check tweet after unlike
  let unlikedTweet = await twitter.getTweet(user1.address, 0);
  console.log("User1 tweet after unlike:", {
    id: unlikedTweet.id.toString(),
    author: unlikedTweet.author,
    content: unlikedTweet.content,
    likes: unlikedTweet.likes.toString()
  });

  // 8. Owner changes max tweet length
  tx = await twitter.connect(owner).changeTweetLength(500);
  await tx.wait();

  maxLen = await twitter.MAX_TWEET_LENGTH();
  console.log("Updated MAX_TWEET_LENGTH by owner:", maxLen.toString());

  // 9. Non-owner tries to change max tweet length
  try {
    tx = await twitter.connect(user1).changeTweetLength(1000);
    await tx.wait();
  } catch (err: any) {
    console.log("❌ Non-owner cannot change tweet length (expected):", err.message);
  }
}

// Run script
main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
