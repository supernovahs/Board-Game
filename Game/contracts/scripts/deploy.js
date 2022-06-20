const ethers = require("hardhat");

const deploy = async () => {

    const registerverifier = await hre.ethers.getContractFactory("RegisterVerifier");
    const verifier = await registerverifier.deploy();
    await verifier.deployed();

    console.log(" Register Verifier deployed to", verifier.address);

    const moveverifier = await hre.ethers.getContractFactory("Move");
    const verifymove = await moveverifier.deploy();
    await verifymove.deployed();

    console.log(" Move Verifier deployed to", verifymove.address);

    const defendverifier = await hre.ethers.getContractFactory("DefendVerifier");
    const verifydefend = await defendverifier.deploy();
    await verifydefend.deployed();

    console.log(" Defend Verifier deployed to", verifydefend.address);


    const game = await hre.ethers.getContractFactory("Footsteps");
    const gameInstance = await game.deploy(verifier.address, verifymove.address, verifydefend.address);
    await gameInstance.deployed();

    console.log("Game contract deployed to ", gameInstance.address);

}

const run = async () => {
    try {
        await deploy()
    }
    catch (err) {
        console.log(err);
        process.exit(1);
    }

}

run();