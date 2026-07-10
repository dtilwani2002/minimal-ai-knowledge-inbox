import { useState } from 'react';

export default function ItemsList({ items, loading, onDelete }) {
  const [deletingId, setDeletingId] = useState(null);

  async function handleDelete(id) {
    setDeletingId(id);
    try {
      await onDelete(id);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="panel p-4 sm:p-5">
      <div className="flex items-baseline justify-between mb-3">
        <h2 className="font-display text-lg font-medium text-[var(--ink)]">Saved items</h2>
        <span className="font-mono text-xs text-[var(--ink-muted)]">
          {items.length} {items.length === 1 ? 'entry' : 'entries'}
        </span>
      </div>

      {loading && <p className="text-sm text-[var(--ink-muted)]">Loading…</p>}

      {!loading && items.length === 0 && (
        <p className="text-sm text-[var(--ink-muted)] italic">
          Nothing here yet — add a note or URL above to start building your archive.
        </p>
      )}

      <ul className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
        {items.map((item) => (
          <li key={item.id} className="index-card">
            <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1 mb-1">
              <div className="flex items-center gap-2 min-w-0 flex-wrap">
                <span className="source-pill">{item.sourceType}</span>
                {item.sourceType === 'url' && (
                  <span className="text-xs text-[var(--ink-muted)] truncate max-w-[220px] sm:max-w-xs">
                    {item.sourceUrl}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="font-mono text-[0.65rem] text-[var(--ink-muted)] whitespace-nowrap">
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  disabled={deletingId === item.id}
                  aria-label={`Delete this ${item.sourceType}`}
                  className="text-[var(--ink-muted)] hover:text-[var(--danger)] disabled:opacity-50 transition-colors"
                >
                  {deletingId === item.id ? (
                    <span className="font-mono text-[0.65rem]">removing…</span>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            <p className="text-sm text-[var(--ink)] leading-snug line-clamp-2">{item.rawContent}</p>
            <span className="font-mono text-[0.65rem] text-[var(--ink-muted)]">
              {item.chunkCount} chunk{item.chunkCount === 1 ? '' : 's'}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}