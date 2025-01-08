import React, { Component } from "react";
import { Card } from "semantic-ui-react";
import factory from "../ethereum/factory";
import MetaMask from "../components/MetaMask";
import Layout from "../components/Layout";
import Button from "../components/Button";
import EmptyCampaignsList from "../components/empty-states/EmptyCampaignsList";
import Link from "next/link";

class CampaignIndex extends Component {
  static async getInitialProps() {
    const campaigns = await factory.getDeployedCampaigns();
    const contract = factory;
    return { campaigns, contract };
  }

  renderCampaigns() {
    const items = this.props.campaigns.map((address) => {
      return {
        fluid: true, //this property allows for the semantic ui card component to span the full width of the container.
        header: address,
        description: <Link href={`/campaigns/${address}`}>View Campaign</Link>,
      };
    });

    return (
      <>
        {items.length > 0 ? (
          <Card.Group items={items} />
        ) : (
          <EmptyCampaignsList />
        )}
      </>
    );
  }

  render() {
    return (
      <Layout>
        <div>
          <MetaMask />
          <h3>Open Campaigns</h3>
          <Link href="/campaigns/new">
            <Button
              onClick={() => console.log("clicked Create Campaign")}
              label="Create Campaign"
              labeled
              floated
              position="right"
              icon={<i aria-hidden="true" className="add circle icon"></i>}
            />
          </Link>
          {this.renderCampaigns()}
        </div>
      </Layout>
    );
  }
}

export default CampaignIndex;
