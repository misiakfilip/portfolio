// src/components/TechCarousel.tsx
import React, { useState, useEffect } from 'react';

interface Technology {
  name: string;
  icon: string; // devicon class name
}

interface TechCarouselProps {
  technologies: Technology[];
  language: 'pl' | 'en';
}

const TechCarousel: React.FC<TechCarouselProps> = ({ technologies, language }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerView = 6; // Ile technologii pokazywać naraz

  useEffect(() => {
    if (technologies.length === 0) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => {
        const maxIndex = Math.max(0, technologies.length - itemsPerView);
        return prev >= maxIndex ? 0 : prev + 1;
      });
    }, 3000); // Przewijaj co 3 sekundy

    return () => clearInterval(timer);
  }, [technologies.length]);

  const t = {
    title: { pl: 'Technologie & Umiejętności', en: 'Technologies & Skills' },
    subtitle: { 
      pl: 'Języki i narzędzia, których używam', 
      en: 'Languages and tools I use' 
    },
  };

  if (technologies.length === 0) return null;

  const visibleTechs = technologies.slice(currentIndex, currentIndex + itemsPerView);
  const dotsCount = Math.ceil(technologies.length / itemsPerView);

  return (
    <section className="py-16 border-t border-b border-white/5 dark:border-white/5 backdrop-blur-md bg-white/5 dark:bg-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t.title[language]}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {t.subtitle[language]}
          </p>
        </div>
        
        <div className="relative overflow-hidden">
          {/* Main Carousel */}
          <div className="flex justify-center items-center gap-6 md:gap-8 flex-wrap min-h-[140px]">
            {visibleTechs.map((tech, index) => (
              <div
                key={`${tech.name}-${currentIndex}-${index}`}
                className="flex flex-col items-center gap-3 p-4 bg-white/10 dark:bg-white/10 backdrop-blur-md border border-white/10 rounded-xl shadow-lg hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-300 hover:-translate-y-2 min-w-[120px] animate-slide-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {tech.icon.startsWith('devicon') ? (
                    <i className={`${tech.icon} text-5xl colored`}></i>
                  ) : (
                    <span className="text-5xl">{tech.icon}</span>
                  )}
                <span className="text-gray-900 dark:text-white font-semibold text-center text-sm">
                  {tech.name}
                </span>
              </div>
            ))}
          </div>

          {/* Progress Indicators (Dots) */}
          {dotsCount > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: dotsCount }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx * itemsPerView)}
                  className={`h-2 rounded-full transition-all ${
                    Math.floor(currentIndex / itemsPerView) === idx
                      ? 'bg-purple-600 w-8'
                      : 'bg-gray-400 dark:bg-gray-600 w-2'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* All Technologies Grid (Desktop only) */}
        <div className="hidden lg:grid grid-cols-8 gap-4 mt-16">
          {technologies.map((tech, index) => (
            <div
              key={`${tech.name}-grid-${index}`}
              className="flex flex-col items-center gap-2 p-3 bg-white/10 dark:bg-white/10 backdrop-blur-md border border-white/10 rounded-lg hover:shadow-lg hover:shadow-cyan-500/10 transition-all hover:-translate-y-1 cursor-pointer"
              title={tech.name}
            >
              <i className={`${tech.icon} text-3xl colored`}></i>
              <span className="text-xs text-gray-900 dark:text-white text-center font-medium">
                {tech.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(20px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }

        .animate-slide-in {
          animation: slide-in 0.5s ease-out forwards;
        }
      `}</style>
    </section>
  );
};

export default TechCarousel;