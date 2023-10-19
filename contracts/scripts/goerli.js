// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  // const MockUSDC = await hre.ethers.deployContract("MockUSDC");

  // await MockUSDC.waitForDeployment();

  // console.log("MockUSDC deployed to:", await MockUSDC.getAddress());

  const TutorTimeToken = await hre.ethers.deployContract("TutorTimeToken", [
    "0x328507DC29C95c170B56a1b3A758eB7a9E73455c", // APE TOKEN GOERLI
  ]);

  await TutorTimeToken.waitForDeployment();

  console.log("TutorTimeToken deployed to:", await TutorTimeToken.getAddress());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
