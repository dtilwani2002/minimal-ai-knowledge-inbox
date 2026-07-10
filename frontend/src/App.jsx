import { useEffect, useState } from 'react';
import { api } from './api/client';
import AddItemForm from './components/AddItemForm';
import ItemsList from './components/ItemsList';
import QueryPanel from './components/QueryPanel';
import AnswerDisplay from './components/AnswerDisplay';

function getInitialTheme() {
  const saved = localStorage.getItem('theme');
  if (saved === 'light' || saved === 'dark') return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export default function App() {
  const [theme, setTheme] = useState(getInitialTheme);
  const [items, setItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(true);
  const [result, setResult] = useState(null);
  const [asking, setAsking] = useState(false);
  const [queryError, setQueryError] = useState(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  async function refreshItems() {
    setLoadingItems(true);
    try {
      const data = await api.listItems();
      setItems(data.items);
    } finally {
      setLoadingItems(false);
    }
  }

  useEffect(() => { refreshItems(); }, []);

  async function handleAdd(type, content) {
    await api.ingest(type, content);
    await refreshItems();
  }

  async function handleDelete(id) {
    await api.deleteItem(id);
    await refreshItems();
  }

  async function handleAsk(question) {
    setAsking(true);
    setQueryError(null);
    setResult(null);
    try {
      const data = await api.query(question);
      setResult(data);
    } catch (err) {
      setQueryError(err.message);
    } finally {
      setAsking(false);
    }
  }

  return (
    <div className="min-h-screen py-8 sm:py-12 px-3 sm:px-4">
      <div className="max-w-2xl mx-auto space-y-4 sm:space-y-5">
        <header className="flex items-start justify-between gap-3 mb-6 sm:mb-8">
          <div className="min-w-0">
            <p className="font-mono text-[0.65rem] sm:text-[0.7rem] tracking-widest uppercase text-[var(--ink-muted)] mb-1">
              Personal Archive · Local RAG
            </p>
            <h1 className="font-display text-3xl sm:text-4xl font-semibold text-[var(--ink)]">
              Knowledge Inbox
            </h1>
            <p className="text-sm text-[var(--ink-muted)] mt-1.5">
              Save notes and links. Ask questions. Get answers traced back to source.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
            className="theme-toggle"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>
        </header>

        <AddItemForm onAdded={handleAdd} />
        <ItemsList items={items} loading={loadingItems} onDelete={handleDelete} />
        <QueryPanel onAsk={handleAsk} asking={asking} />
        <AnswerDisplay result={result} error={queryError} />
      </div>
    </div>
  );
}