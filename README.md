# Board-Game
******

![githubfootsteps](https://user-images.githubusercontent.com/91280922/175805656-169668d9-9338-4c0f-9b4f-ff8a30b8d19d.png)


This is a board game where every player's location is hidden . Everytime they  move, they give a hint about there location. Guess the correct location and get rewarded or DIE!!!.

This game is powered by zero knowledge proofs.


## Contents
* [Stack Used](https://github.com/supernovahs/Board-Game/tree/readme#stack)
* [Structure](https://github.com/supernovahs/Board-Game/tree/readme#structure)
  * circuits
  * frontend
  * contracts
* [Running Locally]()
* 



## Stack 

 * Frontend :
   - Nextjs
   - Tailwindcss
   - chakraUi
   - snarkjs
   - Canva
   - wasm

 * Circuits:
   - circom by [iden3](https://github.com/iden3/circom)
   
 * Contracts:
   - Solidity 
   - Foundry Tests(To be completed) 

## Structure 

* circuits :
This folder consists of the 3 circom files that are used in the game :
  - [Register.circom](https://github.com/supernovahs/Board-Game/blob/master/Game/circuits/Register/Register.circom)
  - [Move.circom](https://github.com/supernovahs/Board-Game/blob/master/Game/circuits/Move/Move.circom)
  - [Defend.circom](https://github.com/supernovahs/Board-Game/blob/master/Game/circuits/Defend/Defend.circom)

* contracts : 
This folder contains the core game contract and the verifier contracts generated using circom.
  - [Game.sol](https://github.com/supernovahs/Board-Game/blob/master/Game/contracts/contracts/Game.sol)
  - [Registerverifier.sol](https://github.com/supernovahs/Board-Game/blob/master/Game/contracts/contracts/Registerverifier.sol)
  - [Moveverifier.sol](https://github.com/supernovahs/Board-Game/blob/master/Game/contracts/contracts/moveverifier.sol)
  - [Defendverifier.sol](https://github.com/supernovahs/Board-Game/blob/master/Game/contracts/contracts/verifier.sol)

* frontend :
  Frontend is created using next js with wagmi hooks to connect to wallet .
  
  Zk proofs are generated in front end using the following [files](https://github.com/supernovahs/Board-Game/tree/master/Game/frontend/public):
  - Defend.wasm
  - Defend_0001.zkey
  - Move.wasm
  - Move_0001.zkey
  - Register.wasm
  - Register_0001.zkey
  - [Proofs.js](https://github.com/supernovahs/Board-Game/blob/master/Game/frontend/proofs/proof.js)
  
  
## Configuring Locally
If you to experience the process yourself, here's how you can use this repository locally in your computer. 

### Deploying contracts 

```
cd Game
cd contracts

npx hardhat run scripts/deploy.js --network networkName
```

### Circuits

```
cd Game 
cd circuits
```

### NextJs Frontend
Deploy on localhost :3000

```
cd Game
cd frontend
yarn dev
```




