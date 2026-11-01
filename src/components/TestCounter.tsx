import React, { useState } from 'react';
import { triggerCompletionConfetti } from '../lib/confetti';

export function TestCounter() {
  const [count, setCount] = useState(0);

  const handleIncrement = () => {
    const next = count + 1;
    setCount(next);
    if (next % 5 === 0) {
      triggerCompletionConfetti();
    }
  };

  return (
    <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/60 flex flex-col items-center gap-3 max-w-sm">
      <span className="text-sm font-medium text-neutral-400">Interactive Island Test</span>
      <span className="text-2xl font-bold text-neutral-100">{count}</span>
      <button
        type="button"
        onClick={handleIncrement}
        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-medium rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900"
      >
        Increment (Confetti at 5)
      </button>
    </div>
  );
}

export default TestCounter;

