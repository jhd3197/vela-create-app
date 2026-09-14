#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const [id, destination, chrome='compact'] = process.argv.slice(2);
if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(id || '') || !destination || !['hub','compact','seamless'].includes(chrome)) {
  console.error('Usage: create-vela-app <app-id> <new-directory> [hub|compact|seamless]'); process.exit(1);
}
const here=path.dirname(fileURLToPath(import.meta.url));
const starter=path.join(here,'templates/notebook');
const target=path.resolve(destination);
try {
  await fs.mkdir(target); // Refuse every existing destination, including empty folders.
  // Reserve the destination atomically, then copy into new child paths. Some
  // Node versions reject fs.cp(source, existingDirectory, {errorOnExist:true}).
  for (const entry of await fs.readdir(starter)) {
    await fs.cp(path.join(starter,entry),path.join(target,entry),{recursive:true,errorOnExist:true,force:false});
  }
  const manifest=JSON.parse(await fs.readFile(path.join(target,'app.json'),'utf8'));
  manifest.id=id;manifest.name=id.split('-').map(word=>word[0].toUpperCase()+word.slice(1)).join(' ');manifest.view.chrome=chrome;
  await fs.writeFile(path.join(target,'app.json'),JSON.stringify(manifest,null,2)+'\n');
  console.log(`Created ${target}. Review this folder in the Vela Library to install it.`);
} catch(error) { console.error(error.message);process.exitCode=1; }
