import Layout from '../components/Layout'
import '../styles/globals.css'
import RainbowKitwrapper from "../components/RainbowKitwrapper"

function MyApp({ Component, pageProps }) {

  return (
    <RainbowKitwrapper>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </RainbowKitwrapper>
  )
}

export default MyApp
