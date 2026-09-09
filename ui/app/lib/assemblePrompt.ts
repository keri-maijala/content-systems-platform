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

interface UserContext {
  name: string;
  role: 'contributor' | 'domain_owner' | 'content_owner';
  domains: string[];
}

const ROLE_DESCRIPTIONS: Record<string, string> = {
  content_owner: 'a content owner with full access across all domains. They configure the system, govern content rules, and use the agent day to day. They can request governance flags and override recommendations.',
  domain_owner: 'a domain owner with access scoped to their assigned domains. They can request governance flags and override recommendations within their domains.',
  contributor: 'a contributor — an everyday user who creates and reviews content within established guidelines. They do not have override access.',
};

export function assembleSystemPrompt(clientKey: string = 'demo', user?: UserContext): string {
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

  // 3. Current user context
  if (user) {
    const roleDescription = ROLE_DESCRIPTIONS[user.role] || 'a platform user.';
    const domainLine = user.domains.length > 0
      ? ` Their assigned domains are: ${user.domains.join(', ')}.`
      : '';
    sections.push(`## Current user\nYou are speaking with ${user.name}, who is ${roleDescription}${domainLine} Tailor your responses to their level of access and ownership.`);
  }

  // 4. Base subject prompts
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

  // 5. Stage prompts
  const stagePrompts = readDir('base/prompts/stages');
  if (stagePrompts.length > 0) {
    sections.push('## Journey stage guidance\n\n' + stagePrompts.join('\n\n---\n\n'));
  }

  // 6. Request handling
  const requestHandling = read('base/prompts/request-handling.md');
  if (requestHandling) {
    sections.push('## Request handling\n\n' + requestHandling);
  }

  // 7. Voice and tone — client custom or default
  const vtDoc = voiceAndToneCustomDoc
    ? read(`clients/${clientKey}/${voiceAndToneCustomDoc}`)
    : read('base/subjects/voice-and-tone-default.md');

  if (vtDoc) {
    sections.push('## Voice and tone\n\n' + vtDoc);
  }

  return sections.join('\n\n---\n\n');
}
