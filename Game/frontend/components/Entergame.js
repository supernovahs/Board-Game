
import Link from "next/link";

export default function Entergame() {

    return (
        // ToDo : Add a bg image here
        // <div className="bg-landing flex flex-wrap absolute">
        <div className="flex absolute  rounded-md justify-center items-center bg-red-400 ">
            <Link href="/Game">
                <div style={{ alignItems: "center", justifyContent: "center", width: "100%", height: "100%" }}>
                    <a className="text-6xl hover:bg-sky-400" >
                        Enter Game
                    </a>
                </div>
            </Link>
        </div >
        // </div>
    )
}



