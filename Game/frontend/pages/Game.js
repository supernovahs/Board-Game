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
        console.log("res0", res[0].length);
        console.log(res[1]);
        console.log("contract", gamecontractwrite);
        let result = await gamecontractwrite.Register(1, res[0], res[1], res[2], res[3], { gasLimit: 1000000 });
        // let result = await gamecontractwrite.getpayment({ value: 10000000000, gasLimit: 1000000 });
        console.log("result", result);
        // console.log("Result", result);
        // try {
        //     let result;
        //     if (account.data?.address && data.chain.id.toString() === networks.selectedChain) {
        //         result = await gamecontractwrite.Register(1, res[0], res[1], res[2], res[4]);
        //     }

        // }
        // catch (err) {
        //     console.log(err);
        // }
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