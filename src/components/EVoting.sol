// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract EVoting {
    mapping (uint => uint) private votes;

    string[] private candidates;

    uint public deadline;

    address private owner;

    address[] public voters;

    function getVoters() public view returns (address[] memory)
    { 
        return voters;
    }

    event VoteCast(uint candidateCode);

    string public title;

    function getTitle() public view returns (string memory)
    { 
        return title;
    }

    string public description;

    function getDescription() public view returns (string memory)
    { 
        return description;
    }
    function getCandidates() public view returns (string[] memory) {
        return candidates;
    }

    
    function vote(uint candidateCode) public {
        
        for (uint256 i = 0; i < voters.length; i++) {
            if (voters[i] == msg.sender) {
                revert("The voter already voted");
            }
        }
        
        require(candidateCode < candidates.length, "Invalid candidate code.");
        require(block.timestamp <= deadline, "The voting period has ended.");
        votes[candidateCode]++;
        emit VoteCast(candidateCode);
                voters.push(msg.sender);

    }

    function getVotes(uint candidateCode) public view returns (uint) {
        require(candidateCode < candidates.length, "Invalid candidate code.");
        return votes[candidateCode];
    }

    function getWinners() public view returns (string[] memory) {
        uint maxVotes = 0;
        uint winnerCounter = 0;

        for (uint i = 0; i < candidates.length; i++) {
            if (votes[i] > maxVotes) {
                maxVotes = votes[i];
                winnerCounter = 1;
            } else if (votes[i] == maxVotes) {
                winnerCounter++;
            }
        }

        string[] memory winners = new string[](winnerCounter);
        uint j = 0;
        for (uint i = 0; i < candidates.length; i++) {
            if (votes[i] == maxVotes) {
                winners[j] = candidates[i];
                j++;
            }
        }

        return winners;
    }

    constructor(string memory _title, string memory _description, uint _deadline, string[] memory _candidates) {
        owner = msg.sender;
        deadline = _deadline;
        candidates = _candidates;
        title = _title;
        description = _description;
    }

    function getTotalVotes() public view returns (uint) {
    uint totalVotes = 0;
    for (uint i = 0; i < candidates.length; i++) {
        totalVotes += votes[i];
    }
    return totalVotes;  
    }

    function getCandidatePercentages() public view returns (uint[] memory) {
    uint totalVotes = getTotalVotes();
    uint[] memory candidatePercentages = new uint[](candidates.length);
    if (totalVotes == 0) {
            for (uint i = 0; i < candidates.length; i++) {
                candidatePercentages[i] = 0;
            }
            return candidatePercentages;
        }

    for (uint i = 0; i < candidates.length; i++) {
        candidatePercentages[i] = (votes[i] * 100) / totalVotes;
    }
    return candidatePercentages;
    }

    function getTimeLeft() public view returns (uint) {
        return deadline - block.timestamp;
    }
}

