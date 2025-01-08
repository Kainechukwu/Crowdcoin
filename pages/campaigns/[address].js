import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import { getCampaignInstance } from "../../ethereum/campaign";
import { Message } from "semantic-ui-react";
import { Card } from "semantic-ui-react";

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
  const [error] = useState("");
  const items = [
    {
      header: "Manager",
      description: "This is the address of the campaign manager",
      meta: managerAddress,
      style: {overflowWrap: "break-word"},
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
  const renderCards = () => {
    return <>{<Card.Group items={items} />}</>;
  };
  return (
    <Layout>
      <h3>Campaign Details</h3>
      {error ? (
        <Message error header="Oops" content={error} />
      ) : (
        <>{renderCards()}</>
      )}
    </Layout>
  );
}
