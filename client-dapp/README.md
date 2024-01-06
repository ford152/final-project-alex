This is a [Next.js](https://nextjs.org/) project bootstrapped with [create-web3-dapp](https://www.alchemy.com/create-web3-dapp).  These instructions are for use with the Polygon Mumbai testnet.

## Getting Started
Ensure you are running node v18.17 or later  
Setup the environment variables:
1) Rename sample.env to .env.local file
2) Set ALCHEMY_API_KEY to your Alchemy api key
3) Set WALLETCONNECT_PROJ_ID to your wallet connect project id.  You can create a free account [here](https://cloud.walletconnect.com/).
4) If you deploy a  new PlayerAccounting contract (see the contract  folder readme), update the NEXT_PUBLIC_PLAYER_ACCOUNTING_CONTRACT_ADDRESS setting to the newly deployed contract address.  Note that the existing sample.env file is pointing to a contract instance already deployed on mumbai that you can use.

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.


## Setup your web3 Wallet
1) Install the MetaMask or Coinbase wallet extension (or another web3 wallet extension of your choice).
2) Add mumbai MATIC to your wallet by sending funds from another wallet or using the [Mumbai faucet](https://mumbaifaucet.com/).
3) Add mumbai USDC using the [Circle faucet](https://faucet.circle.com/).  Make sure that you choose "Polygon POS Mumbai".

## Using the Player dApp
This dApp allows a playing using a gaming system to deposit USDC to the gaming system's smart contract (the Player Accounting contract), so that the player can later spend a portion of those funds to play a game.

1) Click Connect Wallet in the top right corner of the screen.  This process should automatically switch you to the Mumbai network.
2) You should now see your USDC balance
3) Enter an amount of USDC to deposit to the Player Accounting contract
4) Click the Approve USDC button, confirm in your wallet, and wait for the transaction to process.  A link to polygonscan is provided.
5) Click the Deposit USDC button and confirm in your wallet.
6) Your wallet's USDC balance will decrease and the "Funds already on deposit" will increase.

At this point you can go back to the contract folder and follow the steps for "Retrieving the amount of USDC that a Player has deposited to the smart contract", which confirms that the smart contract is properly tracking the amount of USDC that your player wallet has deposited.
