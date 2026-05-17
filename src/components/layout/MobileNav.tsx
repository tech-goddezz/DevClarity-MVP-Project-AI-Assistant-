import { Code2, Sparkles, History, BrainCircuit, ShieldCheck } from "lucide-react";

// Mobile bottom navigation bar — shown only on small screens
// where the sidebar is hidden.
// Simple English: on phones, the sidebar disappears. This
// puts a navigation bar at the bottom of the screen instead,
// like most mobile apps do.

export function MobileNav() {
  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-white/5 bg-[#0B1020]/95 backdrop-blur-xl"
      aria-label="Mobile navigation"
    >
      <ul className="flex items-center justify-around px-2 py-3">
        <li>
          <button
            type="button"
            className="flex flex-col items-center gap-1 px-3 py-1 text-indigo-300"
            aria-label="Analyze code"
            aria-current="page"
          >
            <Sparkles size={20} aria-hidden="true" />
            <span className="text-[10px]">Analyze</span>
          </button>
        </li>
        <li>
          <button
            type="button"
            className="flex flex-col items-center gap-1 px-3 py-1 text-slate-500"
            aria-label="View history"
          >
            <History size={20} aria-hidden="true" />
            <span className="text-[10px]">History</span>
          </button>
        </li>
        <li>
          {/* Logo center button */}
          <button
            type="button"
            className="flex flex-col items-center gap-1 px-3 py-1"
            aria-label="DevClarity home"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
              <Code2 size={18} className="text-indigo-300" aria-hidden="true" />
            </div>
          </button>
        </li>
        <li>
          <button
            type="button"
            className="flex flex-col items-center gap-1 px-3 py-1 text-slate-500"
            aria-label="Smart analysis"
          >
            <BrainCircuit size={20} aria-hidden="true" />
            <span className="text-[10px]">Smart</span>
          </button>
        </li>
        <li>
          <button
            type="button"
            className="flex flex-col items-center gap-1 px-3 py-1 text-slate-500"
            aria-label="Best practices"
          >
            <ShieldCheck size={20} aria-hidden="true" />
            <span className="text-[10px]">Practices</span>
          </button>
        </li>
      </ul>
    </nav>
  );
}