export default function AnswerDisplay({ result, error }) {
  if (error) {
    return (
      <div className="panel p-4 text-sm break-words" style={{ background: 'var(--danger-soft)', borderColor: 'var(--danger-line)', color: 'var(--danger)' }}>
        {error}
      </div>
    );
  }

  if (!result) return null;

  return (
    <div className="panel p-4 sm:p-5 space-y-4">
      <h2 className="font-display text-lg font-medium text-[var(--ink)]">Answer</h2>
      <p className="text-sm text-[var(--ink)] leading-relaxed whitespace-pre-wrap">{result.answer}</p>

      {result.sources.length > 0 && (
        <div className="pt-3" style={{ borderTop: '1px solid var(--line)' }}>
          <h3 className="font-mono text-[0.65rem] tracking-widest uppercase text-[var(--ink-muted)] mb-2.5">
            Cited sources
          </h3>
          <ul className="space-y-2">
            {result.sources.map((s, i) => (
              <li key={s.label} className="citation-tab flex gap-3">
                <span className="citation-number shrink-0">{i + 1}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1 mb-1">
                    <span className="source-pill">{s.sourceType}</span>
                    <span className="font-mono text-[0.65rem] text-[var(--ink-muted)]">
                      relevance {s.score}
                    </span>
                  </div>
                  {s.sourceUrl && (
                    <div className="text-xs text-[var(--ink-muted)] truncate mb-1">{s.sourceUrl}</div>
                  )}
                  <p className="text-xs text-[var(--ink)] leading-snug">{s.snippet}…</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}