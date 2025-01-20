import { Signer } from "@/ethereum/ethers";
import { getCampaignInstance } from "@/ethereum/campaign";
import { useRouter } from "next/router";

export const useRequestActions = () => {
  const router = useRouter();
  const { address } = router.query;

  const approve = async (index) => {
    try {
      if (!Signer) {
        throw new Error("No signer available. Please connect your wallet.");
      }

      const campaign = await getCampaignInstance(address);
      const campaignWithSigner = campaign.connect(Signer);

      const tx = await campaignWithSigner.approveRequest(index);
      console.log("Approve request transaction hash:", tx.hash);

      const receipt = await tx.wait();
      console.log("Approve request transaction confirmed:", receipt);

      router.replace(router.asPath);
    } catch (error) {
      console.error(error.message);
    }
  };

  const finalize = async (index) => {
    try {
      const campaign = await getCampaignInstance(address);
      const campaignWithSigner = campaign.connect(Signer);

      const tx = await campaignWithSigner.finalizeRequest(index);
      console.log("Finalize request transaction hash:", tx.hash);

      const receipt = await tx.wait();
      console.log("Finalize request transaction confirmed:", receipt);

      router.replace(router.asPath);
    } catch (error) {
      console.error(error.message);
    }
  };

  return {
    approve,
    finalize,
  };
};
