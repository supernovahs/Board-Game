pragma circom 2.0.3;

include "../node_modules/circomlib/circuits/mimcsponge.circom";
include "../node_modules/circomlib/circuits/comparators.circom";

template Move () {
    
    signal input x1;
    signal input y1;

    signal input x2;
    signal input y2;

    signal input salt;
    signal input zone;

    signal output a;
    signal output b;

    component mimc1 = MiMCSponge(2,220,1);
    mimc1.ins[0] <== x1;
    mimc1.ins[1] <== y1;
    mimc1.k <== salt;   
    a <== mimc1.outs[0];

    component mimc2 = MiMCSponge(2,220,1);
    mimc2.ins[0] <== x2;
    mimc2.ins[1] <== y2;
    mimc2.k <== salt;
    b <== mimc2.outs[0];

    component upperrange[2];
    upperrange[0] = LessEqThan(5);
    upperrange[0].in[0] <== x2;
    upperrange[0].in[1] <== 10;
    upperrange[0].out === 1;

    upperrange[1] = LessEqThan(5);
    upperrange[1].in[0] <== y2;
    upperrange[1].in[1] <==10;
    upperrange[1].out === 1;

    component lowerrange[2];
    lowerrange[0] = GreaterEqThan(5);
    lowerrange[0].in[0] <== x2;
    lowerrange[0].in[1] <== 0;
    lowerrange[0].out === 1;

    lowerrange[1] = GreaterEqThan(5);
    lowerrange[1].in[0] <== y2;
    lowerrange[1].in[1] <== 0;
    lowerrange[1].out ===1;

    component zonerangelower = GreaterThan(32);
    zonerangelower.in[0] <== zone;
    zonerangelower.in[1] <== 0;
    zonerangelower.out ===1;

    component zonerangeupper = LessThan(32);
    zonerangeupper.in[0] <== zone;
    zonerangeupper.in[1] <== 12;
    zonerangeupper.out ===1;

    signal xleftside;
    signal xrightside;

    // Constraining values according to the zone the user has entered to verify it below.
    xleftside <== zone -1;
    xrightside <== zone;

    // Checking the inputs are within the zone entered. 
    component checkxright = LessThan(32);
    checkxright.in[0] <== x2;
    checkxright.in[1] <== xrightside;
    checkxright.out ===1;

    component checkxleft = GreaterEqThan(32);
    checkxleft.in[0] <== x2;
    checkxleft.in[1] <== xleftside;
    checkxleft.out ===1;

    // checking distance travelled 

    component checkright = LessThan(5);
    checkright.in[0] <== x2;
    checkright.in[1] <== x1 +2;
    checkright.out ===1;

    component checkleft = GreaterThan(5);
    checkleft.in[0] <== x2;
    checkleft.in[1] <== x1 -2;
    checkleft.out ===1 ;

    component checkup = LessThan(5);
    checkup.in[0] <== y2;
    checkup.in[1] <== y1 +2;
    checkup.out ===1 ;

    component checkdown = GreaterThan(5);
    checkdown.in[0] <== y2;
    checkdown.in[1] <== y1 -2;
    checkdown.out ===1;

}

component main {public [zone]} = Move();
