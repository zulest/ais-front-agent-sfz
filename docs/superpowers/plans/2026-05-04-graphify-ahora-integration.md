# Graphify AHORA Integration — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrar graphify como knowledge base privada de los agentes sfz-front (sfz-knowledge MCP), actualizando 5 SKILL.md y 2 archivos CLI.

**Architecture:** Soft check-and-fallback — los agentes intentan llamar `query_graph` vía MCP tool `sfz-knowledge`; si no responde, leen docs directamente. No se rompe el flujo en proyectos sin graphify configurado. El MCP se configura una vez en `claude_desktop_config.json` del cliente como infraestructura de los agentes, no como herramienta del usuario.

**Tech Stack:** Node.js ESM (CLI), Markdown (SKILL.md), Vitest (tests)

---

## File Map

| Archivo | Acción |
|---|---|
| `test/agents-identity.test.js` | Modify — agregar tests de presencia del bloque graphify |
| `agents/ais-agente-front-winforms/SKILL.md` | Modify — agregar cierre Modo Inicial con setup graphify |
| `agents/ais-especificador-cambios-front/SKILL.md` | Modify — restructurar Paso 3 con graphify como fuente primaria |
| `agents/ais-planificador-implementacion-front/SKILL.md` | Modify — agregar paso 5 en "Antes de empezar" con graphify |
| `agents/ais-actualizador-contexto-front/SKILL.md` | Modify — agregar Paso 5 post-sync para graphify --update |
| `agents/ais-detector-deriva/SKILL.md` | Modify — agregar paso 4 en "Antes de empezar" con god_nodes |
| `lib/commands/update-context.js` | Modify — agregar reminder graphify --update al final del output |
| `lib/commands/install.js` | Modify — agregar sección post-install de setup graphify |

---

## Task 1: Tests de presencia del bloque graphify en SKILL.md

**Files:**
- Modify: `test/agents-identity.test.js`

- [ ] **Step 1: Agregar describe block con tests de graphify**

Al final de `test/agents-identity.test.js`, antes del último `});` de cierre del archivo, agregar:

```javascript
describe('graphify integration', () => {
  const GRAPHIFY_AGENTS = [
    'ais-agente-front-winforms',
    'ais-especificador-cambios-front',
    'ais-planificador-implementacion-front',
    'ais-actualizador-contexto-front',
    'ais-detector-deriva',
  ];

  for (const agent of GRAPHIFY_AGENTS) {
    it(`${agent} contains sfz-knowledge block`, () => {
      const skillPath = join(AGENTS_DIR, agent, 'SKILL.md');
      const content = readFileSync(skillPath, 'utf8');
      expect(content).toContain('sfz-knowledge');
      expect(content).toContain('query_graph');
    });
  }

  it('ais-agente-front-winforms contains graphify setup instructions', () => {
    const skillPath = join(AGENTS_DIR, 'ais-agente-front-winforms', 'SKILL.md');
    const content = readFileSync(skillPath, 'utf8');
    expect(content).toContain('graphify.serve');
    expect(content).toContain('/graphify _ais_sdd/');
  });

  it('ais-actualizador-contexto-front mentions graphify --update', () => {
    const skillPath = join(AGENTS_DIR, 'ais-actualizador-contexto-front', 'SKILL.md');
    const content = readFileSync(skillPath, 'utf8');
    expect(content).toContain('--update');
  });

  it('ais-detector-deriva mentions god_nodes', () => {
    const skillPath = join(AGENTS_DIR, 'ais-detector-deriva', 'SKILL.md');
    const content = readFileSync(skillPath, 'utf8');
    expect(content).toContain('god_nodes');
  });
});
```

- [ ] **Step 2: Correr tests — verificar que todos fallan**

```bash
npx vitest run test/agents-identity.test.js
```

Esperado: FAIL — todos los tests del describe `graphify integration` fallan porque los SKILL.md aún no tienen el bloque.

- [ ] **Step 3: Commit del test**

```bash
git add test/agents-identity.test.js
git commit -m "test: add graphify integration checks for agent SKILL.md files"
```

---

## Task 2: Orquestador — cierre del Modo Inicial con setup graphify

