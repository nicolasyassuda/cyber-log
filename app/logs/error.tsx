"use client"
import LinkFocus from "../components/link-focus";

export default function ErrorPage({error}: Readonly<{error: Error}>) {
    return (
        <main className="flex flex-col items-center justify-center text-center px-4 pt-32">
            <h2 className="text-5xl font-extrabold text-cyber-green">
                403 Forbidden
            </h2>
            <p className="mt-4 text-lg text-gray-400 max-w-2xl">
                {error.message}
            </p>
            <div className="mt-8">
                <LinkFocus
                    href="/"
                    className="bg-cyber-green hover:bg-cyber-blue text-black font-semibold py-3 px-6 rounded-lg"
                >
                    Return Home
                </LinkFocus>
            </div>
        </main>
    );
}