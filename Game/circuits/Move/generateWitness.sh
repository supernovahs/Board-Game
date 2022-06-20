#!/bin/bash
cd Move

# Variable to store the name of the circuit
CIRCUIT=Move

# Compile the circuit
circom ${CIRCUIT}.circom --r1cs --wasm --sym --c

cp input.json Move_js/input.json

# Generate the witness.wtns
node ${CIRCUIT}_js/generate_witness.js ${CIRCUIT}_js/${CIRCUIT}.wasm input.json ${CIRCUIT}_js/witness.wtns
