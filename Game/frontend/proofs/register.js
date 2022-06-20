import { groth16calldata } from "./proof";

export async function RegisterProof(xcoordinate, ycoordinate, zone, salt) {

    const input = {
        a: xcoordinate,
        b: ycoordinate,
        salt: salt,
        zone: zone
    }
    console.log("input zone", zone);

    let res = await groth16calldata(input, "/Register.wasm", "/Register_0001.zkey");
    console.log("res", res);
    return res;


}