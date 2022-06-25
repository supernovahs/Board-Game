//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

// @notice: Interface of Verifying contract
interface Registerverifier{
    function verifyProof(
            uint[2] memory a,
            uint[2][2] memory b,
            uint[2] memory c,
            uint[2] memory input
        ) external view returns (bool);
}

interface Moveverifier{
  function verifyProof(
            uint[2] memory ,
            uint[2][2] memory ,
            uint[2] memory ,
            uint[3] memory 
        ) external view returns (bool );
}

interface DefenseVerifier{
  function verifyProof(
            uint[2] memory a,
            uint[2][2] memory b,
            uint[2] memory c,
            uint[3] memory input
        ) external view returns (bool);
}

abstract contract LoogiesContract {
  function tokenURI(uint256 id) external virtual view returns (string memory);
  function ownerOf(uint256 id) external virtual view returns (address);
}

contract Footsteps {


  mapping(address=> Player) public players;
  event register(address indexed player,bool registered);
  event move(address indexed player, bool moved);

  LoogiesContract public loogiescontract;
  address public registerverifier;
  address public moveverifier;
  address public verifierdefend;

  struct Block{
      uint position;  
  }

  struct Attack{
    uint xguess;
    uint yguess;
    bool active;
    address attacker;
  }

  mapping(address =>Attack) public attacks;

  uint public constant height = 10;
  uint public constant width = 10;

  error AlreadyRegistered(address player);
  error InvalidProof();

  Block[width][height] public Area;

  struct Player{
    address player;
    uint health;
    uint location;
    uint zone;
  }

  mapping(address =>uint) public loogies;

  address[] public activeplayers;

  constructor (address _registerverifier,address _moveverifier,address _defendverifier) public payable{
    // loogiescontract = LoogiesContract(_loogiescontract);
    registerverifier = _registerverifier;
    moveverifier = _moveverifier;
    verifierdefend = _defendverifier;
  }

  
/* @notice: Register a player

**/

  function Register(uint LoogieId,uint[2] memory a,uint[2][2] memory b,uint[2] memory c,uint[2] memory input) external {
    require(Registerverifier(registerverifier).verifyProof(a,b,c,input) == true,"Invalid input");
     if( players[msg.sender].player == msg.sender) revert AlreadyRegistered(msg.sender);
    Player memory  player = Player({
      player: msg.sender,
      health: 100,
      location: input[0],
      zone: input[1]
    });

    players[msg.sender] = player;
    loogies[msg.sender] = LoogieId;
    activeplayers.push(msg.sender);
    emit register(msg.sender,true);
  } 

  function Move(uint[2] memory a,
            uint[2][2] memory b,
            uint[2] memory c,
            uint[3] memory input) external {
    require(Moveverifier(moveverifier).verifyProof(a,b,c,input) == true,"Invalid input");
    require(attacks[msg.sender].active == false,"Defend!!");
    Player storage player = players[msg.sender];
    require(player.health >=8 ,"Player is dead");
    require(player.location == input[0],"Invalid location");
    player.location = input[1];
    player.zone = input[2];
    player.health = player.health - 12;
    emit move(msg.sender,true);
  }

  function AttackPlayer(address player,uint x ,uint y) external {
  attacks[player] = Attack({
    xguess: x,
    yguess: y,
    active: true,
    attacker: msg.sender
  });
  players[msg.sender].health -=8;
  
  }

  function Defend(uint[2] memory a,
            uint[2][2] memory b,
            uint[2] memory c,
            uint[3] memory input) external {
    require(DefenseVerifier(verifierdefend).verifyProof(a,b,c,input) == true, "Invalid");

    require(attacks[msg.sender].active == true,"No attack");
    require(input[0] == players[msg.sender].location,"Wrong Guess");
    require(input[1] == attacks[msg.sender].xguess,"Don't cheat");
    require(input[2] == attacks[msg.sender].yguess,"Don't cheat");

    if(players[msg.sender].health > players[attacks[msg.sender].attacker].health){
      players[msg.sender].health += ((players[attacks[msg.sender].attacker].health)/2);
      players[attacks[msg.sender].attacker].health = (players[attacks[msg.sender].attacker].health)/2;
      attacks[msg.sender].active = false;

    }
    else if(players[msg.sender].health == players[attacks[msg.sender].attacker].health) {

      attacks[msg.sender].active = false;

    }

    else{

      players[attacks[msg.sender].attacker].health += (players[msg.sender].health/2);
      players[msg.sender].health -= (players[msg.sender].health /2);
      attacks[msg.sender].active = false;

    }

  }

  // function ExitandRenterGame() external {
  //   require(players[msg.sender].player != 0x0000,"Not Player");
  //   players[msg.sender] = Player({
  //     player: 0x0000,
  //     health: 0,
  //     location: 0,
  //     zone: 0
  //   })
  // }

  





  
}

