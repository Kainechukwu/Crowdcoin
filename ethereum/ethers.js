import { ethers } from "ethers";
import { infuraLink } from "./utils/constants";

let provider, signer;

if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
  console.log("MetaMask detected");

  // Request account access
  await window.ethereum.request({ method: "eth_requestAccounts" });

  // Use the injected MetaMask provider
  provider = new ethers.BrowserProvider(window.ethereum);

  // Get the signer from the provider
  signer = await provider.getSigner();
} else {
  console.log("No MetaMask detected, using Infura provider");

  // Fallback to Infura provider
  provider = new ethers.JsonRpcProvider(infuraLink);

  // No signer available in fallback mode
  signer = null;
}

// Export both provider and signer as named exports
export { provider as Provider, signer as Signer };
