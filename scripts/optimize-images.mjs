// optimize-images.mjs — Convert JPG images to WebP + resize thumbnails
import sharp from 'sharp';
import { readdir, stat } from 'fs/promises';
import { join, basename, extname } from 'path';

const INPUT_DIR  = './public/images';
const OUTPUT_DIR = './public/images';

const images = [
  {
    src: 'nebula-universe.jpg',
    // Hero background — keep full res but compress heavily
    outputs: [
      { suffix: '',        width: 1920, quality: 72, format: 'webp' },
    ],
  },
  {
    src: 'cosmic-orbit.jpg',
    outputs: [
      { suffix: '',        width: 1920, quality: 72, format: 'webp' },
      { suffix: '-thumb',  width: 200,  quality: 60, format: 'webp' },
    ],
  },
  {
    src: 'constellations.jpg',
    outputs: [
      { suffix: '',        width: 1920, quality: 72, format: 'webp' },
      { suffix: '-thumb',  width: 200,  quality: 60, format: 'webp' },
    ],
  },
];

for (const img of images) {
  const srcPath = join(INPUT_DIR, img.src);
  const base    = basename(img.src, extname(img.src));

  for (const out of img.outputs) {
    const destName = `${base}${out.suffix}.${out.format}`;
    const destPath = join(OUTPUT_DIR, destName);

    const pipeline = sharp(srcPath).resize({ width: out.width, withoutEnlargement: true });
    if (out.format === 'webp') {
      pipeline.webp({ quality: out.quality, effort: 6 });
    } else {
      pipeline.jpeg({ quality: out.quality, mozjpeg: true });
    }

    await pipeline.toFile(destPath);
    const { size } = await stat(destPath);
    const { size: origSize } = await stat(srcPath);
    console.log(`✓ ${destName}  ${(size / 1024).toFixed(0)} KiB  (was ${(origSize / 1024).toFixed(0)} KiB, saved ${(100 - (size / origSize * 100)).toFixed(0)}%)`);
  }
}

console.log('\n✅ Done. Update Landing.tsx to use .webp paths.');