**Files:**
- Modify: `agents/ais-agente-front-winforms/SKILL.md:121-127`

El bloque a insertar va **después** de la lista "Fases 3–6 (según doc_level)" y **antes** del separador `---` que precede a "MODO CAMBIO".

- [ ] **Step 1: Insertar el bloque de cierre después de "- Revisor de Especificaciones (opcional)"**

Localizar en el archivo esta línea (está en la sección `## MODO INICIAL`):
```
- Revisor de Especificaciones (opcional)
```

Reemplazar con:
```markdown
- Revisor de Especificaciones (opcional)

**Cierre del Modo Inicial — Knowledge Graph de los agentes:**

Una vez que el Redactor de Especificaciones terminó de generar la documentación en `_ais_sdd/`, informá:

> "[Nombre], la base de conocimiento inicial está completa en `_ais_sdd/`.
>
> **Siguiente paso — configurar sfz-knowledge (backend de los agentes):**
> 1. Corré `/graphify _ais_sdd/` en Claude Code para construir el grafo navegable
> 2. Agregá al `claude_desktop_config.json`:
>    ```json
>    "sfz-knowledge": {
>      "command": "python",
>      "args": ["-m", "graphify.serve", "<ruta-absoluta>/_ais_sdd/graphify-out/graph.json"]
>    }
>    ```
> 3. Reiniciá Claude Desktop para activar sfz-knowledge
>
> Los agentes del Modo Cambio consultarán este grafo automáticamente para analizar impacto y dependencias sin releer todos los docs. Cuando esté listo, escribí `/sfz-front` para continuar."
```

- [ ] **Step 2: Correr tests**

```bash
npx vitest run test/agents-identity.test.js
```

Esperado: el test `ais-agente-front-winforms contains graphify setup instructions` pasa. Los demás del describe `graphify integration` siguen fallando.

- [ ] **Step 3: Commit**

```bash
git add agents/ais-agente-front-winforms/SKILL.md
git commit -m "feat(agent): add graphify setup guidance to orchestrator Modo Inicial close"
```

---

## Task 3: Especificador — graphify como fuente primaria en Paso 3

**Files:**
- Modify: `agents/ais-especificador-cambios-front/SKILL.md:75-79`

- [ ] **Step 1: Restructurar Paso 3**

Localizar la sección completa:
```markdown
### Paso 3 — Consultar la base de conocimiento existente

Lee (si existen):
- `_ais_sdd/code-analysis.md` — análisis del Presentador afectado
- `_ais_sdd/sdd/[componente].md` — spec actual de la pantalla
- `_ais_sdd/winforms/views/[Módulo]/[NombreForm].md` — extracción del form

Usá esta información para describir el **estado actual** con precisión.
```

Reemplazar con:
```markdown
### Paso 3 — Consultar la base de conocimiento

**Primero — sfz-knowledge graph:**

Intentá llamar `query_graph "<funcionalidad-afectada>"` (MCP tool de sfz-knowledge).
- Si responde → usá los nodos y conexiones retornadas como contexto principal del impacto.
  Complementá con `get_node "<id>"` para detalles de un nodo específico.
  Pasá directamente a Paso 4 con este contexto.
- Si no responde → continuá con la lectura directa de docs. Notificá:
  "sfz-knowledge MCP no configurado — operando sin knowledge graph."

**Fallback — Lectura directa de docs:**

Lee (si existen):
- `_ais_sdd/code-analysis.md` — análisis del Presentador afectado
- `_ais_sdd/sdd/[componente].md` — spec actual de la pantalla
- `_ais_sdd/winforms/views/[Módulo]/[NombreForm].md` — extracción del form

Usá esta información para describir el **estado actual** con precisión.
```

- [ ] **Step 2: Correr tests**

```bash
npx vitest run test/agents-identity.test.js
```

Esperado: el test `ais-especificador-cambios-front contains sfz-knowledge block` pasa.

- [ ] **Step 3: Commit**

```bash
git add agents/ais-especificador-cambios-front/SKILL.md
git commit -m "feat(agent): add graphify query as primary knowledge source in especificador"
```

---

