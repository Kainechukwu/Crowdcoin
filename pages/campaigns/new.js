import React, { Component } from "react";
import Layout from "../../components/Layout";
import factory from "../../ethereum/factory";
import CreateCampaignForm from "../../components/forms/CreateCampaignForm";

class CampaignNew extends Component {
  state = {
    minimumContribution: "",
  };

  handleChange = (event) => {
    this.setState({ minimumContribution: event.target.value });
  };

  onSubmit = async (event) => {
    event.preventDefault();
    console.log(this.state.minimumContribution);

    // const accounts = await web3.eth.getAccounts();

    // try {
    //   await factory.methods
    //     .createCampaign(this.state.minimumContribution)
    //     .send({
    //       from: accounts[0],
    //     });
    // } catch (error) {
    //   console.log(error);
    // }
  };

  render() {
    return (
      <Layout>
        <h3>Create a Campaign</h3>
        <CreateCampaignForm
          value={this.state.minimumContribution}
          onSubmit={this.onSubmit}
          onChange={this.handleChange}
        />
      </Layout>
    );
  }
}
export default CampaignNew;
