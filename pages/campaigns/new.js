import React, { Component } from "react";
import Layout from "../../components/Layout";
import factory from "../../ethereum/factory";
import { Signer } from "../../ethereum/ethers";
import CreateCampaignForm from "../../components/forms/CreateCampaignForm";
import ErrorBoundary from "../../components/ErrorBoundary";

class CampaignNew extends Component {
  state = {
    minimumContribution: "",
    loading: false,
    errorMessage: "",
  };

  handleChange = (event) => {
    this.setState({ minimumContribution: event.target.value });
    this.setState({ errorMessage: "" })
  };

  onSubmit = async (event) => {
    event.preventDefault();
    this.setState({ loading: true, errorMessage: "" });

    try {
      if (!Signer) {
        throw new Error("No signer available. Please connect your wallet.");
      }
      if (isNaN(this.state.minimumContribution) || this.state.minimumContribution.trim() === "") {
        this.setState({
          loading: false, // Reset loading since we're exiting early
          errorMessage: "Input must be a valid number",
        });
        return;
      }
  

      // Connect factory contract to signer
      const factoryWithSigner = factory.connect(Signer);

      // Send the transaction
      const tx = await factoryWithSigner.createCampaign(
        this.state.minimumContribution
      );
      console.log("Transaction hash:", tx.hash);

      // Wait for confirmation
      const receipt = await tx.wait();
      console.log("Transaction confirmed:", receipt);

      // Optionally redirect or notify the user after success
    } catch (error) {
      console.error("Error creating campaign:", error);
      this.setState({ errorMessage: error.message });
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    return (
      <Layout>
        <h3>Create a Campaign</h3>
        <CreateCampaignForm
          value={this.state.minimumContribution}
          onSubmit={this.onSubmit}
          onChange={this.handleChange}
          loading={this.state.loading}
          errorMessage={this.state.errorMessage}
        />
      </Layout>
    );
  }
}

const CampaignNewWithErrorBoundary = () => (
  <ErrorBoundary>
    <CampaignNew />
  </ErrorBoundary>
);

export default CampaignNewWithErrorBoundary;
