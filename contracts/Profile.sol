// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract Profile {
    struct UserProfile {
        address account;      // 👈 store the account address
        string displayName;
        string bio;
        string avatarURI; 
        bool exists;
    }

    mapping(address => UserProfile) private profiles;

    event ProfileCreated(address indexed user, string displayName, string bio, string avatarURI);
    event ProfileUpdated(address indexed user, string displayName, string bio, string avatarURI);

    modifier profileExists(address user) {
        require(profiles[user].exists, "Profile does not exist");
        _;
    }

    function createProfile(
        string memory _displayName,
        string memory _bio,
        string memory _avatarURI
    ) external {
        require(!profiles[msg.sender].exists, "Profile already exists");
        profiles[msg.sender] = UserProfile(
            msg.sender,       // 👈 store account here
            _displayName,
            _bio,
            _avatarURI,
            true
        );
        emit ProfileCreated(msg.sender, _displayName, _bio, _avatarURI);
    }

    function updateProfile(
        string memory _displayName,
        string memory _bio,
        string memory _avatarURI
    ) external profileExists(msg.sender) {
        profiles[msg.sender].displayName = _displayName;
        profiles[msg.sender].bio = _bio;
        profiles[msg.sender].avatarURI = _avatarURI;

        emit ProfileUpdated(msg.sender, _displayName, _bio, _avatarURI);
    }

    function getProfile(address _user) external view profileExists(_user) returns (UserProfile memory) {
        return profiles[_user];
    }
}
