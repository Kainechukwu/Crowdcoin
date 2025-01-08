import { ethers } from "ethers";
import { Provider } from "./ethers";
import CampaignFactory from "./build/CampaignFactory.json";

// Contract details
const CONTRACT_ADDRESS = "0xCB6053EedfbDC5a1dc41dFCB21aEb688BE311601";
const parsedCampaignFactory =
  typeof CampaignFactory === "string"
    ? JSON.parse(CampaignFactory)
    : CampaignFactory;

const CONTRACT_ABI = parsedCampaignFactory.interface;

// Function to get the factory contract instance
const getFactoryInstance = () => {
  console.log("CONTRACT_ABI: ", CONTRACT_ABI);
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, Provider);
};

// Export the contract instance for use
const factoryInstance = getFactoryInstance();
console.log("factoryInstance: ", factoryInstance);

export default factoryInstance;
