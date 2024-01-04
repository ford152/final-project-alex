import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
// import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Player Accounting", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployContractsFixture() {
    // Contracts are deployed using the first signer/account
    const [ownerAccount, playerAccount] = await ethers.getSigners();

    // Deploy the fake USDC contract
    const USDCInstance = await ethers.getContractFactory("FakeUSDC");
    const usdc = await USDCInstance.deploy();
    const deployedUSDC = await usdc.waitForDeployment();
    const usdcAddr = await deployedUSDC.getAddress();
    console.log(`Fake USDC contract deployed to ${usdcAddr}`);
    const usdcSupply = await deployedUSDC.totalSupply();
    console.log(`USDC total supply: ${ethers.formatEther(usdcSupply)}`);

    // Send the player wallet some fake USDC
    const amount = ethers.parseUnits("7.0", 18);
    //Define the data parameter
    const data = deployedUSDC.interface.encodeFunctionData("transfer", [playerAccount.address, amount])

    // Creating and sending the transaction object
    const tx = await ownerAccount.sendTransaction({
      to: deployedUSDC,
      from: ownerAccount.address,
      value: ethers.parseUnits("0.000", "ether"),
      data: data
    });

    console.log('Mining transaction...', tx.hash);
    // Waiting for the transaction to be mined
    await tx.wait();
    // Get the player's USDC balance
    const balance = await deployedUSDC.balanceOf(playerAccount.address);
    console.log(`Player now has ${ethers.formatEther(balance)} USDC tokens`);


    // Deploy the PlayerAccounting contract
    const PlayerAccountingInstance = await ethers.getContractFactory('PlayerAccounting');
    const playerAccountingContract = await PlayerAccountingInstance.deploy(usdcAddr);
    const deployedPA = await playerAccountingContract.waitForDeployment();
    const deployedAddr = await deployedPA.getAddress();
    console.log(`Player Accounting contract deployed to ${deployedAddr}`);

    return { deployedUSDC, deployedPA, ownerAccount, playerAccount };
  }

  describe("Default state for player account", function () {
    describe("Call from player's wallet", function () {
      it("Player account should not be active", async function () {
        const { deployedPA, playerAccount } = await loadFixture(deployContractsFixture);
        expect(await deployedPA.connect(playerAccount).getActiveStatus()).to.be.false;
      });

      it("Player's USDC balance should be zero", async function () {
        const { deployedPA, playerAccount } = await loadFixture(deployContractsFixture);
        expect(await deployedPA.connect(playerAccount).getBalance()).to.equal(0);
      });
    });

    describe("Call from owner wallet", function () {
      it("Player account should not be active", async function () {
        const { deployedPA, ownerAccount, playerAccount } = await loadFixture(deployContractsFixture);
        expect(await deployedPA.connect(ownerAccount).getPlayerActiveStatus(playerAccount.address)).to.be.false;
      });

      it("Player's USDC balance seshould be zero", async function () {
        const { deployedPA, ownerAccount, playerAccount } = await loadFixture(deployContractsFixture);
        expect(await deployedPA.connect(ownerAccount).getPlayerBalance(playerAccount.address)).to.equal(0);
      });
    });
  });

  describe("Player wallet deposits funds", function () {
    it("Player balance (in Player Accounting contract) should increase", async function () {
      const { deployedUSDC, deployedPA, playerAccount, ownerAccount } = await loadFixture(deployContractsFixture);
      const deployedPlayerAccountAddr = await deployedPA.getAddress();

      // Player approves the Player Accounting contract to take up to 3 USDC tokens from player's wallet
      const amount = ethers.parseUnits("3.0", 18);
      await deployedUSDC.connect(playerAccount).approve(deployedPlayerAccountAddr, amount);

      // Player deposits 3 USDC
      await deployedPA.connect(playerAccount).deposit(amount);

      expect(await deployedPA.connect(ownerAccount).getPlayerBalance(playerAccount.address)).to.equal(amount);
    });

    it("Player account call to deposit USDC should fail because player doesn't have enough funds", async function () {
      const { deployedUSDC, deployedPA, playerAccount, ownerAccount } = await loadFixture(deployContractsFixture);
      const deployedPlayerAccountAddr = await deployedPA.getAddress();

      // Player approves the Player Accounting contract to take up to 3 USDC tokens from player's wallet
      await deployedUSDC.connect(playerAccount).approve(deployedPlayerAccountAddr, ethers.parseUnits("1.0", 18));

      // Player tries to deposit 25 USDC
      await expect(deployedPA.connect(playerAccount).deposit(ethers.parseUnits("25.0", 18)))
        .to.be.revertedWith('The calling account does not have enough ERC20 funds for the deposit');
    });
  });

  describe("Owner sets the player's account set to active", function () {
    it("Status should be true", async function () {
      const { deployedUSDC, deployedPA, playerAccount, ownerAccount } = await loadFixture(deployContractsFixture);
      await deployedPA.connect(ownerAccount).setPlayerActiveStatus(playerAccount.address, true);
      expect(await deployedPA.connect(ownerAccount).getPlayerActiveStatus(playerAccount.address)).to.be.true;
    });
  });
});
