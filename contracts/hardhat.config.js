require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
const RPC_URL_SEPOLIA = process.env.RPC_URL_SEPOLIA;
const RPC_URL_GOERLI = process.env.RPC_URL_GOERLI;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks: {
    sepolia: {
      url: RPC_URL_SEPOLIA,
      accounts: [PRIVATE_KEY],
    },
    goerli: {
      url: RPC_URL_GOERLI,
      accounts: [PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
};
