import { resolve, join, relative } from 'path';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { AIS_DIR } from '../constants/paths.js';
import { CLI_ACCENT_HEX } from '../constants/cli.js';
import { appendAuditEntry } from './audit.js';

const PROVIDERS = ['azuredevops', 'jira', 'github', 'none'];

function readState(aisDir) {
  const stateFile = join(aisDir, 'state.json');
  if (!existsSync(stateFile)) return {};
  try { return JSON.parse(readFileSync(stateFile, 'utf8')); } catch { return {}; }
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

export default async function linkTicket(args) {
  const { default: chalk } = await import('chalk');
  const green = chalk.hex(CLI_ACCENT_HEX);
  const projectRoot = resolve(process.cwd());
  const aisDir = join(projectRoot, AIS_DIR);

  const [targetArg, ticketIdArg] = args;

  if (!targetArg || targetArg === '--help' || !ticketIdArg) {
    console.log(green('\n  sfz-front link-ticket <archivo> <ticket-id>\n'));
    console.log('  Vincula una spec o plan a un ticket de Azure DevOps, Jira, o GitHub.\n');
    console.log('  El ID del ticket se guarda en el frontmatter del archivo.');
    console.log('  El proveedor se lee de state.json (campo ticket_provider).\n');
    console.log('  Ejemplos:');
    console.log('    npx sfz-front link-ticket _ais_sdd/changes/2026-05-02-clientes.md PROJ-1234');
    console.log('    npx sfz-front link-ticket _ais_sdd/changes/2026-05-02-clientes.md AB#567\n');
    process.exit(0);
  }

  const targetPath = resolve(projectRoot, targetArg);

  if (!existsSync(targetPath)) {
    console.error(chalk.red(`\n  Error: No se encontró el archivo "${targetArg}"\n`));
    process.exit(1);
  }

  if (!targetPath.endsWith('.md')) {
    console.error(chalk.red('\n  Error: Solo se pueden vincular archivos .md (specs o planes)\n'));
    process.exit(1);
  }

  let content = readFileSync(targetPath, 'utf8');
  const fmRegex = /^---\n([\s\S]*?)\n---/;
  if (!fmRegex.test(content)) {
    console.error(chalk.red('\n  Error: El archivo no tiene frontmatter YAML válido (---)\n'));
    process.exit(1);
  }

  const state = readState(aisDir);
  const provider = PROVIDERS.includes(state.ticket_provider) ? state.ticket_provider : 'none';
  const ticketId = ticketIdArg.trim();

  content = setFrontmatterField(content, 'ticket', ticketId);
  content = setFrontmatterField(content, 'ticket_provider', provider);
  content = setFrontmatterField(content, 'ticket_linked_at', new Date().toISOString());

  writeFileSync(targetPath, content, 'utf8');

  if (existsSync(aisDir)) {
    appendAuditEntry(aisDir, {
      operation: 'link-ticket',
      agent: 'cli:sfz-front',
      artifact: relative(projectRoot, targetPath),
      user: state.user_name ?? null,
      meta: { ticket: ticketId, provider },
    });
  }

  console.log(green('\n  AIS Agente Front WinForms — Vinculación de ticket\n'));
  console.log(`  Ticket vinculado: ${chalk.bold(ticketId)}`);
  console.log(`  Archivo: ${chalk.bold(targetArg)}`);
  if (provider !== 'none') console.log(`  Proveedor: ${chalk.gray(provider)}`);
  console.log('');
}
