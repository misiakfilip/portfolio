export function loadGalleryImages(prefix: string) {
  const images = import.meta.glob(
    '/public/projects/*.{jpg,jpeg,png,webp}',
    { eager: true }
  );

  return Object.keys(images)
    .filter(path => path.includes(`/${prefix}`))
    .sort()
    .map(path => {
      const fileName = path.split('/').pop() ?? '';

      return {
        src: path.replace('/public', ''),
        alt: fileName.replace(/\.(jpg|jpeg|png|webp)/, ''),
        caption: ''
      };
    });
}
