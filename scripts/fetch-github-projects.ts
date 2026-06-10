#!/usr/bin/env npx tsx
/**
 * GitHub Projects Agent
 *
 * Fetches all repos (public + private) for a GitHub user, reads each README,
 * and uses a Claude Haiku agent via the Vercel AI SDK to generate vivid
 * portfolio descriptions.
 *
 * Environment Variables:
 * - ANTHROPIC_API_KEY: Required – powers the Haiku description agent
 * - GITHUB_TOKEN:      Optional – PAT with `repo` scope for private repos
 * - GITHUB_USERNAME:   Optional – defaults to "thecuriousnobody"
 *
 * Output: public/data/github-projects.json
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';
import { generateText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_PATH = path.join(__dirname, '..', 'public', 'data', 'github-projects.json');
const GITHUB_USERNAME = process.env.GITHUB_USERNAME || 'thecuriousnobody';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';
const HAS_AI = !!process.env.ANTHROPIC_API_KEY;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  topics: string[];
  pushed_at: string;
  created_at: string;
  private: boolean;
  fork: boolean;
  archived: boolean;
}

interface ProjectItem {
  id: string;
  name: string;
  fullName: string;
  title: string;
  description: string;
  aiDescription: string;
  url: string;
  homepage: string;
  language: string;
  stars: number;
  forks: number;
  topics: string[];
  lastUpdated: string;
  createdAt: string;
  visibility: 'public' | 'private';
}

// ---------------------------------------------------------------------------
// HTTP helper (for GitHub API — no SDK needed)
// ---------------------------------------------------------------------------

function httpsGet(url: string, headers: Record<string, string> = {}): Promise<any> {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const req = https.request(
      {
        hostname: urlObj.hostname,
        port: 443,
        path: urlObj.pathname + urlObj.search,
        method: 'GET',
        headers: { 'User-Agent': 'TISB-World-Bot/1.0', Accept: 'application/json', ...headers },
      },
      (res) => {
        let data = '';
        res.on('data', (c) => (data += c));
        res.on('end', () => {
          if (res.statusCode! >= 400) reject(new Error(`HTTP ${res.statusCode}: ${data.slice(0, 200)}`));
          else {
            try { resolve(JSON.parse(data)); } catch { resolve(data); }
          }
        });
      }
    );
    req.on('error', reject);
    req.end();
  });
}

function ghHeaders(): Record<string, string> {
  const h: Record<string, string> = { Accept: 'application/vnd.github.v3+json' };
  if (GITHUB_TOKEN) h.Authorization = `Bearer ${GITHUB_TOKEN}`;
  return h;
}

// ---------------------------------------------------------------------------
// GitHub API
// ---------------------------------------------------------------------------

async function fetchAllRepos(): Promise<GitHubRepo[]> {
  const useAuth = !!GITHUB_TOKEN;
  console.log(`Fetching repos for ${GITHUB_USERNAME}${useAuth ? ' (including private)' : ' (public only)'}…`);

  const repos: GitHubRepo[] = [];
  let page = 1;

  while (true) {
    const url = useAuth
      ? `https://api.github.com/user/repos?per_page=100&page=${page}&sort=updated&affiliation=owner`
      : `https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&page=${page}&sort=updated&type=owner`;
    const batch = await httpsGet(url, ghHeaders());
    if (!Array.isArray(batch) || batch.length === 0) break;
    repos.push(...batch);
    if (batch.length < 100) break;
    page++;
  }

  const filtered = repos.filter((r) => !r.fork && !r.archived && !r.name.startsWith('.'));
  const pub = filtered.filter((r) => !r.private).length;
  const priv = filtered.filter((r) => r.private).length;
  console.log(`  Found ${repos.length} total → ${filtered.length} kept (${pub} public, ${priv} private)\n`);
  return filtered;
}

async function fetchReadme(repo: GitHubRepo): Promise<string | null> {
  try {
    const data = await httpsGet(
      `https://api.github.com/repos/${GITHUB_USERNAME}/${repo.name}/readme`,
      { ...ghHeaders(), Accept: 'application/vnd.github.v3.raw' }
    );
    return typeof data === 'string' ? data : JSON.stringify(data);
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Haiku Description Agent (Vercel AI SDK)
// ---------------------------------------------------------------------------

async function generateDescription(repo: GitHubRepo, readme: string | null): Promise<string> {
  if (!HAS_AI) {
    return repo.description || `A ${repo.language || 'code'} project exploring ${repo.name.replace(/[-_]/g, ' ')}.`;
  }

  const readmeSnippet = readme ? readme.slice(0, 6000) : 'No README available.';
  const privacyNote = repo.private
    ? `\nIMPORTANT: This is a PRIVATE repository. Do NOT reveal API keys, passwords, internal URLs, secret endpoints, or proprietary implementation details. Focus only on the high-level vision and what the project achieves.`
    : '';

  try {
    const { text } = await generateText({
      model: anthropic('claude-haiku-4-5-20251001'),
      system: `You are a portfolio copywriter for a bold, brutalist-designed creative technologist website. You write punchy, vivid descriptions that make people want to learn more. Never use filler or marketing fluff. Every word earns its place.${privacyNote}`,
      prompt: `Write a compelling 2-3 sentence description for this GitHub project. Capture its essence and ambition — WHAT it does and WHY it matters.

Repository: ${repo.name}
Language: ${repo.language || 'Various'}
Description: ${repo.description || 'None'}
Stars: ${repo.stargazers_count} | Topics: ${(repo.topics || []).join(', ') || 'None'}

README:
${readmeSnippet}

Write ONLY the description. No quotes, no prefix, no labels.`,
      maxTokens: 200,
      temperature: 0.7,
    });

    return text.trim() || repo.description || `A project exploring ${repo.name.replace(/[-_]/g, ' ')}.`;
  } catch (err: any) {
    console.warn(`    ⚠ Haiku agent failed for ${repo.name}: ${err.message}`);
    return repo.description || `A ${repo.language || 'code'} project by The Idea Sandbox.`;
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log('=== GitHub Projects Agent ===');
  console.log(`  Model: Claude Haiku 4.5 (via Vercel AI SDK)`);
  console.log(`  AI enabled: ${HAS_AI ? 'yes' : 'no — set ANTHROPIC_API_KEY'}\n`);

  // 1. Fetch repos
  const repos = await fetchAllRepos();
  if (repos.length === 0) {
    console.error('No repos found — check the username or token');
    process.exit(1);
  }

  // Sort: stars desc, then most recently pushed
  repos.sort((a, b) => {
    if (b.stargazers_count !== a.stargazers_count) return b.stargazers_count - a.stargazers_count;
    return new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime();
  });

  // 2. Process each repo through the Haiku agent
  const items: ProjectItem[] = [];

  for (const repo of repos) {
    console.log(`Processing: ${repo.name}${repo.private ? ' [private]' : ''}`);

    const readme = await fetchReadme(repo);
    console.log(`  README: ${readme ? `${readme.length} chars` : 'not found'}`);

    const aiDescription = await generateDescription(repo, readme);
    console.log(`  → ${aiDescription.slice(0, 80)}…`);

    items.push({
      id: `github-${repo.id}`,
      name: repo.name,
      fullName: repo.full_name,
      title: repo.name.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      description: repo.description || '',
      aiDescription,
      url: repo.private ? '' : repo.html_url,
      homepage: repo.homepage || '',
      language: repo.language || 'Various',
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      topics: repo.topics || [],
      lastUpdated: repo.pushed_at,
      createdAt: repo.created_at,
      visibility: repo.private ? 'private' : 'public',
    });

    // Small delay between AI calls
    if (HAS_AI) await new Promise((r) => setTimeout(r, 300));
  }

  console.log(`\n✓ ${items.length} projects processed`);

  // 3. Write output
  const output = {
    username: GITHUB_USERNAME,
    items,
    lastUpdated: new Date().toISOString(),
    generatedWith: HAS_AI ? 'claude-haiku-4.5-vercel-ai-sdk' : 'repo-metadata-only',
  };

  const outputDir = path.dirname(OUTPUT_PATH);
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2));
  console.log(`Saved to ${OUTPUT_PATH}`);
}

main().catch((err) => {
  console.error('Fatal error:', err.message);
  process.exit(1);
});
