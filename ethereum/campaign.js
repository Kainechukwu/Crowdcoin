import { ethers } from "ethers";
import { Provider } from "./ethers";
import Campaign from "./build/Campaign.json";

// Contract details
const parsedCampaign =
  typeof Campaign === "string" ? JSON.parse(Campaign) : Campaign;

const CONTRACT_ABI = parsedCampaign.abi;

console.log("CONTRACT_ABI: ", CONTRACT_ABI);

// Function to get the factory contract instance
export const getCampaignInstance = async (address) => {
  console.log("CONTRACT_ABI: ", CONTRACT_ABI);
  if (!address) throw new Error("Contract address is required.");
  return new ethers.Contract(address, CONTRACT_ABI, Provider);
};

