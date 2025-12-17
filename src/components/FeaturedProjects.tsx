// src/components/FeaturedProjects.tsx
import React from 'react';
import { ExternalLink, Github, Code } from 'lucide-react';

interface FeaturedProject {
  title: string;
  description: string;
  image?: string;
  technologies: string[];
  demoUrl?: string;
  githubUrl?: string;
  slug?: string;              // ← DODAJ
  hasDetailPage?: boolean; 
  featured: boolean;
}

interface FeaturedProjectsProps {
  projects: FeaturedProject[];
  language: 'pl' | 'en';
}

const FeaturedProjects: React.FC<FeaturedProjectsProps> = ({ projects, language }) => {
  const t = {
    title: { pl: 'Wyróżnione Projekty', en: 'Featured Projects' },
    subtitle: { 
      pl: 'Wybrane projekty, nad którymi pracowałem', 
      en: 'Selected projects I\'ve worked on' 
    },
    demo: { pl: 'Demo', en: 'Demo' },
    github: { pl: 'GitHub', en: 'GitHub' },
  };

  if (projects.length === 0) return null;

  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {t.title[language]}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            {t.subtitle[language]}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <div
              key={index}
              className="bg-white/10 dark:bg-white/10 backdrop-blur-md rounded-xl overflow-hidden shadow-lg border border-white/10 hover:shadow-2xl hover:shadow-cyan-500/20 hover:-translate-y-2 transition-all duration-300"
            >
              {/* Project Image */}
              <div className="relative h-56 overflow-hidden bg-linear-to-br from-purple-600 to-cyan-400">
                {project.image ? (
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Code size={80} className="text-white/30" />
                  </div>
                )}
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent"></div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  {project.title}
                </h3>
                
                <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                  {project.description}
                </p>

                {/* Technologies */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.technologies.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 text-purple-300 rounded-full text-sm font-medium backdrop-blur-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Links */}
                  <div className="flex gap-4">
                    {project.hasDetailPage && project.slug ? (
                      <a
                        href={`/portfolio/projects/${project.slug}`}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium"
                      >
                        <ExternalLink size={18} />
                        {language === 'pl' ? 'Zobacz więcej' : 'Learn more'}
                      </a>
                    ) : (
                      <>
                        {project.demoUrl && (
                          <a
                            href={project.demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium"
                          >
                            <ExternalLink size={18} />
                            {t.demo[language]}
                          </a>
                        )}
                        
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 border-2 border-purple-600 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors font-medium"
                          >
                            <Github size={18} />
                            {t.github[language]}
                          </a>
                        )}
                      </>
                    )}
                  </div>
                {/* <div className="flex gap-4">
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium"
                    >
                      <ExternalLink size={18} />
                      {t.demo[language]}
                    </a>
                  )}
                  
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 border-2 border-purple-600 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors font-medium"
                    >
                      <Github size={18} />
                      {t.github[language]}
                    </a>
                  )}
                </div> */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProjects;