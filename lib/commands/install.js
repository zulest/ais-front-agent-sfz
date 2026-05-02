import { join, resolve } from 'path';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { detectEngines, ENGINES } from '../installer/detector.js';
import { checkExistingInstallation } from '../installer/validator.js';
import { runInstallPrompts } from '../installer/prompts.js';
import { Writer } from '../installer/writer.js';
import { buildManifest, saveManifest, loadManifest } from '../installer/manifest.js';
import { AIS_DIR } from '../constants/paths.js';
import { CLI_ACCENT_HEX, SLASH_TRIGGER, WORD_TRIGGER } from '../constants/cli.js';
import { CLI_BANNER } from '../constants/cli-banner.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '..', '..');

function getVersion() {
  try {
    const pkg = JSON.parse(readFileSync(join(REPO_ROOT, 'package.json'), 'utf8'));
    return pkg.version ?? '0.0.0';
  } catch {
    return '0.0.0';
  }
}

export default async function install(args) {
  const { default: chalk } = await import('chalk');
  const { default: ora } = await import('ora');

  const projectRoot = resolve(process.cwd());
  const version = getVersion();

  console.log(chalk.hex(CLI_ACCENT_HEX)(CLI_BANNER));
  console.log(chalk.gray('  AIS Agente Front WinForms — instalación\n'));
  console.log(chalk.bold('  Instalación\n'));

  // Check existing installation
  const existing = checkExistingInstallation(projectRoot);
  if (existing.installed) {
    console.log(chalk.yellow(`  AIS Agente Front WinForms ya está instalado (v${existing.version}) en este proyecto.\n`));
    const { default: inquirer } = await import('inquirer');
    const { proceed } = await inquirer.prompt([{
      type: 'confirm',
      name: 'proceed',
      message: '¿Quieres reinstalar o actualizar la configuración?',
      default: false,
    }]);
    if (!proceed) {
      console.log(chalk.gray('\n  Instalación cancelada.\n'));
      return;
    }
  }

  // Detect engines
  const detectedEngines = detectEngines(projectRoot);
  const detected = detectedEngines.filter(e => e.detected).map(e => e.name).join(', ');
  if (detected) {
    console.log(chalk.gray(`  Detected: ${detected}\n`));
  }

  // Collect answers
  let answers;
  try {
    answers = await runInstallPrompts(detectedEngines);
  } catch (err) {
    if (err.isTtyError || err.message?.includes('cancel')) {
      console.log(chalk.gray('\n  Installation cancelled.\n'));
      return;
    }
    throw err;
  }

  const selectedEngines = ENGINES.filter(e => answers.engines.includes(e.id));
  const writer = new Writer(projectRoot);

  const spinner = ora({ text: 'Instalando agentes...', color: 'cyan' }).start();

  try {
    // Install skills for each agent x engine
    for (const agent of answers.agents) {
      for (const engine of selectedEngines) {
        await writer.installSkill(agent, engine.skillsDir);
        if (engine.universalSkillsDir && engine.universalSkillsDir !== engine.skillsDir) {
          await writer.installSkill(agent, engine.universalSkillsDir);
        }
      }
    }

    // Stop spinner before possible interactive conflict prompts
    spinner.stop();

    // Instalar entry file de cada engine (deduplica arquivos compartilhados)
    const seenEntryFiles = new Set();
    for (const engine of selectedEngines) {
      if (seenEntryFiles.has(engine.entryFile)) continue;
      seenEntryFiles.add(engine.entryFile);
      await writer.installEntryFile(engine);
    }

    spinner.start(`Creating ${AIS_DIR}/ structure...`);

    // Criar estrutura .ais-agente-front-winforms/
    writer.createAisDir(answers, version);

    // Se reinstall: atualizar engines/agents/config no state.json existente
    if (existing.installed) {
      const statePath = join(projectRoot, AIS_DIR, 'state.json');
      if (existsSync(statePath)) {
        const s = JSON.parse(readFileSync(statePath, 'utf8'));
        s.engines = answers.engines;
        s.agents = answers.agents;
        s.answer_mode = answers.answer_mode;
        s.output_folder = answers.output_folder;
        writeFileSync(statePath, JSON.stringify(s, null, 2), 'utf8');
      }
    }

    // .gitignore
    if (answers.git_strategy === 'gitignore') {
      writer.updateGitignore(answers.output_folder);
    }

    writer.saveCreatedFiles();

    spinner.text = 'Generating manifest...';

    // Manifest com caminhos relativos, apenas arquivos (não diretórios)
    const existingManifest = existing.installed ? loadManifest(projectRoot) : {};
    const newManifest = buildManifest(projectRoot, writer.manifestPaths);
    saveManifest(projectRoot, { ...existingManifest, ...newManifest });

    spinner.succeed(chalk.hex(CLI_ACCENT_HEX)('Installation complete!'));
  } catch (err) {
    spinner.fail(chalk.red('Error durante la instalación.'));
    throw err;
  }

  // Resumo
  const engineNames = selectedEngines.map(e => e.name).join(', ');
  console.log('');
  console.log(chalk.bold('  Resumen:'));
  console.log(`  ${chalk.cyan('Proyecto:')}  ${answers.project_name}`);
  console.log(`  ${chalk.cyan('Motores:')}   ${engineNames}`);
  console.log(`  ${chalk.cyan('Agentes:')}   ${answers.agents.length} instalados`);
  console.log(`  ${chalk.cyan('Versión:')}   ${version}`);
  console.log('');

  if (selectedEngines.length > 0) {
    const names = selectedEngines.map(e => e.name);
    const namesStr = names.length > 1
      ? names.slice(0, -1).join(', ') + ' o ' + names.slice(-1)[0]
      : names[0];
    const hasSlashEngine = selectedEngines.some(e => e.id !== 'codex');
    const command = hasSlashEngine ? SLASH_TRIGGER : WORD_TRIGGER;
    console.log(chalk.cyan(`  → Abre ${namesStr} y escribe ${command} en el chat`));
  }
  console.log('');
}
