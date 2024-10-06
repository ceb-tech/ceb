import hre, { ethers } from "hardhat";

async function main() {
  console.log("=== starting CEB module deploy ===")
  console.log("network:", hre.network.name)
  console.log("chainId", hre.network.config.chainId)

  // only deploy on mainnet
  if (hre.network.config.chainId === 97) {
    const ceb = await ethers.deployContract("CEB");
    await ceb.waitForDeployment();
    const privateSale = await ethers.deployContract("PrivateSale", [
      ceb.target,
      "0x337610d27c682E347C9cD60BD4b3b107C9d34dDd",
      "0xC62435a5f3771a6452183A59273C3F09d4b416f6",
      1,
      60 * 60,
    ]);
    console.log("CEB deployed to:", ceb.target);
    console.log("PrivateSale deployed to:", privateSale.target);
  } else if (hre.network.config.chainId === 56) {
    // const ceb = await ethers.deployContract("CEB");
    // await ceb.waitForDeployment();
    // console.log("CEB deployed to:", ceb.target);
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
