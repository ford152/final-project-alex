import { ethers } from "hardhat";
import dotenv from 'dotenv';
dotenv.config();

async function main() {
  const usdcContractAddress = process.env.USDC_CONTRACT_ADDRESS!;
  console.log('USDC Contract addreess', usdcContractAddress);

  const [deployer] = await ethers.getSigners();
  console.log("Deploying contract with owner account:", deployer.address);
  const weiAmount = (await ethers.provider.getBalance(deployer.address)).toString();
  console.log("Owner account MATIC balance:", (await ethers.formatEther(weiAmount)));

  const ContractBeingDeployed = await ethers.getContractFactory('PlayerAccounting');
  const contract = await ContractBeingDeployed.deploy(usdcContractAddress);
  const deployedContract = await contract.waitForDeployment();
  const deployedContractAddr = await deployedContract.getAddress();
  const activeNetwork = await ethers.provider.getNetwork();

  console.log(`PlayerAccounting smart contract deployed to ${deployedContractAddr} on ${activeNetwork.name} network`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
