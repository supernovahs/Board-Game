#!/bin/bash
cd Register
# Variable to store the name of the circuit
CIRCUIT=Register

# Compile the circuit
circom ${CIRCUIT}.circom --r1cs --wasm --sym --c
