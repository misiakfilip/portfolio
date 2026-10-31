// src/components/RepoModal.tsx
// README modal. TODO(Z-15): native <dialog>, sanitised Markdown (marked + DOMPurify), focus handling.
import { Star, GitFork, ExternalLink, Eye, X } from 'lucide-react';
import type { Dictionary } from '../i18n';
import { languageColor, type Repository } from '../utils/githubRepos';

export const renderMarkdown = (text: string): string => {
  let html = text;

  // Headers
  html = html.replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold text-white mt-6 mb-3">$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold text-white mt-8 mb-4">$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold text-white mt-8 mb-4">$1</h1>');

  // Bold
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-purple-400">$1</strong>');
  html = html.replace(/__(.*?)__/g, '<strong class="font-bold text-purple-400">$1</strong>');

  // Italic
  html = html.replace(/\*(.*?)\*/g, '<em class="italic text-gray-300">$1</em>');
  html = html.replace(/_(.*?)_/g, '<em class="italic text-gray-300">$1</em>');

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-purple-400 hover:text-purple-300 underline">$1</a>');

  // Images
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto rounded-lg my-4 border border-purple-500/30" />');

  // Code blocks
  html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre class="bg-slate-950 rounded-lg p-4 my-4 overflow-x-auto border border-purple-500/30"><code class="text-sm text-gray-300">$2</code></pre>');

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code class="bg-slate-950 px-2 py-1 rounded text-purple-400 text-sm">$1</code>');

  // Lists
  html = html.replace(/^\* (.+)$/gim, '<li class="ml-6 mb-2 text-gray-300 list-disc">$1</li>');
  html = html.replace(/^- (.+)$/gim, '<li class="ml-6 mb-2 text-gray-300 list-disc">$1</li>');
  html = html.replace(/^\d+\. (.+)$/gim, '<li class="ml-6 mb-2 text-gray-300 list-decimal">$1</li>');

  // Wrap consecutive list items in ul/ol
  html = html.replace(/(<li class="ml-6 mb-2 text-gray-300 list-disc">.*?<\/li>\n?)+/g, '<ul class="my-4">$&</ul>');
  html = html.replace(/(<li class="ml-6 mb-2 text-gray-300 list-decimal">.*?<\/li>\n?)+/g, '<ol class="my-4">$&</ol>');

  // Blockquotes
  html = html.replace(/^> (.+)$/gim, '<blockquote class="border-l-4 border-purple-500 pl-4 py-2 my-4 text-gray-400 italic">$1</blockquote>');

  // Horizontal rules
  html = html.replace(/^---$/gim, '<hr class="my-6 border-purple-500/30" />');

  // Line breaks
  html = html.replace(/\n\n/g, '</p><p class="text-gray-300 mb-4">');
  html = '<p class="text-gray-300 mb-4">' + html + '</p>';

  return html;
};


interface RepoModalProps {
  repo: Repository;
  readme: string;
  loadingReadme: boolean;
  onClose: () => void;
  labels: Dictionary['repos'];
}

export const RepoModal = ({ 
  repo, 
  readme, 
  loadingReadme, 
  onClose, 
  labels,
}: RepoModalProps) => (
  <div 
    className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50" 
    onClick={onClose}
  >
    <div 
      className="bg-white/10 dark:bg-white/10 backdrop-blur-xl rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden border-2 border-cyan-500 shadow-2xl"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Modal Header */}
      <div className="bg-white/5 dark:bg-white/5 backdrop-blur-md p-6 border-b border-white/10">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {repo.name}
            </h2>
            {repo.description && (
              <p className="text-gray-700 dark:text-gray-300">{repo.description}</p>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label={labels.close}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white transition-colors ml-4"
          >
            <X size={24} aria-hidden="true" />
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-4 mt-4 text-sm">
          {repo.language && (
            <div className="flex items-center gap-1 text-gray-700 dark:text-gray-300">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: languageColor(repo.language) }}
              ></span>
              <span>{repo.language}</span>
            </div>
          )}
          <div className="flex items-center gap-1 text-gray-700 dark:text-gray-300">
            <Star size={16} />
            <span>{repo.stargazers_count} {labels.stars}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-700 dark:text-gray-300">
            <GitFork size={16} />
            <span>{repo.forks_count} {labels.forks}</span>
          </div>
          
          <div className="ml-auto flex gap-3">
            {repo.homepage && (
              <a
                href={repo.homepage}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
              >
                <ExternalLink size={16} />
                <span>{labels.liveDemo}</span>
              </a>
            )}
            <a
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
            >
              <Eye size={16} />
              <span>{labels.viewOnGitHub}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Modal Content */}
      <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)] bg-white/5 dark:bg-white/5 backdrop-blur-md">
        {loadingReadme ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">{labels.loadingReadme}</p>
          </div>
        ) : (
          <div 
            className="prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(readme) }}
          />
        )}
      </div>
    </div>
  </div>
);

