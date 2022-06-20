import { useState, useEffect } from "react";
const ethers = require("ethers");
import { useContract, useProvider, useSigner, useContractEvent, useNetwork, useDisconnect } from "wagmi";
import { switchNetwork } from "../utils/switchnetworks";
import networks from "../utils/networks.json";
import contractAddress from "../utils/hardhat_contracts.json";
import gameabi from "../utils/Footsteps.json";
import { RegisterProof } from "../proofs/register";
import { useAccount, useConnect, useEnsName } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected';
import { MoveProof } from "../proofs/move";
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
    const [board, setboard] = useState();

    const width = 10;
    const height = 10;

    const length = 90;
    const breadth = 90;
    useEffect(() => {
        console.log("rendering board")
        let boardupdate = []
        for (let y = 0; y < height; y++) {
            for (let x = width - 1; x >= 0; x--) {

                boardupdate.push(
                    <div style={{ width: length, height: breadth, padding: 1, position: "absolute", left: length * x, top: breadth * y }}>
                        <div style={{ position: "relative", height: "100%", background: (x + y) % 2 ? "#BBBBBB" : "#EEEEEE" }}>

                        </div>
                    </div>
                )
            }
        }
        setboard(boardupdate);
        // console.log("board", board);
    }, [100])

    const register = async () => {
        const random = ethers.BigNumber.from(ethers.utils.randomBytes(32)).toString();
        // console.log("zone", xcoordinate + 1);
        const res = await RegisterProof(xcoordinate, ycoordinate, Number(xcoordinate) + 1, random);

        const playerdata = {
            x: xcoordinate,
            y: ycoordinate,
            salt: random
        }

        window.localStorage.setItem("playerdata", JSON.stringify(playerdata));
        console.log("player data", window.localStorage.getItem("playerdata"));

        // let a = Array.from(Array(2), () => new Array(2));
        // a[0][0] = res[1][0][0];
        // a[0][1] = res[1][0][1];
        // a[1][0] = res[1][1][0];
        // a[1][1] = res[1][1][1];
        let result = await gamecontractwrite.Register(10, res[0], res[1], res[2], res[3], { gasLimit: 2000000 });
    }

    const moveleft = async () => {

        const pdata = window.localStorage.getItem("playerdata");
        console.log("pdata", pdata);
        let data = JSON.parse(pdata);
        let ran = data.salt;
        let currentx = data.x;
        let currenty = data.y;
        console.log("ran", ran, "currentx", currentx, "currenty", currenty);

        let res = await MoveProof(Number(currentx), Number(currenty), Number(currentx) - 1, Number(currenty), Number(ran), Number(currentx));
        console.log("left move", res);
        console.log("signer", signer.data._address);
        let location = await gamecontractwrite.players(signer.data._address);
        console.log("locaiton", location);
        // let result = await gamecontractwrite.Move(res[0], res[1], res[2], res[3], { gasLimit: 2000000 });
        // console.log("result", result);
    }

    const moveright = async () => {

        const pdata = window.localStorage.getItem("playerdata");
        console.log("pdata", pdata);
        let data = JSON.parse(pdata);
        let ran = data.salt;
        let currentx = data.x;
        let currenty = data.y;

        let res = await MoveProof(Number(currentx), Number(currenty), Number(currentx) + 1, Number(currenty), Number(ran), Number(currentx) + 2);
        console.log("right move", res);
    }

    const moveup = async () => {

        const pdata = window.localStorage.getItem("playerdata");
        console.log("pdata", pdata);
        let data = JSON.parse(pdata);
        let ran = data.salt;
        let currentx = data.x;
        let currenty = data.y;

        let res = await MoveProof(Number(currentx), Number(currenty), Number(currentx), Number(currenty) + 1, Number(ran), Number(currentx) + 1);
        console.log("Up move", res);
    }

    const movebottom = async () => {

        const pdata = window.localStorage.getItem("playerdata");
        console.log("pdata", pdata);
        let data = JSON.parse(pdata);
        let ran = data.salt;
        let currentx = data.x;
        let currenty = data.y;

        let res = await MoveProof(Number(currentx), Number(currenty), Number(currentx), Number(currenty) - 1, Number(ran), Number(currentx) + 1);
        console.log("Up move", res);
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

            <button

                onClick={() => {
                    moveleft();

                }}
            >Move Left</button>

            <button

                onClick={() => {
                    moveright();

                }}
            >Move Right</button>

            <button

                onClick={() => {
                    moveup();

                }}
            >Move Up</button>

            <button

                onClick={() => {
                    movebottom();

                }}
            >Move Down</button>




            <div style={{ transform: "scale(0.8,0.3)" }}>
                <div style={{ transform: "rotate(-45deg)", color: "#111111", fontWeight: "bold", width: width * 64, height: height * 64, margin: "auto", position: "relative" }}>

                    <div style={{ opacity: 0.7, position: "absolute", left: length / 2 - 10, top: 0 }}>{board}</div>
                </div>

            </div>

        </div>

    )

}




