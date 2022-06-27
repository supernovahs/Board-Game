import dynamic from "next/dynamic";
import Head from "next/head";
export default function Layout({ children }) {
    const Header = dynamic(() => import("./Header"), {
        ssr: false,
    });
    return (
        <>
            {/* <Header style={{}} /> */}
            <main>{children}</main>
        </>
    );
}
