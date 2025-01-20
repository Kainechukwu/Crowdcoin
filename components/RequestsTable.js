import RequestRow from "./RequestRow";

export default function RequestsTable({ requests, approversCount }) {
  return (
    <table className="ui celled table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Description</th>
          <th>Amount</th>
          <th>Recipient</th>
          <th>Approval Count</th>
          <th>Approve</th>
          <th>Finalize</th>
        </tr>
      </thead>
      <tbody>
        {requests.map((request, index) => (
          <RequestRow request={request} index={index} approversCount={approversCount} />
        ))}
      </tbody>
    </table>
  );
}
