/**
 * Split cards.css into modular files
 * Automates the extraction of sections from the monolithic cards.css file
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cardsCssPath = path.join(__dirname, '..', 'css', 'components', 'cards.css');
const cardsDir = path.join(__dirname, '..', 'css', 'components', 'cards');

// Read the original file
const originalContent = fs.readFileSync(cardsCssPath, 'utf-8');
const lines = originalContent.split('\n');

// Define sections with their line ranges (approximate)
// We'll use pattern matching to extract sections
const sections = {
  serviceCard: {
    startPattern: /^\/\* Service Card/,
    endPattern: /^\/\* Service Link/,
    file: '_service-card.css',
    header: '/**\n * Service Card Styles\n * Base service card component styles\n */\n\n'
  },
  pricingCard: {
    startPattern: /^\/\* Pricing cards/,
    endPattern: /^\.add-ons-section/,
    file: '_pricing-card.css',
    header: '/**\n * Pricing Card Styles\n * Pricing card component styles\n */\n\n'
  },
  offerPanel: {
    startPattern: /^\.offer-panel \{/,
    endPattern: /^@keyframes offerPanelEnter/,
    file: '_offer-panel.css',
    header: '/**\n * Offer Panel Styles\n * Offer panel component with color variants\n */\n\n'
  },
  projectCard: {
    startPattern: /^\/\* Project Card Large/,
    endPattern: /^\/\* Scale\/Grow effects/,
    file: '_project-card.css',
    header: '/**\n * Project Card Styles\n * Large project card component\n */\n\n'
  },
  cardVariants: {
    startPattern: /^\/\* Our Process section/,
    endPattern: /^\.service-card:hover::before/,
    file: '_card-variants.css',
    header: '/**\n * Card Variants\n * Color variant hover effects for different card types\n */\n\n'
  },
  cardSections: {
    startPattern: /^\/\* Testimonials Section/,
    endPattern: /^\/\* Disable heavy hover effects on touch devices/,
    file: '_card-sections.css',
    header: '/**\n * Section-Specific Card Styles\n * Testimonials, expertise, and specialized services sections\n */\n\n'
  }
};

console.log('📦 Splitting cards.css into modular files...\n');

// For now, we'll do this manually with precise line extraction
// This script serves as a helper - actual extraction will be done file by file

console.log('✅ Split plan created. Use manual extraction for precision.');
console.log('Files to create:');
Object.values(sections).forEach(section => {
  console.log(`  - ${section.file}`);
});

