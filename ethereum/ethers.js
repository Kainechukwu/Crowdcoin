import { ethers } from "ethers";
import { infuraLink } from "./utils/constants";

let provider;

if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
  console.log("Metamask detacted");
  // We are in the browser and MetaMask is running
  // Request user to connect their wallet
  await window.ethereum.request({ method: "eth_requestAccounts" });

  // Use the injected provider from MetaMask
  provider = new ethers.BrowserProvider(window.ethereum);
} else {
  console.log("No Metamask detacted");
  provider = new ethers.JsonRpcProvider(infuraLink);
}

export default provider;
