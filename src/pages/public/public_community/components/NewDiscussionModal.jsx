import React, { useState, useEffect, useRef } from 'react';
import { FiX, FiCheck } from 'react-icons/fi';

const categories = [
  'All posts',
  'Player',
  'Players',
  'Club Owners',
  'Service Providers',
  'Community & Support',
];

export default function NewDiscussionModal({ open, onClose, onSubmit }) {
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [category, setCategory] = useState(categories[0]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const containerRef = useRef(null);

  useEffect(() => {
    if (open) {
      setCategory(false);
      setTitle('');
      setDescription('');
      setCategory(categories[0]);
    }
  }, [open]);

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose?.();
    }
    if (open) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const handleSubmit = () => {
    // basic validation
    if (!title.trim() || !description.trim()) return;
    onSubmit?.({ category, title, description });
    onClose?.();
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose?.(); }}
      ref={containerRef}
    >
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg border border-gray-200 p-6 relative">
        <button
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
          onClick={onClose}
          aria-label="Close"
        >
          <FiX />
        </button>

        <h3 className="text-lg font-semibold">Start a Discussion</h3>
        <p className="text-base text-gray-500 mt-1 mb-4">Ask a question or share something with the community.</p>

        <div className="space-y-3">
          <div>
            <label className="text-base font-medium block mb-1">Category</label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setCategoryOpen((s) => !s)}
                className="w-full text-left bg-gray-100 rounded-md p-3 flex items-center justify-between"
              >
                <span className="text-base text-gray-700">{category}</span>
                <svg className="h-4 w-4 text-gray-600" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {categoryOpen && (
                <ul className="absolute left-0 right-0 mt-2 bg-gray-50 border border-gray-200 rounded-md overflow-hidden z-10">
                  {categories.map((c) => (
                    <li
                      key={c}
                      className={`flex items-center justify-between px-3 py-2 text-base cursor-pointer ${c === category ? 'bg-btn-primary text-white' : 'text-gray-700'}`}
                      onClick={() => { setCategory(c); setCategoryOpen(false); }}
                    >
                      <span>{c}</span>
                      {c === category && <FiCheck />}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div>
            <label className="text-base font-medium block mb-1">Thread Tittle</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Write tittle"
              className="w-full bg-gray-100 rounded-md p-3 text-base"
            />
          </div>

          <div>
            <label className="text-base font-medium block mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write description"
              className="w-full bg-gray-100 rounded-md p-3 text-base h-32 resize-none"
            />
          </div>

          <div>
            <button
              type="button"
              onClick={handleSubmit}
              className="w-full bg-btn-primary text-white rounded-md p-3 text-center"
            >
              Post a thread
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
