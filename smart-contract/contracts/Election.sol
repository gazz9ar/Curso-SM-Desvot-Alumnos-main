// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract Election {

    uint256 contractBalance;
    struct Candidate {
        string name;
        bool registered;
        bool approved;
        uint voteCount;
    }

    struct Voter {
        bool voted;
        bool registered;
        address vote;
    }

    address[] public candidateAddresses;  
    address[] public voterAddresses; 
    address public owner;
    address public winner;
    string public electionName;

    mapping(address => Voter) public voters;
    mapping(address => Candidate) public candidates;
    uint public totalVotes;

    enum State {Created, Voting, Ended} State public state;

    modifier onlyOwner(){
        require(msg.sender == owner, "Not owner");
        _;
    }

    modifier inState(State _state){
        require(state == _state, "Debe cambiar de estado la votacion");
        _;
    }

    constructor(string memory _name){
        owner = msg.sender;
        electionName = _name;
        state = State.Created;       
    }

    function payFee() public payable {        
        require(msg.sender != owner,'Owner can NOT be candidate');
        require(!candidates[msg.sender].registered,'Candidate already registered');
        require(msg.value == 1 ether, "Insufficients funds");
        candidates[msg.sender].registered = true;             
    }

    function registerVoter(address _voterAddress) onlyOwner inState(State.Created) public {
        require(!voters[_voterAddress].registered, "Voter already registered");
        require(_voterAddress != owner, "The owner cannot be a voter");
        voters[_voterAddress].registered = true;
        voterAddresses.push(_voterAddress);
    }

    function addCandidate(address _canAddress, string memory _name) onlyOwner inState(State.Created) public{
        require(candidates[_canAddress].registered, "Unregistered candidate");
        candidates[_canAddress].name = _name;
        candidates[_canAddress].voteCount = 0;
        candidateAddresses.push(_canAddress);
    }

    function startVote() inState(State.Created) onlyOwner public {      
        require(checkOddCandidates(), 'Add 1 more candidate or voter / draw is not allowed');  
        state = State.Voting;
    }   

    function vote(address _canAddress) inState(State.Voting) public {
        require(voters[msg.sender].registered, "Voter not registered");
        require(!voters[msg.sender].voted, "The voter can only vote once");
        require(candidates[_canAddress].registered, "Candidate not registered");
        require(msg.sender != owner, "Owner cannot vote");
        voters[msg.sender].vote = _canAddress;
        voters[msg.sender].voted = true;
        candidates[_canAddress].voteCount++;        
        totalVotes++;
    }

    function endVote() inState(State.Voting) onlyOwner public {        
        require(checkIfEveryoneVoted(),"There are some voters that didn't vote");
        state = State.Ended;
    }

    function announceWinner() inState(State.Ended) onlyOwner public returns(address) {
        if (winner != 0x0000000000000000000000000000000000000000) {
            return winner;
        }
        uint max = 0;
        uint i;
        address winnerAddress;
        for(i=0; i < candidateAddresses.length; i++) {
            if(candidates[candidateAddresses[i]].voteCount > max){
                max = candidates[candidateAddresses[i]].voteCount;
                winnerAddress = candidateAddresses[i];
            }
        }
        winner = winnerAddress;
        return winner;
    }

    function getTotalCandidate() public view returns(uint){
        return candidateAddresses.length;
    }

    function givePriceToWinner() inState(State.Ended) onlyOwner payable public {
        // Call returns a boolean value indicating success or failure.
        // This is the current recommended method to use.
        (bool sent, bytes memory data) = winner.call{value: address(this).balance}("");
        require(sent, "Failed to send Ether from Contract");
    }

    function getContractBalance() public view returns(uint256) {
        return address(this).balance;
    }

    function checkOddCandidates() view private returns (bool) {
        require(candidateAddresses.length > 0, 'Add more candidates');
        require(voterAddresses.length > 0, 'No one has voted yet');
        if ( ((candidateAddresses.length % 2 != 0)  &&  (voterAddresses.length % 2 == 0)) || (candidateAddresses.length % 2 == 0)  &&  (voterAddresses.length % 2 != 0)   ) {
            // candidatos par y votos impar o viceversa
            return true;
        } else {
            return false;
        }
    }

    function checkIfEveryoneVoted() view private returns (bool) {
        if (voterAddresses.length == totalVotes) {
            return true;
        } else {
            return false;
        }
    }


}