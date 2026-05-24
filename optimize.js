const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const imgDir = path.join(__dirname, 'img');

console.log('=== Image Optimization Started ===\n');

fs.readdirSync(imgDir).forEach(file => {
  if (/\.(jpg|jpeg|png)$/i.test(file)) {
    const filepath = path.join(imgDir, file);
    const stats = fs.statSync(filepath);
    const originalSize = (stats.size / 1024).toFixed(1);
    
    // Using ffmpeg to optimize
    const cmd = `ffmpeg -i "${filepath}" -q:v 5 "${filepath}.tmp" -y 2>nul && move /Y "${filepath}.tmp" "${filepath}"`;
    
    exec(cmd, (err) => {
      const newStats = fs.statSync(filepath);
      const newSize = (newStats.size / 1024).toFixed(1);
      const reduction = (((originalSize - newSize) / originalSize) * 100).toFixed(1);
      
      console.log(`✓ ${file}`);
      console.log(`  Avant: ${originalSize} KB | Après: ${newSize} KB | Réduction: ${reduction}%\n`);
    });
  }
});

console.log('=== Optimization Complete ===');
