import { resolve, join } from 'path';
import { existsSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';
import { AIS_DIR } from '../constants/paths.js';
import { CLI_ACCENT_HEX } from '../constants/cli.js';

const SFZ_FINGERPRINTS = ['FBSCliente.sln', 'FBSProxies'];

function classifyFiles(files) {
  return {
    presentadores: files.filter(f => f.endsWith('_Presentador.cs')),
    designers: files.filter(f => f.endsWith('.Designer.cs')),
    proxies: files.filter(f => f.startsWith('FBSProxies/') || f.includes('FBSProxies\\')),
    others: files.filter(f =>
      !f.endsWith('_Presentador.cs') &&
      !f.endsWith('.Designer.cs') &&
      !f.startsWith('FBSProxies/') &&
      !f.includes('FBSProxies\\')
    ),
  };
}

export default async function updateContext(_args) {
  const { default: chalk } = await import('chalk');
  const green = chalk.hex(CLI_ACCENT_HEX);
  const projectRoot = resolve(process.cwd());
  const aisDir = join(projectRoot, AIS_DIR);

  if (!existsSync(aisDir)) {
    console.error(chalk.red('\n  Error: No se encontró .ais-agente-front-winforms/'));
    console.error(chalk.gray('  Ejecutá "npx sfz-front install" primero.\n'));
    process.exit(1);
  }

  const hasFingerprint = SFZ_FINGERPRINTS.some(f => existsSync(join(projectRoot, f)));
  if (!hasFingerprint) {
    console.error(chalk.red('\n  Error: Este comando es exclusivo del proyecto frontend SFZ (FBSCliente).'));
    console.error(chalk.gray('  Navegá a la carpeta FBSCliente/ antes de continuar.\n'));
    process.exit(1);
  }

  let diffOutput = '';
  try {
    diffOutput = execSync('git diff HEAD~1 --name-only', { cwd: projectRoot, encoding: 'utf8' });
  } catch {
    try {
      diffOutput = execSync('git diff --name-only', { cwd: projectRoot, encoding: 'utf8' });
    } catch {
      console.warn(chalk.yellow('\n  Advertencia: No se pudo leer el historial de git.'));
      console.warn(chalk.gray('  Asegurate de estar en un repositorio git con al menos un commit.\n'));
    }
  }

  const changedFiles = diffOutput.trim().split('\n').filter(Boolean);
  const classified = classifyFiles(changedFiles);

  console.log(green('\n  AIS Agente Front WinForms — Actualización de contexto SFZ\n'));

  if (changedFiles.length === 0) {
    console.log(chalk.gray('  No se detectaron cambios desde el último commit.\n'));
  } else {
    if (classified.presentadores.length > 0) {
      console.log(chalk.bold('  Presentadores modificados (lógica):'));
      classified.presentadores.forEach(f => console.log(chalk.gray(`    ${f}`)));
      console.log(chalk.yellow('  → Activar /ais-actualizador-contexto-front para sincronizar\n'));
    }
    if (classified.designers.length > 0) {
      console.log(chalk.bold('  Vistas/Designers modificados (UI):'));
      classified.designers.forEach(f => console.log(chalk.gray(`    ${f}`)));
      console.log(chalk.yellow('  → Activar /ais-actualizador-contexto-front para sincronizar\n'));
    }
    if (classified.proxies.length > 0) {
      console.log(chalk.bold('  FBSProxies modificados (contratos API):'));
      classified.proxies.forEach(f => console.log(chalk.gray(`    ${f}`)));
      console.log(chalk.yellow('  → Activar /ais-mapeador-proxy-rest para actualizar mapeo\n'));
    }
    if (classified.others.length > 0) {
      console.log(chalk.bold('  Otros archivos modificados:'));
      classified.others.forEach(f => console.log(chalk.gray(`    ${f}`)));
      console.log('');
    }
  }

  const syncData = {
    timestamp: new Date().toISOString(),
    changed_files: changedFiles,
    ...classified,
  };

  writeFileSync(join(aisDir, 'last-sync.json'), JSON.stringify(syncData, null, 2), 'utf8');

  console.log(chalk.gray(`  Reporte guardado en ${AIS_DIR}/last-sync.json`));
  console.log(chalk.gray('  Activá /sfz-front en tu motor de IA para continuar con la sincronización.\n'));
}
