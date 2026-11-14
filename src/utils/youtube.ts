// Attributes of the YouTube <iframe> (project subpages, only rendered when a project has `videoId`).
// Privacy-enhanced host, lazy loading, no autoplay, minimal referrer.

const VIDEO_ID = /^[A-Za-z0-9_-]{11}$/;

export const isYouTubeId = (id: string): boolean => VIDEO_ID.test(id);

export function youtubeIframeAttrs(videoId: string, title: string) {
  if (!isYouTubeId(videoId)) throw new Error(`Invalid YouTube video id: "${videoId}"`);
  return {
    src: `https://www.youtube-nocookie.com/embed/${videoId}`,
    title,
    loading: 'lazy' as const,
    referrerpolicy: 'strict-origin-when-cross-origin' as const,
    allow: 'accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
    allowfullscreen: true,
  };
}
