import dynamic from "next/dynamic";
import Head from "next/head";
export default function Layout({ children }) {
    const Header = dynamic(() => import("./Header"), {
        ssr: false,
    });
    return (
        <>


            <div >
                <Header style={{}} />
                <main >{children}
                </main>
            </div>

        </>
    )
}