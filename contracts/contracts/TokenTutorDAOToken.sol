// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TokenTutorDAOToken is ERC721, ERC721Burnable, Ownable {
    uint256 private _nextTokenId;

    constructor(
        address initialOwner
    ) ERC721("TokenTutorDAO", "TTD") Ownable(initialOwner) {}

    function safeMint(address to) public onlyOwner {
        require(!isUserInDAO(to), "User is already in DAO");
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
    }

    function isUserInDAO(address user) public view returns (bool) {
        return balanceOf(user) > 0;
    }
}
