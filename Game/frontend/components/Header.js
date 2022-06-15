import Link from "next/link";
import { useAccount, useConnect, useNetwork } from "wagmi";
import { switchNetwork } from "../utils/switchnetworks";
import networks from "../utils/networks.json";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Header() {

    return (
        <ConnectButton />
    )


}