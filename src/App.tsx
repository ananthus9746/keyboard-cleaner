import { useCallback, useEffect, useState } from 'react'

function formatKeyLabel(e: KeyboardEvent): string {
  if (e.key === ' ') return 'Space'
  if (e.key.length === 1) return e.key.toUpperCase()
  return e.key
}

function KeyboardIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M7 14h10" />
    </svg>
  )
}

function LockIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M7 11V8a5 5 0 0 1 10 0v3" />
    </svg>
  )
}

function UnlockIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M7 11V8a5 5 0 0 1 9.9-1" />
    </svg>
  )
}

function SunIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  )
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

function AppleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  )
}

function WindowsIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M3 5.55 10.5 4.45v6.9H3V5.55zm7.5-.93L21 3v8.1h-10.5V4.62zM21 12.9v8.1l-10.5-1.47V12.9H21zM10.5 19.53 3 18.45v-5.55h7.5v6.63z" />
    </svg>
  )
}

const THEME_STORAGE_KEY = 'keyboard-cleaner-theme'

type Theme = 'light' | 'dark'

function readStoredTheme(): Theme {
  try {
    const v = localStorage.getItem(THEME_STORAGE_KEY)
    if (v === 'light' || v === 'dark') return v
  } catch {
    /* ignore */
  }
  return 'light'
}

