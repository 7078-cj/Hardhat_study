import { network } from "hardhat";

const { ethers } = await network.connect();


async function main() {
  const [deployer, user1, user2] = await ethers.getSigners();

  console.log("Deploying contracts with account:", deployer.address);

  // 1. Deploy Profile contract
  const Profile = await ethers.getContractFactory("Profile");
  const profile = await Profile.deploy();
  await profile.waitForDeployment();
  console.log("Profile deployed to:", await profile.getAddress());

  // 2. Deploy Twitter with Profile contract address
  const Twitter = await ethers.getContractFactory("Twitter");
  const twitter = await Twitter.deploy(await profile.getAddress());
  await twitter.waitForDeployment();
  console.log("Twitter deployed to:", await twitter.getAddress());

  // 3. Register user1 and user2 profiles
  await profile.connect(user1).setProfile("Alice", "I love Solidity!");
  
  await profile.connect(user2).setProfile("Bob", "Smart contract dev");

  // 4. Listen for events
  (twitter as any).on("TweetCreated", ({tweet} : any) => {
    console.log("\n📢 Event: TweetCreated");
    console.log("Tweet ID:", tweet.id.toString());
    console.log("Author:", tweet.author);
    console.log("Content:", tweet.content);
    console.log("Timestamp:", tweet.timestamp.toString());
    console.log("Likes:", tweet.likes.toString());
  });

 (twitter as any).on("TweetLiked", ({tweet, tweetId, newLikeCount} : any) => {
    console.log("\n❤️ Event: TweetLiked");
    console.log("Tweet ID:", tweetId.toString());
    console.log("New Like Count:", newLikeCount.toString());
  });

  // 5. Create a tweet
  console.log("\n📝 Creating a tweet...");
  let tx = await twitter.connect(user1).createTweet("Hello, this is my first tweet!");
  await tx.wait();

  // 6. Fetch tweets of user1
  let tweets = await twitter.getAllTweets(user1.address);
  console.log("\n✅ Tweets of user1:", tweets);

  // 7. Like the first tweet of user1
  console.log("\n👍 Liking the tweet...");
  tx = await twitter.connect(user2).likeTweet(user1.address, 0);
  await tx.wait();

  // 8. Fetch again
  tweets = await twitter.getAllTweets(user1.address);
  console.log("\n✅ Tweets after like:", tweets);
}

// Run script
main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
