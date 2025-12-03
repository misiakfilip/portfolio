import React, { useState, useEffect } from 'react';
import { Search, Star, GitFork, ExternalLink, Code, Calendar, Filter, X } from 'lucide-react';

interface Repository {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
  topics: string[];
}

const GitHubPortfolio = () => {
  const USERNAME = 'misiakfilip';
  const [repos, setRepos] = useState<Repository[]>([]);
  const [filteredRepos, setFilteredRepos] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null);
  const [readme, setReadme] = useState('');
  const [loadingReadme, setLoadingReadme] = useState(false);

  useEffect(() => {
    fetchRepositories();
  }, []);

  useEffect(() => {
    filterRepositories();
  }, [searchTerm, selectedLanguage, repos]);

  const fetchRepositories = async () => {
    try {
      const response = await fetch(
        `https://api.github.com/users/${USERNAME}/repos?sort=updated&per_page=100`
      );
      
      if (!response.ok) throw new Error('Nie udało się pobrać repozytoriów');
      
      const data: Repository[] = await response.json();
      
      const sortedRepos = data.sort((a, b) => 
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      );
      
      setRepos(sortedRepos);
      setFilteredRepos(sortedRepos);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nieznany błąd');
      setLoading(false);
    }
  };

  const fetchReadme = async (repo: Repository) => {
    setLoadingReadme(true);
    try {
      const response = await fetch(
        `https://api.github.com/repos/${USERNAME}/${repo.name}/readme`,
        {
          headers: {
            Accept: 'application/vnd.github.v3.raw',
          },
        }
      );
      
      if (response.ok) {
        const readmeText = await response.text();
        setReadme(readmeText);
      } else {
        setReadme('# Brak README\n\nTo repozytorium nie zawiera pliku README.');
      }
    } catch (err) {
      setReadme('# Błąd\n\nNie udało się załadować README.');
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

    if (selectedLanguage !== 'all') {
      filtered = filtered.filter(repo => repo.language === selectedLanguage);
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
      C: '#555555',
      Ruby: '#701516',
      Go: '#00ADD8',
      Rust: '#dea584',
      PHP: '#4F5D95',
      Swift: '#ffac45',
      Kotlin: '#A97BFF',
      Dart: '#00B4AB',
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
    return date.toLocaleDateString('pl-PL', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="py-20 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
          <p className="mt-4 text-white text-xl">Ładowanie repozytoriów...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-20 flex items-center justify-center">
        <div className="text-center text-red-400">
          <p className="text-xl">Błąd: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Moje Projekty
          </h2>
          <p className="text-xl text-purple-200">
            {repos.length} {repos.length === 1 ? 'repozytorium' : 'repozytoriów'}
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Szukaj projektów..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-purple-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="pl-10 pr-8 py-3 bg-slate-800 border border-purple-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none cursor-pointer"
            >
              {getUniqueLanguages().map(lang => (
                <option key={lang} value={lang}>
                  {lang === 'all' ? 'Wszystkie języki' : lang}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results count */}
        <p className="text-purple-200 mb-6">
          Znaleziono: {filteredRepos.length} {filteredRepos.length === 1 ? 'projekt' : 'projektów'}
        </p>

        {/* Repository Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRepos.map(repo => (
            <div
              key={repo.id}
              className="bg-slate-800 border border-purple-500/30 rounded-lg p-6 hover:border-purple-500 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 cursor-pointer transform hover:-translate-y-1"
              onClick={() => openRepoModal(repo)}
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                  <Code size={20} className="text-purple-400" />
                  {repo.name}
                </h3>
              </div>

              <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                {repo.description || 'Brak opisu'}
              </p>

              <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
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
                  <Star size={16} />
                  <span>{repo.stargazers_count}</span>
                </div>
                <div className="flex items-center gap-1">
                  <GitFork size={16} />
                  <span>{repo.forks_count}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Calendar size={14} />
                <span>Zaktualizowano: {formatDate(repo.updated_at)}</span>
              </div>

              {repo.topics && repo.topics.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {repo.topics.slice(0, 3).map(topic => (
                    <span
                      key={topic}
                      className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredRepos.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">
              Nie znaleziono repozytoriów spełniających kryteria.
            </p>
          </div>
        )}

        {/* Modal */}
        {selectedRepo && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={closeModal}>
            <div 
              className="bg-slate-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden border border-purple-500"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="bg-slate-900 p-6 border-b border-purple-500/30">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                      {selectedRepo.name}
                    </h2>
                    <p className="text-gray-300">{selectedRepo.description}</p>
                  </div>
                  <button
                    onClick={closeModal}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="flex items-center gap-4 mt-4 text-sm">
                  {selectedRepo.language && (
                    <div className="flex items-center gap-1 text-gray-300">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: getLanguageColor(selectedRepo.language) }}
                      ></span>
                      <span>{selectedRepo.language}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1 text-gray-300">
                    <Star size={16} />
                    <span>{selectedRepo.stargazers_count} stars</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-300">
                    <GitFork size={16} />
                    <span>{selectedRepo.forks_count} forks</span>
                  </div>
                  <a
                    href={selectedRepo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-purple-400 hover:text-purple-300 transition-colors ml-auto"
                  >
                    <ExternalLink size={16} />
                    <span>Zobacz na GitHub</span>
                  </a>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                {loadingReadme ? (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
                    <p className="mt-4 text-gray-400">Ładowanie README...</p>
                  </div>
                ) : (
                  <div className="prose prose-invert prose-purple max-w-none">
                    <pre className="whitespace-pre-wrap text-gray-300 font-mono text-sm bg-slate-900 p-4 rounded-lg">
                      {readme}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GitHubPortfolio;