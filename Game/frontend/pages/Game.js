import { useState, useEffect } from "react";
import Register from "../components/Register";
const ethers = require("ethers");
import { useContract, useProvider, useSigner, useContractEvent, useNetwork, useDisconnect } from "wagmi";
import { switchNetwork } from "../utils/switchnetworks";
import networks from "../utils/networks.json";
import contractAddress from "../utils/hardhat_contracts.json";
import gameabi from "../utils/Footsteps.json";
import { gameproof } from "../proofs/match";
import { useAccount, useConnect, useEnsName } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected';
export default function Game() {
    const { data: account } = useAccount()
    const { connect } = useConnect({
        connector: new InjectedConnector(),
    })

    const { disconnect } = useDisconnect();
    const signer = useSigner();
    const provider = useProvider();

    const gamecontractwrite = useContract({
        addressOrName: contractAddress.Game,
        contractInterface: gameabi.abi,
        signerOrProvider: signer.data
    })

    const gamecontractread = useContract({
        addressOrName: contractAddress.Game,
        contractInterface: gameabi.abi,
        signerOrProvider: provider
    })

    const [xcoordinate, setXcoordinate] = useState(0);
    const [ycoordinate, setYcoordinate] = useState(0);

    const register = async () => {
        const random = ethers.BigNumber.from(ethers.utils.randomBytes(32)).toString();
        const res = await gameproof(xcoordinate, ycoordinate, 1, random);
        console.log("res", res);
        console.log("res1", res[1]);
        console.log(res[0].length, res[1].length, res[2].length, res[3].length);
        console.log("res1", [res[1][0][0], res[1][0][1], res[1][1][0], res[1][1][1]]);

        let a = Array.from(Array(2), () => new Array(2));
        a[0][0] = res[1][0][0];
        a[0][1] = res[1][0][1];
        a[1][0] = res[1][1][0];
        a[1][1] = res[1][1][1];
        console.log("a", a);
        let result = await gamecontractwrite.Register(10, res[0], res[1], res[2], res[3], { gasLimit: 2000000 });
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