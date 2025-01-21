const HDWalletProvider = require("@truffle/hdwallet-provider");
const { Web3 } = require("web3");
const compiledFactory = require("../ethereum/build/CampaignFactory.json");
const { infuraLink, mnemonicPhrase } = require("./utils/constants");

const provider = new HDWalletProvider(
  mnemonicPhrase,
  // remember to change this to your own phrase!
  infuraLink
  // remember to change this to your own endpoint!
);
const web3 = new Web3(provider);
const interface = compiledFactory.abi;
const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log("Attempting to deploy from account", accounts[0]);
  console.log(interface)

  const result = await new web3.eth.Contract(interface)
    .deploy({ data: compiledFactory.evm.bytecode.object })
    .send({ gas: "1000000", from: accounts[0] });

  console.log(interface);
  console.log("Contract deployed to", result.options.address);
  provider.engine.stop();
};
deploy();
