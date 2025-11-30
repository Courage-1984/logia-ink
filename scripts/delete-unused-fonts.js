/**
 * Delete Unused Font Files Script
 * Safely removes font files that are not declared in CSS
 * Based on font-inventory.json analysis
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read font inventory
const inventoryPath = path.join(__dirname, '..', 'audit-reports', 'font-inventory.json');
const inventory = JSON.parse(fs.readFileSync(inventoryPath, 'utf-8'));

console.log('🗑️  Deleting Unused Font Files...\n');
console.log(`Found ${inventory.unusedFiles.length} unused font files\n`);

let totalDeleted = 0;
let totalSizeDeleted = 0;
const errors = [];

// Delete each unused file
for (const file of inventory.unusedFiles) {
  const filePath = path.join(__dirname, '..', file.path);

  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      totalDeleted++;
      totalSizeDeleted += file.size;
      console.log(`✅ Deleted: ${file.path} (${file.sizeKB} KB)`);
    } else {
      console.log(`⚠️  File not found (may already be deleted): ${file.path}`);
    }
  } catch (error) {
    errors.push({ file: file.path, error: error.message });
    console.log(`❌ Error deleting ${file.path}: ${error.message}`);
  }
}

console.log('\n📊 Summary:');
console.log(`Files deleted: ${totalDeleted}`);
console.log(`Total size freed: ${(totalSizeDeleted / 1024).toFixed(2)} KB (${(totalSizeDeleted / 1024 / 1024).toFixed(2)} MB)`);

if (errors.length > 0) {
  console.log(`\n⚠️  Errors: ${errors.length}`);
  errors.forEach(e => console.log(`  - ${e.file}: ${e.error}`));
}

console.log('\n✅ Cleanup complete!');

