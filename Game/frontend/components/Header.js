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

    if (account) return (<div>Connected to {account.address}
        <button onClick={() => disconnect()}>Disconnect</button>
    </div>)
    return (
        <header className="flex flex-wrap justify-between p-5 mb-10">

            <button
                className="text-lg font-medium rounded-md px-5 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500"

                onClick={() => connect()}>Connect Wallet</button>
        </header>

    )
}