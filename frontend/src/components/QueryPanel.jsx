import { useState } from 'react';

export default function QueryPanel({ onAsk, asking }) {
  const [question, setQuestion] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    if (!question.trim()) return;
    onAsk(question.trim());
  }

  return (
    <form onSubmit={handleSubmit} className="panel p-4 sm:p-5 space-y-3">
      <h2 className="font-display text-lg font-medium text-[var(--ink)]">Ask the archive</h2>
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="What did I save about…?"
          className="field flex-1"
        />
        <button type="submit" disabled={asking} className="btn-primary text-sm w-full sm:w-auto">
          {asking ? 'Searching…' : 'Ask'}
        </button>
      </div>
    </form>
  );
}