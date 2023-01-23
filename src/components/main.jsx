import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import ABI from './ABI.json';

const VotingApp = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [candidateNames, setCandidateNames] = useState([]);
  const [candidateCode, setCandidateCode] = useState({});
  const [account, setAccount] = useState(null);
  const [currentWinner, setCurrentWinner] = useState('');
  const [votes, setVotes] = useState({});

  useEffect(() => {
    // Check for web3 and metamask
    if (window.ethereum) {
      // Initialize web3
      const web3js = new Web3(window.ethereum);
      window.ethereum.enable();
      setWeb3(web3js);

      // Set the contract address and ABI
      const contractAddress = '0x1Efb376f4fF367a45879D5630b74f38Abf9Ac5E8';
      const contract = new web3js.eth.Contract(ABI, contractAddress);
      setContract(contract);
      
      if(web3){
        // Get the current account
        web3.eth.getAccounts()
          .then(accounts => {
            setAccount(accounts[0]);
          });
        
        // Get the list of candidate names
        contract.methods.getCandidates().call()
          .then(result => {
            setCandidateNames(result);
            result.forEach((name, index) => {
              setCandidateCode(prevState => ({ ...prevState, [name]: index }));
            });
          })
          .catch(error => {
            console.log(error);
          });

        // Get the number of votes for each candidate
        if(candidateNames.length>0){
          candidateNames.forEach(async (name) => {
            const voteCount = await contract.methods.numberOfVotesFor(candidateCode[name]).call();
            setVotes(prevState => ({ ...prevState, [name]: voteCount }));
          });
        }
      }
    }
  }, [candidateNames]);

  const handleVote = async (candidate) => {
    try {
      // Send a vote transaction
      await contract.methods.voteForCandidate(candidateCode[candidate]).send({ from: account });
      // Update the number of votes
      const voteCount = await contract.methods.numberOfVotesFor(candidateCode[candidate]).call();
      setVotes(prevState => ({ ...prevState, [candidate]: voteCount }));
    } catch (error) {
      console.log(error);
    }
  }

  const handleWinner = async () => {
    try {
      // Get the current winner
      const winner = await contract.methods.currentWinner().call();
      setCurrentWinner(winner);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      <h1>Voting App</h1>
      {candidateNames.length>0 && candidateNames.map((name, index) => (
        <div key={index}>
          <p>{name}</p>
          <button onClick={() => handleVote(name)}>Vote</button>
          <p>Votes: {votes[name]}</p>
        </div>
      ))}
      <button onClick={handleWinner}>View Winner</button>
      {currentWinner && <p>Current Winner: {currentWinner}</p>}
    </div>
  );
}

export default VotingApp;