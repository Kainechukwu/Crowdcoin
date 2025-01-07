const assert = require("assert");
const ganache = require("ganache");
const { Web3 } = require("web3");
const web3 = new Web3(ganache.provider());
const compiledCampaign = require("../ethereum/build/Campaign.json");
const compiledFactory = require("../ethereum/build/CampaignFactory.json");
const { it } = require("mocha");

let accounts;
let campaign;
let factory;
let campaignAddress;

async function fetchCampaign() {
  campaign = await new web3.eth.Contract(
    JSON.parse(compiledCampaign.interface),
    campaignAddress
  );
}

async function deployCampaignFactory() {
  factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploy({
      data: compiledFactory.bytecode,
    })
    .send({ from: accounts[0], gas: "1000000" });

  await factory.methods.createCampaign("100").send({
    from: accounts[0],
    gas: "1000000",
  });

  [campaignAddress] = await factory.methods.getDeployedCampaigns().call(); //destructure the result from the array response and access the first item at index 0 and assign it to campaignAddress
}

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  await deployCampaignFactory();
  await fetchCampaign();
});

describe("Campaign Factory", () => {
  it("deploys a Factory and a Campaign", () => {
    assert.ok(factory.options.address);
    assert.ok(campaign.options.address);
  });

  it("marks caller as the campaign manager", async () => {
    const manager = await campaign.methods.manager().call();
    assert.strictEqual(manager, accounts[0], "manager is not correct");
  });

  it("allows people to contribute money and marks them as approvers", async () => {
    await campaign.methods.contribute().send({
      from: accounts[1],
      value: "200",
    });

    const isContributor = await campaign.methods.approvers(accounts[1]).call(); // you can only look up single values in a mapping so we need to pass the address of the item we want to look up
    assert(isContributor);
  });

  it("requires a minimum contribution", async () => {
    try {
      await campaign.methods.contribute().send({
        from: accounts[2],
        value: "50", //testt contribution function with value less than minimumContribution
      });

      const isContributor = await campaign.methods
        .approvers(accounts[1])
        .call();

      assert(false); //this is to fail the test if it reaches this line
    } catch (error) {
      assert(error);
    }
  });

  it("allows a manager to make a payment request", async () => {
    await campaign.methods
      .createRequest("Buy Batteries", "100", accounts[3])
      .send({
        from: accounts[0],
        gas: "1000000",
      });

    const request = await campaign.methods.requests(0).call();

    assert.strictEqual(request.description, "Buy Batteries");
  });

  it("processes requests", async () => {
    const senderPayload = {
      from: accounts[0],
      gas: "1000000",
    }
    await campaign.methods.contribute().send({
      from: accounts[0],
      value: web3.utils.toWei("10", "ether"),
    });

    await campaign.methods
      .createRequest("A", web3.utils.toWei("5", "ether"), accounts[1])
      .send(senderPayload);

    await campaign.methods.approveRequest(0).send(senderPayload);

    await campaign.methods.finalizeRequest(0).send(senderPayload);

    let balance = await web3.eth.getBalance(accounts[1]);
    balance = web3.utils.fromWei(balance, "ether");
    balance = parseFloat(balance);
    assert(balance > 104);
  });
});
