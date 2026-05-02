import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { AIS_DIR } from '../constants/paths.js';
import { CLI_ACCENT_HEX, NPX_SHORT } from '../constants/cli.js';

export default async function status(args) {
  const { default: chalk } = await import('chalk');

  const statePath = join(process.cwd(), AIS_DIR, 'state.json');

  if (!existsSync(statePath)) {
    console.log(chalk.yellow('\n  AIS Agente Front WinForms no está instalado en este directorio.'));
    console.log('  Ejecuta ' + chalk.bold(`${NPX_SHORT} install`) + ' para instalar.\n');
    return;
  }

  const state = JSON.parse(readFileSync(statePath, 'utf8'));

  console.log(chalk.bold('\n  AIS Agente Front WinForms: Estado\n'));
  console.log(`  Proyecto:        ${chalk.cyan(state.project || '(sin definir)')}`);
  console.log(`  Usuario:         ${chalk.cyan(state.user_name || '(sin definir)')}`);
  console.log(`  Versión:         ${chalk.cyan(state.version || '?')}`);
  console.log(`  Fase actual:     ${chalk.cyan(state.phase || 'No iniciada')}`);
  console.log(`  Idioma chat:     ${chalk.cyan(state.chat_language || 'es')}`);
  console.log(`  Idioma docs:     ${chalk.cyan(state.doc_language || 'es')}`);

  if (state.completed?.length > 0) {
    console.log(`\n  Completado: ${state.completed.map(f => chalk.hex(CLI_ACCENT_HEX)('✓ ' + f)).join(', ')}`);
  }
  if (state.pending?.length > 0) {
    console.log(`  Pendiente: ${state.pending.map(f => chalk.gray('○ ' + f)).join(', ')}`);
  }

  console.log();
}
