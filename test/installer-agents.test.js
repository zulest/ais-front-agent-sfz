import { describe, it, expect } from 'vitest';
import { REQUIRED_AGENT_IDS } from '../lib/installer/prompts.js';

describe('installer prompts', () => {
  it('includes all Modo Inicial required agents', () => {
    expect(REQUIRED_AGENT_IDS).toContain('ais-agente-front-winforms');
    expect(REQUIRED_AGENT_IDS).toContain('ais-inventariador-winforms');
    expect(REQUIRED_AGENT_IDS).toContain('ais-analista-codigo');
    expect(REQUIRED_AGENT_IDS).toContain('ais-analista-reglas-negocio');
    expect(REQUIRED_AGENT_IDS).toContain('ais-arquitecto-sistema');
    expect(REQUIRED_AGENT_IDS).toContain('ais-redactor-especificaciones');
  });

  it('includes all Modo Cambio required agents', () => {
    expect(REQUIRED_AGENT_IDS).toContain('ais-especificador-cambios-front');
    expect(REQUIRED_AGENT_IDS).toContain('ais-planificador-implementacion-front');
    expect(REQUIRED_AGENT_IDS).toContain('ais-actualizador-contexto-front');
  });

  it('does not include ais-reconstructor', () => {
    expect(REQUIRED_AGENT_IDS).not.toContain('ais-reconstructor');
  });

  it('has exactly 9 required agents', () => {
    expect(REQUIRED_AGENT_IDS).toHaveLength(9);
  });
});
