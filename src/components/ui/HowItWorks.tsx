import { ClipboardPaste, Zap, TrendingUp } from "lucide-react";

// A three-step explainer showing how DevClarity works.
// Simple English: shows new visitors the three steps
// to using the app — paste, analyze, improve. This
// reduces confusion and makes the product feel more
// like a real SaaS than a demo tool.

const steps = [
  {
    icon: ClipboardPaste,
    title: "Paste Your Code",
    description:
      "Drop any JavaScript, TypeScript, or Python snippet into the editor. No setup, no account needed.",
    color: "text-indigo-300",
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/20",
  },
  {
    icon: Zap,
    title: "AI Analyzes Instantly",
    description:
      "Our AI reviews your code for quality issues, bad patterns, and improvement opportunities in seconds.",
    color: "text-cyan-300",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
  },
  {
    icon: TrendingUp,
    title: "Improve & Learn",
    description:
      "Get a quality score, clear explanations, and a fixed version of your code — then ship better code.",
    color: "text-green-300",
    bg: "bg-green-500/10",
    border: "border-green-500/20",
  },
];

export function HowItWorks() {
  return (
    <div className="mb-8">
      <p className="text-xs text-slate-500 uppercase tracking-widest mb-4 font-medium">
        How it works
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div
              key={step.title}
              className={`glass-card p-5 border ${step.border} relative`}
            >
              {/* Step number */}
              <span className="absolute top-4 right-4 text-xs text-slate-600 font-mono">
                0{index + 1}
              </span>
              <div className={`w-9 h-9 rounded-xl ${step.bg} border ${step.border} flex items-center justify-center mb-4`}>
                <Icon size={17} className={step.color} aria-hidden="true" />
              </div>
              <h3 className="text-sm font-semibold text-white mb-2">
                {step.title}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {step.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}