# Carbon Emission Blockchain 

This project highlights a fundamental use case for Hardhat, centered around a smart contract integral to the CEB initiative. The project includes the CEB contract's code, a test suite to ensure its proper function, and a deployment script for seamless integration. Additionally, it features an example task implementation to list available accounts within the Hardhat ecosystem. The CEB project focuses on creating platforms and scenarios for carbon-neutral applications, emphasizing its unique application value in virtual environments.

Try running some of the following tasks:

```shell
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
npx hardhat help
```

## Contract Functions

### CEB
- The CEB contract is an ERC20-based token contract that supports token issuance, burning, transfers, authorization, and other functions.
- Basic Contract Information:
  - Token Name: `CEB`
  - Token Symbol: `CEB`
  - Token Decimals: `18`
  - Total Supply: `1,000,000,000` (non-mintable)
- Burn Mechanism:
  - Burns `5%` of the tokens on each transfer.
  - Whitelist mechanism: transfers from addresses within the whitelist do not burn tokens.
  - The admin is by default in the whitelist and can add or remove addresses from the whitelist.
  - Only the admin can add or remove addresses from the whitelist.
  - Admin rights are transferable, and upon transfer, the whitelist addresses are also transferred.

### PrivateSale
- The PrivateSale contract is a private sale contract that supports the sale of tokens at a fixed price to specific addresses.
- Basic Contract Information (determined at initialization):
  - saleTokenAddress: Private sale token address - CEB
  - payTokenAddress: Payment token address - USDT
  - receiverAddress: Receiving address
  - tokenPrice: Token price - 0.1 USDT
  - unlockDate: Unlock time in seconds from the current time. For example, if the unlock is 30 days later, input `30 * 24 * 60 * 60`.

## Contract Deployment Process

### Deploy the CEB Contract to the BSC Mainnet
- Configure the PrivateSale-related parameters:
  - Mainnet USDT address
  - Unlock time
  - Token price
  - Receiving address
  - Execute: `npx hardhat ignition deploy ignition/modules/CEB.ts --network bsc`
- After deploying the CEB contract, transfer funds to the corresponding addresses as per the address allocation table.

### Verify and Open Source the Contract
- Configure etherscan key
- Execute (example): `npx hardhat verify --network testnet 0xbF39886B4F91F5170934191b0d96Dd277147FBB2`


### Project Administrator
- Address: `0xbE81444e6d1D33C323F587d90a07AeC316d93D57`

## Local Contract Debugging

### Contract Deployment Process
- Start the local environment:
  - `npx hardhat node`
- Contract Compilation:
  - `npx hardhat compile`
- Deploy Contract Locally:
  - Use the ignition plugin for deployment:
    - `npx hardhat ignition deploy ignition/modules/CEB.ts --network localhost`
- Contract Testing:
  - `npx hardhat test`

### Script Example to Call Contract Methods
- Run Script:
  - `npx hardhat run scripts/counter.js --network localhost`

### Debugging Methods
- Enter Command Line Debugging:
  - `npx hardhat console --network localhost`
- Fork Mainnet/Testnet for Debugging:
  - `npx hardhat node --fork https://rinkeby.infura.io/v3/<key>`

### Verify Contract
- Copy the `.envrc.example` file to the root directory as `.envrc` and replace it with your own test environment configuration.
- Deploy the Contract to Testnet:
  - `npx hardhat ignition deploy ignition/modules/CEB.ts --network testnet`
- Verify Testnet Contract:
  - Method 1: Use Command Line Verification (might not work with domestic networks)
    - `npx hardhat verify address --network xxx`
  - Method 2: Use Flattened Export Verification
    - `npx hardhat flatten contracts/Counter.sol >> Counter.sol`
- If the contract being verified has multiple constructor arguments, add the parameters during verification:
  - `npx hardhat verify --network xxx 0x1234... arg1 arg2 arg3`
