import Link from "next/link";

export default function Entergame() {
    return (

        <div className="flex absolute rounded-md justify-center items-center bg-gray-400 cursor-pointer px-10 py-3 ">
            <Link href="/Game">
                <div
                    style={{
                        alignItems: "center",
                        justifyContent: "center",
                        width: "100%",
                        height: "100%",
                    }}
                >
                    <a className="text-6xl">Enter Game</a>
                </div>
            </Link>
        </div>
        // </div>
    );
}
