import { describe, it, expect } from 'vitest';
import { mkdtempSync, readFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { Writer } from '../lib/installer/writer.js';
import { AIS_DIR } from '../lib/constants/paths.js';

describe('Writer', () => {
  it('renders config.toml with the selected output folder', () => {
    const projectRoot = mkdtempSync(join(tmpdir(), 'ais-agente-front-winforms-'));
    const writer = new Writer(projectRoot);

    writer.createAisDir(
      {
        project_name: 'Test Project',
        user_name: 'Test User',
        chat_language: 'pt-br',
        doc_language: 'pt-br',
        answer_mode: 'chat',
        output_folder: '_custom_sdd',
        engines: [],
        agents: [],
      },
      '0.0.0-test'
    );

    const configPath = join(projectRoot, AIS_DIR, 'config.toml');
    const config = readFileSync(configPath, 'utf8');

    expect(config).toContain('folder = "_custom_sdd"');
  });
});
