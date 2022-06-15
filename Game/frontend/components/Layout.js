import Header from "./Header";
import Head from "next/head";


export default function Layout({ children }) {
    return (
        <>
            <Head>
                <title>Board Game</title>
            </Head>
            <div>
                <Header />
                <main className="mb-auto">{children}</main>
            </div>
        </>
    )
}