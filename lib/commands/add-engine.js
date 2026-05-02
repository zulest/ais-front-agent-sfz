import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join, resolve } from 'path';
import { checkExistingInstallation } from '../installer/validator.js';
import { detectEngines, ENGINES } from '../installer/detector.js';
import { Writer } from '../installer/writer.js';
import { loadManifest, saveManifest, buildManifest } from '../installer/manifest.js';
import { applyOrangeTheme, ORANGE_PREFIX } from '../installer/orange-prompts.js';
import { AIS_DIR } from '../constants/paths.js';
import { CLI_ACCENT_HEX, NPX_SHORT } from '../constants/cli.js';

export default async function addEngine(args) {
  const { default: chalk } = await import('chalk');
  const { default: inquirer } = await import('inquirer');
  applyOrangeTheme();

  const projectRoot = resolve(process.cwd());

  console.log(chalk.bold('\n  AIS Agente Front WinForms: Agregar engine\n'));

  const existing = checkExistingInstallation(projectRoot);
  if (!existing.installed) {
    console.log(chalk.yellow('  AIS Agente Front WinForms no está instalado en este directorio.'));
    console.log('  Ejecuta ' + chalk.bold(`${NPX_SHORT} install`) + ' para instalar.\n');
    return;
  }

  const state = existing.state;

  // Validate required fields
  if (!Array.isArray(state.agents) || state.agents.length === 0) {
    console.log(chalk.red('  state.json no tiene agentes registrados.'));
    console.log('  Ejecuta ' + chalk.bold(`${NPX_SHORT} install`) + ' primero.\n');
    return;
  }

  const installedEngineIds = new Set(state.engines ?? []);
  const installedAgents = state.agents;

  const allEngines = detectEngines(projectRoot);
  const notInstalled = allEngines.filter(e => !installedEngineIds.has(e.id));

  if (notInstalled.length === 0) {
    console.log(chalk.hex(CLI_ACCENT_HEX)('  Todos los motores detectados ya están configurados.\n'));
    return;
  }

  const choices = notInstalled.map(e => ({
    name: `${e.name}${e.star ? ' ⭐' : ''}${e.detected ? chalk.gray(' (detectado)') : ''}`,
    value: e.id,
    checked: e.detected,
  }));

  const { selected } = await inquirer.prompt([{
    prefix: ORANGE_PREFIX,
    type: 'checkbox',
    name: 'selected',
    message: 'Selecciona los engines a agregar:',
    choices,
    validate: (v) => v.length > 0 || 'Selecciona al menos un engine.',
  }]);

  const selectedEngines = ENGINES.filter(e => selected.includes(e.id));
  const writer = new Writer(projectRoot);

  const seenEntryFiles = new Set();
  for (const engine of selectedEngines) {
    if (!seenEntryFiles.has(engine.entryFile)) {
      seenEntryFiles.add(engine.entryFile);
      await writer.installEntryFile(engine);
    }
    for (const agent of installedAgents) {
      await writer.installSkill(agent, engine.skillsDir);
      if (engine.universalSkillsDir && engine.universalSkillsDir !== engine.skillsDir) {
        await writer.installSkill(agent, engine.universalSkillsDir);
      }
    }
    console.log(chalk.hex(CLI_ACCENT_HEX)(`  ✓  ${engine.name}`));
  }

  // Atualizar state.json
  const statePath = join(projectRoot, AIS_DIR, 'state.json');
  const s = JSON.parse(readFileSync(statePath, 'utf8'));
  s.engines = [...new Set([...(s.engines ?? []), ...selected])];
  writeFileSync(statePath, JSON.stringify(s, null, 2), 'utf8');

  writer.saveCreatedFiles();

  // Atualizar manifest com caminhos relativos
  const existingManifest = loadManifest(projectRoot);
  const newManifest = buildManifest(projectRoot, writer.manifestPaths);
  saveManifest(projectRoot, { ...existingManifest, ...newManifest });

  console.log(chalk.bold(`\n  ${selected.length} engine(s) agregados correctamente.\n`));
}
