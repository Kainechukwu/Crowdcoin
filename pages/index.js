import React, { Component } from "react";
import { Card } from "semantic-ui-react";
import factory from "../ethereum/factory";
import MetaMask from "../components/MetaMask";
import Layout from "../components/Layout";
import Button from "../components/Button";

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
        description: <a>View Campaign</a>,
      };
    });

    return <Card.Group items={items} />;
  }

  render() {
    return (
      <Layout>
        <div>
          <MetaMask />
          <h3>Open Campaigns</h3>

          <Button
            onClick={() => console.log("clicked Create Campaign")}
            label="Create Campaign"
            labeled
            floated
            position="right"
            icon={<i aria-hidden="true" className="add circle icon"></i>}
          />
          {this.renderCampaigns()}
        </div>
      </Layout>
    );
  }
}

export default CampaignIndex;
