
import {
    getDefaultWallets,
    RainbowKitProvider,
    lightTheme
} from '@rainbow-me/rainbowkit';
import {
    chain,
    configureChains,
    createClient,
    WagmiConfig,
} from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import { useEffect, useState } from 'react';

export default function RainbowKitwrapper({ children }) {



    const { chains, provider } = configureChains(
        [chain.mainnet, chain.optimismKovan],
        [
            alchemyProvider({ alchemyId: process.env.ALCHEMY_ID }),
            publicProvider()
        ]
    );
    console.log("chains", chains);
    console.log("provider", provider);


    const { connectors } = getDefaultWallets({
        appName: 'My RainbowKit App',
        chains
    });
    console.log("connectors", connectors);

    const wagmiClient = createClient({
        autoConnect: true,
        connectors,
        provider
    })
    console.log("wagmi client", wagmiClient);

    return (
        <div>
            {wagmiClient !== undefined && (
                <WagmiConfig client={wagmiClient}>
                    <RainbowKitProvider chains={chains} theme={lightTheme()}>
                        {children}
                    </RainbowKitProvider>
                </WagmiConfig>
            )}
        </div>
    )
}