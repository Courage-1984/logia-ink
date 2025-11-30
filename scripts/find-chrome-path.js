import { existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Find Chrome executable path on Windows
 * Returns the path to Chrome.exe if found, or null
 */
export function findChromePath() {
  const isWindows = process.platform === 'win32';

  if (!isWindows) {
    // For non-Windows, return common paths
    const unixPaths = [
      '/usr/bin/google-chrome',
      '/usr/bin/google-chrome-stable',
      '/usr/bin/chromium-browser',
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    ];

    for (const path of unixPaths) {
      if (existsSync(path)) {
        return path;
      }
    }
    return null;
  }

  // Windows paths (common installation locations)
  const windowsPaths = [
    process.env.LOCALAPPDATA + '\\Google\\Chrome\\Application\\chrome.exe',
    process.env.PROGRAMFILES + '\\Google\\Chrome\\Application\\chrome.exe',
    process.env['PROGRAMFILES(X86)'] + '\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  ];

  for (const path of windowsPaths) {
    if (path && existsSync(path)) {
      return path;
    }
  }

  return null;
}

// If run directly, print the path
const isMainModule = import.meta.url === `file://${process.argv[1].replace(/\\/g, '/')}` ||
                     import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/'));

if (isMainModule || process.argv[1]?.endsWith('find-chrome-path.js')) {
  const chromePath = findChromePath();
  if (chromePath) {
    console.log(chromePath);
  } else {
    console.error('Chrome executable not found. Please install Google Chrome.');
    process.exitCode = 1;
  }
}

