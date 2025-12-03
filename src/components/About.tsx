// src/components/About.tsx
import React from 'react';
import { Briefcase } from 'lucide-react';

interface Experience {
  period: string;
  title: string;
  company: string;
  description: string;
  technologies: string[];
}

interface AboutProps {
  experience: Experience[];
  language: 'pl' | 'en';
}

const About: React.FC<AboutProps> = ({ experience, language }) => {
  const t = {
    title: { pl: 'O mnie & Doświadczenie', en: 'About Me & Experience' },
    subtitle: { 
      pl: 'Moja droga w świecie programowania', 
      en: 'My journey in the world of programming' 
    },
  };

  return (
    <section id="about" className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {t.title[language]}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            {t.subtitle[language]}
          </p>
        </div>
        
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-linear-to-b from-purple-500 via-cyan-400 to-transparent transform md:-translate-x-1/2 shadow-lg shadow-purple-500/50"></div>

          <div className="space-y-12">
            {experience.map((exp, index) => (
              <div
                key={index}
                className={`relative flex flex-col md:flex-row gap-8 ${
                  index % 2 === 0 ? 'md:flex-row-reverse' : ''
                }`}
              >
                {/* Timeline Dot */}
                <div className="absolute left-8 md:left-1/2 transform md:-translate-x-1/2 w-4 h-4 rounded-full bg-purple-600 border-4 border-white dark:border-slate-900 z-10"></div>

                {/* Content */}
                <div className={`flex-1 ml-20 md:ml-0 ${index % 2 === 0 ? 'md:text-right md:pr-12' : 'md:pl-12'}`}>
                  <div className="bg-white/10 dark:bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-lg border border-white/10 hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-300 hover:-translate-y-1">
                    {/* Period Badge */}
                    <div className={`inline-block px-4 py-1 bg-purple-500/20 border border-purple-500/30 text-purple-300 rounded-full text-sm font-semibold mb-4 backdrop-blur-sm`}>
                      {exp.period}
                    </div>

                    {/* Title & Company */}
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                      <Briefcase size={24} className="text-purple-600 dark:text-purple-400" />
                      {exp.title}
                    </h3>
                    <p className="text-lg text-purple-600 dark:text-purple-400 font-semibold mb-3">
                      {exp.company}
                    </p>

                    {/* Description */}
                    <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                      {exp.description}
                    </p>

                    {/* Technologies */}
                    <div className={`flex flex-wrap gap-2 ${index % 2 === 0 ? 'md:justify-end' : ''}`}>
                      {exp.technologies.map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className="px-3 py-1 bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-gray-200 rounded-full text-sm font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Spacer for alternating layout */}
                <div className="hidden md:block flex-1"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;