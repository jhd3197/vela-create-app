import fs from 'node:fs/promises';
// Validate the checked-in template snapshot; packaging never reads sibling repos.
const starter = new URL('./templates/notebook/', import.meta.url);
const manifest = JSON.parse(await fs.readFile(new URL('app.json', starter), 'utf8'));
await fs.access(new URL(manifest.runtime.static.entry, starter));
