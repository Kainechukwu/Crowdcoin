import React from "react";
import { FormField, Form, Input, Message } from "semantic-ui-react";
import Button from "../../components/Button";

const CreateCampaignForm = ({
  onSubmit,
  onChange,
  value,
  loading,
  errorMessage,
}) => (
  <Form onSubmit={onSubmit} error>
    <FormField>
      <label>Minimum contribution</label>
      <Input
        onChange={onChange}
        value={value}
        label="wei"
        labelPosition="right"
      />
    </FormField>

    {errorMessage && <Message error header="Oops" content={errorMessage} />}
    <Button
      type="submit"
      label="Create!"
      position="right"
      labeled={loading ? true : false}
      icon={
        loading ? <i aria-hidden="true" className="add circle icon"></i> : null
      }
      loading={loading}
    />
  </Form>
);

export default CreateCampaignForm;
