// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./TokenTutorDAOToken.sol";

contract TokenTutorDAO {
    TokenTutorDAOToken public daoTokenContract;

    mapping(address => bool) public isUserDisputed;
    mapping(address => address[]) public userDisputedBy;
    mapping(address => bool) public isUserBanned;

    constructor(address _tokenTutorDAOToken) {
        daoTokenContract = TokenTutorDAOToken(_tokenTutorDAOToken);
    }

    modifier onlyTokenTutorDAOToken(address user) {
        require(daoTokenContract.isUserInDAO(user), "User is not in DAO");
        _;
    }

    // Vote for a user to be banned
    function dispute(address user) public onlyTokenTutorDAOToken(user) {
        require(!isDisputedByMe(user), "User is already disputed by you");
        isUserDisputed[user] = true;
        userDisputedBy[user].push(msg.sender);
    }

    // Remove a vote
    function removeDispute(address user) public onlyTokenTutorDAOToken(user) {
        require(isUserDisputed[user], "User is not disputed");
        require(!isDisputedByMe(user), "User is already disputed by you");
        isUserDisputed[user] = false;
        for (uint256 i = 0; i < userDisputedBy[user].length; i++) {
            if (userDisputedBy[user][i] == msg.sender) {
                userDisputedBy[user][i] = userDisputedBy[user][
                    userDisputedBy[user].length - 1
                ];
                userDisputedBy[user].pop();
                break;
            }
        }
    }

    // Ban a user if they have 2 votes
    function ban(address user) public onlyTokenTutorDAOToken(user) {
        require(isUserDisputed[user], "User is not disputed");
        require(userDisputedBy[user].length >= 2, "Not enough votes to ban"); // 2 votes to ban temporarily
        isUserDisputed[user] = false;
        for (uint256 i = 0; i < userDisputedBy[user].length; i++) {
            if (userDisputedBy[user][i] == msg.sender) {
                userDisputedBy[user][i] = userDisputedBy[user][
                    userDisputedBy[user].length - 1
                ];
                userDisputedBy[user].pop();
                break;
            }
        }
    }

    // Get the addresses that have voted for a user
    function getDisputedBy(
        address user
    ) public view returns (address[] memory) {
        return userDisputedBy[user];
    }

    // Check if a user is disputed my sender
    function isDisputedByMe(
        address user
    ) public view onlyTokenTutorDAOToken(user) returns (bool) {
        for (uint256 i = 0; i < userDisputedBy[user].length; i++) {
            if (userDisputedBy[user][i] == msg.sender) {
                return true;
            }
        }
        return false;
    }
}
