#!/usr/bin/env node

/**
 * Simple Artwork Updater for TISB World
 * 
 * Since Behance has strong anti-scraping protection, this script provides
 * an easy way to manually update your artwork portfolio.
 * 
 * Usage:
 *   node update-artwork.js add "Project Title" "https://behance.net/gallery/123" "thumbnail-url" "description" "tag1,tag2"
 *   node update-artwork.js list
 *   node update-artwork.js remove "project-id"
 */

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_FILE = path.join(__dirname, '..', 'public', 'data', 'behance-portfolio.json');

async function loadPortfolio() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('❌ Could not load portfolio data:', error.message);
    process.exit(1);
  }
}

async function savePortfolio(portfolio) {
  try {
    await fs.writeFile(DATA_FILE, JSON.stringify(portfolio, null, 2));
    console.log('✅ Portfolio saved successfully');
  } catch (error) {
    console.error('❌ Could not save portfolio:', error.message);
    process.exit(1);
  }
}

function createProjectId(title) {
  return title.toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 30) + '-' + new Date().getFullYear();
}

async function addProject(title, link, thumbnail, description, tagsString) {
  const portfolio = await loadPortfolio();
  
  const tags = tagsString ? tagsString.split(',').map(tag => tag.trim()) : ['digital art'];
  const newProject = {
    id: createProjectId(title),
    title,
    description: description || `Creative project by The Idea Sandbox • View on Behance`,
    link,
    publishedAt: new Date().toISOString(),
    platform: 'behance',
    thumbnail: thumbnail || '',
    author: 'The Idea Sandbox',
    tags
  };
  
  portfolio.items.unshift(newProject); // Add to beginning
  portfolio.lastUpdated = new Date().toISOString();
  portfolio.updateMethod = 'manual_script';
  
  await savePortfolio(portfolio);
  console.log(`✅ Added: "${title}"`);
  console.log(`   ID: ${newProject.id}`);
  console.log(`   Tags: ${tags.join(', ')}`);
}

async function listProjects() {
  const portfolio = await loadPortfolio();
  
  console.log(`🎨 Current Portfolio (${portfolio.items.length} projects):`);
  console.log(`   Last updated: ${new Date(portfolio.lastUpdated).toLocaleDateString()}`);
  console.log('');
  
  portfolio.items.forEach((project, index) => {
    console.log(`${index + 1}. ${project.title}`);
    console.log(`   ID: ${project.id}`);
    console.log(`   Link: ${project.link}`);
    console.log(`   Tags: ${project.tags.join(', ')}`);
    console.log('');
  });
}

async function removeProject(projectId) {
  const portfolio = await loadPortfolio();
  
  const originalLength = portfolio.items.length;
  portfolio.items = portfolio.items.filter(item => item.id !== projectId);
  
  if (portfolio.items.length === originalLength) {
    console.log(`❌ Project with ID "${projectId}" not found`);
    return;
  }
  
  portfolio.lastUpdated = new Date().toISOString();
  portfolio.updateMethod = 'manual_script';
  
  await savePortfolio(portfolio);
  console.log(`✅ Removed project: ${projectId}`);
}

// Main script logic
const [,, command, ...args] = process.argv;

switch (command) {
  case 'add':
    if (args.length < 2) {
      console.log('❌ Usage: node update-artwork.js add "Title" "URL" ["thumbnail"] ["description"] ["tag1,tag2"]');
      process.exit(1);
    }
    await addProject(args[0], args[1], args[2], args[3], args[4]);
    break;
    
  case 'list':
    await listProjects();
    break;
    
  case 'remove':
    if (!args[0]) {
      console.log('❌ Usage: node update-artwork.js remove "project-id"');
      process.exit(1);
    }
    await removeProject(args[0]);
    break;
    
  default:
    console.log('🎨 TISB World Artwork Updater');
    console.log('');
    console.log('Commands:');
    console.log('  add "Title" "URL" ["thumbnail"] ["description"] ["tags"]');
    console.log('  list                                                     ');
    console.log('  remove "project-id"                                      ');
    console.log('');
    console.log('Examples:');
    console.log('  node update-artwork.js add "New Project" "https://behance.net/gallery/123"');
    console.log('  node update-artwork.js list');
    console.log('  node update-artwork.js remove "new-project-2024"');
}