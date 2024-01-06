# Player Accounting Contract

This project deploys the PlayerAccounting smart contract.  This contract accepts USDC deposits from player accounts and tracks the balance for each account.

## Tests
These tests prove out the functionality of the Player Accounting smart contract usage.  A USDC token contract is deployed and the player account is sent a few of those tokens.  The player then approves the Player Accounting contract to transfer USDC tokens, and then the player account deposits USDC tokens to the Player Accounting contract.  The owner of Player Accounting then sets the player's account status to active.

To runs the tests:
```
npx hardhat test
```

## Deploying to Polygon Mumbai testnet
To deploy the contract to the mumbai network:  
1) Rename sample.env to .env file
2) Set PRIVATE_KEY_MUMBAI to a private key of an existing Polygon Mumbai wallet that has some MATIC in it
3) Set ALCHEMY_RPC_URL_MUMBAI to the URL that you copy from your Alchemy account

4) Run:
```
npm run deploy-mumbai
```
5) Make note of the deployed contract's address

## Retrieving the amount of USDC that a Player has deposited to the smart contract
Note: this step requires running client-dapp and depositing funds from a player wallet
1) Set PLAYER_ACCOUNT_MUMBAI to the wallet address of the player account (to retrieve the balance of USDC deposited for that player)
2) Set PLAYER_ACCOUNTING_DEPLOYED_ADDRESS_MUMBAI to the Player Accouting smart contract address that was deployed in the prior step

3) Run:
```
npm run player-balance-mumbai
```
This will retrieve the amount of USDC that the player deposited from the dApp
