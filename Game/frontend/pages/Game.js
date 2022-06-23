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
import { DefendProof } from "../proofs/Defend";
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
    const [attackaddress, setattackaddress] = useState();
    const [attackx, setattackx] = useState();
    const [attacky, setattacky] = useState();

    const width = 11;
    const height = 11;

    const length = 90;
    const breadth = 90;
    useEffect(() => {
        console.log("rendering board")
        let boardupdate = []
        for (let y = 0; y < height; y++) {
            for (let x = width - 1; x >= 0; x--) {
                let localdata = window.localStorage.getItem("playerdata");
                let parsedata = JSON.parse(localdata);
                let xloc = parsedata.x;
                let yloc = parsedata.y;
                let player = "";
                if (xloc == x && yloc == y) {

                    player = (
                        <img src="/chris-sharkot-ball.svg"
                            style={{
                                transform: "rotate(45deg) scale(1,3)",
                                width: 100,
                                height: 100,
                                marginLeft: -10,
                                marginTop: 0,
                            }}
                        />
                    )
                }
                boardupdate.push(
                    <div style={{ width: length, height: breadth, padding: 1, position: "absolute", left: length * x, top: breadth * y }}>
                        <div style={{ position: "relative", height: "100%", background: (x + y) % 2 ? "#BBBBBB" : "#EEEEEE" }}>
                            {player ? player : <span style={{ opacity: 0.4 }}>{"" + x + "," + y}</span>}
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
        console.log("random", random);
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
        let result = await gamecontractwrite.Register(10, res[0], res[1], res[2], res[3], { gasLimit: 500000 });
    }

    const moveleft = async () => {

        const pdata = window.localStorage.getItem("playerdata");
        console.log("pdata", pdata);
        let data = JSON.parse(pdata);
        let ran = data.salt;
        let currentx = data.x;
        let currenty = data.y;
        console.log("ran", ran, "currentx", currentx, "currenty", currenty);

        let res = await MoveProof(currentx, currenty, Number(currentx) - 1, currenty, ran, currentx);
        console.log("left move", res);
        console.log("signer", signer.data._address);
        let location = await gamecontractwrite.players(signer.data._address);
        console.log("locaiton", location);
        let result = await gamecontractwrite.Move(res[0], res[1], res[2], res[3], { gasLimit: 2000000 });
        console.log("result", result);


        let newlocation = {
            x: data.x - 1,
            y: data.y,
            salt: data.salt
        }

        window.localStorage.setItem("playerdata", JSON.stringify(newlocation));


    }

    const moveright = async () => {

        const pdata = window.localStorage.getItem("playerdata");
        console.log("pdata", pdata);
        let data = JSON.parse(pdata);
        let ran = data.salt;
        let currentx = data.x;
        let currenty = data.y;

        let res = await MoveProof(currentx, currenty, Number(currentx) + 1, currenty, ran, Number(currentx) + 2);
        console.log("right move", res);
        let result = await gamecontractwrite.Move(res[0], res[1], res[2], res[3], { gasLimit: 800000 });
        console.log("result", result);

        let newlocation = {
            x: data.x + 1,
            y: data.y,
            salt: data.salt
        }

        window.localStorage.setItem("playerdata", JSON.stringify(newlocation));
    }

    const moveup = async () => {

        const pdata = window.localStorage.getItem("playerdata");
        console.log("pdata", pdata);
        let data = JSON.parse(pdata);
        let ran = data.salt;
        let currentx = data.x;
        let currenty = data.y;

        let res = await MoveProof(currentx, currenty, currentx, Number(currenty) + 1, ran, Number(currentx) + 1);
        console.log("Up move", res);
        let result = await gamecontractwrite.Move(res[0], res[1], res[2], res[3], { gasLimit: 2000000 });
        console.log("result", result);

        let newlocation = {
            x: data.x,
            y: data.y + 1,
            salt: data.salt
        }

        window.localStorage.setItem("playerdata", JSON.stringify(newlocation));

    }

    const movebottom = async () => {

        const pdata = window.localStorage.getItem("playerdata");
        console.log("pdata", pdata);
        let data = JSON.parse(pdata);
        let ran = data.salt;
        let currentx = data.x;
        let currenty = data.y;

        let res = await MoveProof(currentx, currenty, currentx, Number(currenty) - 1, ran, Number(currentx) + 1);
        console.log("Bottom move", res);
        let result = await gamecontractwrite.Move(res[0], res[1], res[2], res[3], { gasLimit: 2000000 });
        console.log("result", result);

        let newlocation = {
            x: data.x,
            y: data.y - 1,
            salt: data.salt
        }

        window.localStorage.setItem("playerdata", JSON.stringify(newlocation));
    }

    const attack = async () => {

        let att = await gamecontractwrite.AttackPlayer(attackaddress, attackx, attacky, { gasLimit: 2000000 });
    }

    const defend = async () => {
        let xcoordinateguess = await gamecontractwrite.attacks(signer.data._address);
        let ycoordinateguess = await gamecontractwrite.attacks(signer.data._address);
        console.log("xguess", Number(xcoordinateguess.xguess), "yguess", Number(ycoordinateguess.yguess));
        const pdata = window.localStorage.getItem("playerdata");
        console.log("pdata", pdata);
        let data = JSON.parse(pdata);
        let ran = data.salt;
        let res = await DefendProof(Number(xcoordinateguess.xguess), Number(ycoordinateguess.yguess), ran);
        console.log(" Defend result", res);
        try {
            await gamecontractwrite.Defend(res[0], res[1], res[2], res[3], { gasLimit: 400000 })
        } catch (err) {
            console.log("error", err);
        }
        let a = await gamecontractwrite.attacks(signer.data._address);
        console.log("a", a);
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

            <input
                placeholder="Location of x coordinate of victim "
                onChange={(e) => {
                    setattackx(e.target.value);
                }}
            />

            <input
                placeholder="location of y coordinate of victim"
                onChange={(e) => {
                    setattacky(e.target.value);
                }}

            />

            <input
                placeholder="address of victim"
                onChange={(e) => {
                    setattackaddress(e.target.value);
                }}
            />

            <button
                onClick={() => {
                    attack();
                }}
            >Attack</button>

            <button
                onClick={() => {
                    defend();
                }}
            >

                Defend</button>




            <div style={{ transform: "scale(0.8,0.3)" }}>
                <div style={{ transform: "rotate(-45deg)", color: "#111111", fontWeight: "bold", width: width * 64, height: height * 64, margin: "auto", position: "relative" }}>

                    <div style={{ opacity: 0.7, position: "absolute", left: length / 2 - 10, top: 0 }}>{board}</div>
                </div>

            </div>

        </div>

    )

}




