import { useState, useEffect } from "react";
const ethers = require("ethers");
import {
    useContract,
    useProvider,
    useSigner,
    useContractEvent,
    useNetwork,
    useDisconnect,
} from "wagmi";
import { switchNetwork } from "../utils/switchnetworks";
import networks from "../utils/networks.json";
import contractAddress from "../utils/hardhat_contracts.json";
import gameabi from "../utils/Footsteps.json";
import { RegisterProof } from "../proofs/register";
import { useAccount, useConnect, useEnsName } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { MoveProof } from "../proofs/move";
import { DefendProof } from "../proofs/Defend";
import { useDisclosure } from "@chakra-ui/react";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
} from "@chakra-ui/react";
import React from "react";
import {
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
} from "@chakra-ui/react";
import { Button, ButtonGroup } from "@chakra-ui/react";
// import { styles } from "../styles/globals.css";
import { styles } from "../styles/Home.module.css";
import Header from "../components/Header";
import Renderplayer from "../components/Renderplayer";

export default function Game() {
    const { data: account } = useAccount();
    const { connect } = useConnect({
        connector: new InjectedConnector(),
    });
    // https://kovan.infura.io/v3/d21c9a0af06049d980fc5df2d149e4bb
    // https://api.s0.ps.hmny.io
    let prov = new ethers.providers.JsonRpcProvider(
        "https://kovan.optimism.io"
    );
    const { disconnect } = useDisconnect();
    const signer = useSigner();
    const provider = useProvider();

    const gamecontractwrite = useContract({
        addressOrName: contractAddress.Game,
        contractInterface: gameabi.abi,
        signerOrProvider: signer.data,
    });

    // Game contract instance using wagmi for write access
    const gamecontractread = useContract({
        addressOrName: contractAddress.Game,
        contractInterface: gameabi.abi,
        signerOrProvider: prov,
    });

    // Constants

    const [xcoordinate, setXcoordinate] = useState(0);
    const [ycoordinate, setYcoordinate] = useState(0);
    const [board, setboard] = useState();
    const [attackaddress, setattackaddress] = useState();
    const [attackx, setattackx] = useState();
    const [attacky, setattacky] = useState();
    const [moved, setmoved] = useState(false);
    const [health, sethealth] = useState();
    const [zone, setzone] = useState();
    const [gameover, setgameover] = useState(false);
    const address = useAccount()?.data?.address;
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [attacked, setattacked] = useState(false);

    const initialRef = React.useRef(null);
    const finalRef = React.useRef(null);

    const width = 11;
    const height = 11;

    useEffect(() => {

        const registerornot = async () => {
            if (address) {

                try {

                    let a = await gamecontractread.Id(address);
                    let isplayer = await a.toNumber();
                    if (isplayer == 0) {
                        setgameover(true);
                    }
                }
                catch (err) {
                    console.log("registerornot", err);
                }
            }

        }
        registerornot();
    }, [address])

    useEffect(() => {
        console.log("rendering board");
        let localdata = window.localStorage.getItem("playerdata");
        let parsedata = JSON.parse(localdata);
        let xloc = parsedata?.x ? parsedata.x : 0;
        let yloc = parsedata?.y ? parsedata.y : 0;
        const boardupdate = (
            <div className="grid grid-cols-11 mx-5">
                {[...Array(width)].map((_, i) => (<span key={i} className={`font-bold text-center`}>{(i + 1) == 11 ? (<p>Dark Zone</p>) : (<p>Zone {i + 1}</p>)}</span>))}
                {Array.from(Array(height), (_, i) =>
                    Array.from(Array(width), (_, j) => (

                        <div
                            className={`grid-item w-24 h-20 ${(i + j) % 2 ? "bg-gray-100" : "bg-gray-400"
                                } p-2 relative`}
                        >

                            <span>

                                {j},
                                {10 - i}
                                {j == xloc && 10 - i == yloc ? (
                                    <div className="absolute bottom-0 right-0 bg-red-600 w-12 h-12 rounded-full mr-2 mb-2"></div>
                                ) : (
                                    ""
                                )}
                            </span>
                        </div>
                    ))
                )}

            </div>
        );

        setboard(boardupdate);
    }, [moved]);

    const contractlistener = new ethers.Contract(
        contractAddress.Game,
        gameabi.abi,
        prov
    );

    const eventlistener = (direction) => {
        contractlistener.on("move", (address, moves) => {
            if (moves == true) {
                const data = window.localStorage.getItem("playerdata");
                const parsedata = JSON.parse(data);

                if (direction == 0) {
                    let playerdata = {
                        x: Number(parsedata.x) - 1,
                        y: parsedata.y,
                        salt: parsedata.salt,
                    };
                    window.localStorage.setItem("playerdata", JSON.stringify(playerdata));
                    console.log("playerdata", playerdata);
                    setmoved(!moved);
                } else if (direction == 1) {
                    let playerdata = {
                        x: Number(parsedata.x) + 1,
                        y: parsedata.y,
                        salt: parsedata.salt,
                    };
                    window.localStorage.setItem("playerdata", JSON.stringify(playerdata));
                    console.log("playerdata", playerdata);
                    setmoved(!moved);
                } else if (direction == 2) {
                    let playerdata = {
                        x: parsedata.x,
                        y: Number(parsedata.y) + 1,
                        salt: parsedata.salt,
                    };
                    window.localStorage.setItem("playerdata", JSON.stringify(playerdata));
                    console.log("playerdata", playerdata);
                    setmoved(!moved);
                } else if (direction == 3) {
                    let playerdata = {
                        x: parsedata.x,
                        y: Number(parsedata.y) - 1,
                        salt: parsedata.salt,
                    };
                    window.localStorage.setItem("playerdata", JSON.stringify(playerdata));
                    console.log("playerdata", playerdata);
                    setmoved(!moved);
                }
                contractlistener.removeAllListeners("move");
            }
        });
    };



    const register = async () => {
        const contracteventsregister = new ethers.Contract(
            contractAddress.Game,
            gameabi.abi,
            prov
        );

        contracteventsregister.on("register", (address, registered) => {
            if (registered == true) {
                let playerdata = {
                    x: xcoordinate,
                    y: ycoordinate,
                    salt: random,
                };

                window.localStorage.setItem("playerdata", JSON.stringify(playerdata));
                setmoved(!moved);
                let updated = 0;
                let newstore = window.localStorage.getItem("playerdata");
                let newstoredata = JSON.parse(newstore);

                while (updated == 0) {
                    window.localStorage.setItem("playerdata", JSON.stringify(playerdata));
                    if (
                        newstoredata.x == xcoordinate &&
                        newstoredata.y == ycoordinate &&
                        newstoredata.salt == random
                    ) {
                        updated = 1;
                    }
                }
                setgameover(false);
            }
        });
        const random = ethers.BigNumber.from(
            ethers.utils.randomBytes(32)
        ).toString();
        const res = await RegisterProof(
            xcoordinate,
            ycoordinate,
            Number(xcoordinate) + 1,
            random
        );
        console.log("res", res);
        let result = await gamecontractwrite.Register(
            res[0],
            res[1],
            res[2],
            res[3],
            { gasLimit: 500000 }
        );
    };

    const moveleft = async () => {
        const pdata = window.localStorage.getItem("playerdata");
        let data = JSON.parse(pdata);
        let ran = data.salt;
        let currentx = data.x;
        let currenty = data.y;

        eventlistener(0);
        let attacks = await gamecontractread.attacks(address);
        let s = attacks.active;
        if (s == true) {
            onOpen();
        }
        else {

            let r = await gamecontractwrite.players(address);
            let a = await r.location;
            let res = await MoveProof(
                currentx,
                currenty,
                Number(currentx) - 1,
                currenty,
                ran,
                currentx
            );
            console.log("left move", res);
            let location = await gamecontractwrite.players(address);
            let result = await gamecontractwrite.Move(res[0], res[1], res[2], res[3], {
                gasLimit: 500000,
            });
        }
    };

    const moveright = async () => {
        const pdata = window.localStorage.getItem("playerdata");
        // console.log("pdata", pdata);
        let data = JSON.parse(pdata);
        let ran = data.salt;
        let currentx = data.x;
        let currenty = data.y;

        eventlistener(1);
        let attacks = await gamecontractread.attacks(address);
        let s = attacks.active;
        if (s == true) {
            onOpen();
        }
        else {


            let res = await MoveProof(
                currentx,
                currenty,
                Number(currentx) + 1,
                currenty,
                ran,
                Number(currentx) + 2
            );
            console.log("right move", res);
            let result = await gamecontractwrite.Move(res[0], res[1], res[2], res[3], {
                gasLimit: 500000,
            });
        }
    };

    const moveup = async () => {
        const pdata = window.localStorage.getItem("playerdata");
        // console.log("pdata", pdata);
        let data = JSON.parse(pdata);
        let ran = data.salt;
        let currentx = data.x;
        let currenty = data.y;

        eventlistener(2);

        let attacks = await gamecontractread.attacks(address);
        let s = attacks.active;
        if (s == true) {
            onOpen();
        }
        else {

            let res = await MoveProof(
                currentx,
                currenty,
                currentx,
                Number(currenty) + 1,
                ran,
                Number(currentx) + 1
            );
            console.log("Up move", res);
            let result = await gamecontractwrite.Move(res[0], res[1], res[2], res[3], {
                gasLimit: 500000,
            });
        }
    };

    const movebottom = async () => {
        const pdata = window.localStorage.getItem("playerdata");
        let data = JSON.parse(pdata);
        let ran = data.salt;
        let currentx = data.x;
        let currenty = data.y;

        eventlistener(3);

        let attacks = await gamecontractread.attacks(address);
        let s = attacks.active;
        if (s == true) {
            onOpen();
        }
        else {

            let res = await MoveProof(
                currentx,
                currenty,
                currentx,
                Number(currenty) - 1,
                ran,
                Number(currentx) + 1
            );
            let result = await gamecontractwrite.Move(res[0], res[1], res[2], res[3], {
                gasLimit: 2000000,
            });
        }
    };

    const attack = async () => {
        let att = await gamecontractwrite.AttackPlayer(
            attackaddress,
            attackx,
            attacky,
            { gasLimit: 2000000 }
        );
    };

    const defend = async () => {
        let xcoordinateguess = await gamecontractwrite.attacks(address);
        let ycoordinateguess = await gamecontractwrite.attacks(address);
        console.log(
            "xguess",
            Number(xcoordinateguess.xguess),
            "yguess",
            Number(ycoordinateguess.yguess)
        );
        const pdata = window.localStorage.getItem("playerdata");
        console.log("pdata", pdata);
        let data = JSON.parse(pdata);
        let ran = data.salt;
        let res = await DefendProof(
            Number(xcoordinateguess.xguess),
            Number(ycoordinateguess.yguess),
            ran
        );
        console.log(" Defend result", res);
        try {
            await gamecontractwrite.Defend(res[0], res[1], res[2], res[3], {
                gasLimit: 400000,
            });
        } catch (err) {
            console.log("error", err);
        }
        let a = await gamecontractwrite.attacks(address);
        console.log("a", a);
    };

    const useInterval = (callback, delay) => {
        const savedCallback = React.useRef();

        React.useEffect(() => {
            savedCallback.current = callback;
        }, [callback]);

        React.useEffect(() => {
            const tick = () => {
                savedCallback.current();
            }
            if (delay !== null) {
                let id = setInterval(tick, delay);
                return () => clearInterval(id);
            }
        }, [delay]);
    };


    useInterval(() => {

        const getstats = async () => {
            try {

                if (address) {
                    let data = await gamecontractread.players(address);
                    let health = data.health;
                    let playerzone = data.zone;
                    console.log("health", health);
                    setzone(playerzone);
                    sethealth(health);
                }
            }
            catch (err) {
                console.log("error on 458", err);
            }
        };
        getstats();
    }, [10000])


    useEffect(() => {
        if (Number(health) < 8) {

            setgameover(true);
        }
    }, [health]);

    console.log("healthhhh", Number(health))
    useEffect(() => {
        const attackerdetails = async () => {
            let a = await gamecontractwrite.attacks(address).active;
            setattacked(a);
            if (attacked) {
                console.log("attacked");
                onOpen();
            }
        };
        attackerdetails();
    });



    useInterval(() => {

        const call = async () => {
            let a = await gamecontractread.TotalPlayers();
            for (let i = 0; i < Number(a); i++) {
                console.log("calling", a);
            }
        }
        call();
    }, [10000])

    let arraddress = [];

    const [opponents, setOpponents] = useState([]);
    useInterval(() => {
        const getstats = async () => {
            let a = await gamecontractread.TotalPlayers();
            for (let i = 0; i < Number(a); i++) {
                let data = await gamecontractread.activeplayers(i);
                arraddress.push(data);
            }
            let playersdetails = [];
            for (let i = 0; i < arraddress.length; i++) {
                let data = await gamecontractread.players(arraddress[i]);
                let health = data.health;
                let playerzone = data.zone;
                let playeraddress = arraddress[i];
                let player = {
                    health: health,
                    zone: playerzone,
                    address: playeraddress
                };
                if (playeraddress !== address) {

                    playersdetails.push(player);
                }
            }
            setOpponents(playersdetails);
            console.log("opponents", opponents);

        }
        getstats();
    }, 10000);


    return (
        <div>
            <Header />

            {gameover ? (
                <div className="bg-gray-200 mt-20 flex flex-col flex-grow">
                    <div className="pt-2">
                        <h1 className="text-center text-5xl my-10">Play Game!!</h1>
                    </div>
                    <div className="w-4/6 mx-auto border-4 border-black rounded hover:rounded-lg">
                        <h2 className="text-2xl my-2 mx-2 text-center">Rules </h2>

                        <ul className="list-disc mx-8 my-5 pl-7">
                            <li>
                                {" "}
                                <b> Welcome to footsteps</b>
                            </li>
                            <li>
                                This is a persistent Board Game where players land and there
                                location is hidden from everyone else.
                            </li>
                            <li>
                                Only a hint is given to other players as you move accross the
                                board.(Your zone is public and can be seen by everyone)
                            </li>
                            <li>Health is reduced when you move .</li>
                            <li>
                                Your aim is to guess another player location using the
                                hints,if right, you get his half health
                            </li>

                            <p>****</p>
                            <li>Attacking costs 8pts health.</li>
                            <li>Moving costs 4pts</li>
                            <li>
                                If you get attacked you cannot move until you prove your
                                location.
                            </li>
                            <li>You lose if your health is less than 8 </li>
                            <p>****</p>
                        </ul>
                    </div>

                    <div
                        className=" flex flex-col "
                        style={{ justifyContent: "center", alignItems: "center" }}
                    >
                        <div>
                            <input
                                className="mx-8 my-6 p-2 border-2 border-black rounded-lg"
                                placeholder="x coordinate"
                                onChange={(e) => {
                                    setXcoordinate(e.target.value);
                                    console.log("x", xcoordinate);
                                }}
                            />
                        </div>
                        <div>
                            <input
                                className="mx-8 my-4 p-2 border-2 border-black rounded-lg"
                                placeholder="y coordinate"
                                onChange={(e) => {
                                    setYcoordinate(e.target.value);
                                    console.log("y", ycoordinate);
                                }}
                            />
                        </div>
                        <div>
                            <button
                                className="mx-8 my-4 py-2 px-8 border-2 border-black rounded-lg bg-gray-400 hover:bg-gray-500"
                                onClick={() => {
                                    register();
                                }}
                            >
                                Register
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-gray-200 mt-20 h-full flex flex-col flex-grow">
                    <div className="flex justify-center border-black border-b-2 py-5">
                        <div>
                            <div className="pt-10 flex justify-center items-center gap-5">
                                <button
                                    className="py-2 px-8 border-2 border-black rounded-lg bg-gray-400 hover:bg-gray-500"
                                    onClick={() => {
                                        moveleft();
                                    }}
                                >
                                    Move Left
                                </button>

                                <button
                                    className="py-2 px-8 border-2 border-black rounded-lg bg-gray-400 hover:bg-gray-500"
                                    onClick={() => {
                                        moveright();
                                    }}
                                >
                                    Move Right
                                </button>

                                <button
                                    className="py-2 px-8 border-2 border-black rounded-lg bg-gray-400 hover:bg-gray-500"
                                    onClick={() => {
                                        moveup();
                                    }}
                                >
                                    Move Up
                                </button>

                                <button
                                    className="py-2 px-8 border-2 border-black rounded-lg bg-gray-400 hover:bg-gray-500"
                                    onClick={() => {
                                        movebottom();
                                    }}
                                >
                                    Move Down
                                </button>
                            </div>
                            {/* Attack div */}
                            <div className="pt-5 flex justify-center items-center gap-5">
                                <input
                                    className="mx-8 my-4 p-2 border-2 border-black rounded-lg"
                                    placeholder="x coordinate of victim "
                                    onChange={(e) => {
                                        setattackx(e.target.value);
                                    }}
                                />

                                <input
                                    className="mx-8 my-4 p-2 border-2 border-black rounded-lg"
                                    placeholder="y coordinate of victim"
                                    onChange={(e) => {
                                        setattacky(e.target.value);
                                    }}
                                />

                                <input
                                    className="mx-8 my-4 p-2 border-2 border-black rounded-lg"
                                    placeholder="address of victim"
                                    onChange={(e) => {
                                        setattackaddress(e.target.value);
                                    }}
                                />
                            </div>
                            <div className="pt-5 flex justify-center items-center gap-5">
                                <Button
                                    onClick={() => {
                                        attack();
                                    }}
                                >
                                    Attack
                                </Button>

                            </div>
                        </div>
                        <div className="border-black border-l-2 p-10">
                            <h1 className="text-lg font-bold">Your Stats</h1>

                            <div className="mt-5">
                                {health && <h2 className="py-1">Health: {Number(health)}</h2>}
                                {zone && <h2 className="py-1">Zone: {Number(zone)}</h2>}
                            </div>
                        </div>
                    </div>

                    <div
                        className="my-10 flex"
                    >
                        <div className="w-4/5">
                            {board}
                        </div>
                        <div className="border-black border-l-2 w-1/5 p-10">
                            <h1 className="text-lg font-bold">EVENTS</h1>
                            {opponents?.map((opponent) => {
                                return (
                                    <div key={1} className="mt-5">
                                        <h2 className="py-1">
                                            Address : {(opponent.address)}
                                        </h2>
                                        <h2 className="py-1">
                                            Health : {Number(opponent.health)}
                                        </h2>
                                        <h2 className="py-1">
                                            Zone : {Number(opponent.zone)}
                                        </h2>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            <Modal
                initialFocusRef={initialRef}
                finalFocusRef={finalRef}
                isOpen={isOpen}
                onClose={onClose}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>You have been attacked</ModalHeader>
                    <ModalCloseButton />
                    <ModalFooter>
                        <Button onClick={async () => {

                            defend();
                            onClose();
                        }}
                            className=""
                            colorScheme="blue"
                            mr={3}>
                            Defend
                        </Button>
                        <Button onClick={onClose}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
}
