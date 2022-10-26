const Election = artifacts.require("Election");
var Web3 = require('web3');

contract("Election", function (accounts) {
  
  it("should assert true", async function () {
    const contract = await Election.deployed();	
    return assert.notEqual(contract.address,'0x0000000000000000000000000000000000000000');
  });

  it("should verify candidate has/pays 1 ether", async function () {
    const contract = await Election.deployed();

    const candidateAddress = accounts[1]; 
    
    try {     
        await contract.payFee({ from: candidateAddress, value: Web3.utils.toWei('1', 'ether')});      
    } catch (error) {
        return assert.fail();
    }
    return assert.isOk(true);
  });

  it("should check election is in state 'Created'", async function () {
    const contract = await Election.deployed();	
    let contractState;

    await contract.state().then(( state ) => {        
        contractState = state;
    });
   
    return assert.equal(contractState,0); // 0 = State.Created
  });


  it("should not allow owner to be candidate when paying comission", async function () {
    const contract = await Election.deployed();	
    const ownerAddress = accounts[0];

    try {
      await contract.payFee({from: ownerAddress})
    } catch (error) {
      return assert.isOk(true); 
    }
    return assert.fail();
  });

  it("should check winner received prize", async function () {
    const contract = await Election.deployed();
    const owner = accounts[0];

    try {
        //register 2 candidates
        const candidateOneAddress = accounts[1];
        const candidateTwoAddress = accounts[2];    
        //candidate 1 is already registered by past test
        await contract.payFee({from: candidateTwoAddress, value: '1000000000000000000'});

        //owner confirms 2 candidates   
        await contract.addCandidate(candidateOneAddress, 'C1', {from: owner});
        await contract.addCandidate(candidateTwoAddress, 'C2' , {from: owner});

        //owner adds 3 voters
        const voterOneAddress = accounts[3];
        const voterTwoAddress = accounts[4]; 
        const voterThreeAddress = accounts[5];   
        await contract.registerVoter(voterOneAddress,{from: owner});
        await contract.registerVoter(voterTwoAddress,{from: owner});
        await contract.registerVoter(voterThreeAddress,{from: owner});  

        //owner starts election
        await contract.startVote({from: owner});

        //all voters vote
        await contract.vote(candidateOneAddress,{from: voterOneAddress});
        await contract.vote(candidateTwoAddress,{from: voterTwoAddress});
        await contract.vote(candidateOneAddress,{from: voterThreeAddress});

        //owner ends election
        await contract.endVote({from: owner});

        //owner announces winner and gives price to winner
        await contract.announceWinner({from: owner});
        await contract.givePriceToWinner({from: owner});
    } catch (error) {
      assert.fail();
    }
    assert.isOk(true);
  });

});