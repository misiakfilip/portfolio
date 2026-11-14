// src/components/TechCarousel.tsx
// Island (client:visible). The server renders every technology (only the first page is visible),
// so the markup is complete before hydration; the island only adds paging and optional auto-advance.
// The list has a fixed height and wraps+clips before hydration, so the layout never shifts.
import { useEffect, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import type { Dictionary } from '../i18n';
import { format } from '../i18n/format';

interface Technology {
  name: string;
  icon: string; // devicon class name or an emoji
}

interface TechCarouselProps {
  technologies: Technology[];
  labels: Dictionary['tech'];
}

// Devicon (technology logos) is a 650 kB font, so it is not part of the initial page load: the
// stylesheet is added when this island hydrates, i.e. when the carousel scrolls into view.
const DEVICON_CSS = {
  href: 'https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/devicon.min.css',
  integrity: 'sha384-DjehTlU5SubGD1zUGe78SkwLgw+q2y9DXnmy3EaDbXA9nvFMPW3LP5verNrWr9rW',
};

function loadDevicons(): void {
  if (document.querySelector(`link[href="${DEVICON_CSS.href}"]`)) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = DEVICON_CSS.href;
  link.integrity = DEVICON_CSS.integrity;
  link.crossOrigin = 'anonymous';
  document.head.appendChild(link);
}

const AUTO_ADVANCE_MS = 4000;
const SSR_ITEMS_PER_VIEW = 6;

/** Items per page by viewport width (all fit in one row, so the height never changes). */
function itemsForViewport(): number {
  if (window.matchMedia('(min-width: 1024px)').matches) return 6;
  if (window.matchMedia('(min-width: 640px)').matches) return 4;
  return 2;
}

const TechCarousel = ({ technologies, labels }: TechCarouselProps) => {
  const [perView, setPerView] = useState(SSR_ITEMS_PER_VIEW);
  const [page, setPage] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [hovered, setHovered] = useState(false);

  const pages = Math.max(1, Math.ceil(technologies.length / perView));
  const current = Math.min(page, pages - 1);

  useEffect(loadDevicons, []);

  // Responsive page size.
  useEffect(() => {
    const queries = ['(min-width: 1024px)', '(min-width: 640px)'].map((q) => window.matchMedia(q));
    const update = () => setPerView(itemsForViewport());
    update();
    queries.forEach((q) => q.addEventListener('change', update));
    return () => queries.forEach((q) => q.removeEventListener('change', update));
  }, []);

  // Respect prefers-reduced-motion: no auto-advance unless the user explicitly resumes it.
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => query.matches && setPlaying(false);
    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    if (!playing || hovered || pages < 2) return;
    const timer = setInterval(() => setPage((p) => (Math.min(p, pages - 1) + 1) % pages), AUTO_ADVANCE_MS);
    return () => clearInterval(timer);
  }, [playing, hovered, pages]);

  if (technologies.length === 0) return null;

  return (
    <div
      role="group"
      aria-roledescription="carousel"
      aria-label={labels.region}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      <ul
        aria-live={playing && !hovered ? 'off' : 'polite'}
        className="flex flex-wrap justify-center content-center gap-4 md:gap-8 h-35 overflow-hidden list-none"
      >
        {technologies.map((tech, index) => {
          const visible = Math.floor(index / perView) === current;
          return (
            <li
              key={tech.name}
              hidden={!visible}
              className="flex flex-col items-center gap-3 p-4 bg-card backdrop-blur-md border border-line rounded-xl shadow-lg hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-300 hover:-translate-y-2 min-w-[120px] animate-slide-in"
              style={{ animationDelay: `${(index % perView) * 0.1}s` }}
            >
              {tech.icon.startsWith('devicon') ? (
                <i className={`${tech.icon} text-4xl md:text-5xl colored inline-block size-10 md:size-12 text-center leading-none`} aria-hidden="true"></i>
              ) : (
                <span className="text-4xl md:text-5xl inline-block size-10 md:size-12 text-center leading-none" aria-hidden="true">{tech.icon}</span>
              )}
              <span className="text-fg font-semibold text-center text-sm">{tech.name}</span>
            </li>
          );
        })}
      </ul>

      {pages > 1 && (
        <div className="flex justify-center items-center gap-1 mt-6">
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? labels.pause : labels.play}
            className="p-2 rounded-lg text-body hover:text-accent"
          >
            {playing ? <Pause size={20} aria-hidden="true" /> : <Play size={20} aria-hidden="true" />}
          </button>
          {Array.from({ length: pages }, (_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setPage(idx)}
              aria-label={format(labels.goToSlide, { n: idx + 1 })}
              aria-current={idx === current ? 'true' : undefined}
              className="group flex items-center justify-center w-6 h-6 rounded-full"
            >
              <span
                className={`block h-2 rounded-full transition-all ${
                  idx === current ? 'bg-accent w-6' : 'bg-muted w-2 group-hover:bg-body'
                }`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default TechCarousel;
