const path = require("path");
const fs = require("fs-extra");
const solc = require("solc");

// Path to the build folder
const buildPath = path.resolve(__dirname, "build");

// Remove the existing build folder
fs.removeSync(buildPath);

// Path to the Solidity contract
const contractPath = path.resolve(__dirname, "contracts", "Campaign.sol");

// Read the contract source code
const source = fs.readFileSync(contractPath, "utf8");

// Solidity compiler input configuration
const input = {
  language: "Solidity",
  sources: {
    "Campaign.sol": {
      content: source,
    },
  },
  settings: {
    outputSelection: {
      // "*": {
      //   "*": ["abi", "evm.bytecode", "evm.sourceMap"],
      // },
      "*": {
        "*": ["*"],
      },
    },
    optimizer: {
      enabled: true,
      runs: 200,
    },
  },
};

// Compile the contract
const output = JSON.parse(solc.compile(JSON.stringify(input))).contracts[
  "Campaign.sol"
];
// Ensure the build directory exists
fs.ensureDirSync(buildPath);

for (let contract in output) {
  fs.outputJSONSync(
    path.resolve(buildPath, `${contract}.json`),
    output[contract]
  );
}

console.log("Contracts successfully compiled and saved in the build folder.");
