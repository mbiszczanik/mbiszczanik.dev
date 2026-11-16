// Fails when a tracked file matches no rule in licenses.json, or a rule matches no file.
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const { licenses, rules } = JSON.parse(readFileSync('licenses.json', 'utf8'));
const files = execFileSync('git', ['ls-files', '-z'], { encoding: 'utf8' }).split('\0').filter(Boolean);

const toRegExp = (glob) =>
  new RegExp(
    '^' +
      glob
        .replace(/[.+^${}()|[\]\\]/g, '\\$&')
        .replace(/\*\*\//g, '\u0000')
        .replace(/\*\*/g, '\u0001')
        .replace(/\*/g, '[^/]*')
        .replace(/\u0000/g, '(?:.*/)?')
        .replace(/\u0001/g, '.*') +
      '$'
  );

const errors = [];
for (const r of rules) if (!licenses[r.license]) errors.push(`rule uses unknown license ${r.license}`);

const compiled = rules.flatMap((r) => r.paths.map((p) => ({ p, re: toRegExp(p), used: false })));
const unmapped = [];
for (const f of files) {
  const m = compiled.find((c) => c.re.test(f));
  if (m) m.used = true;
  else unmapped.push(f);
}
for (const f of unmapped) errors.push(`no license mapping: ${f}`);
for (const c of compiled) if (!c.used) errors.push(`rule matches no tracked file: ${c.p}`);

if (!files.length) errors.push('git ls-files returned no files');
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`check-licenses: ${files.length} tracked files mapped`);
