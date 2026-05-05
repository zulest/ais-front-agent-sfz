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

describe('graphify integration', () => {
  const GRAPHIFY_AGENTS = [
    'ais-agente-front-winforms',
    'ais-especificador-cambios-front',
    'ais-planificador-implementacion-front',
    'ais-actualizador-contexto-front',
    'ais-detector-deriva',
  ];

  for (const agent of GRAPHIFY_AGENTS) {
    it(`${agent} contains sfz-knowledge block`, () => {
      const skillPath = join(AGENTS_DIR, agent, 'SKILL.md');
      const content = readFileSync(skillPath, 'utf8');
      expect(content).toContain('sfz-knowledge');
      expect(content).toContain('query_graph');
    });
  }

  it('ais-agente-front-winforms contains graphify setup instructions', () => {
    const skillPath = join(AGENTS_DIR, 'ais-agente-front-winforms', 'SKILL.md');
    const content = readFileSync(skillPath, 'utf8');
    expect(content).toContain('graphify.serve');
    expect(content).toContain('/graphify _ais_sdd/');
  });

  it('ais-actualizador-contexto-front mentions graphify --update', () => {
    const skillPath = join(AGENTS_DIR, 'ais-actualizador-contexto-front', 'SKILL.md');
    const content = readFileSync(skillPath, 'utf8');
    expect(content).toContain('--update');
  });

  it('ais-detector-deriva mentions god_nodes', () => {
    const skillPath = join(AGENTS_DIR, 'ais-detector-deriva', 'SKILL.md');
    const content = readFileSync(skillPath, 'utf8');
    expect(content).toContain('god_nodes');
  });
});
