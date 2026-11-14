// src/components/GitHubRepos.tsx
// Island (client:visible). Renders a fixed-height skeleton on the server and until the data arrives,
// so the section does not shift the layout; errors (rate limit, network) are shown in the UI.
import { useEffect, useMemo, useRef, useState } from 'react';
import { Search, Star, GitFork, Code, Calendar, Filter } from 'lucide-react';
import type { Dictionary, Lang } from '../i18n';
import { format } from '../i18n/format';
import { RepoError, languageColor, loadRepos, type Repository, type RepoErrorKind } from '../utils/githubRepos';
import { RepoModal } from './RepoModal';

interface GitHubReposProps {
  username: string;
  /** Curated repo names (config.pinnedRepos), shown first in the given order. */
  pinned: string[];
  lang: Lang;
  labels: Dictionary['repos'];
}

type LoadState =
  | { status: 'loading' }
  | { status: 'error'; kind: RepoErrorKind }
  | { status: 'ready'; repos: Repository[] };

const PAGE_SIZE = 6;
const CARD_HEIGHT = 'h-60'; // fixed, so skeleton and real cards have identical height
const GRID = 'grid md:grid-cols-2 lg:grid-cols-3 gap-6';

const GitHubRepos = ({ username, pinned, lang, labels }: GitHubReposProps) => {
  const [state, setState] = useState<LoadState>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);
  const [search, setSearch] = useState('');
  const [languageFilter, setLanguageFilter] = useState('all');
  const [includeForks, setIncludeForks] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [selected, setSelected] = useState<Repository | null>(null);
  // Safari does not focus a button on click, so the dialog could not restore focus itself.
  const opener = useRef<HTMLElement | null>(null);
  const openRepo = (repo: Repository, trigger: HTMLElement) => {
    opener.current = trigger;
    setSelected(repo);
  };
  const closeRepo = () => {
    setSelected(null);
    opener.current?.focus();
  };

  // One request per visit (plus one per explicit retry); aborted on unmount.
  useEffect(() => {
    const controller = new AbortController();
    loadRepos(username, controller.signal).then(
      (repos) => setState({ status: 'ready', repos }),
      (error: unknown) => {
        if (controller.signal.aborted) return;
        setState({ status: 'error', kind: error instanceof RepoError ? error.kind : 'network' });
      },
    );
    return () => controller.abort();
  }, [username, attempt]);

  const repos = state.status === 'ready' ? state.repos : [];
  const hasForks = repos.some((r) => r.fork);

  const pinnedRepos = useMemo(
    () => pinned.map((name) => repos.find((r) => r.name === name)).filter((r): r is Repository => r !== undefined),
    [pinned, repos],
  );
  const languages = useMemo(
    () => [...new Set(repos.map((r) => r.language).filter((l): l is string => l !== null))].sort(),
    [repos],
  );
  const showPinned = pinnedRepos.length > 0 && search === '' && languageFilter === 'all';
  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase();
    const pinnedNames = new Set(showPinned ? pinnedRepos.map((r) => r.name) : []);
    return repos.filter(
      (r) =>
        (includeForks || !r.fork) &&
        !pinnedNames.has(r.name) &&
        (languageFilter === 'all' || r.language === languageFilter) &&
        (needle === '' || r.name.toLowerCase().includes(needle) || (r.description ?? '').toLowerCase().includes(needle)),
    );
  }, [repos, pinnedRepos, showPinned, search, languageFilter, includeForks]);

  const retry = () => {
    setState({ status: 'loading' });
    setAttempt((n) => n + 1);
  };

  if (state.status === 'loading') return <ReposSkeleton pinnedCount={pinned.length} labels={labels} />;

  if (state.status === 'error') {
    return (
      <div role="alert" className="max-w-xl mx-auto text-center py-10">
        <p className="text-lg text-body mb-6">
          {state.kind === 'rate-limit' ? labels.errorRateLimit : labels.errorNetwork}
        </p>
        <button
          type="button"
          onClick={retry}
          className={`px-6 py-3 bg-purple-700 hover:bg-purple-800 text-white rounded-lg font-semibold transition-colors`}
        >
          {labels.retry}
        </button>
      </div>
    );
  }

  const dateFormat = new Intl.DateTimeFormat(lang === 'pl' ? 'pl-PL' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div>
      {showPinned && (
        <div className="mb-16">
          <h3 className="text-2xl md:text-3xl font-bold text-fg mb-8 text-center">{labels.pinnedTitle}</h3>
          <ul className={`${GRID} list-none`}>
            {pinnedRepos.map((repo) => (
              <li key={repo.id}>
                <RepoCard repo={repo} onOpen={openRepo} labels={labels} dateFormat={dateFormat} badge />
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <h3 className="text-2xl md:text-3xl font-bold text-fg mb-6 text-center">{labels.allTitle}</h3>

        <div className="mb-4 flex flex-col md:flex-row gap-4 max-w-4xl mx-auto">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={20} aria-hidden="true" />
            <input
              type="search"
              placeholder={labels.search}
              aria-label={labels.search}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setVisibleCount(PAGE_SIZE);
              }}
              className={`w-full h-12 pl-10 pr-4 bg-card backdrop-blur-md border border-line rounded-lg text-fg placeholder:text-muted`}
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={20} aria-hidden="true" />
            <select
              value={languageFilter}
              aria-label={labels.filterByLanguage}
              onChange={(e) => {
                setLanguageFilter(e.target.value);
                setVisibleCount(PAGE_SIZE);
              }}
              className="h-12 w-full pl-10 pr-8 bg-white dark:bg-slate-800 border border-line rounded-lg text-fg appearance-none cursor-pointer"
            >
              <option value="all">{labels.allLanguages}</option>
              {languages.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="h-8 mb-4 flex items-center justify-center gap-6 text-muted">
          <p aria-live="polite">{format(labels.found, { count: filtered.length })}</p>
          {hasForks && (
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeForks}
                onChange={(e) => setIncludeForks(e.target.checked)}
                className="size-4 accent-purple-600"
              />
              {labels.includeForks}
            </label>
          )}
        </div>

        {filtered.length === 0 ? (
          <p className="text-center py-12 text-lg text-muted">{labels.noResults}</p>
        ) : (
          <ul className={`${GRID} list-none`}>
            {filtered.slice(0, visibleCount).map((repo) => (
              <li key={repo.id}>
                <RepoCard repo={repo} onOpen={openRepo} labels={labels} dateFormat={dateFormat} />
              </li>
            ))}
          </ul>
        )}

        {filtered.length > visibleCount && (
          <div className="text-center mt-8">
            <button
              type="button"
              onClick={() => setVisibleCount((n) => n + PAGE_SIZE)}
              className={`px-6 py-3 border-2 border-accent text-accent hover:bg-chip rounded-lg font-semibold transition-colors`}
            >
              {labels.showMore}
            </button>
          </div>
        )}
      </div>

      {selected && (
        <RepoModal username={username} repo={selected} labels={labels} onClose={closeRepo} />
      )}
    </div>
  );
};

interface RepoCardProps {
  repo: Repository;
  onOpen: (repo: Repository, trigger: HTMLElement) => void;
  labels: Dictionary['repos'];
  dateFormat: Intl.DateTimeFormat;
  badge?: boolean;
}

const RepoCard = ({ repo, onOpen, labels, dateFormat, badge }: RepoCardProps) => (
  <article
    className={`relative ${CARD_HEIGHT} overflow-hidden bg-card backdrop-blur-md rounded-lg p-6 border border-line hover:border-accent-2 hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-300 has-[button:focus-visible]:outline-2 has-[button:focus-visible]:outline-accent-2 ${badge ? 'ring-2 ring-accent-2' : ''}`}
  >
    <div className="flex items-start justify-between gap-2 mb-3">
      <h4 className="text-xl font-semibold text-fg flex items-center gap-2 flex-1 min-w-0">
        <Code size={20} className="text-accent shrink-0" aria-hidden="true" />
        {/* Stretched button: the whole card is clickable and keyboard-operable. */}
        <button
          type="button"
          onClick={(e) => onOpen(repo, e.currentTarget)}
          aria-haspopup="dialog"
          className="truncate text-left cursor-pointer after:absolute after:inset-0 focus-visible:outline-none"
        >
          {repo.name}
        </button>
      </h4>
      {badge && (
        <span className="text-xs bg-chip border border-line text-chip-fg px-2 py-1 rounded-full shrink-0">
          {labels.pinnedBadge}
        </span>
      )}
    </div>

    <p className="text-body text-sm mb-4 line-clamp-2 min-h-10">
      {repo.description || labels.noDescription}
    </p>

    <div className="flex items-center gap-4 text-sm text-muted mb-4">
      {repo.language && (
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: languageColor(repo.language) }}></span>
          <span>{repo.language}</span>
        </div>
      )}
      <div className="flex items-center gap-1">
        <Star size={14} aria-hidden="true" />
        <span>{repo.stargazers_count}</span>
      </div>
      <div className="flex items-center gap-1">
        <GitFork size={14} aria-hidden="true" />
        <span>{repo.forks_count}</span>
      </div>
    </div>

    <div className="flex items-center gap-2 text-xs text-muted mb-4">
      <Calendar size={14} aria-hidden="true" />
      <span>
        {labels.updated}: {dateFormat.format(new Date(repo.pushed_at))}
      </span>
    </div>

    {repo.topics.length > 0 && (
      <ul className="flex flex-wrap gap-2 list-none max-h-7 overflow-hidden">
        {repo.topics.slice(0, 3).map((topic) => (
          <li key={topic} className="px-2 py-1 bg-chip text-chip-fg text-xs rounded-full">
            {topic}
          </li>
        ))}
      </ul>
    )}
  </article>
);

/** Placeholder with the same geometry as the loaded state. Also the server-rendered output. */
const ReposSkeleton = ({ pinnedCount, labels }: { pinnedCount: number; labels: Dictionary['repos'] }) => (
  <div aria-busy="true" role="status">
    <span className="sr-only">{labels.loading}</span>
    {pinnedCount > 0 && (
      <div className="mb-16" aria-hidden="true">
        <div className="h-9 mb-8"></div>
        <div className={GRID}>
          {Array.from({ length: pinnedCount }, (_, i) => (
            <div key={i} className={`${CARD_HEIGHT} rounded-lg bg-card border border-line motion-safe:animate-pulse`}></div>
          ))}
        </div>
      </div>
    )}
    <div aria-hidden="true">
      <div className="h-9 mb-6"></div>
      <div className="h-12 mb-4 max-w-4xl mx-auto rounded-lg bg-card"></div>
      <div className="h-8 mb-4"></div>
      <div className={GRID}>
        {Array.from({ length: PAGE_SIZE }, (_, i) => (
          <div key={i} className={`${CARD_HEIGHT} rounded-lg bg-card border border-line motion-safe:animate-pulse`}></div>
        ))}
      </div>
    </div>
  </div>
);

export default GitHubRepos;
