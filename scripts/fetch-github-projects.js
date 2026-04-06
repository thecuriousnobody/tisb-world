#!/usr/bin/env node
/**
 * Fetch public GitHub repos for thecuriousnobody, read their READMEs,
 * and use OpenAI to generate compelling project descriptions.
 *
 * Environment Variables:
 * - OPENAI_API_KEY:  Required – generates AI descriptions from READMEs
 * - GITHUB_TOKEN:    Optional – raises rate limit from 60 to 5000 req/hr
 * - GITHUB_USERNAME: Optional – defaults to "thecuriousnobody"
 *
 * Output: public/data/github-projects.json
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_PATH = path.join(__dirname, '..', 'public', 'data', 'github-projects.json');
const GITHUB_USERNAME = process.env.GITHUB_USERNAME || 'thecuriousnobody';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';

// ---------------------------------------------------------------------------
// HTTP helpers
// ---------------------------------------------------------------------------

function httpsRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const reqOptions = {
      hostname: urlObj.hostname,
      port: 443,
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: {
        'User-Agent': 'TISB-World-Bot/1.0',
        Accept: 'application/json',
        ...options.headers,
      },
    };

    const req = https.request(reqOptions, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => {
        if (res.statusCode >= 400) {
          reject(new Error(`HTTP ${res.statusCode}: ${data.slice(0, 200)}`));
        } else {
          try {
            resolve(JSON.parse(data));
          } catch {
            resolve(data); // raw text (for README)
          }
        }
      });
    });
    req.on('error', reject);
    if (options.body) req.write(options.body);
    req.end();
  });
}

function githubHeaders() {
  const headers = { Accept: 'application/vnd.github.v3+json' };
  if (GITHUB_TOKEN) headers.Authorization = `Bearer ${GITHUB_TOKEN}`;
  return headers;
}

// ---------------------------------------------------------------------------
// GitHub API
// ---------------------------------------------------------------------------

async function fetchAllRepos() {
  console.log(`Fetching public repos for ${GITHUB_USERNAME}…`);
  const repos = [];
  let page = 1;

  while (true) {
    const url = `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&page=${page}&sort=updated&type=owner`;
    const batch = await httpsRequest(url, { headers: githubHeaders() });
    if (!Array.isArray(batch) || batch.length === 0) break;
    repos.push(...batch);
    if (batch.length < 100) break;
    page++;
  }

  // Filter: public, not forks, not archived, not .github special repos
  const filtered = repos.filter(
    (r) => !r.fork && !r.archived && !r.private && !r.name.startsWith('.')
  );

  console.log(`  Found ${repos.length} total, ${filtered.length} after filtering\n`);
  return filtered;
}

async function fetchReadme(repo) {
  try {
    const url = `https://api.github.com/repos/${GITHUB_USERNAME}/${repo.name}/readme`;
    const data = await httpsRequest(url, {
      headers: { ...githubHeaders(), Accept: 'application/vnd.github.v3.raw' },
    });
    // data is raw README text (because Accept header requests raw)
    return typeof data === 'string' ? data : JSON.stringify(data);
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// OpenAI description generation
// ---------------------------------------------------------------------------

async function generateDescription(repo, readme) {
  if (!OPENAI_API_KEY) {
    // No API key — use repo description or generate from name
    return repo.description || `A ${repo.language || 'code'} project exploring ${repo.name.replace(/[-_]/g, ' ')}.`;
  }

  const readmeSnippet = readme ? readme.slice(0, 4000) : 'No README available.';

  const prompt = `You are writing for a bold, brutalist-designed portfolio website for a creative technologist.
Given this GitHub repository, write a compelling 2-3 sentence description that captures the essence and ambition of the project.
Be vivid and energetic. Focus on WHAT it does and WHY it matters. No fluff, no filler.

Repository: ${repo.name}
Language: ${repo.language || 'Various'}
GitHub description: ${repo.description || 'None'}
Stars: ${repo.stargazers_count}
Topics: ${(repo.topics || []).join(', ') || 'None'}

README (first 4000 chars):
${readmeSnippet}

Write ONLY the description, nothing else. No quotes, no prefix.`;

  try {
    const body = JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 200,
      temperature: 0.7,
    });

    const result = await httpsRequest('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body,
    });

    const text = result.choices?.[0]?.message?.content?.trim();
    return text || repo.description || `A project exploring ${repo.name.replace(/[-_]/g, ' ')}.`;
  } catch (err) {
    console.warn(`    ⚠ OpenAI failed for ${repo.name}: ${err.message}`);
    return repo.description || `A ${repo.language || 'code'} project by The Idea Sandbox.`;
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log('=== GitHub Projects Sync ===\n');

  if (!OPENAI_API_KEY) {
    console.warn('⚠ OPENAI_API_KEY not set – descriptions will use repo metadata only\n');
  }

  // 1. Fetch all repos
  const repos = await fetchAllRepos();
  if (repos.length === 0) {
    console.error('No repos found – check the GitHub username');
    process.exit(1);
  }

  // Sort by stars (descending), then by recent push
  repos.sort((a, b) => {
    if (b.stargazers_count !== a.stargazers_count) return b.stargazers_count - a.stargazers_count;
    return new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime();
  });

  // 2. Process each repo
  const items = [];
  for (const repo of repos) {
    console.log(`Processing: ${repo.name}`);

    // Fetch README
    const readme = await fetchReadme(repo);
    console.log(`  README: ${readme ? `${readme.length} chars` : 'not found'}`);

    // Generate AI description
    const aiDescription = await generateDescription(repo, readme);
    console.log(`  Description: ${aiDescription.slice(0, 80)}…`);

    items.push({
      id: `github-${repo.id}`,
      name: repo.name,
      fullName: repo.full_name,
      title: repo.name
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase()),
      description: repo.description || '',
      aiDescription,
      url: repo.html_url,
      homepage: repo.homepage || '',
      language: repo.language || 'Various',
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      topics: repo.topics || [],
      lastUpdated: repo.pushed_at,
      createdAt: repo.created_at,
    });

    // Small delay to respect rate limits
    await new Promise((r) => setTimeout(r, OPENAI_API_KEY ? 500 : 100));
  }

  console.log(`\n✓ Processed ${items.length} projects`);

  // 3. Write output
  const output = {
    username: GITHUB_USERNAME,
    items,
    lastUpdated: new Date().toISOString(),
    generatedWith: OPENAI_API_KEY ? 'openai-gpt4o-mini' : 'repo-metadata-only',
  };

  const outputDir = path.dirname(OUTPUT_PATH);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2));
  console.log(`Saved to ${OUTPUT_PATH}`);
}

main().catch((err) => {
  console.error('Fatal error:', err.message);
  process.exit(1);
});
