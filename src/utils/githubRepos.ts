// Loads a user's public repositories from the GitHub REST API (no token, nothing secret in the client).
// One request per visit: a successful response is cached in sessionStorage for CACHE_TTL_MS.

export interface Repository {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  pushed_at: string;
  topics: string[];
  fork: boolean;
  archived: boolean;
}

export type RepoErrorKind = 'rate-limit' | 'network';

export class RepoError extends Error {
  constructor(readonly kind: RepoErrorKind) {
    super(kind);
  }
}

const CACHE_TTL_MS = 10 * 60 * 1000;

interface CacheEntry {
  savedAt: number;
  repos: Repository[];
}

function readCache(key: string): Repository[] | null {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    const entry = JSON.parse(raw) as CacheEntry;
    return Date.now() - entry.savedAt < CACHE_TTL_MS && Array.isArray(entry.repos) ? entry.repos : null;
  } catch {
    return null; // storage unavailable or corrupt entry
  }
}

function writeCache(key: string, repos: Repository[]): void {
  try {
    sessionStorage.setItem(key, JSON.stringify({ savedAt: Date.now(), repos } satisfies CacheEntry));
  } catch {
    // storage full or disabled: the cache is only an optimisation
  }
}

/** Keeps only the fields the UI uses (smaller cache entry). */
function slim(r: Repository): Repository {
  return {
    id: r.id,
    name: r.name,
    description: r.description,
    html_url: r.html_url,
    homepage: r.homepage || null,
    stargazers_count: r.stargazers_count,
    forks_count: r.forks_count,
    language: r.language,
    pushed_at: r.pushed_at,
    topics: r.topics ?? [],
    fork: r.fork,
    archived: r.archived,
  };
}

/**
 * Resolves with the user's repositories, most recently pushed first.
 * Rejects with RepoError('rate-limit' | 'network'); an aborted request rejects with the AbortError.
 */
export async function loadRepos(username: string, signal: AbortSignal): Promise<Repository[]> {
  const key = `gh-repos:${username}`;
  const cached = readCache(key);
  if (cached) return cached;

  let response: Response;
  try {
    response = await fetch(`https://api.github.com/users/${username}/repos?sort=pushed&per_page=100`, { signal });
  } catch (error) {
    if (signal.aborted) throw error;
    throw new RepoError('network');
  }
  if (response.status === 403 || response.status === 429) throw new RepoError('rate-limit');
  if (!response.ok) throw new RepoError('network');

  let data: Repository[];
  try {
    data = ((await response.json()) as Repository[]).map(slim);
  } catch (error) {
    if (signal.aborted) throw error;
    throw new RepoError('network');
  }
  data.sort((a, b) => Date.parse(b.pushed_at) - Date.parse(a.pushed_at));
  writeCache(key, data);
  return data;
}

const LANGUAGE_COLORS: Record<string, string> = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  Java: '#b07219',
  'C++': '#f34b7d',
  'C#': '#178600',
  PHP: '#4F5D95',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Shell: '#89e051',
};

export const languageColor = (language: string): string => LANGUAGE_COLORS[language] ?? '#8b949e';
