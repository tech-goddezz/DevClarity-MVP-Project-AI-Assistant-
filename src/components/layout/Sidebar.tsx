import { Code2, Sparkles, History, BrainCircuit, ShieldCheck, Bot } from "lucide-react";

// The left sidebar of the dashboard.
// It's purely presentational — it receives no props
// and manages no state. It just renders the nav.
// Simple English: this is just the left panel you see
// on screen. It doesn't do any logic, it just looks good.

export function Sidebar() {
  return (
    <aside className="hidden lg:flex w-[260px] border-r border-white/5 bg-[#0B1020]/80 backdrop-blur-xl flex-col justify-between p-6 flex-shrink-0">
      <div>
        {/* Logo + App Name */}
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/20">
            <Code2 size={20} className="text-indigo-300" />
          </div>
          <div>
            <h1 className="font-semibold text-lg">DevClarity</h1>
            <p className="text-xs text-slate-400">AI Code Intelligence</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav aria-label="Main navigation">
          <ul className="space-y-3">
            <li>
              <div
                className="sidebar-item-active"
                aria-current="page"
              >
                <Sparkles size={18} aria-hidden="true" />
                Analyze Code
              </div>
            </li>
            <li>
              <div className="sidebar-item">
                <History size={18} aria-hidden="true" />
                History
              </div>
            </li>
            <li>
              <div className="sidebar-item">
                <BrainCircuit size={18} aria-hidden="true" />
                Smart Analysis
              </div>
            </li>
            <li>
              <div className="sidebar-item">
                <ShieldCheck size={18} aria-hidden="true" />
                Best Practices
              </div>
            </li>
          </ul>
        </nav>
      </div>

      {/* AI Assistant Card at the bottom */}
      <div className="glass-card p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
            <Bot className="text-cyan-300" size={18} aria-hidden="true" />
          </div>
          <div>
            <h4 className="text-sm font-medium">AI Assistant</h4>
            <p className="text-xs text-slate-400">Powered by Groq</p>
          </div>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          Analyze and improve your code using advanced AI models.
        </p>
      </div>
    </aside>
  );
}