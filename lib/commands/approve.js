import { resolve, join, relative } from 'path';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { AIS_DIR } from '../constants/paths.js';
import { CLI_ACCENT_HEX } from '../constants/cli.js';
import { appendAuditEntry } from './audit.js';

const VALID_STATUSES = ['draft', 'pending-review', 'approved', 'rejected'];

function readUser(aisDir) {
  const stateFile = join(aisDir, 'state.json');
  if (!existsSync(stateFile)) return null;
  try {
    return JSON.parse(readFileSync(stateFile, 'utf8')).user_name ?? null;
  } catch { return null; }
}

function setFrontmatterField(content, key, value) {
  const fmRegex = /^---\n([\s\S]*?)\n---/;
  const match = content.match(fmRegex);
  if (!match) return content;

  let fm = match[1];
  const fieldRegex = new RegExp(`^${key}:.*$`, 'm');

  if (fieldRegex.test(fm)) {
    fm = fm.replace(fieldRegex, `${key}: ${value}`);
  } else {
    fm = fm + `\n${key}: ${value}`;
  }

  return content.replace(fmRegex, `---\n${fm}\n---`);
}

export default async function approve(args) {
  const { default: chalk } = await import('chalk');
  const green = chalk.hex(CLI_ACCENT_HEX);
  const projectRoot = resolve(process.cwd());
  const aisDir = join(projectRoot, AIS_DIR);

  const [targetArg, statusArg] = args;

  if (!targetArg || targetArg === '--help') {
    console.log(green('\n  sfz-front approve <archivo> [status]\n'));
    console.log('  Cambia el estado de una spec o plan para el flujo de aprobación.\n');
    console.log('  Estados válidos: draft | pending-review | approved | rejected');
    console.log('  Por defecto aplica: approved\n');
    console.log('  Ejemplos:');
    console.log('    npx sfz-front approve _ais_sdd/changes/2026-05-02-clientes.md');
    console.log('    npx sfz-front approve _ais_sdd/plans/2026-05-02-clientes.md rejected\n');
    process.exit(0);
  }

  const status = statusArg && VALID_STATUSES.includes(statusArg) ? statusArg : 'approved';
  const targetPath = resolve(projectRoot, targetArg);

  if (!existsSync(targetPath)) {
    console.error(chalk.red(`\n  Error: No se encontró el archivo "${targetArg}"\n`));
    process.exit(1);
  }

  if (!targetPath.endsWith('.md')) {
    console.error(chalk.red('\n  Error: Solo se pueden aprobar archivos .md (specs o planes)\n'));
    process.exit(1);
  }

  let content = readFileSync(targetPath, 'utf8');
  const fmRegex = /^---\n([\s\S]*?)\n---/;
  if (!fmRegex.test(content)) {
    console.error(chalk.red('\n  Error: El archivo no tiene frontmatter YAML válido (---)\n'));
    process.exit(1);
  }

  const user = readUser(aisDir);
  const now = new Date().toISOString();

  content = setFrontmatterField(content, 'status', status);
  content = setFrontmatterField(content, 'approved_by', user ?? 'unknown');
  content = setFrontmatterField(content, 'approved_at', now);

  writeFileSync(targetPath, content, 'utf8');

  if (existsSync(aisDir)) {
    appendAuditEntry(aisDir, {
      operation: 'approve',
      agent: 'cli:sfz-front',
      artifact: relative(projectRoot, targetPath),
      user,
      meta: { status },
    });
  }

  const label = {
    approved: chalk.green('✅ aprobado'),
    rejected: chalk.red('❌ rechazado'),
    'pending-review': chalk.yellow('⏳ pendiente de revisión'),
    draft: chalk.gray('📝 borrador'),
  }[status] ?? status;

  console.log(green('\n  AIS Agente Front WinForms — Aprobación\n'));
  console.log(`  ${label}: ${chalk.bold(targetArg)}`);
  if (user) console.log(chalk.gray(`  Por: ${user} · ${now}`));
  console.log('');
}
