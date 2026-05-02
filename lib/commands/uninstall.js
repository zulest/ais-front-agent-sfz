import { existsSync, readFileSync, rmSync, unlinkSync, statSync } from 'fs';
import { join, resolve } from 'path';
import { checkExistingInstallation } from '../installer/validator.js';
import { loadManifest, fileStatus } from '../installer/manifest.js';
import { AIS_DIR, AIS_OUTPUT_DIR } from '../constants/paths.js';
import { CLI_ACCENT_HEX } from '../constants/cli.js';

export default async function uninstall(args) {
  const { default: chalk } = await import('chalk');
  const { default: inquirer } = await import('inquirer');

  const projectRoot = resolve(process.cwd());

  console.log(chalk.bold('\n  AIS Agente Front WinForms: Desinstalar\n'));

  const existing = checkExistingInstallation(projectRoot);
  if (!existing.installed) {
    console.log(chalk.yellow('  AIS Agente Front WinForms no está instalado en este directorio.\n'));
    return;
  }

  const state = existing.state;
  const createdFiles = state.created_files ?? [];
  const outputFolder = state.output_folder ?? AIS_OUTPUT_DIR;

  // Classificar arquivos via manifest
  const manifest = loadManifest(projectRoot);
  const toRemove = [];
  const modifiedFiles = [];

  for (const relPath of createdFiles) {
    const hash = manifest[relPath];
    if (hash) {
      const status = fileStatus(projectRoot, relPath, hash);
      if (status === 'modified') {
        modifiedFiles.push(relPath);
        continue; // será tratado separadamente
      }
    }
    const absPath = join(projectRoot, relPath);
    if (existsSync(absPath)) toRemove.push(relPath);
  }

  // Separar em categorias para exibição
  const skillEntries = toRemove.filter(f => f.replace(/\\/g, '/').includes('skills'));
  const entryFiles   = toRemove.filter(f =>
    ['CLAUDE.md', 'AGENTS.md', 'GEMINI.md', '.cursorrules', '.windsurfrules', '.gitignore']
      .some(name => f.endsWith(name))
  );
  const otherFiles   = toRemove.filter(f => !skillEntries.includes(f) && !entryFiles.includes(f));

  console.log('  Archivos a eliminar:\n');

  if (entryFiles.length > 0) {
    console.log(chalk.bold('  Archivos de entrada:'));
    entryFiles.forEach(f => console.log(chalk.red(`    ✗  ${f}`)));
  }
  if (skillEntries.length > 0) {
    const skillDirs = [...new Set(skillEntries.map(f =>
      f.replace(/\\/g, '/').split('/').slice(0, 3).join('/')
    ))];
    console.log(chalk.bold(`\n  Skills:`));
    skillDirs.forEach(d => console.log(chalk.red(`    ✗  ${d}/`)));
  }
  if (otherFiles.length > 0) {
    console.log(chalk.bold('\n  Otros:'));
    otherFiles.forEach(f => console.log(chalk.red(`    ✗  ${f}`)));
  }

  console.log(chalk.bold('\n  Folders:'));
  console.log(chalk.red(`    ✗  ${AIS_DIR}/`));

  const outputDir = join(projectRoot, outputFolder);
  const hasOutputDir = existsSync(outputDir);
  if (hasOutputDir) {
    console.log(chalk.yellow(`    ?  ${outputFolder}/  (se pregunta aparte)`));
  }

  // Warn about modified files
  if (modifiedFiles.length > 0) {
    console.log(chalk.yellow(`\n  ${modifiedFiles.length} archivo(s) modificados por ti se mantendrán:`));
    modifiedFiles.forEach(f => console.log(chalk.gray(`    ✎  ${f}`)));
  }

  console.log('');

  // Confirmação explícita
  const { confirmed } = await inquirer.prompt([{
    type: 'input',
    name: 'confirmed',
    message: `Escribe ${chalk.red('"remove"')} para confirmar la desinstalación:`,
    validate: (v) => v === 'remove' || 'Escribe exactamente "remove" para confirmar.',
  }]);

  if (confirmed !== 'remove') {
    console.log(chalk.gray('\n  Desinstalación cancelada.\n'));
    return;
  }

  let removed = 0;
  let errors = 0;

  for (const relPath of toRemove) {
    const absPath = join(projectRoot, relPath);
    try {
      if (existsSync(absPath)) {
        if (statSync(absPath).isDirectory()) {
          rmSync(absPath, { recursive: true, force: true });
        } else {
          unlinkSync(absPath);
        }
        removed++;
      }
    } catch {
      console.error(chalk.red(`    Error removing: ${relPath}`));
      errors++;
    }
  }

  // Eliminar .ais-agente-front-winforms/ por completo
  const runtimeDir = join(projectRoot, AIS_DIR);
  try {
    if (existsSync(runtimeDir)) {
      rmSync(runtimeDir, { recursive: true, force: true });
      removed++;
    }
  } catch {
    console.error(chalk.red(`    Error eliminando ${AIS_DIR}/`));
    errors++;
  }

  // Pasta de saída — perguntar separadamente
  if (hasOutputDir) {
    console.log('');
    const { removeOutput } = await inquirer.prompt([{
      type: 'confirm',
      name: 'removeOutput',
      message: `¿Eliminar también la carpeta de especificaciones ${chalk.cyan(outputFolder + '/')}?`,
      default: false,
    }]);
    if (removeOutput) {
      try {
        rmSync(outputDir, { recursive: true, force: true });
        console.log(chalk.red(`  ✗  ${outputFolder}/ eliminada.`));
      } catch {
        console.error(chalk.red(`  Error eliminando ${outputFolder}/`));
      }
    } else {
      console.log(chalk.gray(`  → ${outputFolder}/ se mantiene.`));
    }
  }

  console.log('');
  if (errors === 0) {
    console.log(chalk.hex(CLI_ACCENT_HEX)('  AIS Agente Front WinForms se desinstaló correctamente.\n'));
  } else {
    console.log(chalk.yellow(`  Completado con ${errors} error(es). Revisa los archivos arriba.\n`));
  }
}
