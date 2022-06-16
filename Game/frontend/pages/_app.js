import Layout from '../components/Layout'
import '../styles/globals.css'
import networks from "../utils/networks.json";
import { WagmiConfig, createClient } from 'wagmi'
const client = createClient();




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
