import { useState } from 'react';

export default function AddItemForm({ onAdded }) {
  const [type, setType] = useState('note');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!content.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      await onAdded(type, content.trim());
      setContent('');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="panel p-4 sm:p-5 space-y-3.5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-display text-lg font-medium text-[var(--ink)]">Add to inbox</h2>
        <div className="flex gap-1.5">
          <button
            type="button"
            data-active={type === 'note'}
            onClick={() => setType('note')}
            className="tab-btn"
          >
            Note
          </button>
          <button
            type="button"
            data-active={type === 'url'}
            onClick={() => setType('url')}
            className="tab-btn"
          >
            URL
          </button>
        </div>
      </div>

      {type === 'note' ? (
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write or paste a note…"
          rows={4}
          className="field"
        />
      ) : (
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="https://example.com/article"
          className="field"
        />
      )}

      {error && (
        <div className="font-mono text-xs px-3 py-2 rounded break-words" style={{ background: 'var(--danger-soft)', color: 'var(--danger)' }}>
          {error}
        </div>
      )}

      <button type="submit" disabled={submitting} className="btn-primary text-sm w-full sm:w-auto">
        {submitting ? 'Adding…' : 'Add to inbox'}
      </button>
    </form>
  );
}