import Layout from "@/components/Layout";
import { useState } from "react";
import { FormField, Form, Input, Message } from "semantic-ui-react";
import Button from "@/components/Button";
import useRequestFormReducer from "@/utils/useRequestFormReducer";
import { Signer } from "@/ethereum/ethers";
import { useRouter } from "next/router";
import { getCampaignInstance } from "@/ethereum/campaign";
import { ethers } from "ethers";

export default function NewRequest() {
  const router = useRouter();
  const { address } = router.query;
  const [formState, dispatch] = useRequestFormReducer();
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field) => (e) => {
    setErrorMessage("");
    setSuccessMessage("");
    dispatch({ type: `SET_${field.toUpperCase()}`, payload: e.target.value });
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");
    setLoading(true);

    try {
      if (!Signer) {
        throw new Error("No signer available. Please connect your wallet.");
      }
      if (
        formState.description.trim() === "" ||
        formState.amount.trim() === "" ||
        formState.recipient.trim() === ""
      ) {
        setLoading(false);
        setErrorMessage("All input fields are required");
        return;
      }
      const amountToWei = ethers.parseEther(formState.amount.toString());
      const campaign = await getCampaignInstance(address);

      const campaignWithSigner = campaign.connect(Signer);
      const tx = await campaignWithSigner.createRequest(
        formState.description,
        amountToWei,
        formState.recipient
      );
      console.log("Create request transaction hash:", tx.hash);

      const receipt = await tx.wait();
      console.log("Create request transaction confirmed:", receipt);

      setSuccessMessage("Campaign created successfully!");
      router.push(`campaigns/${address}/requests`);
    } catch (error) {
      console.log(error);
      setLoading(false);
      setErrorMessage(error.message ?? "All input fields are required");
    } finally {
      setLoading(false);
      // dispatch({ type: `RESET_FORM` });
    }
  };
  return (
    <Layout>
      <h3>Create a Request</h3>
      <Form className="flex flex-col gap-2" onSubmit={onSubmit} error>
        <FormField>
          <Input
            onChange={handleInputChange("description")}
            value={formState.description}
            label="Description"
            labelPosition="left"
          />
        </FormField>
        <FormField>
          <Input
            onChange={handleInputChange("amount")}
            value={formState.amount}
            label="Value in Ether"
            labelPosition="left"
          />
        </FormField>
        <FormField>
          <Input
            onChange={handleInputChange("Recipient")}
            value={formState.recipient}
            label="recipient"
            labelPosition="left"
          />
        </FormField>

        {errorMessage && <Message error header="Oops" content={errorMessage} />}
        {successMessage && (
          <Message header="Success" content={successMessage} />
        )}
        <Button
          className="max-w-max"
          type="submit"
          label="Create"
          position="right"
          labeled={loading ? true : false}
          icon={
            loading ? (
              <i aria-hidden="true" className="add circle icon"></i>
            ) : null
          }
          loading={loading}
        />
      </Form>
    </Layout>
  );
}
