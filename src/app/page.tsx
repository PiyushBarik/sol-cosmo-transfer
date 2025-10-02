import Link from "next/link";
import { Card } from "@/components/Card";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 dark:from-purple-400 dark:via-blue-400 dark:to-indigo-400 bg-clip-text text-transparent leading-tight">
            Sol Cosmo Transfer
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Explore live Solana token feeds and transfer SOL with your Phantom
            wallet on Devnet
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
            Connected to Solana Devnet
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <Card
            variant="elevated"
            className="group hover:scale-105 transition-transform duration-300"
          >
            <div className="p-8">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:shadow-lg group-hover:shadow-green-500/25 transition-shadow duration-300">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">
                Live Token Feed
              </h2>
              <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                Real-time Solana token prices and market data powered by
                WebSocket connections. Watch prices update live with CoinGecko
                integration.
              </p>
              <Link
                href="/cosmo"
                className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors duration-200"
              >
                View Token Feed
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>
          </Card>

          <Card
            variant="elevated"
            className="group hover:scale-105 transition-transform duration-300"
          >
            <div className="p-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:shadow-lg group-hover:shadow-blue-500/25 transition-shadow duration-300">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-100">
                SOL Transfer
              </h2>
              <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                Send SOL to any Solana address using your Phantom wallet. Secure
                transactions on Devnet with real-time Explorer links.
              </p>
              <Link
                href="/transfer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200"
              >
                Start Transfer
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>
          </Card>
        </div>

        {/* Tech Stack */}
        <Card variant="bordered" className="mb-16">
          <div className="p-8">
            <h3 className="text-2xl font-bold mb-6 text-center text-slate-900 dark:text-slate-100">
              Built with Modern Web3 Stack
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                {
                  name: "Next.js 14",
                  color: "bg-black text-white dark:bg-white dark:text-black",
                },
                { name: "TypeScript", color: "bg-blue-600 text-white" },
                { name: "Tailwind CSS", color: "bg-cyan-500 text-white" },
                { name: "Solana Web3.js", color: "bg-purple-600 text-white" },
              ].map((tech) => (
                <div
                  key={tech.name}
                  className={`${tech.color} px-4 py-3 rounded-lg text-center font-medium text-sm transition-transform hover:scale-105`}
                >
                  {tech.name}
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Getting Started */}
        <Card>
          <div className="p-8">
            <h3 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">
              Getting Started
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 mt-1">
                  1
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
                    Install Phantom Wallet
                  </h4>
                  <p className="text-slate-600 dark:text-slate-300">
                    Download and install the Phantom browser extension, then
                    switch to Devnet
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 mt-1">
                  2
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
                    Get Devnet SOL
                  </h4>
                  <p className="text-slate-600 dark:text-slate-300">
                    Use the Phantom wallet&apos;s built-in faucet or visit{" "}
                    <a
                      href="https://faucet.solana.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-600 dark:text-purple-400 hover:underline"
                    >
                      faucet.solana.com
                    </a>
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 mt-1">
                  3
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
                    Explore the Demo
                  </h4>
                  <p className="text-slate-600 dark:text-slate-300">
                    Check live token prices in Cosmo and send SOL in Transfer
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
