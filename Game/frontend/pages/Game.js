import { gameproof } from "../proofs/match"
import { useState, useEffect } from "react";
import Layout from "../components/Layout";
const ethers = require("ethers");

export default function Game() {
    const [xcoordinate, setXcoordinate] = useState(0);
    const [ycoordinate, setYcoordinate] = useState(0);

    const Register = async () => {
        const random = ethers.BigNumber.from(ethers.utils.randomBytes(32)).toString();
        const res = await gameproof(xcoordinate, ycoordinate, 1, random);
        console.log("res", res);
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
                    Register();
                }}
            >
                Register
            </button>
            <div>


            </div>

        </div>
    )

}