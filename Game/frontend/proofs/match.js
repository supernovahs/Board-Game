import { groth16calldata } from "./proof";

export async function gameproof(xcoordinate, ycoordinate, zone, salt) {

    const input = {
        a: xcoordinate,
        b: ycoordinate,
        salt: salt,
        zone: zone
    }

    let res = await groth16calldata(input, "/Register.wasm", "/Register_final.zkey");
    console.log("res", res);
    return res;


}