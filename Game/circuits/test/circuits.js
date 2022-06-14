const { assert, expect } = require("chai");
const wasm_tester = require("circom_tester").wasm;
console.log("Starting");
describe("Board Game", async function () {
    let Registercircuit;

    it("should Pass", async function () {
        Registercircuit = await wasm_tester("/Game/circuits/Register/Register.circom");
        console.log("Register circuit", Registercircuit);
        await Registercircuit.loadConstraints();


        let input = {
            a: 0,
            b: 5,
            salt: 293,
            zone: 1
        }
        try {
            await Registercircuit.calculateWitness(input);

        }
        catch (err) {
            assert(err.message.includes("Assert Failed"));
        }


    })
})


