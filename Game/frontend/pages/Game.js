import { useState, useEffect } from "react";
const ethers = require("ethers");
import {
    useContract,
    useSigner,
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
import { Button } from "@chakra-ui/react";
// import { styles } from "../styles/globals.css";
import Header from "../components/Header";
import EventCard from "../components/EventCard";

export default function Game() {
    const { data: account } = useAccount();
    const { connect } = useConnect({
        connector: new InjectedConnector(),
    });
    // https://kovan.optimism.io
    //https://mainnet.optimism.io
    let prov = new ethers.providers.JsonRpcProvider(
        "https://mainnet.optimism.io"
    );
    const { disconnect } = useDisconnect();
    const signer = useSigner();
    // const provider = useProvider();

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
    const [alive, setalive] = useState(true);

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
                {[...Array(width)].map((_, i) => (<span key={i} className={`font-bold text-center`}>{(<p>Zone {i + 1}</p>)}</span>))}
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
            if (moves == true && address == address) {
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
                    setmoved(!moved);
                } else if (direction == 3) {
                    let playerdata = {
                        x: parsedata.x,
                        y: Number(parsedata.y) - 1,
                        salt: parsedata.salt,
                    };
                    window.localStorage.setItem("playerdata", JSON.stringify(playerdata));
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
            if (registered == true && address == address



            ) {
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
            contractlistener.removeAllListeners("register");
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
            let location = await gamecontractwrite.players(address);
            let result = await gamecontractwrite.Move(res[0], res[1], res[2], res[3], {
                gasLimit: 500000,
            });
        }
    };

    const moveright = async () => {
        const pdata = window.localStorage.getItem("playerdata");
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

        const pdata = window.localStorage.getItem("playerdata");
        console.log("pdata", pdata);
        let data = JSON.parse(pdata);
        let ran = data.salt;
        let res = await DefendProof(
            Number(xcoordinateguess.xguess),
            Number(ycoordinateguess.yguess),
            ran
        );
        try {
            await gamecontractwrite.Defend(res[0], res[1], res[2], res[3], {
                gasLimit: 2000000,
            });
        } catch (err) {
            console.log("error", err);
        }

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
                    setzone(playerzone);
                    sethealth(health);
                    let isalive = data.alive;
                    setalive(isalive);
                }
            }
            catch (err) {
                console.log("error on 458", err);
            }
        };
        getstats();
    }, [10000])


    useEffect(() => {
        if (Number(health) < 8 || (!alive)) {

            setgameover(true);
        }
    }, [health]);

    useEffect(() => {
        const attackerdetails = async () => {
            let a = await gamecontractwrite.attacks(address).active;
            setattacked(a);
            if (attacked) {
                onOpen();
            }
        };
        attackerdetails();
    });


    let arraddress = [];

    const [opponents, setOpponents] = useState([]);
    useInterval(() => {
        const getstats = async () => {
            let a = await gamecontractread.TotalPlayers();
            for (let i = 0; i < Number(a); i++) {
                let data = await gamecontractread.activeplayers(i);
                let id = await gamecontractread.Id(data);
                console.log("id", id);

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

        }
        getstats();
    }, 10000);

    const Quit = async () => {
        await gamecontractwrite.Quit({ gasLimit: 2000000 });
    }


    return (
        <div>
            <Header />

            {gameover ? (
                <div className="bg-gray-200 mt-20 flex flex-col flex-grow">
                    <div className="pt-2">
                        <h1 className="text-center text-5xl my-10">Play Game!!</h1>
                    </div>
                    <div className="w-4/6 mx-auto border-4 border-black rounded hover:rounded-lg">
                        <h2 className="text-2xl my-2 mx-2 text-center ">Rules </h2>

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
                                hints and if your health is greater than the attacked player, you get half of his health
                                Else if the attacked player has greater health than you, he gets 20 % of your health.
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


                    <div
                        className="my-10 flex"
                    >
                        <div className="w-4/5">
                            {board}
                        </div>
                        <div className="flex flex-col">
                            <button
                                className="py-2 px-8 border-2 border-black rounded-lg bg-gray-400 hover:bg-gray-500 mb-2"
                                onClick={() => {
                                    Quit();
                                }}
                            >
                                Quit Game
                            </button>
                            <div className='p-5 border-2 border-black rounded-lg text-center '>
                                <h1 className="text-lg font-bold">Your Stats</h1>

                                <div className="mt-5">
                                    {health && <h2 className="py-1">Health: {Number(health)}</h2>}
                                    {zone && <h2 className="py-1">Zone: {Number(zone)}</h2>}
                                </div>
                            </div>

                            <div>
                                <h1 className="text-lg font-bold">ACTIONS</h1>
                                <div className="pt-10 flex flex-col justify-center items-center gap-5">
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
                            </div>

                            <div className="mt-5">
                                <h1 className="text-lg font-bold">EVENTS</h1>
                                {opponents?.map((opponent, i) => <EventCard key={i} opponent={opponent} setattackx={setattackx} setattacky={setattacky} attackx={attackx} attacky={attacky} setattackaddress={setattackaddress} attack={attack} />)}
                            </div>
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
