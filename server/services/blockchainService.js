const fs = require('fs');
const path = require('path');
const { ethers } = require('ethers');
const env = require('../config/env');
const { contractStatusToName } = require('../utils/status');

function loadContract() {
  const artifactPath = path.join(__dirname, '../contract.json');
  if (!env.contractAddress || !fs.existsSync(artifactPath)) {
    throw new Error('Blockchain contract is not configured. Deploy the contract and set CONTRACT_ADDRESS.');
  }
  const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
  const provider = new ethers.JsonRpcProvider(env.rpcUrl);
  const signer = env.privateKey ? new ethers.Wallet(env.privateKey, provider) : null;
  const readContract = new ethers.Contract(env.contractAddress, artifact.abi, provider);
  return { provider, signer, readContract, artifact };
}

async function registerComplaint(title, description) {
  const { provider, signer, readContract } = loadContract();
  if (!signer) throw new Error('Blockchain signer is not configured.');
  const transaction = await readContract.connect(signer).registerComplaint(title, description);
  const receipt = await transaction.wait();
  const total = await readContract.getTotalComplaints();
  const block = await provider.getBlock(receipt.blockNumber);
  const complaint = await getComplaint(Number(total));
  return { ...complaint, transactionHash: receipt.hash, timestamp: new Date(Number(block.timestamp) * 1000) };
}

async function getComplaint(complaintId) {
  const { readContract } = loadContract();
  const item = await readContract.getComplaint(complaintId);
  return { complaintId: Number(item.id), complainant: item.complainant, title: item.title, description: item.description, status: contractStatusToName(item.status), timestamp: new Date(Number(item.timestamp) * 1000) };
}

async function updateComplaintStatus(complaintId, status) {
  const { signer, readContract } = loadContract();
  if (!signer) throw new Error('Blockchain signer is not configured.');
  const transaction = await readContract.connect(signer).updateComplaintStatus(complaintId, status);
  const receipt = await transaction.wait();
  return { transactionHash: receipt.hash, complaint: await getComplaint(complaintId) };
}

async function getBlockchainInfo() {
  const { provider, readContract } = loadContract();
  const network = await provider.getNetwork();
  return { network: network.name === 'unknown' ? `Chain ${network.chainId}` : network.name, chainId: Number(network.chainId), contractAddress: env.contractAddress, owner: await readContract.owner(), totalComplaints: Number(await readContract.getTotalComplaints()), adminAddress: env.adminAddress || null };
}

module.exports = { registerComplaint, getComplaint, updateComplaintStatus, getBlockchainInfo };