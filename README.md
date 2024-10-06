# Basic Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, a sample script that deploys that contract, and an example of a task implementation, which simply lists the available accounts.

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

### Address Allocation

| No. | Address Name         | Address                               | Percentage | Amount    |
|-----|----------------------|---------------------------------------|------------|-----------|
| 1   | Platform Members     | 0x445E69B665D5e119F40561A5CbA01AEaF679564d | 15%        | 150,000,000  |
| 2   | Private Fund Subscription | 0x2D491861930F05E32468fB3eDA32D96AA0A628B8 | 5%         | 50,000,000   |
| 3   | Public Sales          | 0x12353D644e183Eb94835BCC86e5F47e74B5Ef089 | 25%        | 250,000,000  |
| 4   | Community and User Rewards | 0xe7502DF040d55ec9F7D6d2A83B4C6908f896903C | 5%         | 50,000,000   |
| 5   | Carbon Rights Exchange | 0x4F7caDFE53B4Fa1c729c6114f5c54a4506D64248 | 20%        | 200,000,000  |
| 6   | Project Reserve       | 0xB868108eFD819C478df1f9dd58096A92e2e00a84 | 10%        | 100,000,000  |
| 7   | Technical Team        | 0xB3083bA94D7ad4d4E080B881673f1A164Ac2ff8F | 5%         | 50,000,000   |
| 8   | Mining Rewards        | 0x75fb28bAaD0a62996632608cB25FAbf75130A548 | 15%        | 150,000,000  |

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
