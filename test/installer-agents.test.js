import { describe, it, expect } from 'vitest';
import { REQUIRED_AGENT_IDS } from '../lib/installer/prompts.js';

describe('installer prompts', () => {
  it('uses AIS agent ids as required defaults', () => {
    expect(REQUIRED_AGENT_IDS).toEqual([
      'ais-agente-front-winforms',
      'ais-inventariador-winforms',
      'ais-analista-codigo',
      'ais-analista-reglas-negocio',
      'ais-arquitecto-sistema',
      'ais-redactor-especificaciones',
    ]);
  });
});
