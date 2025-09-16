// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;


interface IProfile{
    struct UserProfile{
        string displayName;
        string bio;
    }

    function getProfile(address _user) external view returns(UserProfile memory);

}
    

contract Twitter{

    IProfile profileContract;

    uint16 public MAX_TWEET_LENGTH = 280;

    struct Tweet {
        uint256 id;
        address author;
        string content;
        uint256 timestamp;
        uint256 likes;
    }

    event TweetCreated(Tweet);
    event TweetLiked(Tweet, uint256 tweetId, uint256 newLikeCount);

    address public owner;

    constructor(address _profileContract) {
        owner = msg.sender;
        profileContract = IProfile(_profileContract);
    }

    modifier onlyOwner(){
        require(msg.sender == owner, "You Are Not the Owner");
        _;
    }

    modifier onlyRegistered(){
        IProfile.UserProfile memory userProfileTemp = profileContract.getProfile(msg.sender);
        require(bytes(userProfileTemp.displayName).length > 0, "User Not Registered");
        _;
    }

    mapping(address => Tweet[]) public tweets;

    function changeTweetLength(uint16 newTweetLength) public onlyOwner{
        MAX_TWEET_LENGTH = newTweetLength;
    }

    function createTweet(string memory _tweet) public onlyRegistered{

        //adding require to limit the tweets
        require(bytes(_tweet).length <= 280, "Tweet is too long");

        Tweet memory newTweet = Tweet({
            id: tweets[msg.sender].length,
            author: msg.sender,
            content: _tweet,
            timestamp: block.timestamp,
            likes: 0
        });


       tweets[msg.sender].push(newTweet);

       emit TweetCreated(newTweet);
    }

    // memory = temporary storage
    // view = no data changes when the function runs

    function getTweet(address _owner, uint _i) public view returns (Tweet memory){
        return tweets[_owner][_i];
    }

    function getAllTweets(address _owner) public view returns (Tweet[] memory){
        return tweets[_owner];
    }

    function likeTweet(address author, uint256 id) external onlyRegistered{
        require(tweets[author][id].id == id , "tweet does not exist");

        tweets[author][id].likes++;

        emit TweetLiked(tweets[author][id], id, tweets[author][id].likes);
    }

    function unlikeTweet(address author, uint256 id) external onlyRegistered{
        require(tweets[author][id].id == id , "tweet does not exist");
        require(tweets[author][id].likes > 0 , "tweet has no likes");

        tweets[author][id].likes--;
    }

    function getTotalLikes(address _author) external view returns(uint){
        uint totalLIkes;

        for(uint i = 0; i < tweets[_author].length; i++){
            totalLIkes += tweets[_author][i].likes;
        }

        return totalLIkes;
    }


}