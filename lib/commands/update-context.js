import { resolve, join, basename } from 'path';
import { existsSync, writeFileSync, readFileSync, readdirSync } from 'fs';
import { execSync } from 'child_process';
import { AIS_DIR, AIS_OUTPUT_DIR } from '../constants/paths.js';
import { CLI_ACCENT_HEX } from '../constants/cli.js';
import { appendAuditEntry } from './audit.js';

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

/**
 * Detects which specs in _ais_sdd/sdd/ are stale by comparing their
 * git modification timestamp against the changed C# files list.
 * Marks stale specs by injecting/updating "stale: true" in their frontmatter.
 */
function detectAndMarkStaleSpecs(projectRoot, outputDir, changedCs, chalk) {
  const sddDir = join(projectRoot, outputDir, 'sdd');
  if (!existsSync(sddDir)) return [];

  const specFiles = readdirSync(sddDir).filter(f => f.endsWith('.md'));
  const staleSpecs = [];

  for (const specFile of specFiles) {
    const specPath = join(sddDir, specFile);
    const specContent = readFileSync(specPath, 'utf8');

    // Extract which module/concept this spec covers from its filename
    // Convention: ClienteDetalle.md covers Clientes/ module
    const concept = basename(specFile, '.md').toLowerCase();

    // A spec is stale if any changed C# file contains the concept name
    const isStale = changedCs.some(f => f.toLowerCase().includes(concept));
    if (!isStale) continue;

    // Mark stale in frontmatter
    const fmRegex = /^---\n([\s\S]*?)\n---/;
    const match = specContent.match(fmRegex);
    if (!match) continue;

    let fm = match[1];
    if (/^stale:/m.test(fm)) {
      fm = fm.replace(/^stale:.*$/m, 'stale: true');
    } else {
      fm = fm + '\nstale: true';
    }

    writeFileSync(specPath, specContent.replace(fmRegex, `---\n${fm}\n---`), 'utf8');
    staleSpecs.push(specFile);
  }

  return staleSpecs;
}

/**
 * Generates _ais_sdd/health.md with a freshness dashboard per spec.
 */
function generateHealthDashboard(projectRoot, outputDir, staleSpecs) {
  const sddDir = join(projectRoot, outputDir, 'sdd');
  const healthPath = join(projectRoot, outputDir, 'health.md');

  let allSpecs = [];
  if (existsSync(sddDir)) {
    allSpecs = readdirSync(sddDir).filter(f => f.endsWith('.md'));
  }

  const now = new Date().toISOString().slice(0, 10);
  const staleSet = new Set(staleSpecs);

  const rows = allSpecs.map(f => {
    const status = staleSet.has(f) ? '🔴 Desactualizada' : '🟢 Al día';
    return `| ${f.replace('.md', '')} | ${status} |`;
  });

  const content = `# Health Dashboard — FBSCliente WinForms SFZ

**Generado:** ${now}
**Specs totales:** ${allSpecs.length} · **Desactualizadas:** ${staleSpecs.length}

| Spec | Estado |
|------|--------|
${rows.join('\n')}

---
_Actualizado automáticamente por \`npx sfz-front update-context\`. Activá \`/ais-detector-deriva\` para un análisis profundo de las secciones desactualizadas._
`;

  writeFileSync(healthPath, content, 'utf8');
}

export default async function updateContext(_args) {
  const { default: chalk } = await import('chalk');
  const green = chalk.hex(CLI_ACCENT_HEX);
  const projectRoot = resolve(process.cwd());
  const aisDir = join(projectRoot, AIS_DIR);
  const outputDir = AIS_OUTPUT_DIR;

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

  // Read user and git_strategy from state.json for audit entries
  let user = null;
  let gitStrategy = 'commit';
  const stateFile = join(aisDir, 'state.json');
  if (existsSync(stateFile)) {
    try {
      const state = JSON.parse(readFileSync(stateFile, 'utf8'));
      user = state.user_name ?? null;
      gitStrategy = state.git_strategy ?? 'commit';
    } catch { /* ignore */ }
  }

  let diffOutput = '';
  if (gitStrategy !== 'none') {
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

  // Stale spec detection
  const csFiles = [...classified.presentadores, ...classified.designers, ...classified.others.filter(f => f.endsWith('.cs'))];
  const staleSpecs = detectAndMarkStaleSpecs(projectRoot, outputDir, csFiles, chalk);

  if (staleSpecs.length > 0) {
    console.log(chalk.yellow(`  ⚠️  Specs desactualizadas detectadas (${staleSpecs.length}):`));
    staleSpecs.forEach(f => console.log(chalk.gray(`    ${outputDir}/sdd/${f}`)));
    console.log(chalk.yellow('  → Activar /ais-detector-deriva para análisis profundo de deriva\n'));

    generateHealthDashboard(projectRoot, outputDir, staleSpecs);
    console.log(chalk.gray(`  Dashboard de salud actualizado en ${outputDir}/health.md`));
  } else if (changedFiles.length > 0) {
    generateHealthDashboard(projectRoot, outputDir, []);
  }

  const syncData = {
    timestamp: new Date().toISOString(),
    changed_files: changedFiles,
    stale_specs: staleSpecs,
    ...classified,
  };

  writeFileSync(join(aisDir, 'last-sync.json'), JSON.stringify(syncData, null, 2), 'utf8');

  appendAuditEntry(aisDir, {
    operation: 'update-context',
    agent: 'cli:sfz-front',
    user,
    meta: {
      changed: changedFiles.length,
      stale_specs: staleSpecs.length,
      presentadores: classified.presentadores.length,
      designers: classified.designers.length,
      proxies: classified.proxies.length,
    },
  });

  console.log(chalk.gray(`\n  Reporte guardado en ${AIS_DIR}/last-sync.json`));
  console.log(chalk.gray('  Activá /sfz-front en tu motor de IA para continuar con la sincronización.\n'));
}
