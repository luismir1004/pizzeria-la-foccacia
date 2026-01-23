
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputSvg = path.join(__dirname, '../public/favicon.svg');
const publicDir = path.join(__dirname, '../public');

async function generateIcons() {
    if (!fs.existsSync(inputSvg)) {
        console.log('❌ favicon.svg not found at:', inputSvg);
        return;
    }

    const sizes = [192, 512];

    for (const size of sizes) {
        const outputPath = path.join(publicDir, `pwa-${size}x${size}.png`);
        console.log(`Generating ${size}x${size} icon...`);

        await sharp(inputSvg)
            .resize(size, size)
            .toFormat('png')
            .toFile(outputPath);

        console.log(`✅ Saved ${path.basename(outputPath)}`);
    }
}

generateIcons().catch(console.error);
