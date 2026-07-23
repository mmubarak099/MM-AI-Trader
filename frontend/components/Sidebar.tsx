export default function Sidebar() {

  return (

    <aside className="w-64 min-h-screen bg-gray-900 border-r border-gray-800 p-5">

      <h2 className="text-xl font-bold mb-8">
        MM AI Trader
      </h2>


      <nav className="space-y-4">

        <div className="text-gray-300 hover:text-white cursor-pointer">
          📊 Dashboard
        </div>


        <div className="text-gray-300 hover:text-white cursor-pointer">
          🤖 AI Scanner
        </div>


        <div className="text-gray-300 hover:text-white cursor-pointer">
          👀 Watchlist
        </div>


        <div className="text-gray-300 hover:text-white cursor-pointer">
          ⚡ Trade Signals
        </div>


        <div className="text-gray-300 hover:text-white cursor-pointer">
          📒 Trade Journal
        </div>


        <div className="text-gray-300 hover:text-white cursor-pointer">
          ⚙ Settings
        </div>


      </nav>

    </aside>

  );
}