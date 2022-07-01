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
* [How to Play]()



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
   
   Circuits are written in a lang called circom. This language helps prove expressions that are either:
   - Constant values - Only a constant value is allowed. Ex: 4
   - linear expressions - Expression where only addition is used Ex: 4+7+7
   - Quadratic expressions - Expression where two linear expression are multiplied and one is added. Ex: a*b +c 
   
   
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

## How to Play!

### Your Goal in the Game?
Guess another player's location and attack , if successful your health increases, else vice versa. ERC20 token can be added for this.

* Register as a player : 
After connecting the  wallet, you land on the register page, you enter the coordinates of the location you want to land. You can choose between 0 to 10.
 - Register Circuit

```
    signal  input a; User enter x coordinate
    signal  input b; User enters Y coordinate
    signal input salt; 
    // User enters the zone he is entering, We will verify this below
    signal input zone; User enters zone 
    signal output c; This is the location hash that will be updated in contract
```

 Here above , the zone input is public , because we want it to be public. All other inputs are private.
The  player enters the coordinate in front end , they are saved in local storage.

* Move : 
Player can move across the board by clicking on the buttons. Your location is private . Only the location hash is public in the contract.
Your actual location is in your localstorage.

 - Move circuit

```
    signal input x1;  // User enter the previous location x coordinate
    signal input y1;  // User enter the previous location y coordinate

    signal input x2;  // User enter the new location x coordinate where he moves
    signal input y2;  // User enter the new location y coordinate where he moves

    signal input salt; // Salt must be the same that was used to register
    signal input zone; // Zone will be public(Same as register)

    signal output a;  // Old  location hash(This will be verified in contract )
    signal output b;  // New location hash

```

### If location is hashed, how will I guess another person's location?
Well, the Board Game is divided in 10 zones, when every player moves, a public variable named zone is updated based on the location of the player. This is achieved by zk proofs.

* Attack 
If you  think you correctly guessed another player's location , Guess his location and click on attack.

* Defend 
If you're attacked you cannot move until you prove that your location in response to the attack.

## Importance of Salt  and some assumptions

To prevent Brute force attacks(i.e by guessing location using hit and trial), the player along with the coordinates submit a salt(it's a random number ) to the circuit to prevent attacks.

* Assumption

Almost every zk application has an assumption that the user knows his salt . The salt is saved in his local storage. 
If the player deleted his salt, he can not play the game. He will have to re register
