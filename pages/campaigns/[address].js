import React from "react";
import Layout from "../../components/Layout";

export async function getServerSideProps(context) {
  const { address } = context.params; // Extract the address from the context

  return {
    props: {
      address, // Pass the address to the component as a prop
    },
  };
}

export default function CampaignDetails({ address }) {
  return <Layout>Address:{address}</Layout>;
}
