import React, { useState, useEffect } from "react";
import Web3 from "web3";
import ABI from "./ABI.json";

const contractAddress = "0xfB13B567954686F66CBAe11817C07B4f84a116cc";
const web3 = new Web3(window.ethereum);

const contract = new web3.eth.Contract(ABI, contractAddress);

async function getCandidates() {
  const candidates = await contract.methods.getCandidates().call();
  return candidates;
}

async function getVotes(index) {
  const votes = await contract.methods.getVotes(index).call();
  return votes;
}

const Main = () => {
  const [candidates, setCandidates] = useState([]);
  const [votes, setVotes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const candidates = await getCandidates();
      setCandidates(candidates);

      const votes = [];
      for (let i = 0; i < candidates.length; i++) {
        const candidateVotes = await getVotes(i);
        votes.push(candidateVotes);
      }
      setVotes(votes);
    };
    fetchData();
  }, []);

  return (
    <div>
      <h1>Main component</h1>
      {candidates.map((candidate, index) => (
        <div key={candidate}>
          <p>Candidate: {candidate}</p>
          <p>Votes: {votes[index]}</p>
        </div>
      ))}
    </div>
  );
};

export default Main;
