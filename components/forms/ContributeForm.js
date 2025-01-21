import { FormField, Form, Input, Message } from "semantic-ui-react";
import Button from "../../components/Button";



const ContributeForm = ({
  onSubmit,
  onChange,
  value,
  loading,
  errorMessage,
  successMessage
}) => (
  <Form onSubmit={onSubmit} error>
    <FormField>
      <label>Contribute to this campaign</label>
      <Input
        onChange={onChange}
        value={value}
        label="wei"
        labelPosition="right"
      />
    </FormField>

    {errorMessage && <Message error header="Oops" content={errorMessage} />}
    {successMessage && <Message  header="Success" content={successMessage} />}
    <Button
      type="submit"
      label="Contribute!"
      position="right"
      labeled={loading ? true : false}
      icon={
        loading ? <i aria-hidden="true" className="add circle icon"></i> : null
      }
      loading={loading}
    />
  </Form>
);

export default ContributeForm;
