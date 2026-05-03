#!/usr/bin/env node

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import chalk from 'chalk';
import { CLI_ACCENT_HEX, NPM_PACKAGE, NPX_LONG, NPX_SHORT } from '../lib/constants/cli.js';
import { CLI_BANNER } from '../lib/constants/cli-banner.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(readFileSync(join(__dirname, '../package.json'), 'utf8'));

const [,, command, ...args] = process.argv;

const commands = {
  install:          () => import('../lib/commands/install.js'),
  update:           () => import('../lib/commands/update.js'),
  status:           () => import('../lib/commands/status.js'),
  uninstall:        () => import('../lib/commands/uninstall.js'),
  'add-agent':      () => import('../lib/commands/add-agent.js'),
  'add-engine':     () => import('../lib/commands/add-engine.js'),
  'export-diagrams':() => import('../lib/commands/export-diagrams.js'),
  'update-context': () => import('../lib/commands/update-context.js'),
};

const green = chalk.hex(CLI_ACCENT_HEX);

if (!command || command === '--help' || command === '-h') {
  console.log(green(CLI_BANNER) + `
  AIS Agente Front WinForms v${pkg.version} · npm: ${NPM_PACKAGE}

  Uso: ${NPX_SHORT} <comando>  (equivalente: ${NPX_LONG} <comando>)

  Comandos:
    install            Instala el paquete de agentes cliente WinForms en el proyecto actual
    update             Actualiza los agentes a la última versión
    status             Muestra el estado actual del análisis
    uninstall          Elimina el paquete del proyecto
    add-agent          Añade un agente al proyecto
    add-engine         Añade soporte para otro motor de IA
    update-context     Detecta cambios desde el último commit y guarda reporte para sincronización
    export-diagrams    Exporta diagramas Mermaid como SVG/PNG
                       Opciones: --format=svg|png  --output=<carpeta>
                       Requiere: npm install -g @mermaid-js/mermaid-cli

  Documentación del paquete: https://www.npmjs.com/package/${NPM_PACKAGE}
  `);
  process.exit(0);
}

if (command === '--version' || command === '-v') {
  console.log(pkg.version);
  process.exit(0);
}

if (!commands[command]) {
  console.error(`\n  Comando desconocido: "${command}"`);
  console.error(`  Ejecuta "${NPX_SHORT} --help" para ver los comandos disponibles.\n`);
  process.exit(1);
}

const mod = await commands[command]();
await mod.default(args);
