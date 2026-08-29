export default function Sidebar() {

  return (

    <aside className="w-64 min-h-screen border-r border-slate-800/80 bg-[#07111f] px-4 py-5">

      <div className="mb-6 rounded-2xl border border-slate-800/80 bg-slate-900/50 p-4">

        <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
          Workspace
        </p>

        <h2 className="mt-1 text-lg font-bold tracking-wide text-white">
          Trading Console
        </h2>

        <p className="mt-1 text-xs text-slate-500">
          AI-assisted market operations
        </p>

      </div>


      <nav className="space-y-2">

        <div className="flex items-center gap-3 rounded-xl border border-blue-500/20 bg-blue-500/10 px-3 py-2.5 text-sm font-semibold text-blue-300 cursor-pointer">
          <span className="text-base">📊</span>
          <span>Dashboard</span>
        </div>


        <div className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-400 transition-all duration-200 hover:bg-slate-800/60 hover:text-white cursor-pointer">
          <span className="text-base">📈</span>
          <span>Market Overview</span>
        </div>


        <div className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-400 transition-all duration-200 hover:bg-slate-800/60 hover:text-white cursor-pointer">
          <span className="text-base">🤖</span>
          <span>AI Analysis</span>
        </div>


        <div className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-400 transition-all duration-200 hover:bg-slate-800/60 hover:text-white cursor-pointer">
          <span className="text-base">⚡</span>
          <span>Trade Plan</span>
        </div>


        <div className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-400 transition-all duration-200 hover:bg-slate-800/60 hover:text-white cursor-pointer">
          <span className="text-base">🟢</span>
          <span>Active Trade</span>
        </div>


        <div className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-400 transition-all duration-200 hover:bg-slate-800/60 hover:text-white cursor-pointer">
          <span className="text-base">📒</span>
          <span>Trade History</span>
        </div>


        <div className="my-4 border-t border-slate-800/80" />


        <p className="px-3 text-[10px] uppercase tracking-[0.18em] text-slate-600">
          Analysis
        </p>


        <div className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-400 transition-all duration-200 hover:bg-slate-800/60 hover:text-white cursor-pointer">
          <span className="text-base">⏯️</span>
          <span>Replay</span>
        </div>


        <div className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-400 transition-all duration-200 hover:bg-slate-800/60 hover:text-white cursor-pointer">
          <span className="text-base">🧪</span>
          <span>Backtesting</span>
        </div>


        <div className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-400 transition-all duration-200 hover:bg-slate-800/60 hover:text-white cursor-pointer">
          <span className="text-base">📊</span>
          <span>Performance</span>
        </div>


        <div className="my-4 border-t border-slate-800/80" />


        <div className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-400 transition-all duration-200 hover:bg-slate-800/60 hover:text-white cursor-pointer">
          <span className="text-base">⚙</span>
          <span>Settings</span>
        </div>


      </nav>

    </aside>

  );
}