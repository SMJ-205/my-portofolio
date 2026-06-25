import fs from 'fs';
import path from 'path';

const CONFIG_PATH = './src/config/portfolio.json';
const OUTPUT_DIR = './public/data/repos';

// Binary file extensions to exclude from crawling
const BINARY_EXTENSIONS = /\.(png|jpe?g|gif|webp|svg|ico|pdf|zip|tar|gz|xlsx?|csv|db|sqlite|bin|exe|dll|so|dylib|woff2?|eot|ttf|otf|mp4|webm|mp3|wav)$/i;

// Read GITHUB_TOKEN from env
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || process.env.VITE_GITHUB_TOKEN;
const headers = {
  'User-Agent': 'my-portfolio-build-script',
  'Accept': 'application/vnd.github.v3+json',
};
if (GITHUB_TOKEN) {
  headers['Authorization'] = `token ${GITHUB_TOKEN}`;
} else {
  console.warn('\x1b[33mWarning: GITHUB_TOKEN not found in environment. Crawling will run unauthenticated and may hit rate limits.\x1b[0m');
}

// Function to recursively crawl a repository
async function fetchRepoTreeAndFiles(repo) {
  const tree = {};
  const files = {};

  async function crawl(dirPath = '') {
    const url = `https://api.github.com/repos/${repo}/contents/${dirPath}`;
    console.log(`Fetching: ${url}`);
    
    const res = await fetch(url, { headers });
    if (!res.ok) {
      if (res.status === 403 || res.status === 429) {
        throw new Error(`GitHub API rate limit exceeded or forbidden: ${res.statusText}`);
      }
      throw new Error(`Failed to fetch contents of folder "${dirPath}": ${res.status} ${res.statusText}`);
    }

    const items = await res.json();
    if (!Array.isArray(items)) {
      // If the contents is not an array, it's likely a single file at this level (unusual for directory list query)
      return;
    }

    // Filter and sort items (directories first, then files)
    const filteredItems = items
      .filter(item => {
        if (item.type === 'dir') return true;
        // Exclude binary files
        return !BINARY_EXTENSIONS.test(item.name);
      })
      .sort((a, b) => {
        if (a.type === b.type) return a.name.localeCompare(b.name);
        return a.type === 'dir' ? -1 : 1;
      });

    // Save tree structure for this path
    tree[dirPath] = filteredItems.map(item => ({
      name: item.name,
      path: item.path,
      type: item.type,
      sha: item.sha,
      download_url: item.download_url,
    }));

    // Process directories and files
    for (const item of filteredItems) {
      if (item.type === 'dir') {
        await crawl(item.path);
      } else if (item.type === 'file') {
        // Skip files that are too large to keep our bundle lightweight (>1MB)
        if (item.size && item.size > 1024 * 1024) {
          console.log(`  Skipping file (too large): ${item.path} (${(item.size / 1024).toFixed(1)} KB)`);
          files[item.path] = `// File skipped during build (size is ${(item.size / (1024 * 1024)).toFixed(1)}MB, exceeding the 1MB limit).`;
          continue;
        }

        console.log(`  Downloading: ${item.path}`);
        try {
          const fileRes = await fetch(item.download_url, { headers });
          if (!fileRes.ok) {
            console.warn(`  \x1b[33mWarning: Failed to download file content for ${item.path}: ${fileRes.statusText}\x1b[0m`);
            files[item.path] = `// Error: Failed to fetch file content from GitHub.`;
            continue;
          }
          const text = await fileRes.text();
          files[item.path] = text;
        } catch (fileErr) {
          console.warn(`  \x1b[33mWarning: Fetch error for ${item.path}: ${fileErr.message}\x1b[0m`);
          files[item.path] = `// Error: Fetch error - ${fileErr.message}`;
        }
      }
    }
  }

  await crawl('');
  return { repo, tree, files };
}

async function main() {
  console.log('Starting GitHub repositories build-time cache pre-generation...');

  if (!fs.existsSync(CONFIG_PATH)) {
    console.error(`Error: Portfolio config not found at ${CONFIG_PATH}`);
    process.exit(1);
  }

  // Parse config
  let portfolio;
  try {
    portfolio = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
  } catch (err) {
    console.error(`Error parsing portfolio config: ${err.message}`);
    process.exit(1);
  }

  if (!portfolio.projects || !Array.isArray(portfolio.projects)) {
    console.error('Error: No projects array found in portfolio configuration.');
    process.exit(1);
  }

  // Find all githubRepo fields
  const repos = portfolio.projects
    .map(p => p.githubRepo)
    .filter(Boolean);

  if (repos.length === 0) {
    console.log('No GitHub repositories configured to pre-generate.');
    process.exit(0);
  }

  console.log(`Found ${repos.length} repository/repositories to download:`, repos);

  // Ensure output directory exists
  try {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  } catch (dirErr) {
    console.error(`Error creating output directory ${OUTPUT_DIR}: ${dirErr.message}`);
    process.exit(1);
  }

  // Fetch data for all repos
  let successCount = 0;
  for (const repo of repos) {
    console.log(`\n----------------------------------------`);
    console.log(`Processing repo: ${repo}`);
    console.log(`----------------------------------------`);
    
    try {
      const repoData = await fetchRepoTreeAndFiles(repo);
      const outputFilename = `${repo.replace('/', '_')}.json`;
      const outputPath = path.join(OUTPUT_DIR, outputFilename);
      
      fs.writeFileSync(outputPath, JSON.stringify(repoData, null, 2), 'utf-8');
      console.log(`Successfully wrote bundle to ${outputPath}`);
      successCount++;
    } catch (err) {
      console.error(`\x1b[31mError processing repo ${repo}: ${err.message}\x1b[31m`);
      console.error('Moving to next repository...\x1b[0m');
    }
  }

  console.log(`\nFinished! Successfully pre-generated ${successCount} of ${repos.length} repositories.`);
}

main().catch(err => {
  console.error('Fatal error running repository download script:', err);
  process.exit(1);
});
