// src/components/RepoModal.tsx
// README modal on a native <dialog>: showModal() provides the focus trap, Escape and inert page;
// closing restores focus to the card that opened it. The README is fetched (AbortController) and
// rendered by renderReadme, which is loaded with import() only when a modal opens.
import { useEffect, useRef, useState } from 'react';
import { Star, GitFork, ExternalLink, Eye, X } from 'lucide-react';
import type { Dictionary } from '../i18n';
import { languageColor, type Repository } from '../utils/githubRepos';

interface RepoModalProps {
  username: string;
  repo: Repository;
  labels: Dictionary['repos'];
  onClose: () => void;
}

type ReadmeState = { status: 'loading' } | { status: 'ready'; html: string } | { status: 'missing' | 'error' };

export const RepoModal = ({ username, repo, labels, onClose }: RepoModalProps) => {
  const dialog = useRef<HTMLDialogElement>(null);
  const [readme, setReadme] = useState<ReadmeState>({ status: 'loading' });

  // Open as a modal and lock page scroll while open.
  useEffect(() => {
    const element = dialog.current!;
    element.showModal();
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = 'hidden';
    return () => {
      root.style.overflow = previousOverflow;
      if (element.open) element.close();
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    setReadme({ status: 'loading' });
    (async () => {
      try {
        const response = await fetch(`https://api.github.com/repos/${username}/${repo.name}/readme`, {
          headers: { Accept: 'application/vnd.github.v3.raw' },
          signal: controller.signal,
        });
        if (!response.ok) return setReadme({ status: 'missing' });
        const markdown = await response.text();
        const { renderReadme } = await import('../utils/renderReadme');
        if (!controller.signal.aborted) setReadme({ status: 'ready', html: renderReadme(markdown, username, repo.name) });
      } catch {
        if (!controller.signal.aborted) setReadme({ status: 'error' });
      }
    })();
    return () => controller.abort();
  }, [username, repo.name]);

  return (
    <dialog
      ref={dialog}
      aria-labelledby="repo-modal-title"
      onClose={onClose}
      // A click on the backdrop targets the <dialog> itself (its content fills the box).
      onClick={(e) => e.target === e.currentTarget && e.currentTarget.close()}
      className="m-auto w-[calc(100%-2rem)] max-w-4xl max-h-[90dvh] p-0 flex-col overflow-hidden rounded-xl border-2 border-accent-2 bg-white dark:bg-slate-900 text-body shadow-2xl backdrop:bg-black/70 backdrop:backdrop-blur-sm open:flex"
    >
      <div className="p-6 border-b border-line">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h2 id="repo-modal-title" className="text-2xl font-bold text-fg mb-2 wrap-break-word">
              {repo.name}
            </h2>
            {repo.description && <p className="text-body">{repo.description}</p>}
          </div>
          <button
            type="button"
            onClick={() => dialog.current?.close()}
            aria-label={labels.close}
            className="shrink-0 p-2 -m-2 rounded-lg text-muted hover:text-fg transition-colors"
          >
            <X size={24} aria-hidden="true" />
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-4 mt-4 text-sm">
          {repo.language && (
            <div className="flex items-center gap-1 text-body">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: languageColor(repo.language) }}></span>
              <span>{repo.language}</span>
            </div>
          )}
          <div className="flex items-center gap-1 text-body">
            <Star size={16} aria-hidden="true" />
            <span>{repo.stargazers_count} {labels.stars}</span>
          </div>
          <div className="flex items-center gap-1 text-body">
            <GitFork size={16} aria-hidden="true" />
            <span>{repo.forks_count} {labels.forks}</span>
          </div>

          <div className="ml-auto flex gap-4">
            {repo.homepage && (
              <a href={repo.homepage} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-accent hover:underline">
                <ExternalLink size={16} aria-hidden="true" />
                <span>{labels.liveDemo}</span>
              </a>
            )}
            <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-accent hover:underline">
              <Eye size={16} aria-hidden="true" />
              <span>{labels.viewOnGitHub}</span>
            </a>
          </div>
        </div>
      </div>

      <div className="p-6 overflow-y-auto min-h-0 flex-1" aria-busy={readme.status === 'loading'}>
        {readme.status === 'loading' && (
          <div role="status" className="text-center py-8">
            <div className="inline-block motion-safe:animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent"></div>
            <p className="mt-4 text-muted">{labels.loadingReadme}</p>
          </div>
        )}
        {readme.status === 'ready' && <div className="readme" dangerouslySetInnerHTML={{ __html: readme.html }} />}
        {(readme.status === 'missing' || readme.status === 'error') && (
          <p className="text-muted">{readme.status === 'missing' ? labels.readmeMissing : labels.readmeError}</p>
        )}
      </div>
    </dialog>
  );
};