## Task 4: Planificador — graphify para dependencias en Antes de empezar

**Files:**
- Modify: `agents/ais-planificador-implementacion-front/SKILL.md:46-55`

- [ ] **Step 1: Agregar paso 5 al bloque "Antes de empezar"**

Localizar el bloque completo "## Antes de empezar" que termina en:
```
4. Si hay lagunas 🔴 en la spec, detenete y pedí que el Especificador las resuelva primero.
```

Reemplazar con:
```markdown
4. Si hay lagunas 🔴 en la spec, detenete y pedí que el Especificador las resuelva primero.
5. **Knowledge base — sfz-knowledge:**
   Intentá `query_graph "<módulo-del-cambio>"` (MCP tool de sfz-knowledge) para entender dependencias.
   - Si la spec afecta múltiples módulos → usá `shortest_path "<módulo-A>" "<módulo-B>"` para trazar el camino de dependencias.
   - Si sfz-knowledge no responde → continuá con la lectura directa de docs en `_ais_sdd/`.
```

- [ ] **Step 2: Correr tests**

```bash
npx vitest run test/agents-identity.test.js
```

Esperado: el test `ais-planificador-implementacion-front contains sfz-knowledge block` pasa.

- [ ] **Step 3: Commit**

```bash
git add agents/ais-planificador-implementacion-front/SKILL.md
git commit -m "feat(agent): add graphify dependency analysis to planificador"
```

---

## Task 5: Actualizador — reminder graphify --update post-sync

**Files:**
- Modify: `agents/ais-actualizador-contexto-front/SKILL.md:104-111`

- [ ] **Step 1: Agregar Paso 5 después del resumen al usuario**

Localizar el bloque "### Paso 4 — Resumen al usuario" que termina en:
```markdown
> [Si no hay drift]: ✅ Sin divergencias detectadas."
```

Insertar inmediatamente después (antes de la sección `## Escala de confianza`):
```markdown

### Paso 5 — Sincronizar el knowledge graph

Después del resumen, informá:

> "Para mantener el knowledge graph de los agentes sincronizado con los cambios aplicados:
> Corré `/graphify _ais_sdd/ --update` en Claude Code.
> Esto actualiza sfz-knowledge incrementalmente — solo re-extrae los docs modificados."
```

- [ ] **Step 2: Correr tests**

```bash
npx vitest run test/agents-identity.test.js
```

Esperado: los tests `ais-actualizador-contexto-front contains sfz-knowledge block` y `ais-actualizador-contexto-front mentions graphify --update` pasan.

- [ ] **Step 3: Commit**

```bash
git add agents/ais-actualizador-contexto-front/SKILL.md
git commit -m "feat(agent): add graphify --update reminder to actualizador post-sync"
```

---

## Task 6: Detector de deriva — god_nodes para priorizar análisis

**Files:**
- Modify: `agents/ais-detector-deriva/SKILL.md:51-59`

- [ ] **Step 1: Agregar paso 4 en "Antes de empezar" y renumerar el paso existente**

Localizar el bloque "## Antes de empezar" que termina en:
```markdown
4. Pedí acceso a los archivos C# actuales o leelos si tenés acceso al proyecto.
```

Reemplazar con:
```markdown
4. **Knowledge base — sfz-knowledge:**
   Intentá `god_nodes` (MCP tool de sfz-knowledge).
   - Si responde → los nodos más conectados del graph son los de mayor riesgo de deriva. Priorizá el análisis de los módulos correspondientes a los top god nodes.
   - Si no responde → continuá con la priorización por frontmatter `stale` (paso 3).
5. Pedí acceso a los archivos C# actuales o leelos si tenés acceso al proyecto.
```

- [ ] **Step 2: Correr tests**

```bash
npx vitest run test/agents-identity.test.js
```

Esperado: todos los tests del describe `graphify integration` pasan.

- [ ] **Step 3: Correr suite completa**

```bash
npm test
```

Esperado: todos los tests pasan (incluyendo `agents-identity`, `writer-config`, `installer-agents`, `paths`).

- [ ] **Step 4: Commit**

