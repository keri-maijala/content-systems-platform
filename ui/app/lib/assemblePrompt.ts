import fs from 'fs';
import path from 'path';

// Root of the repo, two levels up from ui/app/lib/
const REPO_ROOT = path.resolve(process.cwd(), '..');

function read(filePath: string): string {
  const full = path.join(REPO_ROOT, filePath);
  if (!fs.existsSync(full)) return '';
  return fs.readFileSync(full, 'utf-8').trim();
}

function readDir(dirPath: string): string[] {
  const full = path.join(REPO_ROOT, dirPath);
  if (!fs.existsSync(full)) return [];
  return fs.readdirSync(full)
    .filter(f => f.endsWith('.md'))
    .sort()
    .map(f => fs.readFileSync(path.join(full, f), 'utf-8').trim());
}

export function assembleSystemPrompt(clientKey: string = 'demo'): string {
  const sections: string[] = [];

  // 1. Role and core behavior
  sections.push(`You are a content design agent for the Content Systems Platform. You help content teams write, review, and govern content across their organization.`);

  // 2. Client context from config
  const configPath = `clients/${clientKey}/config.json`;
  const configFull = path.join(REPO_ROOT, configPath);
  let clientName = '';
  let domains: string[] = [];
  let voiceAndToneCustomDoc = '';

  if (fs.existsSync(configFull)) {
    const config = JSON.parse(fs.readFileSync(configFull, 'utf-8'));
    clientName = config.client?.name || '';
    domains = (config.domains || []).map((d: { name: string }) => d.name).filter(Boolean);
    const vt = config.subjects?.voice_and_tone;
    if (vt?.customized && vt?.custom_doc) {
      voiceAndToneCustomDoc = vt.custom_doc;
    }
  }

  if (clientName) {
    sections.push(`## Client\nYou are configured for ${clientName}.`);
  }

  if (domains.length > 0) {
    sections.push(`## Domains\nThis client's content domains are: ${domains.join(', ')}. Scope your guidance to these domains when context is provided.`);
  }

  // 3. Base subject prompts
  const subjectPrompts = [
    read('base/prompts/plain-language.md'),
    read('base/prompts/accessibility.md'),
    read('base/prompts/inclusive-language.md'),
    read('base/prompts/terminology-governance.md'),
    read('base/prompts/voice-and-tone.md'),
  ].filter(Boolean);

  if (subjectPrompts.length > 0) {
    sections.push('## Subject guidance\n\n' + subjectPrompts.join('\n\n---\n\n'));
  }

  // 4. Stage prompts
  const stagePrompts = readDir('base/prompts/stages');
  if (stagePrompts.length > 0) {
    sections.push('## Journey stage guidance\n\n' + stagePrompts.join('\n\n---\n\n'));
  }

  // 5. Request handling
  const requestHandling = read('base/prompts/request-handling.md');
  if (requestHandling) {
    sections.push('## Request handling\n\n' + requestHandling);
  }

  // 6. Voice and tone — client custom or default
  const vtDoc = voiceAndToneCustomDoc
    ? read(`clients/${clientKey}/${voiceAndToneCustomDoc}`)
    : read('base/subjects/voice-and-tone-default.md');

  if (vtDoc) {
    sections.push('## Voice and tone\n\n' + vtDoc);
  }

  return sections.join('\n\n---\n\n');
}
