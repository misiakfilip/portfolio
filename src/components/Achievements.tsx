// src/components/Achievements.tsx
import React from 'react';
import { Award, Calendar, Building } from 'lucide-react';

interface Achievement {
  title: string;
  issuer: string;
  date: string;
  icon: string;
}

interface AchievementsProps {
  achievements: Achievement[];
  language: 'pl' | 'en';
}

const Achievements: React.FC<AchievementsProps> = ({ achievements, language }) => {
  const t = {
    title: { pl: 'Osiągnięcia & Certyfikaty', en: 'Achievements & Certificates' },
    subtitle: { 
      pl: 'Zdobyte certyfikaty i ukończone kursy', 
      en: 'Earned certificates and completed courses' 
    },
  };

  if (achievements.length === 0) return null;

  return (
    <section id="experience" className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {t.title[language]}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            {t.subtitle[language]}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((achievement, index) => (
            <div
              key={index}
              className="bg-white/10 dark:bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-lg border border-white/10 hover:shadow-2xl hover:shadow-cyan-500/20 hover:-translate-y-2 transition-all duration-300"
            >
              {/* Icon */}
              <div className="text-5xl mb-4">{achievement.icon}</div>

              {/* Title */}
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 flex items-start gap-2">
                <Award size={24} className="text-purple-600 dark:text-purple-400 flex-shrink-0 mt-1" />
                <span>{achievement.title}</span>
              </h3>

              {/* Issuer */}
              <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 mb-2">
                <Building size={18} />
                <p className="font-semibold">{achievement.issuer}</p>
              </div>

              {/* Date */}
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm">
                <Calendar size={16} />
                <p>{achievement.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Achievements;