```bash
git add agents/ais-detector-deriva/SKILL.md
git commit -m "feat(agent): add god_nodes graphify query to drift detector prioritization"
```

---

## Task 7: update-context.js — reminder graphify --update al final del output

**Files:**
- Modify: `lib/commands/update-context.js:215-218`

- [ ] **Step 1: Agregar el bloque condicional al final de la función**

Localizar las últimas dos líneas de la función `updateContext`:
```javascript
  console.log(chalk.gray(`\n  Reporte guardado en ${AIS_DIR}/last-sync.json`));
  console.log(chalk.gray('  Activá /sfz-front en tu motor de IA para continuar con la sincronización.\n'));
}
```

Reemplazar con:
```javascript
  console.log(chalk.gray(`\n  Reporte guardado en ${AIS_DIR}/last-sync.json`));
  console.log(chalk.gray('  Activá /sfz-front en tu motor de IA para continuar con la sincronización.\n'));

  const graphPath = join(projectRoot, outputDir, 'graphify-out', 'graph.json');
  if (existsSync(graphPath)) {
    console.log(chalk.gray('  📊 Knowledge graph: /graphify _ais_sdd/ --update\n'));
  }
}
```

- [ ] **Step 2: Verificar que `join` y `existsSync` ya están importados**

Revisar las primeras líneas del archivo:
```javascript
import { resolve, join, basename } from 'path';
import { existsSync, writeFileSync, readFileSync, readdirSync } from 'fs';
```

Ambas ya están importadas — no hay que agregar nada.

- [ ] **Step 3: Correr suite completa**

```bash
npm test
```

Esperado: todos los tests pasan.

- [ ] **Step 4: Commit**

```bash
git add lib/commands/update-context.js
git commit -m "feat(cli): show graphify --update reminder in update-context when graph exists"
```

---

## Task 8: install.js — sección de setup graphify en post-install output

**Files:**
- Modify: `lib/commands/install.js:155-157`

- [ ] **Step 1: Agregar la sección graphify después del comando de activación**

Localizar el bloque final de output (las últimas líneas antes del cierre de función):
```javascript
    console.log(chalk.cyan(`  → Abre ${namesStr} y escribe ${command} en el chat`));
  }
  console.log('');
}
```

Reemplazar con:
```javascript
    console.log(chalk.cyan(`  → Abre ${namesStr} y escribe ${command} en el chat`));
  }
  console.log('');
  console.log(chalk.bold('  Knowledge graph de los agentes (después del Modo Inicial):'));
  console.log(chalk.gray('  1. En Claude Code, corré: /graphify _ais_sdd/'));
  console.log(chalk.gray('  2. Agregá a claude_desktop_config.json:'));
  console.log(chalk.gray('       "sfz-knowledge": {'));
  console.log(chalk.gray('         "command": "python",'));
  console.log(chalk.gray('         "args": ["-m", "graphify.serve",'));
  console.log(chalk.gray('                  "<tu-proyecto>/_ais_sdd/graphify-out/graph.json"]'));
  console.log(chalk.gray('       }'));
  console.log(chalk.gray('  3. Reiniciá Claude Desktop'));
  console.log('');
}
```

- [ ] **Step 2: Correr suite completa**

```bash
npm test
```

Esperado: todos los tests pasan.

- [ ] **Step 3: Commit final**

```bash
git add lib/commands/install.js
git commit -m "feat(cli): add graphify sfz-knowledge setup section to post-install output"
```

---

## Self-Review

**Spec coverage:**
- ✅ Orquestador cierra Modo Inicial con instrucciones graphify → Task 2
- ✅ Especificador usa graphify como fuente primaria → Task 3
- ✅ Planificador consulta dependencias vía graphify → Task 4
- ✅ Actualizador recuerda `--update` post-sync → Task 5
- ✅ Detector usa `god_nodes` para priorizar → Task 6
- ✅ update-context.js muestra reminder → Task 7
- ✅ install.js muestra setup graphify → Task 8
- ✅ Todos los cambios de SKILL.md tienen tests en Task 1

**Placeholder scan:** ninguno — todos los steps tienen código exacto.

**Type consistency:** no hay tipos compartidos entre tasks — cada task es independiente.
