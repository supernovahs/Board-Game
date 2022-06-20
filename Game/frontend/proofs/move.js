import { groth16calldata } from "./proof";

export async function MoveProof(x1, y1, x2, y2, salt, zone) {

    const input = {
        x1: x1,
        y1: y1,
        x2: x2,
        y2: y2,
        salt: salt,
        zone: zone
    }

    let res = await groth16calldata(input, "/Move.wasm", "/Move_0001.zkey");
    console.log("res", res);
    return res;


}