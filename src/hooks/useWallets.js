import { useEffect, useState } from "react";
import Web3 from "web3";

const useWallets = () => {
  const [web3, setWeb3] = useState(null);
  const [wallets, setWallets] = useState([]);
  const [connectedAccount, setConnectedAccount] = useState(null);

  useEffect(() => {
    const detectProviders = async () => {
      if (window.ethereum) {
        // Listen for EIP-6963 connect events
        window.ethereum.on("connect", (provider) => {
          console.log("Wallet connected:", provider);
        });

        // Detect EIP-6963-compatible providers
        if (window.ethereum.providers) {
          const availableWallets = window.ethereum.providers.map((provider) => ({
            name: provider.name,
            id: provider.id,
            provider,
          }));
          setWallets(availableWallets);

          // Optionally, set the first provider as default
          const primaryProvider = availableWallets[0]?.provider || window.ethereum;
          setWeb3(new Web3(primaryProvider));
        } else {
          // Fallback to default provider
          setWeb3(new Web3(window.ethereum));
        }
      } else {
        console.error("No wallets detected");
      }
    };

    detectProviders();
  }, []);

  const connectWallet = async (provider) => {
    try {
      const accounts = await provider.request({ method: "eth_requestAccounts" });
      setConnectedAccount(accounts[0]);
      console.log("Connected accounts:", accounts);
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  useEffect(() => {
    if (web3 && web3.currentProvider) {
      const provider = web3.currentProvider;

      provider.on("accountsChanged", (accounts) => {
        console.log("Accounts changed:", accounts);
        setConnectedAccount(accounts[0]);
      });

      provider.on("chainChanged", (chainId) => {
        console.log("Chain changed:", chainId);
        window.location.reload(); // Reload to ensure correct chain
      });

      provider.on("disconnect", (error) => {
        console.log("Wallet disconnected:", error);
        setConnectedAccount(null);
      });
    }
  }, [web3]);

  return {
    wallets,
    connectWallet,
    connectedAccount,
    web3,
  };
};

export default useWallets;
