import { createRequire } from 'module';
import chalk from 'chalk';
import { CLI_ACCENT_HEX } from '../constants/cli.js';

const require = createRequire(import.meta.url);
const ORANGE = chalk.hex(CLI_ACCENT_HEX);

export function applyOrangeTheme() {
  const colors = require('yoctocolors-cjs');
  colors.green = (t) => ORANGE(t);
  colors.cyan = (t) => ORANGE(t);
}

export const ORANGE_PREFIX = ORANGE('?');
