// // SPDX-License-Identifier: MIT
// pragma solidity 0.8.28;

// contract CampaignFactory {
//     address[] public deployedCampaigns;

//     function createCampaign(uint minimum) public {
//         address newCampaign = new Campaign(minimum, msg.sender);
//         deployedCampaigns.push(newCampaign);
//     }

//     function getDeployedCampaigns() public view returns (address[] memory){
//         return deployedCampaigns;
//     }
// }

// contract Campaign {
// //struct
//     struct Request {
//         string description;
//         uint value;
//         address recepient;
//         bool complete;
//         mapping(address => bool) approvals;
//         uint approvalCount;
//     }
//     struct RequestView {
//         string description;
//         uint value;
//         address recepient;
//         bool complete;
//         uint approvalCount;
//     }

  
// //modifiers
//     modifier restricted() {
//         require(msg.sender == manager);
//         _;

//     }
//     modifier isApprover() {
//         require(approvers[msg.sender]);
//         _;
//     }

// //properties
//     address public manager;
//     uint public minimumContribution;
//     mapping(address => bool) public approvers;
//     uint approversCount;
//     Request[] public requests;
          

// //methods
//     constructor(uint minimum, address creator) public {
//     manager = creator;
//     minimumContribution = minimum;
//    }

//    function contribute() public payable {
//     require(msg.value >= minimumContribution);

//     approvers[msg.sender] = true;
//     approversCount++;

//    }


//    function createRequest( string memory description, uint value, address recepient )  public restricted  {
//         Request memory newRequest = Request({
//             description: description,
//             value: value, 
//             recepient: recepient, 
//             complete: false, 
//             approvalCount: 0

//         });
//         requests.push(newRequest);


//     }

//     function approveRequest(uint index) public {
//         require(approvers[msg.sender]);
//         Request storage selectedRequest = requests[index];
//         require(!selectedRequest.approvals[msg.sender]);
//         selectedRequest.approvals[msg.sender] = true;
//         selectedRequest.approvalCount = selectedRequest.approvalCount + 1;
        
//     }

//     function getRequest(uint index) public view returns (RequestView memory) {
//         Request storage selectedRequest = requests[index];

//         return RequestView({
//             description: selectedRequest.description,
//             value: selectedRequest.value, 
//             recepient: selectedRequest.recepient, 
//             complete: selectedRequest.complete, 
//             approvalCount: selectedRequest.approvalCount

//         });
//     }


//     function finalizeRequest(uint index) public restricted {
//         Request storage selectedRequest = requests[index];
//         require(!selectedRequest.complete);
//         bool approvalThreshold = selectedRequest.approvalCount > approversCount / 2; //greater than half of total approvers
//         require(approvalThreshold);
//         selectedRequest.recepient.transfer(selectedRequest.value);
//         selectedRequest.complete = true;

//     }

//     function getSummary() public view returns (
//         uint ,
//         uint,
//         uint ,
//         uint ,
//         address 
//     ) {
//         return (
//             address(this).balance,
//             minimumContribution,
//             requests.length,
//             approversCount,
//             manager
//         );
//     }

//     function getRequestsCount() public view returns (uint) {       
//         return requests.length;

//     }   

   

// }

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
}
