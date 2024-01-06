import { ethers } from "hardhat";
import dotenv from 'dotenv';
dotenv.config();

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Calling contract with owner account:", deployer.address);
  const weiAmount = (await ethers.provider.getBalance(deployer.address)).toString();
  console.log("Owner account MATIC balance:", (await ethers.formatEther(weiAmount)));

  const tokenContractFactory = await ethers.getContractFactory('PlayerAccounting');
  const tokenContract: any = await tokenContractFactory.attach(process.env.PLAYER_ACCOUNTING_DEPLOYED_ADDRESS_MUMBAI!);
  const res = await tokenContract.getPlayerBalance(process.env.PLAYER_ACCOUNT_MUMBAI);
  // console.log(`response`, res);

  console.log(`Player ${process.env.PLAYER_ACCOUNT_MUMBAI} deposit balance is: ${ethers.formatUnits(res, 6)}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
