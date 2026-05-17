type ScoreRingProps = {
  displayScore: number;
};

function getScoreColors(score: number) {
  if (score >= 8) {
    return { start: "#22c55e", end: "#10b981" };
  }
  if (score >= 6) {
    return { start: "#f59e0b", end: "#f97316" };
  }
  if (score >= 4) {
    return { start: "#f97316", end: "#ef4444" };
  }
  return { start: "#ef4444", end: "#dc2626" };
}

export function ScoreRing({ displayScore }: ScoreRingProps) {
  const scorePercentage = (displayScore / 10) * 100;
  const colors = getScoreColors(displayScore);

  return (
    <div
      className="relative w-24 h-24"
      role="img"
      aria-label={`Code quality score: ${displayScore} out of 10`}
    >
      <svg className="w-24 h-24 rotate-[-90deg]" aria-hidden="true">
        <circle
          cx="48"
          cy="48"
          r="40"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="8"
          fill="transparent"
        />
        <circle
          cx="48"
          cy="48"
          r="40"
          stroke="url(#score-gradient)"
          strokeWidth="8"
          fill="transparent"
          strokeDasharray={251}
          strokeDashoffset={251 - (251 * scorePercentage) / 100}
          strokeLinecap="round"
          className="score-ring-fill"
        />
        <defs>
          <linearGradient id="score-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={colors.start} />
            <stop offset="100%" stopColor={colors.end} />
          </linearGradient>
        </defs>
      </svg>

      <div className="absolute inset-0 flex items-center justify-center flex-col">
        <span className="text-2xl font-bold">{displayScore}</span>
        <span className="text-xs text-slate-400">/10</span>
      </div>
    </div>
  );
}