export default function App() {
  const [theme, setTheme] = useState<Theme>(readStoredTheme)
  const isDark = theme === 'dark'

  const [frozen, setFrozen] = useState(true)
  const [keysCleaned, setKeysCleaned] = useState(0)
  const [lastKey, setLastKey] = useState('—')
  /** Draws attention to cleaning / lock on first visit; stops after timeout or first click. */
  const [showLockEntryHighlight, setShowLockEntryHighlight] = useState(true)

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!frozen) return
      e.preventDefault()
      e.stopPropagation()
      setKeysCleaned((n) => n + 1)
      setLastKey(formatKeyLabel(e))
    },
    [frozen],
  )

  useEffect(() => {
    if (!frozen) return
    window.addEventListener('keydown', onKeyDown, true)
    return () => window.removeEventListener('keydown', onKeyDown, true)
  }, [frozen, onKeyDown])

  useEffect(() => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme)
    } catch {
      /* ignore */
    }
  }, [theme])

  useEffect(() => {
    if (!showLockEntryHighlight) return
    const id = window.setTimeout(() => setShowLockEntryHighlight(false), 10_000)
    return () => window.clearTimeout(id)
  }, [showLockEntryHighlight])

  const shell = isDark
    ? 'min-h-full bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100'
    : 'min-h-full bg-gradient-to-b from-slate-50 via-white to-slate-100 text-slate-900'

  const card = isDark
    ? 'rounded-2xl border border-slate-700/80 bg-slate-900/60 shadow-xl shadow-black/20 backdrop-blur-sm'
    : 'rounded-2xl border border-slate-200/90 bg-white/90 shadow-xl shadow-slate-300/40 backdrop-blur-sm'

  const muted = isDark ? 'text-slate-400' : 'text-slate-600'

  const tipCard = isDark
    ? 'rounded-xl border border-slate-700/60 bg-slate-800/40 p-4'
    : 'rounded-xl border border-slate-200 bg-slate-50/80 p-4'

  const themeBtn = isDark
    ? 'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-600 bg-slate-800 text-amber-300 transition hover:bg-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-400'
    : 'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500'

  const statusOn = isDark
    ? 'inline-flex items-center gap-2 rounded-full border border-teal-500/40 bg-teal-950/50 px-3 py-1 text-xs font-medium text-teal-300'
    : 'inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-medium text-teal-800'

  const statusOff = isDark
    ? 'inline-flex items-center gap-2 rounded-full border border-amber-500/35 bg-amber-950/40 px-3 py-1 text-xs font-medium text-amber-200'
    : 'inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-900'

  const primaryBtn = isDark
    ? 'flex w-full max-w-xs flex-col items-center justify-center gap-3 rounded-2xl border border-teal-500/50 bg-teal-600 px-6 py-8 text-white shadow-lg shadow-teal-900/30 transition hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-300 active:scale-[0.99] sm:py-10'
    : 'flex w-full max-w-xs flex-col items-center justify-center gap-3 rounded-2xl border border-teal-600/30 bg-teal-600 px-6 py-8 text-white shadow-lg shadow-teal-900/15 transition hover:bg-teal-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 active:scale-[0.99] sm:py-10'

  const secondaryBtn = isDark
    ? 'flex w-full max-w-xs flex-col items-center justify-center gap-3 rounded-2xl border border-slate-600 bg-slate-800 px-6 py-8 text-slate-100 shadow-inner transition hover:bg-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400 active:scale-[0.99] sm:py-10'
    : 'flex w-full max-w-xs flex-col items-center justify-center gap-3 rounded-2xl border border-slate-300 bg-white px-6 py-8 text-slate-800 shadow-sm transition hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400 active:scale-[0.99] sm:py-10'

  const statBorder = isDark ? 'border-slate-700' : 'border-slate-200'
  const monoKey = isDark ? 'font-mono text-sm text-teal-300' : 'font-mono text-sm text-teal-700'

  const sectionLabel = isDark ? 'text-slate-400' : 'text-slate-500'
  const footerBorder = isDark ? 'border-slate-700/50' : 'border-slate-200/50'

  return (
    <div className={`relative flex flex-col items-stretch px-4 py-8 pb-12 font-sans sm:px-6 sm:py-10 ${shell}`}>
      <div className="mx-auto flex w-full max-w-xl flex-col gap-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <div
              className={
                isDark
                  ? 'flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-teal-500/15 text-teal-400'
                  : 'flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-teal-100 text-teal-700'
              }
            >
              <KeyboardIcon className="h-7 w-7" />
            </div>
            <div>
              <p className={`text-xs font-semibold uppercase tracking-widest ${muted}`}>
                Browser tool
              </p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
                Keyboard cleaner
              </h1>
              <p className={`mt-2 max-w-md text-sm leading-relaxed ${muted}`}>
                Catch stray key presses in this tab while you wipe crumbs or dust. Click
                anywhere on the page first so the window is focused—then use cleaning mode.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
            className={themeBtn}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? (
              <SunIcon className="h-5 w-5" />
            ) : (
              <MoonIcon className="h-5 w-5" />
            )}
          </button>
        </header>

        <section className={`${card} p-6 sm:p-8`}>
          <div className="flex flex-col items-center text-center">
            <span className={frozen ? statusOn : statusOff} role="status">
              <span
                className={`h-2 w-2 rounded-full ${frozen ? 'bg-teal-400' : 'bg-amber-400'}`}
                aria-hidden
              />
              {frozen ? 'Cleaning mode on — keys absorbed here' : 'Cleaning mode off — keys type normally'}
            </span>

            <p className={`mt-4 text-sm leading-relaxed ${muted}`}>
              {frozen
                ? 'Safe to wipe your keyboard. Press keys freely; they will not type into other fields on this page.'
                : 'Your keyboard works as usual again. Turn cleaning mode back on before the next wipe.'}
            </p>

            <div className="mt-8 flex w-full flex-col items-center gap-3">
              <div
                className={
                  frozen && showLockEntryHighlight
                    ? 'animate-lock-entry w-full max-w-xs rounded-2xl'
                    : 'w-full max-w-xs rounded-2xl'
                }
              >
                <button
                  type="button"
                  onClick={() => {
                    setShowLockEntryHighlight(false)
                    setFrozen((f) => !f)
                  }}
                  className={frozen ? primaryBtn : secondaryBtn}
                  aria-pressed={frozen}
                  aria-label={frozen ? 'Turn off cleaning mode (unlock keyboard)' : 'Turn on cleaning mode (lock for cleaning)'}
                >
                {frozen ? (
                  <LockIcon className="h-12 w-12 sm:h-14 sm:w-14" />
                ) : (
                  <UnlockIcon className="h-12 w-12 sm:h-14 sm:w-14" />
                )}
                <span className="text-base font-semibold">
                  {frozen ? 'Turn off cleaning mode' : 'Turn on cleaning mode'}
                </span>
                <span
                  className={`text-xs font-normal ${
                    frozen
                      ? 'text-white/85'
                      : isDark
                        ? 'text-slate-400'
                        : 'text-slate-600'
                  }`}
                >
                  {frozen ? 'When you are done wiping' : 'Before you start wiping'}
                </span>
                </button>
              </div>
            </div>

            <div className={`mt-10 w-full border-t pt-8 ${statBorder}`}>
              <p className="text-4xl font-semibold tabular-nums tracking-tight sm:text-5xl">
                {keysCleaned}
              </p>
              <p className={`mt-1 text-xs font-semibold uppercase tracking-widest ${muted}`}>
                Keys caught this session
              </p>
              <p className={`mt-4 ${monoKey}`}>Last key: {lastKey}</p>
            </div>
          </div>
        </section>

        <section aria-labelledby="platform-tips-heading">
          <h2
            id="platform-tips-heading"
            className={`text-sm font-semibold uppercase tracking-widest ${sectionLabel}`}
          >
            On your computer
          </h2>
          <p className={`mt-2 text-sm ${muted}`}>
            This page runs in your browser on both Apple macOS and Microsoft Windows—the
            steps below help you get a smooth, predictable clean on each system.
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <article className={tipCard}>
              <div className="flex items-center gap-2">
                <AppleIcon
                  className={isDark ? 'h-5 w-5 text-slate-300' : 'h-5 w-5 text-slate-700'}
                  aria-hidden
                />
                <h3 className="text-sm font-bold">Apple macOS</h3>
              </div>
              <ul className={`mt-3 list-inside list-disc space-y-2 text-sm leading-relaxed ${muted}`}>
                <li>Use Safari, Chrome, or Firefox—keep this tab active and click the page so it has focus.</li>
                <li>
                  Full-screen the window (green button) if you want fewer accidental clicks
                  away from this tab.
                </li>
                <li>
                  If you use Sticky Keys or other Keyboard accessibility features, they still
                  apply system-wide; this tool only handles keys while you are here.
                </li>
              </ul>
            </article>
            <article className={tipCard}>
              <div className="flex items-center gap-2">
                <WindowsIcon
                  className={isDark ? 'h-5 w-5 text-sky-300' : 'h-5 w-5 text-sky-600'}
                  aria-hidden
                />
                <h3 className="text-sm font-bold">Microsoft Windows</h3>
              </div>
              <ul className={`mt-3 list-inside list-disc space-y-2 text-sm leading-relaxed ${muted}`}>
                <li>Edge or Chrome work well—click inside this page before cleaning so keys register here.</li>
                <li>
                  If keys still reach other apps, another window may be focused; click this tab
                  again and confirm cleaning mode is on.
                </li>
                <li>
                  Sticky Keys (five Shift presses) and Filter Keys can change how keys behave;
                  turn them off in Settings → Accessibility → Keyboard if they get in the way.
                </li>
              </ul>
            </article>
          </div>
        </section>

        <footer className={`flex flex-col items-center gap-4 border-t pt-8 ${footerBorder}`}>
          <a
            href="https://www.buymeacoffee.com"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-5 py-3 text-sm font-semibold text-slate-900 shadow-md transition hover:bg-amber-300"
          >
            <span aria-hidden>☕</span>
            Buy me a coffee
          </a>
          <p className={`text-center text-xs ${muted}`}>
            Works offline after load. No keys are sent to a server.
          </p>
        </footer>
      </div>
    </div>
  )
}
