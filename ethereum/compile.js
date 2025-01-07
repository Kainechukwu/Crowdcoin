const path = require('path');
const fs = require('fs-extra');
const solc = require('solc');


const buildPath = path.resolve(__dirname, 'build');

fs.removeSync(buildPath);//this will remove the build folder. It will be more difficult to do if we tried using the native fs module. So in this case we use fs-extra instead, which is a wrapper around the native fs module with extra functionality.

const campaignPath = path.resolve(__dirname, 'contracts', 'Campaign.sol');

const source = fs.readFileSync(campaignPath, 'utf8');
const optimizationRuns = 1
const output = solc.compile(source, optimizationRuns).contracts
fs.ensureDirSync(buildPath);

for (let contract in output){
    const contractName = contract.replace(':', ''); 
    fs.outputJSONSync(
        path.resolve(buildPath, `${contractName}.json`),
        output[contract]
    )
}