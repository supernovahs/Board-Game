import Link from "next/link";
import { switchNetwork } from "../utils/switchnetworks";
import networks from "../utils/networks.json";
import { useAccount, useConnect, useEnsName, useDisconnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";

export default function Header() {
    const { data: account } = useAccount();
    const { connect } = useConnect({
        connector: new InjectedConnector(),
    });
    const { disconnect } = useDisconnect();

    if (account) {
        let link = "https://etherscan.io/address/" + account.address;

        return (
            <div className="fixed top-0 left-0 w-screen bg-black z-10">
                {/* <div className="top-4 right-30  absolute"><p class="text-xl font-mono ">Connected to</p>
                <a href={link} target="_blank">
                    {(account.address).substring(0, 6) + "..."}
                </a>
            </div>) */}
                <div className="p-5 flex items-center justify-between ">
                    <h1 className="text-white text-3xl font-mono">Footsteps</h1>
                    <div className="flex items-center gap-5">
                        <p className="text-xl font-mono text-white ">Connected to</p>
                        <a href={link} target="_blank" rel="noreferrer" className="text-white">
                            {account.address.substring(0, 6) + "..."}
                        </a>
                        <button
                            className="text-lg font-medium rounded-md bg-sky-300 hover:bg-violet-400 px-6 py-2 "
                            onClick={() => disconnect()}
                        >
                            Disconnect
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed top-0 left-0 w-screen bg-black z-10">
            <div className="p-5 flex items-center justify-between ">
                <h1 className="text-white text-3xl font-mono">Footsteps</h1>

                <button
                    className="text-lg font-medium rounded-md bg-sky-300 hover:bg-violet-400 px-6 py-2 "
                    onClick={() => connect()}
                >
                    Connect Wallet
                </button>
            </div>
        </div>
    );
}
