// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

contract Twitter{

    

    mapping(address => string[]) public tweets;

    function createTweet(string memory _tweet) public{
        return tweets[msg.sender].push(_tweet);
    }

    // memory = temporary storage
    // view = no data changes when the function runs

    function getTweet(address _owner, uint _i) public view returns (string memory){
        return tweets[_owner][_i];
    }

    function getAllTweets(address _owner) public view returns (string[] memory){
        return tweets[_owner];
    }


}