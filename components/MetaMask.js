import React, { useCallback, useEffect, useState } from "react";
import { ethers } from "ethers";

export default function MetaMask() {
  const [errorMessage, setErrorMessage] = useState(null);
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [userBalance, setUserBalance] = useState(null);

  const accountChanged = (account) => {
    setDefaultAccount(account);
    getBalance(account);
  };

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        accountChanged(accounts[0]);
      } catch (error) {
        setErrorMessage(error.message);
      }
    } else {
      setErrorMessage("MetaMask is not installed");
    }
  };

  const getBalance = (account) => {
    if (window.ethereum && account) {
      window.ethereum
        .request({
          method: "eth_getBalance",
          params: [String(account), "latest"],
        })
        .then((balance) => {
          setUserBalance(ethers.formatEther(balance));
        });
    }
  };
  useEffect(() => {
    connectWallet();
  }, []);

  useEffect(() => {
    getBalance();
  }, [getBalance]);

  return (
    <div>
      {errorMessage ? (
        <p className="text-blue-400">Error: {errorMessage}</p>
      ) : (
        <>
          <p className="text-blue-400">Account: {defaultAccount}</p>
          <p className="text-blue-400">Balance: {userBalance}</p>
        </>
      )}
    </div>
  );
}
