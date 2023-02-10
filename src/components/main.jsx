import React, { useState, useEffect } from "react";
import Web3 from "web3";
import ABI from "./ABI.json";
import "./Main.css";

const contractAddress = "0x69aD1adEF0E186663fDE9d82584EEB16F0D59EEc";
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

async function getTotalVotes() {
  const totalVotes = await contract.methods.getTotalVotes().call();
  return totalVotes;
}

async function getTitle() {
  const title = await contract.methods.getTitle().call();
  return title;
}

async function getDescription() {
  const description = await contract.methods.getDescription().call();
  return description;
}

async function getCandidatePercentages() {
  const candidatePercentages = await contract.methods.getCandidatePercentages().call();
  return candidatePercentages;
}

async function getCurrentWinners() {
  const currentWinners = await contract.methods.getWinners().call();
  return currentWinners;
}

async function getTimeLeft() {
  const timeLeft = await contract.methods.getTimeLeft().call();
  return timeLeft;
}

async function vote(index) {
  
  const accounts = await web3.eth.getAccounts();
  const result = await contract.methods.vote(index).send({ from: accounts[0] });
  console.log(result);
}

const Main = () => {
  const [candidates, setCandidates] = useState([]);
  const [votes, setVotes] = useState([]);
  const [totalVotes, setTotalVotes] = useState([]);
  const [title, setTitle] = useState([]);
  const [description, setDescription] = useState([]);
  const [candidatePercentages, setCandidatePercentages] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [currentWinners, setCurrentWinners] = useState(0);


  useEffect(() => {
    const fetchData = async () => {
      const candidates = await getCandidates();
      setCandidates(candidates);

      const totalVotes = await getTotalVotes();
      setTotalVotes(totalVotes);

      const title = await getTitle();
      setTitle(title);

      const description = await getDescription();
      setDescription(description);

      const votes = [];
      for (let i = 0; i < candidates.length; i++) {
        const candidateVotes = await getVotes(i);
        votes.push(candidateVotes);
      }
      setVotes(votes);

      const candidatePercentages = await getCandidatePercentages();
      setCandidatePercentages(candidatePercentages);

      const currentWinners = await getCurrentWinners();
      setCurrentWinners(currentWinners);

      const timeLeft = await getTimeLeft();
      setTimeLeft(timeLeft);
    };
    fetchData();
    const intervalId = setTimeout(() => {
      fetchData();
    }, 15000);
  
    return () => {
      clearTimeout(intervalId);
    };
  }, []);

  useEffect(() => {
    let intervalId = setInterval(() => {
      setTimeLeft(prevTimeLeft => prevTimeLeft - 1);
    }, 1000);
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const calculateTimeLeft = (timeLeftMs) => {
    let days = Math.floor(timeLeftMs / ( 60 * 60 * 24));
    let hours = Math.floor((timeLeftMs % ( 60 * 60 * 24)) / ( 60 * 60));
    let minutes = Math.floor((timeLeftMs % ( 60 * 60)) / ( 60));
    let seconds = Math.floor((timeLeftMs % ( 60)) );
  
    let timeLeftString = "";
    if (days) timeLeftString += `${days}d `;
    if (hours) timeLeftString += `${hours}h `;
    if (minutes) timeLeftString += `${minutes}m `;
    timeLeftString += `${seconds}s`;
  
    return timeLeftString;
  };


 
  return (
    <div>
      <section className="jumbotron text-center">
        <div className="container">
          <h1 className="jumbotron-heading">{title}</h1>
          <p className="lead text-muted">{description}</p>
          <p>
            <a href={"https://goerli.etherscan.io/address/"+contractAddress} target="_blank" className="btn btn-primary my-2">View contract on Etherscan</a>
          </p>
          <p className=" text-center mt-3 " style={{fontSize:40}}>Total Votes: {totalVotes}</p>

        </div>
      </section>
      <div className="d-flex justify-content-center mt-4">
        <div className="d-flex flex-wrap">
          {candidates.map((candidate, index) => (
            <div className="col-md-4 mb-3">
              <div className="card h-100 shadow-sm">
                <svg className="bd-placeholder-img card-img-top" width="100%" height="225" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img" aria-label=""><title></title><rect width="100%" height="100%" fill="#55595c"/><text x="50%" y="50%" fill="#eceeef" dy=".3em"></text></svg>
                <div className="card-body">
                  <h2 className="card-text">{candidate}</h2>
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="btn-group">
                      <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => vote(index)}>Vote</button>
                    </div>
                    <small className="text-muted">{candidatePercentages[index]}% at  {votes[index]} votes</small>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <p className=" text-center mt-3 " style={{fontSize:40}}>Current Winner: {currentWinners}</p>
      <p className=" text-center mt-3 " style={{fontSize:40}}>Time left for voting: {calculateTimeLeft(timeLeft)}</p>
      
    
    
    </div>
    
  );
  
};

export default Main;
