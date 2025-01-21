// // SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

contract CampaignFactory {
    address[] public deployedCampaigns;

    function createCampaign(uint minimum) public {
        address newCampaign = address(new Campaign(minimum, msg.sender));
        deployedCampaigns.push(newCampaign);
    }

    function getDeployedCampaigns() public view returns (address[] memory) {
        return deployedCampaigns;
    }
}

contract Campaign {
    struct Request {
        string description;
        uint value;
        address recipient;
        bool complete;
        mapping(address => bool) approvals;
        uint approvalCount;
    }

    address public manager;
    uint public minimumContribution;
    mapping(address => bool) public approvers;
    uint public approversCount;
    Request[] public requests;

    modifier restricted() {
        require(msg.sender == manager, "Only the manager can perform this action");
        _;
    }

    event ContributionReceived(address indexed contributor, uint amount);
    event RequestCreated(string description, uint value, address indexed recipient);
    event RequestFinalized(uint indexed requestId);

    constructor(uint minimum, address creator) {
        manager = creator;
        minimumContribution = minimum;
    }

    function contribute() public payable {
        require(msg.value >= minimumContribution, "Contribution is below the minimum");

        approvers[msg.sender] = true;
        approversCount++;

        emit ContributionReceived(msg.sender, msg.value);
    }

    function createRequest(
        string memory description,
        uint value,
        address recipient
    ) public restricted {
        Request storage newRequest = requests.push();
        newRequest.description = description;
        newRequest.value = value;
        newRequest.recipient = recipient;
        newRequest.complete = false;
        newRequest.approvalCount = 0;

        emit RequestCreated(description, value, recipient);
    }

    function approveRequest(uint index) public {
        require(approvers[msg.sender], "Only approvers can approve requests");
        Request storage request = requests[index];
        require(!request.approvals[msg.sender], "You have already approved this request");

        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }

    function finalizeRequest(uint index) public restricted {
        Request storage request = requests[index];
        require(!request.complete, "Request is already finalized");
        require(
            request.approvalCount > approversCount / 2,
            "Approval threshold not met"
        );

        (bool sent, ) = request.recipient.call{value: request.value}("");
        require(sent, "Transfer failed");

        request.complete = true;

        emit RequestFinalized(index);
    }

    function getSummary() public view returns (
        uint campaignBalance,
        uint minimumContributionAmount,
        uint requestsCount,
        uint contributorsCount,
        address managerAddress
    ) {
        return (
            address(this).balance,
            minimumContribution,
            requests.length,
            approversCount,
            manager
        );
    }

    function getRequestsCount() public view returns (uint) {
        return requests.length;
    }

    function getRequest(uint index) public view returns (
    string memory description,
    uint value,
    address recipient,
    bool complete,
    uint approvalCount
) {
    Request storage request = requests[index];
    return (
        request.description,
        request.value,
        request.recipient,
        request.complete,
        request.approvalCount
    );
}

  
}
