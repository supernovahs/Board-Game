import Header from "./Header";
import Head from "next/head";
import { useAccount, useConnect, useEnsName } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
export default function Layout({ children }) {

    return (
        <>


            <div>
                <Header style={{ margin: "10" }} />
                <main >{children}
                </main>
            </div>

        </>
    )
}