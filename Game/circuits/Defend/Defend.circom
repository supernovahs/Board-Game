pragma circom 2.0.3;

include "../node_modules/circomlib/circuits/mimcsponge.circom";

template Defend () {

    signal input xguess;
    signal input yguess;
    signal input salt;
    signal output location;
    component mimc = MiMCSponge(2,220,1);
    mimc.ins[0] <== xguess;
    mimc.ins[1] <== yguess;
    mimc.k <== salt;
    location <== mimc.outs[0];
}

component main { public  [ xguess,yguess ] } = Defend();

