require("@nomiclabs/hardhat-waffle");
require("dotenv").config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  settings: {
    optimizer: {
      enabled: true,
      runs: 200,
    },
  },
  networks: {
    kovanOptimism: {
      url: "https://kovan.optimism.io",
      accounts: [process.env.PRIVATE_KEY],
    },
    ropsten: {
      url: "https://ropsten.infura.io/v3/d21c9a0af06049d980fc5df2d149e4bb",
      accounts: [process.env.PRIVATE_KEY],
    },
    kovan: {
      url: "https://kovan.infura.io/v3/460f40a260564ac4a4f4b3fffb032dad",
      accounts: [process.env.PRIVATE_KEY],
    },
    devnet: {
      url: "https://api.s0.ps.hmny.io",
      accounts: [process.env.PRIVATE_KEY],
    },
    goerli: {
      url: process.env.GOERLI,
      accounts: [process.env.PRIVATE_KEY]
    },
  },
};
