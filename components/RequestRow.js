// import React from "react";
import { ethers } from "ethers";
import { useRequestActions } from "@/utils/useRequestActions";

export default function RequestRow({ request, index, approversCount }) {
  const { approve, finalize } = useRequestActions();

  return (
    <tr key={index}>
      <td data-label="ID">{index + 1} </td>
      <td data-label="Description">{request.description}</td>
      <td data-label="Amount">{ethers.formatEther(request.value)}</td>
      <td data-label="Recepient">{request.recipient.slice(0, 7)}</td>
      <td data-label="Approval Count">
        {request.approvalCount}/{approversCount}
      </td>
      <td data-label="Approve">
        <button
          onClick={() => approve(index)}
          className="w-full  rounded border border-green-500 text-green-500 px-4 py-2  justify-center"
        >
          Approve
        </button>
      </td>
      <td data-label="Finalize">
        <button
          onClick={() => finalize(index)}
          className="w-full rounded border border-red-500 text-red-500 px-4 py-2 justify-center"
        >
          Finalize
        </button>
      </td>
    </tr>
  );
}
