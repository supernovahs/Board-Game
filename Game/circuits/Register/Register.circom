pragma circom 2.0.3;

include "../node_modules/circomlib/circuits/mimcsponge.circom";
include "../node_modules/circomlib/circuits/comparators.circom";

// This checks that the coordinates entered are within the range of board game
template RangeProof () {
    signal  input a;
    signal  input b;
    signal input salt;
    // User enters the zone he is entering, We will verify this below
    signal input zone;
    signal output c;

    // Upper range is 10 

    component upperrange[2];
    upperrange[0] = LessEqThan(5);
    upperrange[0].in[0] <== a;
    upperrange[0].in[1] <== 10;
    upperrange[0].out === 1;

    upperrange[1] = LessEqThan(5);
    upperrange[1].in[0] <== b;
    upperrange[1].in[1] <==10;
    upperrange[1].out === 1;

// lower range is 0 

    component lowerrange[2];
    lowerrange[0] = GreaterEqThan(5);
    lowerrange[0].in[0] <== a;
    lowerrange[0].in[1] <== 0;
    lowerrange[0].out === 1;

    lowerrange[1] = GreaterEqThan(5);
    lowerrange[1].in[0] <== b;
    lowerrange[1].in[1] <== 0;
    lowerrange[1].out ===1;

    component mimc = MiMCSponge(2,220,1);
    
    mimc.ins[0] <== a;
    mimc.ins[1] <== b;
    mimc.k <== salt;
    // This output c will be verified in the contract . 
    c <== mimc.outs[0];
    
    // Checking the user inputs the zone in range of board.
    component zonerangelower = GreaterThan(32);
    zonerangelower.in[0] <== zone;
    zonerangelower.in[1] <== 0;
    zonerangelower.out ===1;

    component zonerangeupper = LessThan(32);
    zonerangeupper.in[0] <== zone;
    zonerangeupper.in[1] <== 12;
    zonerangeupper.out ===1 ;

// Intermediate signals representing both the x coordinates of a zone 
    signal xleftside;
    signal xrightside;

// Constraining values according to the zone the user has entered to verify it below.
    xleftside <== zone -1;
    xrightside <== zone;

// Checking the inputs are within the zone entered. 
    component checkxright = LessThan(32);
    checkxright.in[0] <== a;
    checkxright.in[1] <== xrightside;
    checkxright.out ===1;

    component checkxleft = GreaterEqThan(32);
    checkxleft.in[0] <== a;
    checkxleft.in[1] <== xleftside;
    checkxleft.out ===1;

}

component main { public [zone]} = RangeProof();

