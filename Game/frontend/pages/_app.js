import Layout from '../components/Layout'
import '../styles/globals.css'
import networks from "../utils/networks.json";
import { WagmiConfig, createClient, createStorage } from 'wagmi'
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

        <Layout>
          <Component {...pageProps} />
        </Layout>
      </WagmiConfig>


    </div>
  )
}

export default MyApp;
