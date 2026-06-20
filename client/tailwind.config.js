/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Theme-aware semantic tokens (reference CSS variables)
        'th-base':        'var(--bg-base)',
        'th-card':        'var(--bg-card)',
        'th-card-hover':  'var(--bg-card-hover)',
        'th-elevated':    'var(--bg-elevated)',
        'th-input':       'var(--bg-input)',
        'th-nav':         'var(--bg-nav)',
        'th-pill':        'var(--bg-pill)',
        'th-pill-active': 'var(--bg-pill-active)',
        'th-accent':      'var(--accent-bg)',
        'th-accent-text': 'var(--accent-text)',
        'th-glass':       'var(--glass-bg)',
      },
      textColor: {
        'th-primary':   'var(--text-primary)',
        'th-secondary': 'var(--text-secondary)',
        'th-muted':     'var(--text-muted)',
        'th-dimmed':    'var(--text-dimmed)',
        'th-inverted':  'var(--text-inverted)',
      },
      borderColor: {
        'th-main':        'var(--border-main)',
        'th-subtle':      'var(--border-subtle)',
        'th-input':       'var(--border-input)',
        'th-input-focus': 'var(--border-input-focus)',
      },
      boxShadowColor: {
        'th-glow': 'var(--accent-glow)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}