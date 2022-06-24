import { groth16calldata } from "./proof";

export async function DefendProof(x, y, salt) {

    const input = {
        xguess: x,
        yguess: y,
        salt: salt
    }

    let res = await groth16calldata(input, "/Defend.wasm", "/Defend_0001.zkey");
    return res;


}