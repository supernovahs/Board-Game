//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "hardhat/console.sol";

// @notice: Interface of Verifying contract
interface Iverifier{
    function verifyProof(
            uint[2] memory a,
            uint[2][2] memory b,
            uint[2] memory c,
            uint[1] memory input
        ) external view returns (bool);
}

abstract contract LoogiesContract {
  function tokenURI(uint256 id) external virtual view returns (string memory);
  function ownerOf(uint256 id) external virtual view returns (address);
}

contract Footsteps {

  LoogiesContract public loogiescontract;
  address public verifier;
  struct Block{
      uint position;  
  }

  uint public constant height = 10;
  uint public constant width = 10;

  error AlreadyRegistered(address player);
  error InvalidProof();

  Block[width][height] public Area;

  struct Player{
    address player;
    uint health;    
  }

  Player[] public players;
  mapping(address =>uint) public loogies;

  constructor (address _verifier) public payable{
    // loogiescontract = LoogiesContract(_loogiescontract);
    _verifier = verifier;
  }

  
/* @notice: Register a player


**/

  function Register(uint LoogieId,uint[2] memory a,uint[2][2] memory b,uint[2] memory c,uint[1] memory input) external {
    if(Iverifier(verifier).verifyProof(a,b,c,input) != true) revert InvalidProof();
    if(loogies[msg.sender] !=0 ) revert AlreadyRegistered(msg.sender);

    Player memory  player = Player({
      player: msg.sender,
      health: 100
    });

    players.push(player);
    loogies[msg.sender] = LoogieId;
  }
}
