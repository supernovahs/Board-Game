import Layout from '../components/Layout'
import '../styles/globals.css'
import networks from "../utils/networks.json";
import { WagmiConfig, createClient, createStorage } from 'wagmi'
import { ChakraProvider } from '@chakra-ui/react'
import React from "react";
import ReactDOM from "react-dom";
let client;

if (typeof window !== 'undefined') {

  client = createClient(
    {
      storage: createStorage({ storage: window.localStorage })
    }
  );
}



function MyApp({ Component, pageProps }) {


  return (
    <div>

      <WagmiConfig client={client}>

        <ChakraProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ChakraProvider>
      </WagmiConfig>


    </div>
  )
}

export default MyApp;
