import { RegisterProof } from "../proofs/register"
import { useState } from "react";
import { useSigner, useContract, useProvider } from "wagmi";
const ethers = require("ethers");

export default function Register() {

    const [xcoordinate, setXcoordinate] = useState(0);
    const [ycoordinate, setYcoordinate] = useState(0);


    const register = async () => {
        const random = ethers.BigNumber.from(ethers.utils.randomBytes(32)).toString();
        const res = await RegisterProof(xcoordinate, ycoordinate, 1, random);
    }

    return (
        <div>
            <input
                placeholder="x coordinate"
                onChange={(e) => {
                    setXcoordinate(e.target.value);
                    console.log("x", xcoordinate);
                }}
            />
            <input
                placeholder="y coordinate"
                onChange={(e) => {
                    setYcoordinate(e.target.value);
                    console.log("y", ycoordinate);
                }}
            />

            <button
                onClick={() => {
                    register();
                }}
            >
                Register
            </button>


        </div>
    )

}