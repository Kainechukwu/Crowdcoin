import Layout from "@/components/Layout";
import Button from "@/components/Button";
import { getCampaignInstance } from "@/ethereum/campaign";
import Link from "next/link";
import RequestsTable from "@/components/RequestsTable";

export async function getServerSideProps(context) {
  const { address } = await context.params;
  const campaign = await getCampaignInstance(address);
  const requestsNumber = (await campaign.getRequestsCount()).toString();
  const approversCount = Number((await campaign.approversCount()).toString());

  const requests = await Promise.all(
    Array(Number(requestsNumber))
      .fill()
      .map((element, index) => {
        return campaign.requests(index).then((request) => ({
          description: request[0],
          value: request[1].toString(), // Convert BigInt to string
          recipient: request[2],
          complete: request[3],
          approvalCount: request[4].toString(), // Convert BigInt to string
        }));
      })
  );

  return {
    props: {
      address,
      requestsNumber,
      requests,
      approversCount,
    },
  };
}

export default function Requests({ address, approversCount, requests }) {

  


  return (
    <Layout>
      <div className="flex justify-between items-center">
        <h3>Requests</h3>
        <Link href={`/campaigns/${address}/requests/new`}>
          <Button label="Add Request" position="right" />
        </Link>
      </div>

      <RequestsTable requests={requests} approversCount={approversCount} />
    </Layout>
  );
}
