import type { ImageMetadata } from 'astro';

// Every project image lives in src/assets/projects/ and goes through astro:assets
// (AVIF/WebP, srcset, width/height). Files are looked up by name ("arct-menu.png").
const modules = import.meta.glob<ImageMetadata>('/src/assets/projects/*.{jpg,jpeg,png,webp,svg}', {
  eager: true,
  import: 'default',
});

const byName = new Map(
  Object.entries(modules).map(([path, meta]) => [path.split('/').pop() ?? path, meta] as const),
);

export function getProjectImage(fileName: string): ImageMetadata | undefined {
  return byName.get(fileName);
}

/** Raster files (no svg) whose name starts with `prefix`, sorted by name. */
export function listProjectImages(prefix: string): Array<{ fileName: string; image: ImageMetadata }> {
  return [...byName.entries()]
    .filter(([name]) => name.startsWith(prefix) && !name.endsWith('.svg'))
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([fileName, image]) => ({ fileName, image }));
}
