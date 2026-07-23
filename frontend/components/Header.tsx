export default function Header() {
  return (
    <header className="bg-gray-900 border-b border-gray-800 h-16 flex items-center justify-between px-6">
      <div>
        <h1 className="text-2xl font-bold text-green-400">
          MM AI Trader
        </h1>
        <p className="text-sm text-gray-400">
          AI Powered Intraday Trading Platform
        </p>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-green-400 font-semibold">
          🟢 Market Open
        </span>

        <button className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg font-semibold">
          Login
        </button>
      </div>
    </header>
  );
}