#!/bin/bash
cd Defend

# Variable to store the name of the circuit
CIRCUIT=Defend

# Compile the circuit
circom ${CIRCUIT}.circom --r1cs --wasm --sym --c

cp input.json Defend_js/input.json

# Generate the witness.wtns
node ${CIRCUIT}_js/generate_witness.js ${CIRCUIT}_js/${CIRCUIT}.wasm input.json ${CIRCUIT}_js/witness.wtns
