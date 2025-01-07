pragma solidity ^0.4.17;

contract CampaignFactory {
    address[] public deployedCampaigns;

    function createCampaign(uint minimum) public {
        address newCampaign = new Campaign(minimum, msg.sender);
        deployedCampaigns.push(newCampaign);
    }

    function getDeployedCampaigns() public view returns (address[]){
        return deployedCampaigns;
    }
}

contract Campaign {
//struct
    struct Request {
        string description;
        uint value;
        address recepient;
        bool complete;
        mapping(address => bool) approvals;
        uint approvalCount;
    }
    struct RequestView {
        string description;
        uint value;
        address recepient;
        bool complete;
        uint approvalCount;
    }

//modifiers
    modifier restricted() {
        require(msg.sender == manager);
        _;

    }
    modifier isApprover() {
        require(approvers[msg.sender]);
        _;
    }

//properties
    address public manager;
    uint public minimumContribution;
    mapping(address => bool) public approvers;
    uint approversCount;
    Request[] public requests;
          

//methods
   function Campaign(uint minimum, address creator) public {
    manager = creator;
    minimumContribution = minimum;
   }

   function contribute() public payable {
    require(msg.value >= minimumContribution);

    approvers[msg.sender] = true;
    approversCount++;

   }


   function createRequest( string description, uint value, address recepient )  public restricted  {
        Request memory newRequest = Request({
            description: description,
            value: value, 
            recepient: recepient, 
            complete: false, 
            approvalCount: 0

        });
        requests.push(newRequest);


    }

    function approveRequest(uint index) public {
        require(approvers[msg.sender]);
        Request storage selectedRequest = requests[index];
        require(!selectedRequest.approvals[msg.sender]);
        selectedRequest.approvals[msg.sender] = true;
        selectedRequest.approvalCount = selectedRequest.approvalCount + 1;
        
    }

    function getRequest(uint index) public view returns (RequestView memory) {
        Request storage selectedRequest = requests[index];

        return RequestView({
            description: selectedRequest.description,
            value: selectedRequest.value, 
            recepient: selectedRequest.recepient, 
            complete: selectedRequest.complete, 
            approvalCount: selectedRequest.approvalCount

        });
    }


    function finalizeRequest(uint index) public restricted {
        Request storage selectedRequest = requests[index];
        require(!selectedRequest.complete);
        bool approvalThreshold = selectedRequest.approvalCount > approversCount / 2; //greater than half of total approvers
        require(approvalThreshold);
        selectedRequest.recepient.transfer(selectedRequest.value);
        selectedRequest.complete = true;

    }

   

}

 