import React, { useEffect } from 'react';
import Web3 from 'web3';
import ABI from './ABI.json';

const Main = () => {
  useEffect(() => {
    // Check for web3 and metamask
    if (window.ethereum) {
      // Initialize web3
      const web3 = new Web3(window.ethereum);
      window.ethereum.enable();

      // Set the contract address and ABI
      const contractAddress = '0x1Efb376f4fF367a45879D5630b74f38Abf9Ac5E8';
      const contract = new web3.eth.Contract(ABI, contractAddress);

      // Interact with the contract
      // Example: call the 'get' method of the contract
      contract.methods.get().call()
        .then(result => {
          console.log(result);
        })
        .catch(error => {
          console.log(error);
        });
    }
  }, []);

  return (
    <div>
      <h1>Contract Interaction</h1>
    </div>
  );
}

export default Main;