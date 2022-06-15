const ethers = require("hardhat");

const deploy = async () => {

    const registerverifier = await hre.ethers.getContractFactory("RegisterVerifier");
    const verifier = await registerverifier.deploy();
    await verifier.deployed();

    console.log("Sudoko Verifier deployed to", verifier.address);

    const game = await hre.ethers.getContractFactory("Footsteps");
    const gameInstance = await game.deploy(verifier.address);
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