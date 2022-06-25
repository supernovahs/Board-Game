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
// import { styles } from "../styles/globals.css";
import { styles } from "../styles/Home.module.css";

export default function Game() {
    const { data: account } = useAccount()
    const { connect } = useConnect({
        connector: new InjectedConnector(),
    })

    let prov = new ethers.providers.JsonRpcProvider("https://kovan.infura.io/v3/d21c9a0af06049d980fc5df2d149e4bb");
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

    // Ethers contract isntance to listen events
    const contractevents = new ethers.Contract(contractAddress.Game, gameabi.abi, prov);

    const [xcoordinate, setXcoordinate] = useState(0);
    const [ycoordinate, setYcoordinate] = useState(0);
    const [board, setboard] = useState();
    const [attackaddress, setattackaddress] = useState();
    const [attackx, setattackx] = useState();
    const [attacky, setattacky] = useState();
    const [moved, setmoved] = useState(false);
    const [health, sethealth] = useState();
    const [zone, setzone] = useState();

    const address = useAccount()?.data?.address;

    console.log('addrress', address);

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
                                transform: "rotate(30deg) scale(1,3)",
                                width: 100,
                                height: 100,
                                marginLeft: -10,
                                marginTop: 0,
                            }}
                        />
                    )
                }
                boardupdate.push(
                    <div style={{ width: length, height: breadth, padding: 1, position: "absolute", left: length * x, top: breadth * (10 - y) }}>
                        <div style={{ position: "relative", height: "100%", background: (x + y) % 2 ? "#BBBBBB" : "#EEEEEE" }}>
                            {player ? player : <span style={{ opacity: 0.4 }}>{"" + x + "," + y}</span>}
                        </div>
                    </div>
                )
            }
        }
        setboard(boardupdate);
        // console.log("board", board);
    }, [moved])

    const contractlistener = new ethers.Contract(contractAddress.Game, gameabi.abi, prov);
    const eventlistener = (direction) => {

        contractlistener.on("move", (address, moves) => {
            if (moves == true) {
                const data = window.localStorage.getItem("playerdata");
                const parsedata = JSON.parse(data);

                if (direction == 0) {
                    let playerdata = {
                        x: Number(parsedata.x) - 1,
                        y: parsedata.y,
                        salt: parsedata.salt

                    }
                    window.localStorage.setItem("playerdata", JSON.stringify(playerdata));
                    console.log("playerdata", playerdata);
                    setmoved(!moved);
                }
                else if (direction == 1) {
                    let playerdata = {
                        x: Number(parsedata.x) + 1,
                        y: parsedata.y,
                        salt: parsedata.salt
                    }
                    window.localStorage.setItem("playerdata", JSON.stringify(playerdata));
                    console.log("playerdata", playerdata);
                    setmoved(!moved);

                }
                else if (direction == 2) {
                    let playerdata = {
                        x: parsedata.x,
                        y: Number(parsedata.y) + 1,
                        salt: parsedata.salt
                    }
                    window.localStorage.setItem("playerdata", JSON.stringify(playerdata));
                    console.log("playerdata", playerdata);
                    setmoved(!moved);

                }
                else if (direction == 3) {
                    let playerdata = {
                        x: parsedata.x,
                        y: Number(parsedata.y) - 1,
                        salt: parsedata.salt
                    }
                    window.localStorage.setItem("playerdata", JSON.stringify(playerdata));
                    console.log("playerdata", playerdata);
                    setmoved(!moved);

                }
                contractlistener.removeAllListeners('move');


            }
        })




    }

    const register = async () => {
        const contracteventsregister = new ethers.Contract(contractAddress.Game, gameabi.abi, prov);

        contracteventsregister.on("register", (address, registered) => {
            if (registered == true) {
                let playerdata = {
                    x: xcoordinate,
                    y: ycoordinate,
                    salt: random
                }

                window.localStorage.setItem("playerdata", JSON.stringify(playerdata));
                // console.log("playerdata", playerdata);
                setmoved(!moved);
                let updated = 0;
                // console.log("updated location in local storage!!!")
                let newstore = window.localStorage.getItem("playerdata");
                let newstoredata = JSON.parse(newstore);

                while (updated == 0) {
                    window.localStorage.setItem("playerdata", JSON.stringify(playerdata));
                    if (newstoredata.x == xcoordinate && newstoredata.y == ycoordinate && newstoredata.salt == random) {
                        // console.log("registered successfully")
                        updated = 1;
                    }
                }


            }
        })
        const random = ethers.BigNumber.from(ethers.utils.randomBytes(32)).toString();
        const res = await RegisterProof(xcoordinate, ycoordinate, Number(xcoordinate) + 1, random);
        console.log("res", res);
        let result = await gamecontractwrite.Register(10, res[0], res[1], res[2], res[3], { gasLimit: 500000 });
        // console.log("result", result);
    }

    const moveleft = async () => {

        const pdata = window.localStorage.getItem("playerdata");
        console.log("pdata", pdata);
        let data = JSON.parse(pdata);
        let ran = data.salt;
        let currentx = data.x;
        let currenty = data.y;

        eventlistener(0);

        let r = await gamecontractwrite.players(address);
        let a = await r.location;
        // console.log("a", a);
        let res = await MoveProof(currentx, currenty, Number(currentx) - 1, currenty, ran, currentx);
        console.log("left move", res);
        let location = await gamecontractwrite.players(address);
        // console.log("location", location);
        let result = await gamecontractwrite.Move(res[0], res[1], res[2], res[3], { gasLimit: 500000 });

    }

    const moveright = async () => {

        const pdata = window.localStorage.getItem("playerdata");
        // console.log("pdata", pdata);
        let data = JSON.parse(pdata);
        let ran = data.salt;
        let currentx = data.x;
        let currenty = data.y;

        eventlistener(1);


        let res = await MoveProof(currentx, currenty, Number(currentx) + 1, currenty, ran, Number(currentx) + 2);
        console.log("right move", res);
        let result = await gamecontractwrite.Move(res[0], res[1], res[2], res[3], { gasLimit: 500000 });

    }

    const moveup = async () => {

        const pdata = window.localStorage.getItem("playerdata");
        // console.log("pdata", pdata);
        let data = JSON.parse(pdata);
        let ran = data.salt;
        let currentx = data.x;
        let currenty = data.y;

        eventlistener(2);

        let res = await MoveProof(currentx, currenty, currentx, Number(currenty) + 1, ran, Number(currentx) + 1);
        console.log("Up move", res);
        let result = await gamecontractwrite.Move(res[0], res[1], res[2], res[3], { gasLimit: 500000 });

    }

    const movebottom = async () => {

        const pdata = window.localStorage.getItem("playerdata");
        // console.log("pdata", pdata);
        let data = JSON.parse(pdata);
        let ran = data.salt;
        let currentx = data.x;
        let currenty = data.y;

        eventlistener(3);

        let res = await MoveProof(currentx, currenty, currentx, Number(currenty) - 1, ran, Number(currentx) + 1);
        console.log("Bottom move", res);
        let result = await gamecontractwrite.Move(res[0], res[1], res[2], res[3], { gasLimit: 2000000 });
        // console.log("result", result);
    }

    const attack = async () => {

        let att = await gamecontractwrite.AttackPlayer(attackaddress, attackx, attacky, { gasLimit: 2000000 });
    }

    const defend = async () => {
        let xcoordinateguess = await gamecontractwrite.attacks(address);
        let ycoordinateguess = await gamecontractwrite.attacks(address);
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
        let a = await gamecontractwrite.attacks(address);
        console.log("a", a);
    }
    useEffect(() => {

        const getstats = async () => {
            if (address) {
                let data = await gamecontractread.players(address);
                let health = data.health;
                let playerzone = data.zone;
                console.log("health", health);
                setzone(playerzone);
                sethealth(health);
            }
        }
        getstats();
    }, [moved, address])

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

            <div style={{ border: "2px solid black" }}>
                <h1>
                    Your Stats
                    <div>

                        {health && (<h2>Health: {Number(health)}</h2>)}
                        {zone && (<h2>Zone: {Number(zone)}</h2>)}
                    </div>
                </h1>
            </div>




            <div style={{ transform: "scale(0.8,0.3)" }}>
                <div style={{ transform: "rotate(-30deg)", color: "#111111", fontWeight: "bold", width: width * 64, height: height * 64, margin: "auto", position: "relative" }}>

                    <div style={{ opacity: 0.7, position: "absolute", left: length / 2 - 10, top: 0 }}>{board}</div>
                </div>

            </div>

        </div>

    )

}




