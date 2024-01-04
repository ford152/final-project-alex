# Player Accounting Contract

This project deploys the PlayerAccounting smart contract.  This contract accepts USDC deposits from player accounts and tracks the balance for each account.


To test:
```
npx hardhat test
REPORT_GAS=true npx hardhat test
```

To deploy the contract to the mumbai network:  
1) Rename sample.env to .env file
2) Set PRIVATE_KEY_MUMBAI to a private key of an existing Polygon Mumbai wallet that has some MATIC in it
3) Set ALCHEMY_RPC_URL_MUMBAI to the URL that you copy from your Alchemy account

4) Run:
```
npm run deploy-mumbai
```

