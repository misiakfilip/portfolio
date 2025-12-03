// src/components/GitHubRepos.tsx
import React, { useState, useEffect } from 'react';
import { Search, Star, GitFork, Code, Calendar, Filter, ExternalLink, Eye, X } from 'lucide-react';

interface Repository {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
  topics: string[];
}

interface GitHubReposProps {
  username: string;
  language: 'pl' | 'en';
}

const GitHubRepos: React.FC<GitHubReposProps> = ({ username, language }) => {
  const [repos, setRepos] = useState<Repository[]>([]);
  const [pinnedRepos, setPinnedRepos] = useState<Repository[]>([]);
  const [filteredRepos, setFilteredRepos] = useState<Repository[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null);
  const [readme, setReadme] = useState('');
  const [loadingReadme, setLoadingReadme] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguageFilter, setSelectedLanguageFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRepositories();
  }, []);

  useEffect(() => {
    filterRepositories();
  }, [searchTerm, selectedLanguageFilter, repos]);

  const fetchRepositories = async () => {
    try {
      const response = await fetch(
        `https://api.github.com/users/${username}/repos?sort=updated&per_page=100`
      );
      
      if (!response.ok) throw new Error('Failed to fetch repositories');
      
      const data: Repository[] = await response.json();
      
      const sortedRepos = data.sort((a, b) => 
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      );
      
      setRepos(sortedRepos);
      setFilteredRepos(sortedRepos);

      // Pinned repos (top 6 by stars)
      const pinned = [...data]
        .sort((a, b) => b.stargazers_count - a.stargazers_count)
        .slice(0, 6);
      setPinnedRepos(pinned);
      
      setLoading(false);
    } catch (err) {
      console.error('GitHub fetch error:', err);
      setLoading(false);
    }
  };

  const fetchReadme = async (repo: Repository) => {
    setLoadingReadme(true);
    try {
      const response = await fetch(
        `https://api.github.com/repos/${username}/${repo.name}/readme`,
        {
          headers: { Accept: 'application/vnd.github.v3.raw' },
        }
      );
      
      if (response.ok) {
        const text = await response.text();
        setReadme(text);
      } else {
        setReadme(language === 'pl' 
          ? '# Brak README\n\nTo repozytorium nie zawiera pliku README.' 
          : '# No README\n\nThis repository does not contain a README file.');
      }
    } catch (err) {
      setReadme(language === 'pl' 
        ? '# Błąd\n\nNie udało się załadować README.' 
        : '# Error\n\nFailed to load README.');
    }
    setLoadingReadme(false);
  };

  const filterRepositories = () => {
    let filtered = repos;

    if (searchTerm) {
      filtered = filtered.filter(repo =>
        repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (repo.description && repo.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedLanguageFilter !== 'all') {
      filtered = filtered.filter(repo => repo.language === selectedLanguageFilter);
    }

    setFilteredRepos(filtered);
  };

  const getUniqueLanguages = (): string[] => {
    const languages = repos
      .map(repo => repo.language)
      .filter((lang): lang is string => lang !== null);
    return ['all', ...new Set(languages)];
  };

  const getLanguageColor = (language: string): string => {
    const colors: { [key: string]: string } = {
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
    return colors[language] || '#8b949e';
  };

  const openRepoModal = (repo: Repository) => {
    setSelectedRepo(repo);
    setReadme('');
    fetchReadme(repo);
  };

  const closeModal = () => {
    setSelectedRepo(null);
    setReadme('');
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'pl' ? 'pl-PL' : 'en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const renderMarkdown = (text: string): string => {
    let html = text;
    html = html.replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold text-white mt-6 mb-3">$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold text-white mt-8 mb-4">$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold text-white mt-8 mb-4">$1</h1>');
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-purple-400">$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em class="italic text-gray-300">$1</em>');
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" class="text-purple-400 hover:text-purple-300 underline">$1</a>');
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto rounded-lg my-4 border border-purple-500/30" />');
    html = html.replace(/```[\s\S]*?```/g, (match) => {
      const code = match.replace(/```\w*\n?/g, '').trim();
      return `<pre class="bg-slate-950 rounded-lg p-4 my-4 overflow-x-auto border border-purple-500/30"><code class="text-sm text-gray-300">${code}</code></pre>`;
    });
    html = html.replace(/`([^`]+)`/g, '<code class="bg-slate-950 px-2 py-1 rounded text-purple-400 text-sm">$1</code>');
    html = html.replace(/^\* (.+)$/gim, '<li class="ml-6 mb-2 text-gray-300 list-disc">$1</li>');
    html = html.replace(/^- (.+)$/gim, '<li class="ml-6 mb-2 text-gray-300 list-disc">$1</li>');
    html = html.replace(/^> (.+)$/gim, '<blockquote class="border-l-4 border-purple-500 pl-4 py-2 my-4 text-gray-400 italic">$1</blockquote>');
    html = html.replace(/\n\n/g, '<br/><br/>');
    return html;
  };

  const t = {
    pinnedTitle: { pl: 'Przypięte Repozytoria', en: 'Pinned Repositories' },
    allTitle: { pl: 'Wszystkie Projekty GitHub', en: 'All GitHub Projects' },
    search: { pl: 'Szukaj projektów...', en: 'Search projects...' },
    allLanguages: { pl: 'Wszystkie języki', en: 'All languages' },
    found: { pl: 'Znaleziono', en: 'Found' },
    projects: { pl: 'projektów', en: 'projects' },
    updated: { pl: 'Zaktualizowano', en: 'Updated' },
    viewOnGitHub: { pl: 'Zobacz na GitHub', en: 'View on GitHub' },
    liveDemo: { pl: 'Demo', en: 'Live Demo' },
    loadingReadme: { pl: 'Ładowanie README...', en: 'Loading README...' },
    noDescription: { pl: 'Brak opisu', en: 'No description' },
  };

  if (loading) {
    return (
      <div className="py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
          <p className="mt-4 text-gray-900 dark:text-white text-xl">Loading repositories...</p>
        </div>
      </div>
    );
  }

  return (
    <section id="projects" className="py-20 px-6 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        
        {/* Pinned Repositories */}
        {pinnedRepos.length > 0 && (
          <div className="mb-20">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              {t.pinnedTitle[language]}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pinnedRepos.map(repo => (
                <RepoCard
                  key={repo.id}
                  repo={repo}
                  onOpen={openRepoModal}
                  getLanguageColor={getLanguageColor}
                  formatDate={formatDate}
                  t={t}
                  isPinned
                />
              ))}
            </div>
          </div>
        )}

        {/* All Repositories */}
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 text-center">
            {t.allTitle[language]}
          </h2>

          {/* Search and Filter */}
          <div className="mb-8 flex flex-col md:flex-row gap-4 max-w-4xl mx-auto">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder={t.search[language]}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 dark:bg-white/10 backdrop-blur-md border border-white/10 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <select
                value={selectedLanguageFilter}
                onChange={(e) => setSelectedLanguageFilter(e.target.value)}
                className="pl-10 pr-8 py-3 bg-white dark:bg-slate-800 border border-gray-300 dark:border-purple-500 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none cursor-pointer"
              >
                {getUniqueLanguages().map(lang => (
                  <option key={lang} value={lang}>
                    {lang === 'all' ? t.allLanguages[language] : lang}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results count */}
          <p className="text-gray-600 dark:text-gray-400 mb-6 text-center">
            {t.found[language]}: {filteredRepos.length} {t.projects[language]}
          </p>

          {/* Repository Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRepos.map(repo => (
              <RepoCard
                key={repo.id}
                repo={repo}
                onOpen={openRepoModal}
                getLanguageColor={getLanguageColor}
                formatDate={formatDate}
                t={t}
              />
            ))}
          </div>

          {filteredRepos.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                {language === 'pl' 
                  ? 'Nie znaleziono repozytoriów spełniających kryteria.' 
                  : 'No repositories found matching the criteria.'}
              </p>
            </div>
          )}
        </div>

        {/* Modal */}
        {selectedRepo && (
          <RepoModal
            repo={selectedRepo}
            readme={readme}
            loadingReadme={loadingReadme}
            onClose={closeModal}
            renderMarkdown={renderMarkdown}
            getLanguageColor={getLanguageColor}
            t={t}
          />
        )}
      </div>
    </section>
  );
};

// RepoCard Component
interface RepoCardProps {
  repo: Repository;
  onOpen: (repo: Repository) => void;
  getLanguageColor: (lang: string) => string;
  formatDate: (date: string) => string;
  t: any;
  isPinned?: boolean;
}

const RepoCard: React.FC<RepoCardProps> = ({ repo, onOpen, getLanguageColor, formatDate, t, isPinned }) => (
  <div
    onClick={() => onOpen(repo)}
    className={`bg-white/10 dark:bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/10 hover:border-cyan-500 hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-300 cursor-pointer ${isPinned ? 'ring-2 ring-cyan-500' : ''}`}
  >
    <div className="flex items-start justify-between mb-3">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2 flex-1">
        <Code size={20} className="text-purple-600 dark:text-purple-400 shrink-0" />
        <span className="truncate">{repo.name}</span>
      </h3>
      {isPinned && (
        <span className="text-xs bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 px-2 py-1 rounded-full backdrop-blur-sm">
          ⭐ Pinned
        </span>
      )}
    </div>

    {/* <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 line-clamp-2 min-h-[2.5rem]">
      {repo.description || t.noDescription[language || 'en']}
    </p> */}

    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
      {repo.language && (
        <div className="flex items-center gap-1">
          <span
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: getLanguageColor(repo.language) }}
          ></span>
          <span>{repo.language}</span>
        </div>
      )}
      <div className="flex items-center gap-1">
        <Star size={14} />
        <span>{repo.stargazers_count}</span>
      </div>
      <div className="flex items-center gap-1">
        <GitFork size={14} />
        <span>{repo.forks_count}</span>
      </div>
    </div>

    {/* <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500 mb-4">
      <Calendar size={14} />
      <span>{t.updated[language || 'en']}: {formatDate(repo.updated_at)}</span>
    </div> */}

    {repo.topics && repo.topics.length > 0 && (
      <div className="flex flex-wrap gap-2">
        {repo.topics.slice(0, 3).map(topic => (
          <span
            key={topic}
            className="px-2 py-1 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 text-xs rounded-full"
          >
            {topic}
          </span>
        ))}
      </div>
    )}
  </div>
);

// RepoModal Component
interface RepoModalProps {
  repo: Repository;
  readme: string;
  loadingReadme: boolean;
  onClose: () => void;
  renderMarkdown: (text: string) => string;
  getLanguageColor: (lang: string) => string;
  t: any;
}

const RepoModal: React.FC<RepoModalProps> = ({ 
  repo, 
  readme, 
  loadingReadme, 
  onClose, 
  renderMarkdown, 
  getLanguageColor, 
  t 
}) => (
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
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white transition-colors ml-4"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-4 mt-4 text-sm">
          {repo.language && (
            <div className="flex items-center gap-1 text-gray-700 dark:text-gray-300">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: getLanguageColor(repo.language) }}
              ></span>
              <span>{repo.language}</span>
            </div>
          )}
          <div className="flex items-center gap-1 text-gray-700 dark:text-gray-300">
            <Star size={16} />
            <span>{repo.stargazers_count} stars</span>
          </div>
          <div className="flex items-center gap-1 text-gray-700 dark:text-gray-300">
            <GitFork size={16} />
            <span>{repo.forks_count} forks</span>
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
                <span>{t.liveDemo}</span>
              </a>
            )}
            <a
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
            >
              <Eye size={16} />
              <span>{t.viewOnGitHub}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Modal Content */}
      <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)] bg-white/5 dark:bg-white/5 backdrop-blur-md">
        {loadingReadme ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">{t.loadingReadme}</p>
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

export default GitHubRepos;