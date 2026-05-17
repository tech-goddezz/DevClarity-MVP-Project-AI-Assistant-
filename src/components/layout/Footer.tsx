import { Code2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/5 mt-16 py-8 px-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">

        <div className="flex items-center gap-2">
          <Code2 size={16} className="text-indigo-300" aria-hidden="true" />
          <span className="text-sm text-slate-400">DevClarity</span>
          <span className="text-slate-600 text-sm">·</span>
          <span className="text-sm text-slate-500">AI Code Intelligence</span>
        </div>

        <div className="flex items-center gap-6">
          
            <a href="https://github.com/tech-goddezz"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-slate-500 hover:text-slate-300 transition"
            aria-label="View source code on GitHub"
          >
            GitHub
          </a>


          
            <a href="https://www.linkedin.com/in/elizabethomigie"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-slate-500 hover:text-slate-300 transition"
            aria-label="Connect on LinkedIn"
          >
            LinkedIn
          </a>

          <span className="text-xs text-slate-600">
            Built by Elizabeth Omigie
          </span>
        </div>

      </div>
    </footer>
  );
}