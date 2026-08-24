import React, { useEffect, useRef, useState } from 'react';
import { apiGetATSScore, ATSScoreResponse } from '@/api/client';
import { Loader2, ShieldCheck } from 'lucide-react';

interface ATSScoreWidgetProps {
  resumeData: unknown;
}

/**
 * Displays a live ATS compatibility score and missing keyword hints.
 * Debounces API calls by 1.5 s after each resume change.
 */
export const ATSScoreWidget: React.FC<ATSScoreWidgetProps> = ({ resumeData }) => {
  const [result, setResult] = useState<ATSScoreResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!resumeData) return;

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await apiGetATSScore(resumeData);
        setResult(res.data);
      } catch {
        // silently ignore ATS fetch errors — don't block the builder
      } finally {
        setLoading(false);
      }
    }, 1500);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [resumeData]);

  const score = result?.score ?? null;

  // Colour band: red < 40, amber < 70, green >= 70
  const gaugeColour =
    score === null ? 'bg-muted/20' : score >= 70 ? 'bg-emerald-500' : score >= 40 ? 'bg-amber-500' : 'bg-red-500';

  const scoreLabel =
    score === null ? '—' : score >= 70 ? 'Good' : score >= 40 ? 'Fair' : 'Needs work';

  return (
    <div className="mx-2 my-3 rounded-xl border border-line bg-canvas p-3 space-y-3">
      {/* Header */}
      <div className="flex items-center gap-1.5">
        <ShieldCheck className="h-3.5 w-3.5 text-brand shrink-0" />
        <p className="text-[11px] font-bold text-muted uppercase tracking-wider">ATS Score</p>
        {loading && <Loader2 className="h-3 w-3 animate-spin text-muted ml-auto" />}
      </div>

      {/* Gauge bar */}
      <div>
        <div className="flex items-end justify-between mb-1">
          <span className="text-2xl font-black text-ink">{score !== null ? score : '—'}</span>
          <span className="text-[10px] text-muted font-semibold">{scoreLabel}</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-muted/20 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${gaugeColour}`}
            style={{ width: score !== null ? `${score}%` : '0%' }}
          />
        </div>
        <p className="text-[10px] text-muted mt-0.5">out of 100</p>
      </div>

      {/* Missing keywords */}
      {result && result.recommendations.length > 0 && (
        <div>
          <p className="text-[10px] font-semibold text-muted uppercase tracking-wider mb-1">Missing keywords</p>
          <ul className="space-y-0.5">
            {result.recommendations.slice(0, 6).map((kw) => (
              <li key={kw} className="text-[11px] text-muted flex items-center gap-1.5">
                <span className="inline-block h-1 w-1 rounded-full bg-muted/50 shrink-0" />
                {kw}
              </li>
            ))}
            {result.recommendations.length > 6 && (
              <li className="text-[10px] text-muted/60 italic">
                +{result.recommendations.length - 6} more…
              </li>
            )}
          </ul>
        </div>
      )}

      {result && result.recommendations.length === 0 && (
        <p className="text-[11px] text-emerald-600 font-semibold">All key ATS terms found ✓</p>
      )}
    </div>
  );
};

