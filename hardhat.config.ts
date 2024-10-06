import { HardhatUserConfig } from "hardhat/config"
import "@nomicfoundation/hardhat-toolbox"
import "@nomicfoundation/hardhat-ignition-ethers"

const privateKey: any = process.env.PRIVATE_KEY

const config: HardhatUserConfig = {
  solidity: "0.8.23",

  sourcify: {
    enabled: true,
  },

  networks: {
    localhost: {
      url: "http://localhost:8545",
      chainId: 31337,
    },
    testnet: {
      url: "https://bsc-testnet.blockpi.network/v1/rpc/public",
      chainId: 97,
      accounts: [privateKey],
    },
    mainnet: {
      url: "https://bsc-dataseed.bnbchain.org/",
      chainId: 56,
      accounts: [privateKey],
    }
  },
  etherscan: {
    // Your API key for Etherscan
    apiKey: process.env.ETHERSCAN_API_KEY
  },
}

export default config
