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
        <button onClick={() => connect()}>Connect Wallet</button>

    )
}