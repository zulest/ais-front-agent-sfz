import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const AGENTS_DIR = join(__dirname, '..', 'agents');

function parseAgentFrontmatter(skillPath) {
  const content = readFileSync(skillPath, 'utf8');
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  const fm = {};
  for (const line of match[1].split('\n')) {
    const [k, ...v] = line.split(':');
    if (k && v.length) fm[k.trim()] = v.join(':').trim().replace(/^"|"$/g, '');
  }
  fm._rawContent = content;
  return fm;
}

describe('agent identity', () => {
  const agentDirs = readdirSync(AGENTS_DIR).filter(d =>
    existsSync(join(AGENTS_DIR, d, 'SKILL.md'))
  );

  it('ais-reconstructor should not exist', () => {
    expect(agentDirs).not.toContain('ais-reconstructor');
  });

  it('three new agents should exist', () => {
    expect(agentDirs).toContain('ais-especificador-cambios-front');
    expect(agentDirs).toContain('ais-planificador-implementacion-front');
    expect(agentDirs).toContain('ais-actualizador-contexto-front');
  });

  for (const dir of agentDirs) {
    const skillPath = join(AGENTS_DIR, dir, 'SKILL.md');
    describe(`${dir}`, () => {
      it('has valid frontmatter with required fields', () => {
        const fm = parseAgentFrontmatter(skillPath);
        expect(fm).not.toBeNull();
        expect(fm.name).toBeTruthy();
        expect(fm.description).toBeTruthy();
      });

      it('has agent_domain: client-front', () => {
        const fm = parseAgentFrontmatter(skillPath);
        expect(fm['metadata']).toBeDefined();
        // Check raw content for agent_domain
        expect(fm._rawContent).toContain('agent_domain: client-front');
      });

      it('has FRONTEND WinForms SFZ identity block', () => {
        const fm = parseAgentFrontmatter(skillPath);
        expect(fm._rawContent).toContain('FRONTEND WinForms SFZ');
      });

      it('has Contexto SFZ section', () => {
        const fm = parseAgentFrontmatter(skillPath);
        expect(fm._rawContent).toContain('## Contexto SFZ');
      });
    });
  }
});
