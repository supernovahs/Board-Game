const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Greeter", function () {
  it("Should return the new greeting once it's changed", async function () {
    const registerverifier = await hre.ethers.getContractFactory("RegisterVerifier");
    const verifier = await registerverifier.deploy();
    await verifier.deployed();

    console.log(" Register Verifier deployed to", verifier.address, "at", Date.now());

    const moveverifier = await hre.ethers.getContractFactory("Move");
    const verifymove = await moveverifier.deploy();
    await verifymove.deployed();

    console.log(" Move Verifier deployed to", verifymove.address, "at", Date.now());

    const defendverifier = await hre.ethers.getContractFactory("DefendVerify");
    const verifydefend = await defendverifier.deploy();
    await verifydefend.deployed();

    console.log(" Defend Verifier deployed to", verifydefend.address, "at", Date.now());

    const game = await hre.ethers.getContractFactory("Footsteps");
    const gameInstance = await game.deploy(verifier.address, verifymove.address, verifydefend.address);
    await gameInstance.deployed();

    console.log("Game contract deployed to ", gameInstance.address, "at", Date.now());
  });
});
