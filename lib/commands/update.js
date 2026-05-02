import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join, resolve } from 'path';
import { checkExistingInstallation } from '../installer/validator.js';
import { loadManifest, saveManifest, buildManifest, fileStatus } from '../installer/manifest.js';
import { Writer } from '../installer/writer.js';
import { ENGINES } from '../installer/detector.js';
import { applyOrangeTheme, ORANGE_PREFIX } from '../installer/orange-prompts.js';
import { AIS_DIR } from '../constants/paths.js';
import { CLI_ACCENT_HEX, NPM_PACKAGE, NPX_SHORT } from '../constants/cli.js';

async function fetchLatestVersion(packageName) {
  try {
    const res = await fetch(`https://registry.npmjs.org/${packageName}/latest`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.version ?? null;
  } catch {
    return null;
  }
}

export default async function update(args) {
  const { default: chalk } = await import('chalk');
  const { default: ora } = await import('ora');
  const { default: semver } = await import('semver');

  const projectRoot = resolve(process.cwd());

  console.log(chalk.bold('\n  AIS Agente Front WinForms: Actualizar\n'));

  const existing = checkExistingInstallation(projectRoot);
  if (!existing.installed) {
    console.log(chalk.yellow('  AIS Agente Front WinForms no está instalado en este directorio.'));
    console.log('  Ejecuta ' + chalk.bold(`${NPX_SHORT} install`) + ' para instalar.\n');
    return;
  }

  const installedVersion = existing.version;

  // Validate installed version before comparing
  if (!semver.valid(installedVersion)) {
    console.log(chalk.yellow(`  Versión instalada inválida: "${installedVersion}". Ejecuta ${NPX_SHORT} install para corregirlo.\n`));
    return;
  }

  // Check version on npm
  const spinner = ora({ text: 'Buscando la última versión...', color: 'cyan' }).start();
  const latestVersion = await fetchLatestVersion(NPM_PACKAGE);
  spinner.stop();

  if (latestVersion && semver.valid(latestVersion)) {
    if (!semver.lt(installedVersion, latestVersion)) {
      console.log(chalk.hex(CLI_ACCENT_HEX)(`  Ya estás en la última versión (v${installedVersion}).\n`));
      return;
    }
    console.log(`  Versión instalada:  ${chalk.yellow('v' + installedVersion)}`);
    console.log(`  Versión disponible: ${chalk.hex(CLI_ACCENT_HEX)('v' + latestVersion)}\n`);
  } else {
    console.log(chalk.gray(`  Versión instalada: v${installedVersion}`));
    console.log(chalk.gray('  No se pudo verificar la versión en npm. Continuando sin conexión.\n'));
  }

  // Carregar manifest e classificar arquivos
  const manifest = loadManifest(projectRoot);
  const state = existing.state;
  const installedAgents = state.agents ?? [];
  const installedEngineIds = state.engines ?? [];
  const installedEngines = ENGINES.filter(e => installedEngineIds.includes(e.id));

  const modified = [];
  const intact = [];
  const missing = [];

  for (const [relPath, hash] of Object.entries(manifest)) {
    const status = fileStatus(projectRoot, relPath, hash);
    if (status === 'modified') modified.push(relPath);
    else if (status === 'missing') missing.push(relPath);
    else intact.push(relPath);
  }

  if (modified.length > 0) {
    console.log(chalk.yellow(`  ${modified.length} archivo(s) modificados por ti se mantendrán:`));
    modified.forEach(f => console.log(chalk.gray(`    ✎  ${f}`)));
    console.log('');
  }
  if (missing.length > 0) {
    console.log(chalk.cyan(`  ${missing.length} archivo(s) faltantes se restaurarán:`));
    missing.forEach(f => console.log(chalk.gray(`    +  ${f}`)));
    console.log('');
  }

  const toUpdate = intact.length + missing.length;
  console.log(`  ${toUpdate} archivo(s) se actualizarán.`);
  if (toUpdate === 0 && !latestVersion) {
    console.log(chalk.gray('  No hay archivos para actualizar.\n'));
    return;
  }

  const { default: inquirer } = await import('inquirer');
  applyOrangeTheme();
  const { confirm } = await inquirer.prompt([{
    prefix: ORANGE_PREFIX,
    type: 'confirm',
    name: 'confirm',
    message: '¿Confirmas la actualización?',
    default: true,
  }]);
  if (!confirm) {
    console.log(chalk.gray('\n  Actualización cancelada.\n'));
    return;
  }

  const writer = new Writer(projectRoot);
  const updateSpinner = ora({ text: 'Actualizando agentes...', color: 'cyan' }).start();

  try {
    // Reinstalar skills (intactos + ausentes; pular modificados)
    for (const agent of installedAgents) {
      for (const engine of installedEngines) {
        const relDir = join(engine.skillsDir, agent).replace(/\\/g, '/');
        const isModified = modified.some(f => f.replace(/\\/g, '/').startsWith(relDir));
        if (!isModified) {
          const { rmSync } = await import('fs');
          const dest = join(projectRoot, engine.skillsDir, agent);
          if (existsSync(dest)) rmSync(dest, { recursive: true, force: true });
          await writer.installSkill(agent, engine.skillsDir);
        }

        if (engine.universalSkillsDir && engine.universalSkillsDir !== engine.skillsDir) {
          const uRelDir = join(engine.universalSkillsDir, agent).replace(/\\/g, '/');
          const uIsModified = modified.some(f => f.replace(/\\/g, '/').startsWith(uRelDir));
          if (!uIsModified) {
            const { rmSync } = await import('fs');
            const uDest = join(projectRoot, engine.universalSkillsDir, agent);
            if (existsSync(uDest)) rmSync(uDest, { recursive: true, force: true });
            await writer.installSkill(agent, engine.universalSkillsDir);
          }
        }
      }
    }

    updateSpinner.text = 'Actualizando archivos de entrada...';

    // Atualizar entry files intactos ou ausentes
    for (const engine of installedEngines) {
      const relEntry = engine.entryFile;
      const hash = manifest[relEntry];
      if (!hash) continue; // no instalado por AIS Agente Front WinForms — no tocar
      const status = fileStatus(projectRoot, relEntry, hash);
      if (status === 'intact' || status === 'missing') {
        await writer.installEntryFile(engine, { force: true });
      }
    }

    updateSpinner.text = 'Actualizando versión...';

    if (latestVersion && semver.valid(latestVersion)) {
      writeFileSync(join(projectRoot, AIS_DIR, 'version'), latestVersion, 'utf8');
      const statePath = join(projectRoot, AIS_DIR, 'state.json');
      const s = JSON.parse(readFileSync(statePath, 'utf8'));
      s.version = latestVersion;
      writeFileSync(statePath, JSON.stringify(s, null, 2), 'utf8');
    }

    updateSpinner.text = 'Actualizando manifest...';

    writer.saveCreatedFiles();
    const newManifest = buildManifest(projectRoot, writer.manifestPaths);
    // Mesclar com manifest existente (preservar entradas de arquivos não tocados)
    const intactEntries = Object.fromEntries(
      intact.map(r => [r, manifest[r]])
    );
    saveManifest(projectRoot, { ...intactEntries, ...newManifest });

    updateSpinner.succeed(chalk.hex(CLI_ACCENT_HEX)('¡Actualización completada!'));
  } catch (err) {
    updateSpinner.fail(chalk.red('Error durante la actualización.'));
    throw err;
  }

  if (modified.length > 0) {
    console.log(chalk.yellow(`\n  ${modified.length} archivo(s) mantenidos (modificados por ti).`));
  }
  console.log('');
}
