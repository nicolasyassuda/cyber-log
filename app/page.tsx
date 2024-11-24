import LinkFocus from "./components/link-focus";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center text-center px-4 pt-32">
      <h2 className="text-5xl font-extrabold text-cyber-green">
        Analyze Your Logs in Real-Time
      </h2>
      <p className="mt-4 text-lg text-gray-400 max-w-2xl">
        Cyber-Log is a powerful tool for analyzing web server logs. Gain
        insights, monitor traffic, and enhance performance effortlessly.
      </p>
      <div className="mt-8">
        <LinkFocus
          href="/logs"
          className="bg-cyber-green hover:bg-cyber-blue text-black font-semibold py-3 px-6 rounded-lg"
        >
          Get Started
        </LinkFocus>
      </div>
    </main>
  );
}
