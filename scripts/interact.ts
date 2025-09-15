import { network } from "hardhat";

const { ethers } = await network.connect();


async function main() {
  const [deployer, user1, user2] = await ethers.getSigners();

  console.log("Deploying contract with account:", deployer.address);

  const Twitter = await ethers.getContractFactory("Twitter");
  const twitter = await Twitter.deploy();
  await twitter.waitForDeployment();

  const contractAddress = await twitter.getAddress();
  console.log("Twitter deployed to:", contractAddress);

  // Listen for events
  twitter.on("TweetCreated", (tweet) => {
    console.log("\n📢 Event: TweetCreated");
    console.log("Tweet ID:", tweet.id.toString());
    console.log("Author:", tweet.author);
    console.log("Content:", tweet.content);
    console.log("Timestamp:", tweet.timestamp.toString());
    console.log("Likes:", tweet.likes.toString());
  });

  twitter.on("TweetLiked", (tweet, tweetId, newLikeCount) => {
    console.log("\n❤️ Event: TweetLiked");
    console.log("Tweet ID:", tweet.id.toString());
    console.log("Author:", tweet.author);
    console.log("Content:", tweet.content);
    console.log("Timestamp:", tweet.timestamp.toString());
    console.log("Likes:", tweet.likes.toString());
    console.log("Tweet ID:", tweetId.toString());
    console.log("New Like Count:", newLikeCount.toString());
  });

  // Create a tweet
  console.log("\n📝 Creating a tweet...");
  let tx = await twitter.connect(user1).createTweet("Hello, this is my first tweet!");
  await tx.wait();

  // Fetch tweets of user1
  let tweets = await twitter.getAllTweets(user1.address);
  console.log("\n✅ Tweets of user1:", tweets);

  // Like the first tweet of user1
  console.log("\n👍 Liking the tweet...");
  tx = await twitter.connect(user2).likeTweet(user1.address, 0);
  await tx.wait();

  // Fetch again
  tweets = await twitter.getAllTweets(user1.address);
  console.log("\n✅ Tweets after like:", tweets);
}

// Run script
main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
