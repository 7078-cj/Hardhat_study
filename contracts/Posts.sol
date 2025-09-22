// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./Profile.sol";

contract Posts {
    struct Post {
        uint256 id;
        address author;
        string caption;
        string content;   // text
        string imageURI;  // optional image (e.g. IPFS/Arweave/server URL)
        uint256 timestamp;
        uint256 likes;
        bool exists;
    }

    Profile private profileContract;
    uint256 private nextPostId;
    mapping(uint256 => Post) private posts;
    mapping(uint256 => mapping(address => bool)) private likedBy; // postId => user => liked

    event PostCreated(uint256 indexed postId, address indexed author, string content, string imageURI);
    event PostUpdated(uint256 indexed postId, string newContent, string newImageURI);
    event PostDeleted(uint256 indexed postId);
    event PostLiked(uint256 indexed postId, address indexed user);
    event PostUnliked(uint256 indexed postId, address indexed user);

    constructor(address _profileContract) {
        profileContract = Profile(_profileContract);
        nextPostId = 1;
    }

    modifier onlyAuthor(uint256 _postId) {
        require(posts[_postId].author == msg.sender, "Not the post author");
        _;
    }

    modifier postExists(uint256 _postId) {
        require(posts[_postId].exists, "Post does not exist");
        _;
    }

    // Create a new post
    function createPost(string memory _content, string memory _imageURI, string memory _caption) external {
        // ensure user has a profile
        Profile.UserProfile memory userProfile = profileContract.getProfile(msg.sender);
        require(userProfile.exists, "Create a profile first");

        posts[nextPostId] = Post(
            nextPostId,
            msg.sender,
            _caption,
            _content,
            _imageURI,
            block.timestamp,
            0,
            true
        );

        emit PostCreated(nextPostId, msg.sender, _content, _imageURI);
        nextPostId++;
    }

    // Update post content
    function updatePost(uint256 _postId, string memory _newContent, string memory _newImageURI, string memory _newCaption)
        external
        postExists(_postId)
        onlyAuthor(_postId)
    {
        Post storage post = posts[_postId];
        post.caption = _newCaption;
        post.content = _newContent;
        post.imageURI = _newImageURI;

        emit PostUpdated(_postId, _newContent, _newImageURI);
    }

    // Delete a post
    function deletePost(uint256 _postId) external postExists(_postId) onlyAuthor(_postId) {
        delete posts[_postId];
        emit PostDeleted(_postId);
    }

    // Like/unlike
    function likePost(uint256 _postId) external postExists(_postId) {
        require(!likedBy[_postId][msg.sender], "Already liked");
        likedBy[_postId][msg.sender] = true;
        posts[_postId].likes++;
        emit PostLiked(_postId, msg.sender);
    }

    function unlikePost(uint256 _postId) external postExists(_postId) {
        require(likedBy[_postId][msg.sender], "Haven't liked yet");
        likedBy[_postId][msg.sender] = false;
        posts[_postId].likes--;
        emit PostUnliked(_postId, msg.sender);
    }

    // Getters
    function getPost(uint256 _postId) external view postExists(_postId) returns (Post memory) {
        return posts[_postId];
    }

    function hasLiked(uint256 _postId, address _user) external view returns (bool) {
        return likedBy[_postId][_user];
    }
}
