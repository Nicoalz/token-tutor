// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

struct TutorTime {
    uint tokenId;
    address tutor;
    address student;
    uint price;
    uint mintedAt;
    uint redeemedAt; // 0 -> not redeemed yet, timestamp -> redeemed (burnt)
}

struct Tutor {
    string name;
    string description;
    address tutor;
    uint mintedAmount;
    uint maxMint;
    uint hourPrice; // in wei
}

contract TutorTimeToken is ERC721, ERC721Burnable {
    uint private _nextTokenId;

    mapping(address => Tutor) public addressToTutor;
    address[] public allTutors;

    // Token metadata
    mapping(uint => TutorTime) public tokenData;

    IERC20 public immutable asset;

    constructor(IERC20 _asset) ERC721("TutorTime", "TT") {
        asset = _asset;
    }

    // Students can mint time of a tutor (time is a Token)
    function safeMint(address tutor) public {
        Tutor storage tutorData = addressToTutor[tutor];
        require(
            tutorData.tutor != address(0),
            "TutorTimeToken: user is not a tutor"
        );
        require(
            tutorData.mintedAmount < tutorData.maxMint,
            "TutorTimeToken: max mint per tutor reached"
        );
        require(
            tutor != msg.sender,
            "TutorTimeToken: tutor cannot mint his own time"
        );
        uint tokenId = _nextTokenId++;
        addressToTutor[tutor].mintedAmount++;
        tokenData[tokenId] = TutorTime(
            tokenId,
            tutor,
            msg.sender,
            tutorData.hourPrice,
            block.timestamp,
            0
        );
        _safeMint(msg.sender, tokenId);
        asset.transferFrom(msg.sender, address(this), tutorData.hourPrice); // Transfer asset to contract
    }

    function setTutorPreferences(
        uint maxMint,
        uint price,
        string memory name,
        string memory description
    ) public {
        Tutor storage tutorData = addressToTutor[msg.sender];
        tutorData.name = name;
        tutorData.description = description;
        tutorData.tutor = msg.sender;
        tutorData.maxMint = maxMint;
        tutorData.hourPrice = price;
        // Add tutor to allTutors array if not already in it
        bool tutorSaved = false;
        for (uint i = 0; i < allTutors.length; i++) {
            if (allTutors[i] == msg.sender) {
                tutorSaved = true;
                break;
            }
        }
        if (!tutorSaved) {
            allTutors.push(msg.sender);
        }
    }

    // Get all the tutor times minted by a student
    function getAllTutorTimeForStudent(
        address student
    ) public view returns (TutorTime[] memory) {
        TutorTime[] memory allTutorTimes = new TutorTime[](balanceOf(student));
        uint index = 0;
        for (uint i = 0; i < _nextTokenId; i++) {
            if (tokenData[i].student == student) {
                allTutorTimes[index] = tokenData[i];
                index++;
            }
        }
        return allTutorTimes;
    }

    // Get all the tutor times of a tutor
    function getAllTutorTimeForTutor(
        address tutor
    ) public view returns (TutorTime[] memory) {
        TutorTime[] memory allTutorTimes = new TutorTime[](
            addressToTutor[tutor].mintedAmount
        );
        uint index = 0;
        for (uint i = 0; i < _nextTokenId; i++) {
            if (tokenData[i].tutor == tutor) {
                allTutorTimes[index] = tokenData[i];
                index++;
            }
        }
        return allTutorTimes;
    }

    // Redeem a token (burn it) when hour is done
    function burn(uint tokenId) public override {
        require(
            tokenData[tokenId].redeemedAt == 0,
            "TutorTimeToken: token already redeemed"
        );
        require(
            tokenData[tokenId].student == msg.sender,
            "TutorTimeToken: only student can redeem token"
        );
        tokenData[tokenId].redeemedAt = block.timestamp;
        super.burn(tokenId);
        asset.transfer(tokenData[tokenId].tutor, tokenData[tokenId].price); // Transfer asset to tutor
    }

    function getAllTutors() public view returns (Tutor[] memory) {
        Tutor[] memory allTutorsData = new Tutor[](allTutors.length);
        for (uint i = 0; i < allTutors.length; i++) {
            allTutorsData[i] = addressToTutor[allTutors[i]];
        }
        return allTutorsData;
    }
}
