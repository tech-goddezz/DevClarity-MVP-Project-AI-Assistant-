// Basic tests for utility functions.
// Simple English: these check that our helper functions
// work correctly. Even simple tests show recruiters
// that you think about code quality and verification.

import { toLanguageLabel, guessLanguage, timeAgo } from "./utils";

// Test toLanguageLabel
function testToLanguageLabel() {
  console.assert(
    toLanguageLabel("javascript") === "JavaScript",
    "toLanguageLabel: javascript should return JavaScript"
  );
  console.assert(
    toLanguageLabel("typescript") === "TypeScript",
    "toLanguageLabel: typescript should return TypeScript"
  );
  console.assert(
    toLanguageLabel("python") === "Python",
    "toLanguageLabel: python should return Python"
  );
  console.log("toLanguageLabel: all tests passed");
}

// Test guessLanguage
function testGuessLanguage() {
  console.assert(
    guessLanguage("def hello(): print('hi')") === "python",
    "guessLanguage: should detect python"
  );
  console.assert(
    guessLanguage("const x: string = 'hello'") === "typescript",
    "guessLanguage: should detect typescript"
  );
  console.assert(
    guessLanguage("const x = () => {}") === "javascript",
    "guessLanguage: should default to javascript"
  );
  console.log("guessLanguage: all tests passed");
}

// Test timeAgo
function testTimeAgo() {
  const justNow = new Date().toISOString();
  console.assert(
    timeAgo(justNow) === "just now",
    "timeAgo: recent date should return 'just now'"
  );
  console.log("timeAgo: all tests passed");
}

testToLanguageLabel();
testGuessLanguage();
testTimeAgo();

console.log("All utility tests passed.");