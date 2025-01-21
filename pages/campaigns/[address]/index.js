import React, { useState } from "react";
import Layout from "@/components/Layout";
import { getCampaignInstance } from "@/ethereum/campaign";
import { Message, Card, Grid } from "semantic-ui-react";
import ContributeForm from "@/components/forms/ContributeForm";
import { Signer } from "@/ethereum/ethers";
// import { ethers } from "ethers";
import Button from "@/components/Button";

import { useRouter } from "next/router";
import Link from "next/link";

export async function getServerSideProps(context) {
  const { address } = await context.params; // Extract the address from the context
  const campaign = await getCampaignInstance(address);
  const summary = await campaign.getSummary();
  console.log(summary);

  return {
    props: {
      contractAddress: address, // Pass the address to the component as a prop
      campaignBalance: summary[0].toString(),
      minimumContributionAmount: summary[1].toString(),
      requestsCount: summary[2].toString(),
      contributorsCount: summary[3].toString(),
      managerAddress: summary[4],
    },
  };
}

export default function CampaignDetails({
  contractAddress,
  campaignBalance,
  minimumContributionAmount,
  requestsCount,
  contributorsCount,
  managerAddress,
}) {
  const router = useRouter();
  const [error] = useState("");
  const [contribution, setContribution] = useState("");
  const [contributionLoading, setContributionLoading] = useState("");
  const [contributionError, setContributionError] = useState("");
  const [contributionSuccess, setContributionSuccess] = useState("");

  const items = [
    {
      header: "Manager Address",
      description: "This is the address of the campaign manager",
      meta: managerAddress,
      style: { overflowWrap: "break-word" },
    },
    {
      header: "Campaign Balance",
      description: "The total amount contributed to the campaign",
      meta: campaignBalance,
    },
    {
      header: "Minimum Contribution",
      description: "The least amount that can be contributed to the campaign",
      meta: minimumContributionAmount,
    },

    {
      header: "Requests",
      description: "The total number of requests",
      meta: requestsCount,
    },
    {
      header: "Contributors",
      description: "The total number of contributors",
      meta: contributorsCount,
    },
  ];
  const refreshPage = () => {
    router.replace(router.asPath);
    setContribution("");
  };
  const renderCards = () => {
    return <>{<Card.Group items={items} />}</>;
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setContributionLoading(true);
    setContributionError(""); // Clear previous errors
    setContributionSuccess(""); // Clear previous success messages

    try {
      if (!Signer) {
        setContributionError(
          "No signer available. Please connect your wallet."
        );
      }

      if (isNaN(contribution) || !contribution) {
        setContributionError("Input must be a valid number");
        return;
      }

      const contributionValue = Number(contribution);
      // const valueInWei = ethers.parseEther(contributionValue.toString());
      // console.log("valueInWei: ", valueInWei.toString());

      const minimumContributionValue = Number(minimumContributionAmount);

      if (contributionValue < minimumContributionValue) {
        setContributionError(
          `Contribution must be greater than or equal to the minimum contribution amount. (${minimumContributionValue})`
        );
        return;
      }

      const campaign = await getCampaignInstance(contractAddress);
      const campaignWithSigner = campaign.connect(Signer);
      const tx = await campaignWithSigner.contribute({
        value: contributionValue,
      });
      const receipt = await tx.wait();
      console.log("Transaction confirmed. View receipt:", receipt);

      setContributionSuccess("Successfully contributed to the campaign.");

      refreshPage();
    } catch (error) {
      setContributionError(
        error?.message || "An error occurred while contributing."
      );
    } finally {
      setContributionLoading(false);
    }
  };

  const handleChange = (event) => {
    setContribution(event.target.value);
    setContributionError("");
    setContributionSuccess("");
  };

  return (
    <Layout>
      <h3>Campaign Details</h3>
      {error ? (
        <Message error header="Oops" content={error} />
      ) : (
        <>
          <Grid>
            <Grid.Row>
              <Grid.Column width={10}>{renderCards()}</Grid.Column>
              <Grid.Column width={6}>
                <ContributeForm
                  address={contractAddress}
                  onSubmit={onSubmit}
                  onChange={handleChange}
                  value={contribution}
                  loading={contributionLoading}
                  errorMessage={contributionError}
                  successMessage={contributionSuccess}
                />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <Link href={`/campaigns/${contractAddress}/requests`}>
                  <Button label="View Requests" />
                </Link>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </>
      )}
    </Layout>
  );
}
