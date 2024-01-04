import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-ethers";
import dotenv from 'dotenv';
dotenv.config();


const config: HardhatUserConfig = {
  solidity: "0.8.20",
  // defaultNetwork: "mumbai",
  networks: {
    mumbai: {
      url: process.env.ALCHEMY_RPC_URL_MUMBAI,
      accounts: [process.env.PRIVATE_KEY_MUMBAI!]
    }
  }
};

export default config;
