import { existsSync, readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { checkExistingInstallation } from '../installer/validator.js';
import { Writer } from '../installer/writer.js';
import { loadManifest, saveManifest, buildManifest } from '../installer/manifest.js';
import { ENGINES } from '../installer/detector.js';
import { applyOrangeTheme, ORANGE_PREFIX } from '../installer/orange-prompts.js';
import { AIS_DIR } from '../constants/paths.js';
import { CLI_ACCENT_HEX, NPX_SHORT } from '../constants/cli.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '..', '..');
const AGENTS_DIR = join(REPO_ROOT, 'agents');

const AGENT_LABELS = {
  'ais-agente-front-winforms':    'AIS: orquestador cliente (/sfz-front)',
  'ais-inventariador-winforms':     'AIS: inventariador WinForms',
  'ais-extractor-forms-winforms':   'AIS: extractor de forms WinForms',
  'ais-analista-codigo':            'AIS: analista de código',
  'ais-analista-reglas-negocio':    'AIS: analista de reglas de negocio',
  'ais-mapeador-proxy-rest':        'AIS: mapeador Proxy→REST',
  'ais-arquitecto-sistema':         'AIS: arquitecto de sistema',
  'ais-redactor-especificaciones':  'AIS: redactor de especificaciones',
  'ais-revisor-especificaciones':   'AIS: revisor de especificaciones',
  'ais-documentador-ui':            'AIS: documentador UI (screenshots)',
  'ais-data-master':                'AIS: maestro de datos (base de datos)',
  'ais-design-system':              'AIS: sistema de diseño (tokens/temas)',
  'ais-agents-help':                'AIS: ayuda de agentes (analogías)',
  'ais-reconstructor':              'AIS: Reconstructor (reconstrucción desde specs)',
};

export default async function addAgent(args) {
  const { default: chalk } = await import('chalk');
  const { default: inquirer } = await import('inquirer');
  applyOrangeTheme();

  const projectRoot = resolve(process.cwd());

  console.log(chalk.bold('\n  AIS Agente Front WinForms: Agregar agente\n'));

  const existing = checkExistingInstallation(projectRoot);
  if (!existing.installed) {
    console.log(chalk.yellow('  AIS Agente Front WinForms no está instalado en este directorio.'));
    console.log('  Ejecuta ' + chalk.bold(`${NPX_SHORT} install`) + ' para instalar.\n');
    return;
  }

  const state = existing.state;

  if (!Array.isArray(state.engines) || state.engines.length === 0) {
    console.log(chalk.red('  state.json no tiene motores configurados.'));
    console.log('  Ejecuta ' + chalk.bold(`${NPX_SHORT} install`) + ' o ' + chalk.bold(`${NPX_SHORT} add-engine`) + ' primero.\n');
    return;
  }

  const installedAgents = new Set(state.agents ?? []);
  const installedEngines = ENGINES.filter(e => state.engines.includes(e.id));

  let availableAgents = [];
  try {
    availableAgents = readdirSync(AGENTS_DIR, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => d.name)
      .filter(name => !installedAgents.has(name));
  } catch {
    console.log(chalk.red('  No se pudo leer la carpeta agents.\n'));
    return;
  }

  if (availableAgents.length === 0) {
    console.log(chalk.hex(CLI_ACCENT_HEX)('  Todos los agentes disponibles ya están instalados.\n'));
    return;
  }

  const choices = availableAgents.map(id => ({
    name: AGENT_LABELS[id] ?? id,
    value: id,
    checked: true,
  }));

  const { selected } = await inquirer.prompt([{
    prefix: ORANGE_PREFIX,
    type: 'checkbox',
    name: 'selected',
    message: 'Selecciona los agentes a agregar:',
    choices,
    validate: (v) => v.length > 0 || 'Selecciona al menos un agente.',
  }]);

  const writer = new Writer(projectRoot);

  for (const agent of selected) {
    for (const engine of installedEngines) {
      await writer.installSkill(agent, engine.skillsDir);
      if (engine.universalSkillsDir && engine.universalSkillsDir !== engine.skillsDir) {
        await writer.installSkill(agent, engine.universalSkillsDir);
      }
    }
    console.log(chalk.hex(CLI_ACCENT_HEX)(`  ✓  ${AGENT_LABELS[agent] ?? agent}`));
  }

  const statePath = join(projectRoot, AIS_DIR, 'state.json');
  const s = JSON.parse(readFileSync(statePath, 'utf8'));
  s.agents = [...new Set([...(s.agents ?? []), ...selected])];
  writeFileSync(statePath, JSON.stringify(s, null, 2), 'utf8');

  writer.saveCreatedFiles();

  const existingManifest = loadManifest(projectRoot);
  const newManifest = buildManifest(projectRoot, writer.manifestPaths);
  saveManifest(projectRoot, { ...existingManifest, ...newManifest });

  console.log(chalk.bold(`\n  ${selected.length} agente(s) agregados correctamente.\n`));
}
