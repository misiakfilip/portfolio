// src/components/ProjectComponents.tsx
import React from 'react';
import { Download, Youtube, FileText, Image as ImageIcon, Code, ExternalLink } from 'lucide-react';

// YouTube Video Component
interface YouTubeVideoProps {
  videoId: string;
  title?: string;
}

export const YouTubeVideo: React.FC<YouTubeVideoProps> = ({ videoId, title = "Video" }) => (
  <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/10">
    <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
      <Youtube className="text-red-500" size={28} />
      {title}
    </h3>
    <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
      <iframe
        className="absolute top-0 left-0 w-full h-full rounded-lg"
        src={`https://www.youtube.com/embed/${videoId}`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  </div>
);

// Download Button Component
interface DownloadButtonProps {
  href: string;
  label: string;
  icon?: 'pdf' | 'file' | 'code';
  size?: string;
}

export const DownloadButton: React.FC<DownloadButtonProps> = ({ 
  href, 
  label, 
  icon = 'file',
  size 
}) => {
  const Icon = icon === 'pdf' ? FileText : icon === 'code' ? Code : Download;
  
  return (
    <a
      href={href}
      download
      className="inline-flex items-center gap-3 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-semibold shadow-lg hover:shadow-xl"
    >
      <Icon size={20} />
      <div className="text-left">
        <div>{label}</div>
        {size && <div className="text-xs opacity-80">{size}</div>}
      </div>
    </a>
  );
};

// Downloads Section
interface DownloadsSectionProps {
  title?: string;
  downloads: Array<{
    href: string;
    label: string;
    icon?: 'pdf' | 'file' | 'code';
    size?: string;
  }>;
}

export const DownloadsSection: React.FC<DownloadsSectionProps> = ({ 
  title = "Pliki do pobrania",
  downloads 
}) => (
  <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/10">
    <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
      <Download className="text-cyan-400" size={28} />
      {title}
    </h3>
    <div className="flex flex-col gap-4">
      {downloads.map((download, index) => (
        <DownloadButton key={index} {...download} />
      ))}
    </div>
  </div>
);

// Image Gallery Component
interface ImageGalleryProps {
  title?: string;
  images: Array<{
    src: string;
    alt: string;
    caption?: string;
  }>;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ 
  title = "Galeria",
  images 
}) => (
  <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/10">
    <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
      <ImageIcon className="text-cyan-400" size={28} />
      {title}
    </h3>
    <div className="grid md:grid-cols-2 gap-4">
      {images.map((image, index) => (
        <div key={index} className="group cursor-pointer">
          <div className="relative overflow-hidden rounded-lg border border-white/10 hover:border-cyan-500 transition-all">
            <img 
              src={image.src} 
              alt={image.alt}
              className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {image.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/70 backdrop-blur-sm p-3">
                <p className="text-white text-sm">{image.caption}</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Features List Component
interface FeaturesListProps {
  title?: string;
  features: string[];
}

export const FeaturesList: React.FC<FeaturesListProps> = ({ 
  title = "Funkcje",
  features 
}) => (
  <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/10">
    <h3 className="text-2xl font-bold text-white mb-6">
      {title}
    </h3>
    <ul className="space-y-3">
      {features.map((feature, index) => (
        <li key={index} className="flex items-start gap-3 text-gray-300">
          <span className="text-cyan-400 text-xl">✓</span>
          <span>{feature}</span>
        </li>
      ))}
    </ul>
  </div>
);

// Text Section Component
interface TextSectionProps {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export const TextSection: React.FC<TextSectionProps> = ({ title, children, icon }) => (
  <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/10">
    <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
      {icon}
      {title}
    </h3>
    <div className="prose prose-invert prose-cyan max-w-none text-gray-300">
      {children}
    </div>
  </div>
);

// Links Section
interface LinksSectionProps {
  title?: string;
  links: Array<{
    href: string;
    label: string;
    description?: string;
  }>;
}

export const LinksSection: React.FC<LinksSectionProps> = ({ 
  title = "Linki",
  links 
}) => (
  <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/10">
    <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
      <ExternalLink className="text-cyan-400" size={28} />
      {title}
    </h3>
    <div className="space-y-3">
      {links.map((link, index) => (
        <a
          key={index}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="block p-4 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 hover:border-cyan-500 transition-all group"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white font-semibold group-hover:text-cyan-400 transition-colors">
                {link.label}
              </div>
              {link.description && (
                <div className="text-gray-400 text-sm mt-1">
                  {link.description}
                </div>
              )}
            </div>
            <ExternalLink className="text-gray-400 group-hover:text-cyan-400 transition-colors" size={20} />
          </div>
        </a>
      ))}
    </div>
  </div>
);

export default {
  YouTubeVideo,
  DownloadButton,
  DownloadsSection,
  ImageGallery,
  FeaturesList,
  TextSection,
  LinksSection,
};