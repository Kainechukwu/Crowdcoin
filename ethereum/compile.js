// const path = require("path");
// const fs = require("fs-extra");
// const solc = require("solc");

// const buildPath = path.resolve(__dirname, "build");

// fs.removeSync(buildPath); //this will remove the build folder. It will be more difficult to do if we tried using the native fs module. So in this case we use fs-extra instead, which is a wrapper around the native fs module with extra functionality.

// const campaignPath = path.resolve(__dirname, "contracts", "Campaign.sol");

// const source = fs.readFileSync(campaignPath, "utf8");
// const optimizationRuns = 1;

// const input = {
//   language: "Solidity",
//   sources: {
//     "Campaign.sol": {
//       content: source,
//     },
//   },
//   settings: {
//     outputSelection: {
// "*": {
//   "*": ["*"],
// },
//     },
//     optimizer: {
//       enabled: true,
//       runs: optimizationRuns,
//     },
//   },
// };

// const output = JSON.parse(solc.compile(JSON.stringify(input))).contracts;
// fs.ensureDirSync(buildPath);

// console.log("output: ", output);

// for (let contract in output) {
//   const contractName = contract.replace(":", "");
//   fs.outputJSONSync(
//     path.resolve(buildPath, `${contractName}.json`),
//     output[contract]
//   );
// }

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
