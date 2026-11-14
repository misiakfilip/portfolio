import type { ImageMetadata } from 'astro';
import type { Lang } from '../i18n';
import { listProjectImages } from './projectImages';

export interface GalleryImage {
  image: ImageMetadata;
  alt: string;
}

/** Gallery of a project: files with the given prefix, alt text from `captions` (filename -> text). */
export function loadGalleryImages(
  prefix: string,
  captions: Record<string, Record<Lang, string>>,
  lang: Lang,
): GalleryImage[] {
  return listProjectImages(prefix).map(({ fileName, image }) => {
    const alt = captions[fileName]?.[lang] ?? `${prefix} ${fileName.replace(/\.\w+$/, '')}`;
    return { image, alt };
  });
}
