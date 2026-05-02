import { describe, it, expect } from 'vitest';
import { AIS_DIR, AIS_OUTPUT_DIR } from '../lib/constants/paths.js';

describe('paths', () => {
  it('uses ais-agente-front-winforms runtime directory', () => {
    expect(AIS_DIR).toBe('.ais-agente-front-winforms');
  });

  it('uses _ais_sdd as default output folder', () => {
    expect(AIS_OUTPUT_DIR).toBe('_ais_sdd');
  });
});
