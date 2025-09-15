// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

contract Twitter{
    
    
    uint16 public MAX_TWEET_LENGTH = 280;

    struct Tweet {
        address author;
        string content;
        uint256 timestamp;
        uint256 likes;
    }

    address public owner;

    constructor(){
        owner = msg.sender;
    }// this contructs the owner as the one who deployed the contract

    modifier onlyOwner(){
        require(msg.sender == owner, "You Are Not the Owner");
        _;
    }

    mapping(address => Tweet[]) public tweets;

    function changeTweetLength(uint16 newTweetLength) public onlyOwner{
        MAX_TWEET_LENGTH = newTweetLength;
    }

    function createTweet(string memory _tweet) public{

        //adding require to limit the tweets
        require(bytes(_tweet).length <= 280, "Tweet is too long");

        Tweet memory newTweet = Tweet({
            author: msg.sender,
            content: _tweet,
            timestamp: block.timestamp,
            likes: 0
        });


       tweets[msg.sender].push(newTweet);
    }

    // memory = temporary storage
    // view = no data changes when the function runs

    function getTweet(address _owner, uint _i) public view returns (Tweet memory){
        return tweets[_owner][_i];
    }

    function getAllTweets(address _owner) public view returns (Tweet[] memory){
        return tweets[_owner];
    }


}