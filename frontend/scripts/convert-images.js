
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const imgDir = path.join(__dirname, '../public/img/menu');
const jsonPath = path.join(__dirname, '../src/data/products.json');

async function convertImages() {
    if (!fs.existsSync(imgDir)) {
        console.error('Directory not found:', imgDir);
        return;
    }

    const files = fs.readdirSync(imgDir);
    let convertedCount = 0;

    // 1. Convert Images
    for (const file of files) {
        if (file.endsWith('.png')) {
            const inputPath = path.join(imgDir, file);
            const outputPath = path.join(imgDir, file.replace('.png', '.webp'));

            console.log(`Converting ${file} to WebP...`);

            try {
                await sharp(inputPath)
                    .webp({ quality: 80 })
                    .toFile(outputPath);
                console.log(`✅ Saved ${path.basename(outputPath)}`);
                convertedCount++;
            } catch (err) {
                console.error(`❌ Error converting ${file}:`, err);
            }
        }
    }

    // 2. Update JSON
    if (fs.existsSync(jsonPath)) {
        console.log('Updating products.json...');
        const data = fs.readFileSync(jsonPath, 'utf8');
        const updatedData = data.replace(/\.png/g, '.webp'); // Replace all .png with .webp
        fs.writeFileSync(jsonPath, updatedData);
        console.log('✅ Updated products.json references');
    }

    console.log(`\n🎉 Job done! Converted ${convertedCount} images.`);
}

convertImages();
