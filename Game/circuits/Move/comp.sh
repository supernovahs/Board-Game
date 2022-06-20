#!/bin/bash
cd Move
# Variable to store the name of the circuit
CIRCUIT=Move

# Compile the circuit
circom ${CIRCUIT}.circom --r1cs --wasm --sym --c
