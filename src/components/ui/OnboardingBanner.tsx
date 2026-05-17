import { useState } from "react";
import { X, Lightbulb } from "lucide-react";

// A dismissable tip banner shown to first-time visitors.
// Once dismissed, it stays hidden using localStorage.
// Simple English: shows new users a helpful tip about
// how to use the app. They can close it and it won't
// come back.

export function OnboardingBanner() {
  const [visible, setVisible] = useState(() => {
    // Check if user has already dismissed this banner before.
    // Simple English: if they've visited before and closed it,
    // don't show it again.
    return localStorage.getItem("devclarity_onboarded") !== "true";
  });

  if (!visible) return null;

  const dismiss = () => {
    setVisible(false);
    localStorage.setItem("devclarity_onboarded", "true");
  };

  return (
    <div
      role="banner"
      className="mb-6 p-4 rounded-2xl border border-indigo-500/20 bg-indigo-500/5 flex items-start gap-3"
    >
      <Lightbulb size={18} className="text-indigo-300 mt-0.5 flex-shrink-0" />
      <div className="flex-1">
        <p className="text-sm text-slate-300 font-medium mb-1">
          Welcome to DevClarity 
        </p>
        <p className="text-xs text-slate-400 leading-relaxed">
          Paste any JavaScript, TypeScript, or Python code into the editor
          and click <strong className="text-slate-300">Analyze Code</strong>.
          You'll get an AI quality score, issues found, and suggestions to
          improve — instantly. Switch to <strong className="text-slate-300">Smart AI</strong> for deeper analysis.
        </p>
      </div>
      <button
        onClick={dismiss}
        aria-label="Dismiss welcome message"
        className="text-slate-500 hover:text-slate-300 transition flex-shrink-0"
      >
        <X size={16} />
      </button>
    </div>
  );
}