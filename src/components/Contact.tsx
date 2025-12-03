// src/components/Contact.tsx
import React from 'react';
import { Mail, Github, Linkedin, Send } from 'lucide-react';

interface ContactProps {
  name: string;
  email: string;
  github: string;
  linkedin: string;
  language: 'pl' | 'en';
}

const Contact: React.FC<ContactProps> = ({ name, email, github, linkedin, language }) => {
  const t = {
    title: { pl: 'Skontaktuj się ze mną', en: 'Get In Touch' },
    subtitle: { 
      pl: 'Chcesz porozmawiać o projekcie? Wyślij mi wiadomość!', 
      en: 'Want to talk about a project? Send me a message!' 
    },
    sendEmail: { pl: 'Wyślij email', en: 'Send Email' },
    or: { pl: 'lub', en: 'or' },
    findMe: { pl: 'Znajdź mnie na:', en: 'Find me on:' },
  };

  return (
    <section id="contact" className="py-20 px-6 relative border-t border-white/5">
    <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-cyan-600/20 dark:from-purple-500/10 dark:to-cyan-500/10"></div>
    <div className="relative max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          {t.title[language]}
        </h2>
        <p className="text-xl text-white/90 mb-12">
          {t.subtitle[language]}
        </p>

        {/* Email Button */}
        <a
          href={`mailto:${email}`}
          className="inline-flex items-center gap-3 px-8 py-4 bg-white text-purple-600 text-lg font-semibold rounded-lg hover:bg-gray-100 transition-colors shadow-xl hover:shadow-2xl"
        >
          <Mail size={24} />
          {t.sendEmail[language]}
        </a>

        {/* Divider */}
        <div className="flex items-center gap-4 my-12 max-w-md mx-auto">
          <div className="flex-1 h-px bg-white/30"></div>
          <span className="text-white/70">{t.or[language]}</span>
          <div className="flex-1 h-px bg-white/30"></div>
        </div>

        {/* Social Links */}
        <p className="text-white/90 mb-6 text-lg">{t.findMe[language]}</p>
        <div className="flex gap-6 justify-center">
          <a
            href={github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-14 h-14 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full transition-colors"
            aria-label="GitHub"
          >
            <Github size={28} className="text-white" />
          </a>
          <a
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center w-14 h-14 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full transition-colors"
            aria-label="LinkedIn"
          >
            <Linkedin size={28} className="text-white" />
          </a>
          <a
            href={`mailto:${email}`}
            className="flex items-center justify-center w-14 h-14 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full transition-colors"
            aria-label="Email"
          >
            <Mail size={28} className="text-white" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Contact;