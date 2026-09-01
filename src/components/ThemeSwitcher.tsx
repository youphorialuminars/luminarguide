'use client';

import React, { useEffect, useState } from 'react';

const THEMES = [
  { id: 'violet', label: 'Light', from: '#16212C', to: '#A67E33' },
  { id: 'teal-dark', label: 'Dark', from: '#141312', to: '#E6C065' },
];

export default function ThemeSwitcher() {
  const [active, setActive] = useState('violet');

  useEffect(() => {
    const saved = localStorage.getItem('luminarsguide-theme');
    const theme = saved && THEMES.some((t) => t.id === saved) ? saved : 'violet';
    document.documentElement.setAttribute('data-theme', theme);
    setActive(theme);
  }, []);

  const applyTheme = (id) => {
    document.documentElement.setAttribute('data-theme', id);
    localStorage.setItem('luminarsguide-theme', id);
    setActive(id);
  };

  return (
    <div className="flex items-center gap-1.5" role="group" aria-label="Choose color theme">
      {THEMES.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => applyTheme(t.id)}
          aria-label={t.label}
          aria-pressed={active === t.id}
          title={t.label}
          className="w-6 h-6 rounded-full border-2 transition-transform hover:scale-110"
          style={{
            background: `linear-gradient(135deg, ${t.from}, ${t.to})`,
            borderColor: active === t.id ? 'var(--foreground)' : 'transparent',
          }}
        />
      ))}
    </div>
  );
}