import Web3 from "web3";
import { infuraLink } from "./utils/constants";


let web3;

if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
  // We are in the browser and metamask is running.
  window.ethereum.request({ method: "eth_requestAccounts" });
  web3 = new Web3(window.web3.currentProvider);//ideally we should be able to use <new Web3(window.ethereum)>. However, we donnt know what version of ethereum is injected innto the browser by metamask so its better to use the web3 currentProvider

  
} else {
  // We are on the server *OR* the user is not running metamask
  const provider = new Web3.providers.HttpProvider(infuraLink);
  web3 = new Web3(provider);
}

export default web3;



