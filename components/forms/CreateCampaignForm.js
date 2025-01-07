import React from 'react'
import { FormField, Form, Input } from 'semantic-ui-react'
import Button from "../../components/Button";


const CreateCampaignForm = ({onSubmit, onChange, value}) => (
  <Form onSubmit={onSubmit}>
    <FormField>
      <label>Minimum contribution</label>
      <Input onChange={onChange} value={value} label='wei' labelPosition='right'  />
    </FormField>


    <Button  type='submit' label="Create!"/>
  </Form>
)

export default CreateCampaignForm