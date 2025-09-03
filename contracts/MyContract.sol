// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

contract MyContract {
    string value;

    function get() public view returns(string memory){
        return value;
    } 

    function set(string calldata _value) public{
        value = _value;
    }
}