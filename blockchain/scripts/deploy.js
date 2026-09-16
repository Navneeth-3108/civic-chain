const fs = require('fs');
const path = require('path');
const hre = require('hardhat');

async function main() {
  const ComplaintRegistration = await hre.ethers.getContractFactory('ComplaintRegistration');
  const contract = await ComplaintRegistration.deploy();
  await contract.waitForDeployment();
  const address = await contract.getAddress();
  const artifact = await hre.artifacts.readArtifact('ComplaintRegistration');
  const output = { address, owner: await contract.owner(), abi: artifact.abi };
  fs.writeFileSync(path.join(__dirname, '../../server/contract.json'), JSON.stringify(output, null, 2));
  console.log(`ComplaintRegistration deployed to: ${address}`);
  console.log(`Owner: ${output.owner}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});