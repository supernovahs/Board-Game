import Link from "next/link";
import { switchNetwork } from "../utils/switchnetworks";
import networks from "../utils/networks.json";
import { useAccount, useConnect, useEnsName, useDisconnect } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'

export default function Header() {
    const { data: account } = useAccount()
    const { connect } = useConnect({
        connector: new InjectedConnector(),
    })
    const { disconnect } = useDisconnect();

    if (account) {

        let link = "https://etherscan.io/address/" + account.address;

        return (<div class="divide-{red}">
            {/* <div className="top-4 right-30  absolute"><p class="text-xl font-mono ">Connected to</p>
                <a href={link} target="_blank">
                    {(account.address).substring(0, 6) + "..."}
                </a>
            </div>) */}
            <div className="p-5 mb-4 ">
                <p class="text-xl font-mono ">Connected to</p>
                <a href={link} target="_blank">
                    {(account.address).substring(0, 6) + "..."}
                </a>
                <img src="/Footsteps.png" alt="" height="100" width="200" align="center" />
                <button className="text-lg font-medium rounded-md bg-sky-300 hover:bg-violet-400 px-6 py-4 top-3 right-3 absolute" onClick={() => disconnect()}>Disconnect</button>
            </div >
        </div >
        )
    }

    return (
        <header className="  p-5 mb-4 relative">

            <button
                className="text-lg font-medium rounded-md bg-sky-300 hover:bg-violet-400 px-6 py-4 top-3 right-3 absolute"

                onClick={() => connect()}>Connect Wallet</button>
        </header>

    )
}