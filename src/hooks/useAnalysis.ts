import { useState, useRef, useEffect, useCallback } from "react";
import { analyzeCode, fixCode } from "../api/analyze";
import { guessLanguage } from "../lib/utils";
import type { AnalysisResult, Language, AnalysisMode } from "../types";
import toast from "react-hot-toast";


// This hook owns ALL the logic for the analysis feature.
// Components that use this hook just get back data and
// functions — they don't need to know HOW any of it works.
// Simple English: this is the "brain" of the app. The
// components are just the "face" that displays things.

export function useAnalysis() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [language, setLanguage] = useState<Language>("javascript");
  const [mode, setMode] = useState<AnalysisMode>("fast");
  const [typedSummary, setTypedSummary] = useState("");
  const [fixedCode, setFixedCode] = useState<string | null>(null);
  const [fixing, setFixing] = useState(false);
  const [fixError, setFixError] = useState("");
  const [displayScore, setDisplayScore] = useState(0);
  const [history, setHistory] = useState<AnalysisResult[]>([]);

  // Refs hold interval IDs so we can stop animations
  // when needed without causing memory leaks.
  // Simple English: refs are like sticky notes that
  // remember something between renders without
  // causing the screen to re-draw.
  const typingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const scoreRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const resultRef = useRef<HTMLDivElement | null>(null);

  // Load history from localStorage when the app first opens.
  // Simple English: when the page loads, check if the user
  // has done any previous analyses and restore them.
  useEffect(() => {
    const saved = localStorage.getItem("devclarity_history");
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch {
        // If the saved data is corrupted, just start fresh
        localStorage.removeItem("devclarity_history");
      }
    }
  }, []);

  // Save history to localStorage whenever it changes.
  // Simple English: every time the history list updates,
  // save it so it survives a page refresh.
  useEffect(() => {
    localStorage.setItem("devclarity_history", JSON.stringify(history));
  }, [history]);

  // Cleanup intervals when the component unmounts.
  // Simple English: when the user leaves the page,
  // stop any animations that are still running
  // so they don't cause errors in the background.
  useEffect(() => {
    return () => {
      if (typingRef.current) clearInterval(typingRef.current);
      if (scoreRef.current) clearInterval(scoreRef.current);
    };
  }, []);

 // Animates the summary text appearing word by word.
// Changed from character-by-character because word-by-word
// looks cleaner and avoids mid-word cursor artifacts.
// Simple English: the summary types itself out one word at
// a time instead of one letter at a time — smoother and
// less likely to look like gibberish mid-animation.
const typeText = useCallback((text: string) => {
  if (typingRef.current) clearInterval(typingRef.current);
  const safe = typeof text === "string" ? text : String(text ?? "");
  const words = safe.split(" ");
  let index = 0;
  setTypedSummary("");
  typingRef.current = setInterval(() => {
    if (index >= words.length) {
      clearInterval(typingRef.current!);
      return;
    }
    const separator = index === 0 ? "" : " ";
    setTypedSummary((prev) => prev + separator + words[index]);
    index++;
  }, 60); // 60ms per word feels natural
}, []);


  // Animates the score counting up from 0 to the final value.
  // Simple English: instead of the score jumping straight
  // to "8", it counts up: 1, 2, 3... 8. Feels satisfying.
  const animateScore = useCallback((finalScore: number) => {
    if (scoreRef.current) clearInterval(scoreRef.current);
    let current = 0;
    const target = Math.min(finalScore || 0, 10);
    setDisplayScore(0);
    scoreRef.current = setInterval(() => {
      current += 0.2;
      setDisplayScore(Math.round(current));
      if (current >= target) {
        setDisplayScore(target);
        clearInterval(scoreRef.current!);
      }
    }, 30);
  }, []);

  // Updates the language guess as the user types code.
  // Only runs if no analysis result is showing yet.
  const handleCodeChange = useCallback((nextCode: string) => {
    setCode(nextCode);
    if (!result) {
      setLanguage(guessLanguage(nextCode));
    }
  }, [result]);

  // Loads a previous analysis from history back into the main view.
  // Simple English: when the user clicks an old analysis
  // in the history panel, this restores it to the screen.
  const loadFromHistory = useCallback((item: AnalysisResult) => {
    setResult(item);
    setCode(item.code);
    setLanguage(item.language);
    typeText(item.summary);
    animateScore(item.score);
  }, [typeText, animateScore]);

  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem("devclarity_history");
    toast.success("History cleared.");
  }, []);
  

  // The main function — sends code to the backend,
  // gets analysis back, updates all state.
  const runAnalysis = useCallback(async () => {
    if (!code.trim()) {
      setError("Please paste some code before analyzing.");
      toast.error("Analysis failed. Please try again.");
      return;
    }

    // Stop any running animations from a previous analysis
    if (typingRef.current) clearInterval(typingRef.current);
    if (scoreRef.current) clearInterval(scoreRef.current);

    setLoading(true);
    setError("");
    setResult(null);
    setTypedSummary("");
    setDisplayScore(0);

    try {
      const data = await analyzeCode({ code, language, mode });

      // Small delay so the loading state doesn't flash
      // away too quickly — feels more intentional.
      await new Promise((r) => setTimeout(r, 700));

      const resultWithMeta: AnalysisResult = {
        ...data,
        id: crypto.randomUUID(),
        code,
        analyzedAt: new Date().toISOString(),
      };

      setResult(resultWithMeta);
      toast.success("Analysis complete!");

      // Keep only the last 10 analyses in history
      setHistory((prev) => [resultWithMeta, ...prev].slice(0, 10));

      animateScore(data.score);
      typeText(data.summary);

      // Scroll the result panel into view smoothly
      setTimeout(() => {
        resultRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);

    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, [code, language, mode, animateScore, typeText]);

  // Asks the AI to fix the issues in the current code.
// Simple English: takes the code and its problems,
// sends them to the backend, and gets back a
// corrected version of the code.
const runFix = useCallback(async () => {
  if (!result) return;
  setFixing(true);
  setFixError("");
  setFixedCode(null);
  try {
    const data = await fixCode({
      code: result.code,
      issues: result.issues,
      language: result.language,
    });
    setFixedCode(data.fixedCode);
  } catch (err) {
    setFixError(
      err instanceof Error ? err.message : "Fix failed. Try again."
    );
  } finally {
    setFixing(false);
  }
}, [result]);

// Keyboard shortcut: Cmd+Enter or Ctrl+Enter triggers analysis.
// Simple English: instead of having to click the button,
// developers can press Ctrl+Enter (Windows) or Cmd+Enter (Mac)
// to analyze — just like running code in VS Code or CodeSandbox.
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    const isMac = navigator.platform.toUpperCase().includes("MAC");
    const modifier = isMac ? e.metaKey : e.ctrlKey;
    if (modifier && e.key === "Enter") {
      e.preventDefault();
      runAnalysis();
    }
  };

  window.addEventListener("keydown", handleKeyDown);
  return () => window.removeEventListener("keydown", handleKeyDown);
}, [runAnalysis]);

  return {
    // State
    code,
    result,
    loading,
    error,
    language,
    mode,
    typedSummary,
    displayScore,
    history,
    resultRef,
    fixedCode,
    fixing,
    fixError,
    // Actions
    setLanguage,
    setMode,
    handleCodeChange,
    runAnalysis,
    loadFromHistory,
    clearHistory,
    runFix,
  };
}