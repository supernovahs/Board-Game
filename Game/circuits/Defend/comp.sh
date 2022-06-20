#!/bin/bash
cd Defend
# Variable to store the name of the circuit
CIRCUIT=Defend

# Compile the circuit
circom ${CIRCUIT}.circom --r1cs --wasm --sym --c
