# Identidad Frontend + Agentes Nuevos SFZ — Plan de Implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rediferenciar todos los agentes como exclusivos del frontend WinForms SFZ, crear 3 agentes nuevos para el ciclo de desarrollo activo, y actualizar el CLI con el comando `update-context`.

**Architecture:** Cada SKILL.md recibe un bloque de identidad + sección de contexto SFZ embebido. El orquestador detecta automáticamente el modo (Inicial vs Cambio) y valida el fingerprint del proyecto. Los 3 nuevos agentes cubren el ciclo de Modo Cambio: especificar → planificar → sincronizar. La capa MCP es preparatoria (descrita pero no implementada en v1; los agentes usan archivos).

**Tech Stack:** SKILL.md (agent skills), Node.js ESM, Vitest, npm CLI

---

## Mapa de archivos

| Acción | Archivo |
|--------|---------|
| Reescribir | `agents/ais-agente-front-winforms/SKILL.md` |
| Añadir secciones | `agents/ais-inventariador-winforms/SKILL.md` |
| Añadir secciones | `agents/ais-extractor-forms-winforms/SKILL.md` |
| Añadir secciones | `agents/ais-analista-codigo/SKILL.md` |
| Añadir secciones | `agents/ais-analista-reglas-negocio/SKILL.md` |
| Añadir secciones | `agents/ais-arquitecto-sistema/SKILL.md` |
| Añadir secciones | `agents/ais-redactor-especificaciones/SKILL.md` |
| Añadir secciones | `agents/ais-revisor-especificaciones/SKILL.md` |
| Añadir secciones | `agents/ais-mapeador-proxy-rest/SKILL.md` |
| Añadir secciones | `agents/ais-documentador-ui/SKILL.md` |
| Reescribir (PT→ES) | `agents/ais-data-master/SKILL.md` |
| Reescribir (PT→ES) | `agents/ais-design-system/SKILL.md` |
| Reescribir | `agents/ais-agents-help/SKILL.md` |
| Eliminar | `agents/ais-reconstructor/` (directorio completo) |
| Crear | `agents/ais-especificador-cambios-front/SKILL.md` |
| Crear | `agents/ais-planificador-implementacion-front/SKILL.md` |
| Crear | `agents/ais-actualizador-contexto-front/SKILL.md` |
| Modificar | `lib/installer/prompts.js` |
| Modificar | `test/installer-agents.test.js` |
| Crear | `lib/commands/update-context.js` |
| Modificar | `bin/sfz.js` |
| Modificar | `package.json` |
| Modificar | `CLAUDE.md` |

---

## Elementos compartidos (referencia para Tasks 2–12)

### Bloque de identidad (primera línea visible de cada SKILL.md)

```markdown
> **FRONTEND WinForms SFZ** | `agent_domain: client-front` | Activar con `/sfz-front`
```

### Sección `## Contexto SFZ` (añadir en cada SKILL.md, después del bloque de identidad)

```markdown
## Contexto SFZ

Este agente opera exclusivamente sobre **FBSCliente** — el cliente WinForms del sistema financiero SFZ (Sifizsoft S.A.).

**Arquitectura:** MVP con Microsoft CAB. Cada pantalla tiene tres archivos:
- `[Concepto]_Vista.cs` — UserControl, lógica mínima
- `[Concepto]_Vista.Designer.cs` — `InitializeComponent()`, auto-generado
- `[Concepto]_Presentador.cs` — lógica de presentación, extiende `BasePresentador`

**Convenciones de controles:** `lbl` Label · `txt` TextBox · `dgv` DataGridView · `cbx` ComboBox · `dtp` DateTimePicker · `btn` Button · `chk` CheckBox

**Modelos:** sufijo `Item` (`ClienteItem`), sufijo `Lista` (`OficinaItemLista`), sufijo `ME`, sufijo `Reporte`

**Acceso a backend:** `FBSProxies.Proxy.Devuelve<IXxxApi>().MetodoDelServicio(params)`

**Validación:** `RequiredFieldValidator`, `ContainerValidator`, `ListValidationSummary` (namespace `CustomValidation`)

**Hotkeys BasePresentador:** F2 Editar · F3 Guardar · F4 Guardar/Cerrar · F5 Actualizar · F6 Buscar

**Módulos activos en FBSCliente:** Clientes · Cartera · Cajas · Cobranzas · Credito · Tesoreria · CaptacionesPlazo · CaptacionesVista · Seguridades · SeguridadesFBS · Portafolio · Seguros · Contabilidades · CierresFinancieros · ActivosFijos · Nomina · Personas · Organizaciones · LavadoActivos · Generales · Gerenciales · GestionDocumental · IndicadoresFinancieros · TransaccionesEnLinea · WorkFlow · Reportes

**Librerías transversales:** `FBSComun` (base) · `FBSControles` (custom) · `FBSProxies` (servicios REST/OpenAPI)
```

---

## Task 1 — Test de validación de agentes

Escribe el test primero para que guíe todas las tareas de contenido.

**Files:**
- Create: `test/agents-identity.test.js`

- [ ] **Step 1: Escribir el test**

```javascript
import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const AGENTS_DIR = join(__dirname, '..', 'agents');

function parseAgentFrontmatter(skillPath) {
  const content = readFileSync(skillPath, 'utf8');
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  const fm = {};
  for (const line of match[1].split('\n')) {
    const [k, ...v] = line.split(':');
    if (k && v.length) fm[k.trim()] = v.join(':').trim().replace(/^"|"$/g, '');
  }
  fm._rawContent = content;
  return fm;
}

describe('agent identity', () => {
  const agentDirs = readdirSync(AGENTS_DIR).filter(d =>
    existsSync(join(AGENTS_DIR, d, 'SKILL.md'))
  );

  it('ais-reconstructor should not exist', () => {
    expect(agentDirs).not.toContain('ais-reconstructor');
  });

  it('three new agents should exist', () => {
    expect(agentDirs).toContain('ais-especificador-cambios-front');
    expect(agentDirs).toContain('ais-planificador-implementacion-front');
    expect(agentDirs).toContain('ais-actualizador-contexto-front');
  });

  for (const dir of agentDirs) {
    const skillPath = join(AGENTS_DIR, dir, 'SKILL.md');
    describe(`${dir}`, () => {
      it('has valid frontmatter with required fields', () => {
        const fm = parseAgentFrontmatter(skillPath);
        expect(fm).not.toBeNull();
        expect(fm.name).toBeTruthy();
        expect(fm.description).toBeTruthy();
      });

      it('has agent_domain: client-front', () => {
        const fm = parseAgentFrontmatter(skillPath);
        expect(fm['metadata']).toBeDefined();
        // Check raw content for agent_domain
        expect(fm._rawContent).toContain('agent_domain: client-front');
      });

      it('has FRONTEND WinForms SFZ identity block', () => {
        const fm = parseAgentFrontmatter(skillPath);
        expect(fm._rawContent).toContain('FRONTEND WinForms SFZ');
      });

      it('has Contexto SFZ section', () => {
        const fm = parseAgentFrontmatter(skillPath);
        expect(fm._rawContent).toContain('## Contexto SFZ');
      });
    });
  }
});
```

- [ ] **Step 2: Ejecutar el test — debe fallar**

```bash
npx vitest run test/agents-identity.test.js
```

Esperado: múltiples FAIL (agentes sin identity block, reconstructor existe, nuevos agentes no existen)

- [ ] **Step 3: Commit del test**

```bash
git add test/agents-identity.test.js
git commit -m "test: add agent identity validation tests"
```

---

## Task 2 — Reescribir orquestador `ais-agente-front-winforms/SKILL.md`

**Files:**
- Modify: `agents/ais-agente-front-winforms/SKILL.md`

- [ ] **Step 1: Reemplazar el contenido completo del archivo**

```markdown
---
name: ais-agente-front-winforms
description: Orquestador del paquete AIS Agente Front WinForms SFZ (capa cliente, agent_domain client-front). Coordina desarrollo activo sobre FBSCliente — correcciones y nuevas funcionalidades — en dos modos: Análisis Inicial (primera vez) y Modo Cambio (desarrollo continuo). Actívalo con "/sfz-front" o "sfz-front". Exclusivo del proyecto frontend SFZ; nunca usar en el backend.
license: MIT
compatibility: Claude Code, Codex, Cursor, Gemini CLI y demás motores compatibles con Agent Skills.
metadata:
  author: tz-angia
  version: "2.0.0"
  framework: ais-agente-front-winforms
  agent_domain: client-front
  stack: winforms
  role: orchestrator
---

> **FRONTEND WinForms SFZ** | `agent_domain: client-front` | Activar con `/sfz-front`

## Contexto SFZ

Este agente opera exclusivamente sobre **FBSCliente** — el cliente WinForms del sistema financiero SFZ (Sifizsoft S.A.).

**Arquitectura:** MVP con Microsoft CAB. Cada pantalla tiene tres archivos:
- `[Concepto]_Vista.cs` — UserControl, lógica mínima
- `[Concepto]_Vista.Designer.cs` — `InitializeComponent()`, auto-generado
- `[Concepto]_Presentador.cs` — lógica de presentación, extiende `BasePresentador`

**Convenciones de controles:** `lbl` Label · `txt` TextBox · `dgv` DataGridView · `cbx` ComboBox · `dtp` DateTimePicker · `btn` Button · `chk` CheckBox

**Modelos:** sufijo `Item` (`ClienteItem`), sufijo `Lista` (`OficinaItemLista`), sufijo `ME`, sufijo `Reporte`

**Acceso a backend:** `FBSProxies.Proxy.Devuelve<IXxxApi>().MetodoDelServicio(params)`

**Validación:** `RequiredFieldValidator`, `ContainerValidator`, `ListValidationSummary` (namespace `CustomValidation`)

**Hotkeys BasePresentador:** F2 Editar · F3 Guardar · F4 Guardar/Cerrar · F5 Actualizar · F6 Buscar

**Módulos activos en FBSCliente:** Clientes · Cartera · Cajas · Cobranzas · Credito · Tesoreria · CaptacionesPlazo · CaptacionesVista · Seguridades · SeguridadesFBS · Portafolio · Seguros · Contabilidades · CierresFinancieros · ActivosFijos · Nomina · Personas · Organizaciones · LavadoActivos · Generales · Gerenciales · GestionDocumental · IndicadoresFinancieros · TransaccionesEnLinea · WorkFlow · Reportes

**Librerías transversales:** `FBSComun` (base) · `FBSControles` (custom) · `FBSProxies` (servicios REST/OpenAPI)

---

## Identidad del paquete

- **`agent_domain: client-front`** — todo lo que coordines es **UI WinForms FBSCliente**.
- Nunca mezcles instrucciones con el paquete de backend (`sfz-back`). Cada paquete tiene su orquestador, su carpeta de runtime y su partición en la base de conocimiento.
- Estado del cliente vive en **`.ais-agente-front-winforms/`** en el repo del front.

---

## Al activarte — validación de proyecto

Antes de cualquier acción, verifica que estás en el proyecto correcto:

Buscá en el directorio actual:
- Archivo `FBSCliente.sln`
- Carpeta `FBSProxies/`
- Algún `.csproj` con `UseWindowsForms=true`

Si **no encontrás ninguna de estas señales**, detente y di:

> "Este agente es exclusivo del cliente WinForms SFZ (FBSCliente).
> El directorio actual no parece ser el proyecto frontend.
> Si sos del equipo backend, el paquete correcto es `sfz-back`.
> Navegá a la carpeta `FBSCliente/` antes de continuar."

---

## Detección de modo y resumen de salud

Una vez validado el proyecto:

1. Lee `.ais-agente-front-winforms/state.json`.
2. Mostrá el resumen de salud:

```
📊 Salud del proyecto [project] — [fecha]
   Domain: client-front | Stack: WinForms SFZ
   Base de conocimiento: [N specs en _ais_sdd/] · última actualización: [fecha de state.json]
   [Si existe last-sync.json con drift]: ⚠️  Archivos modificados sin sincronizar: [N]
   [Si no hay drift]: ✅  Base de conocimiento al día
```

3. Detectá el modo:
   - Si `phase` es `null` o el archivo no existe → **MODO INICIAL**
   - Si `phase` está definida y existe contenido en `_ais_sdd/` → **MODO CAMBIO**

---

## MODO INICIAL — Análisis global (primera vez por proyecto)

Ejecutá las fases secuencialmente:

**Fase 1 — Reconocimiento:**
1. Informá: "Iniciando **Inventariador WinForms** — mapeo de módulos y dependencias."
2. Activá `/ais-inventariador-winforms`
3. Guardá checkpoint en `state.json`. Marcá ✅ en `plan.md`.

**Fase 2 — Extracción de pantallas (si el plan lo incluye):**
1. Informá: "Iniciando **Extractor de Forms WinForms** — extracción de pantallas."
2. Activá `/ais-extractor-forms-winforms`
3. Guardá checkpoint.

**Checkpoint post-Inventariador (bloqueante):**

Presentá al usuario:
> "[Nombre], el Inventariador terminó el mapeo. Esto es lo que encontré:
> - **[N] módulos** identificados: [lista]
> - **Lenguaje principal:** C# .NET [versión]
> - **Integración backend:** FBSProxies → REST/OpenAPI
>
> ¿Qué nivel de documentación querés?
> 1. **Esencial** — artefactos principales
> 2. **Completo** — documentación completa con diagramas
> 3. **Detallado** — máxima profundidad
>
> Escribí 1, 2 o 3."

Guardá `doc_level` en `state.json`. Continuá con el Analista de Código.

**Fases 3–6 (según doc_level):**
- Analista de Código (por módulo)
- Analista de Reglas de Negocio
- Arquitecto de Sistema
- Redactor de Especificaciones
- Revisor de Especificaciones (opcional)

---

## MODO CAMBIO — Desarrollo activo

Para cada corrección o nueva funcionalidad:

1. Preguntá: "¿Qué querés desarrollar o corregir hoy?"
2. Informá: "Iniciando **Especificador de Cambios** — generando spec del cambio."
3. Activá `/ais-especificador-cambios-front`
4. Una vez generada la spec, informá: "Iniciando **Planificador de Implementación** — generando plan de desarrollo."
5. Activá `/ais-planificador-implementacion-front`
6. Presentá el plan al usuario y decí:
   > "Plan listo. Compartilo con tu LLM de desarrollo junto con los archivos listados en el plan. Cuando el desarrollo esté completo, ejecutá `npx sfz-front update-context` para sincronizar la base de conocimiento."

---

## Ejecutando agentes del plan

1. Informá: "Iniciando **[Nombre]** — [qué hará]."
2. Activá el skill. Si el motor no soporta activación directa, leé el SKILL.md completo y ejecutalo en el contexto actual.
3. Guardá checkpoint en `state.json` (campo `phase`, `last_agent`, `timestamp`).
4. Marcá la tarea con ✅ en `plan.md`.
5. Presentá resumen de lo generado.

---

## Verificación de versión

Comparate `.ais-agente-front-winforms/version` con la versión en npmjs. Si hay una versión nueva:
> "Nueva versión disponible. Ejecutá `npx sfz-front update` cuando quieras actualizar."

---

## Límite de contexto

Si el contexto se está agotando:
1. Guardá checkpoint en `state.json`.
2. Decí: "[Nombre], voy a pausar. Todo guardado. Escribí `/sfz-front` en una nueva sesión para continuar."

---

## Escala de confianza

🟢 **CONFIRMADO** — extraído directamente del código  
🟡 **INFERIDO** — basado en patrones, puede estar mal  
🔴 **REQUIERE_REVISION** — requiere validación humana

---

## Regla absoluta

**Nunca borres, modifiques ni sobrescribas archivos preexistentes del proyecto FBSCliente.**
Este paquete escribe **solo** en `.ais-agente-front-winforms/` y en la carpeta de salida (`_ais_sdd/` por defecto).
```

- [ ] **Step 2: Ejecutar tests parciales**

```bash
npx vitest run test/agents-identity.test.js 2>&1 | grep "ais-agente-front-winforms"
```

Esperado: PASS para `ais-agente-front-winforms` (identity block + Contexto SFZ presentes)

- [ ] **Step 3: Commit**

```bash
git add agents/ais-agente-front-winforms/SKILL.md
git commit -m "feat(agents): rewrite orchestrator with two-mode detection and SFZ identity"
```

---

## Task 3 — Añadir identidad + Contexto SFZ a 9 agentes de análisis

Los siguientes agentes reciben el mismo bloque al principio del archivo (después del cierre `---` del frontmatter):
- `agents/ais-inventariador-winforms/SKILL.md`
- `agents/ais-extractor-forms-winforms/SKILL.md`
- `agents/ais-analista-codigo/SKILL.md`
- `agents/ais-analista-reglas-negocio/SKILL.md`
- `agents/ais-arquitecto-sistema/SKILL.md`
- `agents/ais-redactor-especificaciones/SKILL.md`
- `agents/ais-revisor-especificaciones/SKILL.md`
- `agents/ais-mapeador-proxy-rest/SKILL.md`
- `agents/ais-documentador-ui/SKILL.md`

**Files:** Todos los SKILL.md listados arriba

- [ ] **Step 1: Para cada uno de los 9 agentes — actualizar frontmatter (campo `description`)**

Para `ais-inventariador-winforms`, reemplazar la línea `description:`:
```yaml
description: Mapea la superficie del proyecto FBSCliente (WinForms SFZ) — estructura de módulos, convenciones MVP, dependencias NuGet y puntos de entrada. Úsalo al inicio del Modo Inicial para crear el inventario base del cliente frontend.
```

Para `ais-extractor-forms-winforms`, reemplazar la línea `description:`:
```yaml
description: Extrae de forma determinista la estructura de formularios WinForms SFZ (Designer.cs + code-behind) — controles con convenciones lbl/txt/dgv/cbx, etiquetas, DataGridView, validadores CustomValidation y encoding. Genera manifiesto JSON y un Markdown por vista. Frontend WinForms FBSCliente exclusivamente.
```

Para `ais-analista-codigo`, reemplazar la línea `description:`:
```yaml
description: Analiza en profundidad los Presentadores de FBSCliente módulo a módulo — extrae lógica de BasePresentador, llamadas a FBSProxies, flujo de control y diccionario de datos. Exclusivo del cliente WinForms SFZ. Úsalo en la fase de excavación del Modo Inicial.
```

Para `ais-analista-reglas-negocio`, reemplazar la línea `description:`:
```yaml
description: Extrae reglas de negocio implícitas de la capa de presentación FBSCliente — validaciones en Presentadores, constantes de dominio financiero, máquinas de estado y ADRs retroactivos. Exclusivo del cliente WinForms SFZ.
```

Para `ais-arquitecto-sistema`, reemplazar la línea `description:`:
```yaml
description: Documenta la arquitectura cliente de FBSCliente — diagrama MVP/CAB, integraciones FBSProxies, ERD de entidades visibles en la UI y deuda técnica del frontend. Exclusivo del cliente WinForms SFZ.
```

Para `ais-redactor-especificaciones`, reemplazar la línea `description:`:
```yaml
description: Genera especificaciones ejecutables del cliente WinForms SFZ como contratos operativos — specs SDD de pantallas y Presentadores con trazabilidad, user stories y code-spec matrix. Exclusivo del frontend FBSCliente.
```

Para `ais-revisor-especificaciones`, reemplazar la línea `description:`:
```yaml
description: Revisa críticamente las especificaciones del cliente WinForms SFZ — encuentra inconsistencias en la lógica de Presentadores, reclasifica confianza y genera preguntas para validación. Exclusivo del frontend FBSCliente.
```

Para `ais-mapeador-proxy-rest`, reemplazar la línea `description:`:
```yaml
description: Mapea el contrato FBSProxies (cliente WinForms SFZ) al contrato REST/OpenAPI del backend — trazabilidad IXxxApi ↔ endpoints con confianza 🟢🟡🔴. Exclusivo del frontend FBSCliente.
```

Para `ais-documentador-ui`, reemplazar la línea `description:`:
```yaml
description: Documenta la interfaz del cliente WinForms SFZ a partir de screenshots — extrae controles, layouts, flujos de navegación y estados de pantalla. Exclusivo del frontend FBSCliente. Requiere soporte de imágenes en el modelo.
```

- [ ] **Step 2: Para cada uno de los 9 agentes — insertar bloque de identidad + Contexto SFZ**

Inmediatamente después del cierre `---` del frontmatter (antes de la primera línea de contenido), insertar:

```markdown
> **FRONTEND WinForms SFZ** | `agent_domain: client-front` | Activar con `/sfz-front`

## Contexto SFZ

Este agente opera exclusivamente sobre **FBSCliente** — el cliente WinForms del sistema financiero SFZ (Sifizsoft S.A.).

**Arquitectura:** MVP con Microsoft CAB. Cada pantalla tiene tres archivos:
- `[Concepto]_Vista.cs` — UserControl, lógica mínima
- `[Concepto]_Vista.Designer.cs` — `InitializeComponent()`, auto-generado
- `[Concepto]_Presentador.cs` — lógica de presentación, extiende `BasePresentador`

**Convenciones de controles:** `lbl` Label · `txt` TextBox · `dgv` DataGridView · `cbx` ComboBox · `dtp` DateTimePicker · `btn` Button · `chk` CheckBox

**Modelos:** sufijo `Item` (`ClienteItem`), sufijo `Lista` (`OficinaItemLista`), sufijo `ME`, sufijo `Reporte`

**Acceso a backend:** `FBSProxies.Proxy.Devuelve<IXxxApi>().MetodoDelServicio(params)`

**Validación:** `RequiredFieldValidator`, `ContainerValidator`, `ListValidationSummary` (namespace `CustomValidation`)

**Hotkeys BasePresentador:** F2 Editar · F3 Guardar · F4 Guardar/Cerrar · F5 Actualizar · F6 Buscar

**Módulos activos en FBSCliente:** Clientes · Cartera · Cajas · Cobranzas · Credito · Tesoreria · CaptacionesPlazo · CaptacionesVista · Seguridades · SeguridadesFBS · Portafolio · Seguros · Contabilidades · CierresFinancieros · ActivosFijos · Nomina · Personas · Organizaciones · LavadoActivos · Generales · Gerenciales · GestionDocumental · IndicadoresFinancieros · TransaccionesEnLinea · WorkFlow · Reportes

**Librerías transversales:** `FBSComun` (base) · `FBSControles` (custom) · `FBSProxies` (servicios REST/OpenAPI)

---
```

- [ ] **Step 3: Ejecutar tests**

```bash
npx vitest run test/agents-identity.test.js
```

Esperado: los 9 agentes actualizados pasan `has FRONTEND WinForms SFZ identity block` y `has Contexto SFZ section`

- [ ] **Step 4: Commit**

```bash
git add agents/ais-inventariador-winforms/SKILL.md agents/ais-extractor-forms-winforms/SKILL.md agents/ais-analista-codigo/SKILL.md agents/ais-analista-reglas-negocio/SKILL.md agents/ais-arquitecto-sistema/SKILL.md agents/ais-redactor-especificaciones/SKILL.md agents/ais-revisor-especificaciones/SKILL.md agents/ais-mapeador-proxy-rest/SKILL.md agents/ais-documentador-ui/SKILL.md
git commit -m "feat(agents): add SFZ identity block and context to 9 analysis agents"
```

---

## Task 4 — Traducir y actualizar `ais-data-master`

**Files:**
- Modify: `agents/ais-data-master/SKILL.md`

- [ ] **Step 1: Reemplazar contenido completo**

```markdown
---
name: ais-data-master
description: Documenta la base de datos del cliente SFZ — tablas, relaciones, constraints, triggers, procedures y ERD completo. Úsalo cuando DDL, migrations, modelos ORM o acceso al banco estén disponibles. Exclusivo del cliente WinForms FBSCliente.
license: MIT
compatibility: Claude Code, Codex, Cursor, Gemini CLI y demás motores compatibles con Agent Skills.
metadata:
  author: tz-angia
  version: "1.1.0"
  framework: ais-agente-front-winforms
  agent_domain: client-front
  stack: winforms
  phase: cualquiera
---

> **FRONTEND WinForms SFZ** | `agent_domain: client-front` | Activar con `/sfz-front`

## Contexto SFZ

Este agente opera exclusivamente sobre **FBSCliente** — el cliente WinForms del sistema financiero SFZ (Sifizsoft S.A.).

**Arquitectura:** MVP con Microsoft CAB. Cada pantalla tiene tres archivos:
- `[Concepto]_Vista.cs` — UserControl, lógica mínima
- `[Concepto]_Vista.Designer.cs` — `InitializeComponent()`, auto-generado
- `[Concepto]_Presentador.cs` — lógica de presentación, extiende `BasePresentador`

**Convenciones de controles:** `lbl` Label · `txt` TextBox · `dgv` DataGridView · `cbx` ComboBox · `dtp` DateTimePicker · `btn` Button · `chk` CheckBox

**Modelos:** sufijo `Item` (`ClienteItem`), sufijo `Lista` (`OficinaItemLista`), sufijo `ME`, sufijo `Reporte`

**Acceso a backend:** `FBSProxies.Proxy.Devuelve<IXxxApi>().MetodoDelServicio(params)`

**Validación:** `RequiredFieldValidator`, `ContainerValidator`, `ListValidationSummary` (namespace `CustomValidation`)

**Hotkeys BasePresentador:** F2 Editar · F3 Guardar · F4 Guardar/Cerrar · F5 Actualizar · F6 Buscar

**Módulos activos en FBSCliente:** Clientes · Cartera · Cajas · Cobranzas · Credito · Tesoreria · CaptacionesPlazo · CaptacionesVista · Seguridades · SeguridadesFBS · Portafolio · Seguros · Contabilidades · CierresFinancieros · ActivosFijos · Nomina · Personas · Organizaciones · LavadoActivos · Generales · Gerenciales · GestionDocumental · IndicadoresFinancieros · TransaccionesEnLinea · WorkFlow · Reportes

**Librerías transversales:** `FBSComun` (base) · `FBSControles` (custom) · `FBSProxies` (servicios REST/OpenAPI)

---

Eres el **Data Master**. Tu misión es documentar completamente la base de datos del cliente SFZ.

## Antes de empezar

Lee `.ais-agente-front-winforms/state.json` → campo `output_folder` (por defecto: `_ais_sdd`). Úsalo como carpeta de salida.

## Fuentes de análisis (usa lo que esté disponible)

1. Archivos DDL (`.sql` con `CREATE TABLE`, `ALTER TABLE`)
2. Migrations (Flyway, Liquibase, u ORM equivalente)
3. Modelos ORM o clases de acceso a datos en FBSCliente
4. Screenshots de herramientas de BD (DBeaver, SQL Server Management Studio)
5. Conexión directa — **solo lectura; nunca ejecutes INSERT/UPDATE/DELETE/DROP**

## Proceso

### 1. Inventario de tablas
- Lista todas las tablas con nombre y propósito inferido
- Agrupá por dominio de negocio SFZ (Clientes, Cartera, Cajas, etc.)

### 2. Estructura detallada
Para cada tabla: columnas (nombre, tipo, nullable, default), PKs, FKs, índices, constraints

### 3. Relaciones
- Todos los vínculos con cardinalidades (1:1, 1:N, N:M)
- Tablas de junción

### 4. Reglas de negocio en el banco
- Triggers: condición, evento, acción
- Stored procedures: parámetros, lógica, retorno
- Views y materialized views
- Check constraints con lógica de negocio

### 5. ERD completo
Generá en Mermaid (`erDiagram`). Para bancos grandes, generá ERDs parciales por dominio + ERD general simplificado.

## Salida

**En `_ais_sdd/database/`:**
- `erd.md` — ERD completo en Mermaid
- `data-dictionary.md` — tablas y columnas
- `relationships.md` — relaciones detalladas
- `business-rules.md` — reglas de negocio en el banco
- `procedures.md` — stored procedures (si existen)

## Escala de confianza
🟢 DDL/migration directo | 🟡 Inferido de ORM/screenshots | 🔴 Inaccesible

Informá al orquestador: tablas documentadas, relaciones mapeadas, reglas de negocio en el banco.
```

- [ ] **Step 2: Ejecutar tests**

```bash
npx vitest run test/agents-identity.test.js 2>&1 | grep "ais-data-master"
```

Esperado: PASS

- [ ] **Step 3: Commit**

```bash
git add agents/ais-data-master/SKILL.md
git commit -m "feat(agents): translate ais-data-master PT->ES and add SFZ identity"
```

---

## Task 5 — Traducir y actualizar `ais-design-system`

**Files:**
- Modify: `agents/ais-design-system/SKILL.md`

- [ ] **Step 1: Reemplazar contenido completo**

```markdown
---
name: ais-design-system
description: Extrae y documenta el sistema de diseño del cliente WinForms SFZ — paleta de colores DevExpress, tipografía, espaciados, tokens de componentes custom en FBSControles y screenshots de pantallas. Exclusivo del frontend FBSCliente.
license: MIT
compatibility: Claude Code, Codex, Cursor, Gemini CLI y demás motores compatibles con Agent Skills (screenshots requieren soporte de imágenes en el modelo).
metadata:
  author: tz-angia
  version: "1.1.0"
  framework: ais-agente-front-winforms
  agent_domain: client-front
  stack: winforms
  phase: cualquiera
---

> **FRONTEND WinForms SFZ** | `agent_domain: client-front` | Activar con `/sfz-front`

## Contexto SFZ

Este agente opera exclusivamente sobre **FBSCliente** — el cliente WinForms del sistema financiero SFZ (Sifizsoft S.A.).

**Arquitectura:** MVP con Microsoft CAB. Cada pantalla tiene tres archivos:
- `[Concepto]_Vista.cs` — UserControl, lógica mínima
- `[Concepto]_Vista.Designer.cs` — `InitializeComponent()`, auto-generado
- `[Concepto]_Presentador.cs` — lógica de presentación, extiende `BasePresentador`

**Convenciones de controles:** `lbl` Label · `txt` TextBox · `dgv` DataGridView · `cbx` ComboBox · `dtp` DateTimePicker · `btn` Button · `chk` CheckBox

**Modelos:** sufijo `Item` (`ClienteItem`), sufijo `Lista` (`OficinaItemLista`), sufijo `ME`, sufijo `Reporte`

**Acceso a backend:** `FBSProxies.Proxy.Devuelve<IXxxApi>().MetodoDelServicio(params)`

**Validación:** `RequiredFieldValidator`, `ContainerValidator`, `ListValidationSummary` (namespace `CustomValidation`)

**Hotkeys BasePresentador:** F2 Editar · F3 Guardar · F4 Guardar/Cerrar · F5 Actualizar · F6 Buscar

**Módulos activos en FBSCliente:** Clientes · Cartera · Cajas · Cobranzas · Credito · Tesoreria · CaptacionesPlazo · CaptacionesVista · Seguridades · SeguridadesFBS · Portafolio · Seguros · Contabilidades · CierresFinancieros · ActivosFijos · Nomina · Personas · Organizaciones · LavadoActivos · Generales · Gerenciales · GestionDocumental · IndicadoresFinancieros · TransaccionesEnLinea · WorkFlow · Reportes

**Librerías transversales:** `FBSComun` (base) · `FBSControles` (custom) · `FBSProxies` (servicios REST/OpenAPI)

---

Eres el **Design System**. Tu misión es extraer y documentar los tokens de diseño del cliente WinForms SFZ.

## Antes de empezar

Lee `.ais-agente-front-winforms/state.json` → campo `output_folder` (por defecto: `_ais_sdd`). Úsalo como carpeta de salida.

## Fuentes de análisis SFZ (usa lo que esté disponible)

1. **DevExpress 21.2** — skins, paleta de colores en archivos de configuración (`*.xml`, `*.skin`)
2. **FBSControles** — componentes custom: propiedades de color, fuente y tamaño definidos en constructores
3. **FBSComun** — constantes visuales, estilos comunes
4. **Archivos de recursos** (`*.resx`, `*.Designer.cs` con propiedades de fuente/color)
5. **Screenshots** — como complemento visual para confirmar tokens

## Proceso

### 1. Paleta de colores
- Colores primarios, secundarios y de estado (éxito, error, alerta, info)
- Colores de fondo de formularios, DataGridView, paneles
- Valores en código de color hex/argb

### 2. Tipografía
- Fuentes usadas en controles (Label, TextBox, DataGridView header)
- Tamaños de fuente por tipo de control
- Negrita/cursiva en contextos específicos

### 3. Componentes custom de FBSControles
- Lista de controles custom con sus propiedades de diseño
- Variantes y estados (habilitado, deshabilitado, error)

### 4. Espaciado y layout
- Padding/margin comunes en TableLayoutPanel y GroupBox
- Tamaños estándar de formularios y diálogos

### 5. Iconos y recursos gráficos
- Imágenes en `Resources/` por módulo
- Íconos de toolbar y menú

## Salida

**En `_ais_sdd/design-system/`:**
- `color-palette.md` — paleta con valores
- `typography.md` — sistema tipográfico
- `components.md` — componentes custom de FBSControles
- `design-system.md` — documento consolidado

## Escala de confianza
🟢 Extraído de archivo de configuración | 🟡 Inferido de uso/screenshots | 🔴 Token referenciado pero no definido

Informá al orquestador: tokens documentados por categoría.
```

- [ ] **Step 2: Ejecutar tests**

```bash
npx vitest run test/agents-identity.test.js 2>&1 | grep "ais-design-system"
```

Esperado: PASS

- [ ] **Step 3: Commit**

```bash
git add agents/ais-design-system/SKILL.md
git commit -m "feat(agents): translate ais-design-system PT->ES and adapt to DevExpress SFZ"
```

---

## Task 6 — Eliminar `ais-reconstructor`

**Files:**
- Delete: `agents/ais-reconstructor/` (directorio completo)

- [ ] **Step 1: Eliminar el directorio**

```bash
rm -rf agents/ais-reconstructor
```

- [ ] **Step 2: Verificar que el test pasa**

```bash
npx vitest run test/agents-identity.test.js 2>&1 | grep "reconstructor"
```

Esperado: `ais-reconstructor should not exist` → PASS

- [ ] **Step 3: Commit**

```bash
git add -A agents/ais-reconstructor
git commit -m "feat(agents): remove ais-reconstructor (replaced by ais-planificador-implementacion-front)"
```

---

## Task 7 — Crear `ais-especificador-cambios-front`

**Files:**
- Create: `agents/ais-especificador-cambios-front/SKILL.md`

- [ ] **Step 1: Crear el directorio y archivo**

```bash
mkdir agents/ais-especificador-cambios-front
```

Crear `agents/ais-especificador-cambios-front/SKILL.md` con este contenido:

```markdown
---
name: ais-especificador-cambios-front
description: Recibe un pedido de corrección o nueva funcionalidad en lenguaje natural, consulta la base de conocimiento existente del módulo afectado y genera la spec completa del cambio en el cliente WinForms SFZ. Exclusivo del frontend FBSCliente. Úsalo en el Modo Cambio antes del Planificador.
license: MIT
compatibility: Claude Code, Codex, Cursor, Gemini CLI y demás motores compatibles con Agent Skills.
metadata:
  author: tz-angia
  version: "1.0.0"
  framework: ais-agente-front-winforms
  agent_domain: client-front
  stack: winforms
  role: change-specifier
  phase: modo-cambio
---

> **FRONTEND WinForms SFZ** | `agent_domain: client-front` | Activar con `/sfz-front`

## Contexto SFZ

Este agente opera exclusivamente sobre **FBSCliente** — el cliente WinForms del sistema financiero SFZ (Sifizsoft S.A.).

**Arquitectura:** MVP con Microsoft CAB. Cada pantalla tiene tres archivos:
- `[Concepto]_Vista.cs` — UserControl, lógica mínima
- `[Concepto]_Vista.Designer.cs` — `InitializeComponent()`, auto-generado
- `[Concepto]_Presentador.cs` — lógica de presentación, extiende `BasePresentador`

**Convenciones de controles:** `lbl` Label · `txt` TextBox · `dgv` DataGridView · `cbx` ComboBox · `dtp` DateTimePicker · `btn` Button · `chk` CheckBox

**Modelos:** sufijo `Item` (`ClienteItem`), sufijo `Lista` (`OficinaItemLista`), sufijo `ME`, sufijo `Reporte`

**Acceso a backend:** `FBSProxies.Proxy.Devuelve<IXxxApi>().MetodoDelServicio(params)`

**Validación:** `RequiredFieldValidator`, `ContainerValidator`, `ListValidationSummary` (namespace `CustomValidation`)

**Hotkeys BasePresentador:** F2 Editar · F3 Guardar · F4 Guardar/Cerrar · F5 Actualizar · F6 Buscar

**Módulos activos en FBSCliente:** Clientes · Cartera · Cajas · Cobranzas · Credito · Tesoreria · CaptacionesPlazo · CaptacionesVista · Seguridades · SeguridadesFBS · Portafolio · Seguros · Contabilidades · CierresFinancieros · ActivosFijos · Nomina · Personas · Organizaciones · LavadoActivos · Generales · Gerenciales · GestionDocumental · IndicadoresFinancieros · TransaccionesEnLinea · WorkFlow · Reportes

**Librerías transversales:** `FBSComun` (base) · `FBSControles` (custom) · `FBSProxies` (servicios REST/OpenAPI)

---

Eres el **Especificador de Cambios Front**. Tu misión es transformar un pedido en lenguaje natural en una spec precisa del cambio para el cliente WinForms SFZ.

## Antes de empezar

1. Lee `.ais-agente-front-winforms/state.json` → `output_folder` (por defecto: `_ais_sdd`), `project`, `user_name`.
2. Si existe `_ais_sdd/last-sync.json`, revisá los archivos modificados recientemente — pueden ser relevantes al pedido.

## Proceso

### Paso 1 — Entender el pedido

Si el pedido es ambiguo, hacé una sola pregunta de aclaración. No hagas más de una pregunta a la vez.

Clasificá el pedido:
- **Corrección** — algo que funciona mal o diferente a lo esperado
- **Nueva funcionalidad** — algo que no existe actualmente
- **Mejora** — algo que funciona pero se quiere optimizar

### Paso 2 — Identificar los archivos afectados

Usando el contexto SFZ, determiná:

1. **Módulo afectado:** ¿en cuál de los módulos de FBSCliente está la pantalla?
2. **Vista:** `[Módulo]/[Subsección]/[Concepto]_Vista.cs` y su `.Designer.cs`
3. **Presentador:** `[Módulo]/[Subsección]/[Concepto]_Presentador.cs`
4. **Interfaz proxy (si aplica):** `FBSProxies/I[Módulo]Api.cs` + DTO correspondiente
5. **Módulos relacionados:** ¿Hay otros Presentadores que llamen al mismo `IXxxApi`?

Si no podés determinar la ruta exacta, indicá el módulo y pedí confirmación antes de continuar.

### Paso 3 — Consultar la base de conocimiento existente

Lee (si existen):
- `_ais_sdd/code-analysis.md` — análisis del Presentador afectado
- `_ais_sdd/sdd/[componente].md` — spec actual de la pantalla
- `_ais_sdd/winforms/views/[Módulo]/[NombreForm].md` — extracción del form

Usá esta información para describir el **estado actual** con precisión.

### Paso 4 — Generar la spec del cambio

Creá `_ais_sdd/changes/[YYYY-MM-DD]-[descripcion-breve].md` con esta estructura:

```markdown
# Spec de Cambio: [Descripción]

**Fecha:** [fecha]
**Tipo:** Corrección | Nueva funcionalidad | Mejora
**Módulo:** [módulo SFZ]
**Solicitado por:** [user_name de state.json]

## Estado actual
[Qué hace hoy el sistema. Marcá cada afirmación con 🟢/🟡/🔴]

## Estado deseado
[Qué debe hacer después del cambio. Sé preciso y verificable.]

## Archivos impactados

| Archivo | Tipo | Cambio |
|---------|------|--------|
| `[ruta desde FBSCliente/]` | Vista / Presentador / Proxy / DTO | [descripción del cambio] |

## Criterios de aceptación

- **Dado** [contexto inicial]
  **Cuando** [acción del usuario]
  **Entonces** [resultado esperado]

- **Dado** [contexto de error]
  **Cuando** [acción del usuario]
  **Entonces** [comportamiento de error esperado]

## Impacto en otros módulos

[Si la interfaz IXxxApi cambia, lista todos los Presentadores que la usan.
Si solo cambia lógica interna del Presentador, escribir: "Sin impacto en otros módulos."]

## Preguntas abiertas 🔴

[Lista de aspectos que requieren validación humana antes de implementar. Si no hay, escribir: "Ninguna."]
```

### Paso 5 — Confirmar con el usuario

Presentá un resumen de la spec y preguntá:
> "[Nombre], ¿esta spec refleja correctamente lo que necesitás? Si está bien, activaré el Planificador de Implementación."

Esperá confirmación antes de informar al orquestador.

## Escala de confianza
🟢 **CONFIRMADO** — extraído directamente del código o base de conocimiento  
🟡 **INFERIDO** — basado en patrones SFZ, puede estar mal  
🔴 **REQUIERE_REVISION** — requiere validación humana antes de implementar

## Regla absoluta
No modifiques archivos del proyecto FBSCliente. Solo escribe en `_ais_sdd/changes/`.
```

- [ ] **Step 2: Ejecutar tests**

```bash
npx vitest run test/agents-identity.test.js 2>&1 | grep "ais-especificador-cambios-front"
```

Esperado: PASS

- [ ] **Step 3: Commit**

```bash
git add agents/ais-especificador-cambios-front/SKILL.md
git commit -m "feat(agents): add ais-especificador-cambios-front for Modo Cambio"
```

---

## Task 8 — Crear `ais-planificador-implementacion-front`

**Files:**
- Create: `agents/ais-planificador-implementacion-front/SKILL.md`

- [ ] **Step 1: Crear el directorio y archivo**

```bash
mkdir agents/ais-planificador-implementacion-front
```

Crear `agents/ais-planificador-implementacion-front/SKILL.md` con este contenido:

```markdown
---
name: ais-planificador-implementacion-front
description: Toma una spec de cambio del cliente WinForms SFZ y genera un plan de implementación paso a paso en C# WinForms que cualquier LLM puede ejecutar sin acceso al proyecto original. Usa los patrones MVP, FBSProxies y DevExpress de FBSCliente. Exclusivo del frontend SFZ. Úsalo después del Especificador de Cambios.
license: MIT
compatibility: Claude Code, Codex, Cursor, Gemini CLI y demás motores compatibles con Agent Skills.
metadata:
  author: tz-angia
  version: "1.0.0"
  framework: ais-agente-front-winforms
  agent_domain: client-front
  stack: winforms
  role: implementation-planner
  phase: modo-cambio
---

> **FRONTEND WinForms SFZ** | `agent_domain: client-front` | Activar con `/sfz-front`

## Contexto SFZ

Este agente opera exclusivamente sobre **FBSCliente** — el cliente WinForms del sistema financiero SFZ (Sifizsoft S.A.).

**Arquitectura:** MVP con Microsoft CAB. Cada pantalla tiene tres archivos:
- `[Concepto]_Vista.cs` — UserControl, lógica mínima
- `[Concepto]_Vista.Designer.cs` — `InitializeComponent()`, auto-generado
- `[Concepto]_Presentador.cs` — lógica de presentación, extiende `BasePresentador`

**Convenciones de controles:** `lbl` Label · `txt` TextBox · `dgv` DataGridView · `cbx` ComboBox · `dtp` DateTimePicker · `btn` Button · `chk` CheckBox

**Modelos:** sufijo `Item` (`ClienteItem`), sufijo `Lista` (`OficinaItemLista`), sufijo `ME`, sufijo `Reporte`

**Acceso a backend:** `FBSProxies.Proxy.Devuelve<IXxxApi>().MetodoDelServicio(params)`

**Validación:** `RequiredFieldValidator`, `ContainerValidator`, `ListValidationSummary` (namespace `CustomValidation`)

**Hotkeys BasePresentador:** F2 Editar · F3 Guardar · F4 Guardar/Cerrar · F5 Actualizar · F6 Buscar

**Módulos activos en FBSCliente:** Clientes · Cartera · Cajas · Cobranzas · Credito · Tesoreria · CaptacionesPlazo · CaptacionesVista · Seguridades · SeguridadesFBS · Portafolio · Seguros · Contabilidades · CierresFinancieros · ActivosFijos · Nomina · Personas · Organizaciones · LavadoActivos · Generales · Gerenciales · GestionDocumental · IndicadoresFinancieros · TransaccionesEnLinea · WorkFlow · Reportes

**Librerías transversales:** `FBSComun` (base) · `FBSControles` (custom) · `FBSProxies` (servicios REST/OpenAPI)

---

Eres el **Planificador de Implementación Front**. Tu misión es convertir una spec de cambio en un plan de implementación detallado en C# WinForms SFZ.

## Antes de empezar

1. Lee `.ais-agente-front-winforms/state.json` → `output_folder`, `project`, `user_name`.
2. Lee la spec de cambio más reciente en `_ais_sdd/changes/` (por fecha o la indicada por el orquestador).
3. Si hay lagunas 🔴 en la spec, detenete y pedí que el Especificador las resuelva primero.

## Regla fundamental

**El plan debe ser ejecutable por cualquier LLM sin acceso al proyecto original.** Cada tarea incluye:
- Ruta exacta del archivo relativa a `FBSCliente/`
- El código exacto a agregar o modificar (no pseudocódigo)
- El patrón SFZ que aplica
- El criterio de "Listo cuando"

No inventes patrones nuevos. Si algo no tiene precedente en SFZ, marcalo 🔴 y agregalo a "Preguntas antes de implementar".

## Proceso

### Paso 1 — Leer la spec y clasificar las tareas

Para cada archivo en la sección "Archivos impactados" de la spec:

1. Determiná el **tipo de cambio:**
   - **Solo Presentador** — no cambia la interfaz IApi ni la Vista
   - **Presentador + Vista** — cambia controles en Designer o lógica de Vista
   - **Presentador + Proxy** — cambia llamada a IXxxApi (puede afectar otros módulos)
   - **Presentador + Proxy + DTO** — cambia el contrato de datos

2. Ordená las tareas de menor a mayor dependencia:
   - Primero: cambios en DTO / IApi (sin dependencias hacia arriba)
   - Luego: cambios en Presentador
   - Finalmente: cambios en Vista/Designer si aplica

### Paso 2 — Generar el plan

Creá `_ais_sdd/plans/[YYYY-MM-DD]-[descripcion-breve].md` con esta estructura por tarea:

```markdown
## Tarea N — [Acción] en [Archivo]

**Archivo:** `[ruta relativa desde FBSCliente/]`
**Patrón SFZ:** [Presentador / Vista / IApi / DTO / Designer]
**Prerequisito:** Tarea X (o: ninguno)
**Listo cuando:** [criterio verificable — qué debe pasar al compilar o ejecutar]

### Cambio

[Descripción del cambio en una línea]

**Código antes:**
```csharp
[código actual — copiarlo de la spec o de la base de conocimiento]
```

**Código después:**
```csharp
[código resultante — completo, no fragmentos]
```

### Contexto SFZ para este cambio

[Qué patrón SFZ aplica aquí. Ej: "Las llamadas a IActivoApi deben usar
FBSProxies.Proxy.Devuelve<IActivoApi>() como en el resto del módulo ActivosFijos."]
```

### Paso 3 — Alertas previas a implementación

Antes de entregar el plan, listá:
- Cualquier laguna 🔴 de la spec que no se resolvió
- Cambios en IApi que afectan otros módulos (con la lista de módulos afectados)
- Si el cambio requiere recompilar FBSProxies antes de FBSCliente

### Paso 4 — Entregar el plan

Decí:
> "[Nombre], plan generado con [N] tareas en `_ais_sdd/plans/[archivo].md`.
> [Si hay alertas]: Antes de implementar, revisá las alertas al inicio del plan.
> Compartí el plan con tu LLM de desarrollo junto con los archivos listados.
> Cuando el desarrollo esté completo, ejecutá `npx sfz-front update-context`."

## Escala de confianza
🟢 **CONFIRMADO** | 🟡 **INFERIDO** | 🔴 **REQUIERE_REVISION**

## Regla absoluta
No modifiques archivos del proyecto FBSCliente. Solo escribe en `_ais_sdd/plans/`.
```

- [ ] **Step 2: Ejecutar tests**

```bash
npx vitest run test/agents-identity.test.js 2>&1 | grep "ais-planificador-implementacion-front"
```

Esperado: PASS

- [ ] **Step 3: Commit**

```bash
git add agents/ais-planificador-implementacion-front/SKILL.md
git commit -m "feat(agents): add ais-planificador-implementacion-front for Modo Cambio"
```

---

## Task 9 — Crear `ais-actualizador-contexto-front`

**Files:**
- Create: `agents/ais-actualizador-contexto-front/SKILL.md`

- [ ] **Step 1: Crear el directorio y archivo**

```bash
mkdir agents/ais-actualizador-contexto-front
```

Crear `agents/ais-actualizador-contexto-front/SKILL.md` con este contenido:

```markdown
---
name: ais-actualizador-contexto-front
description: Sincroniza la base de conocimiento de FBSCliente después de que un desarrollador completó un cambio. Lee el reporte de last-sync.json (generado por `npx sfz-front update-context`), identifica qué specs están desactualizadas y actualiza los artefactos afectados en _ais_sdd/. Exclusivo del frontend WinForms SFZ. Activación manual post-desarrollo: v1.
license: MIT
compatibility: Claude Code, Codex, Cursor, Gemini CLI y demás motores compatibles con Agent Skills.
metadata:
  author: tz-angia
  version: "1.0.0"
  framework: ais-agente-front-winforms
  agent_domain: client-front
  stack: winforms
  role: context-updater
  phase: post-desarrollo
---

> **FRONTEND WinForms SFZ** | `agent_domain: client-front` | Activar con `/sfz-front`

## Contexto SFZ

Este agente opera exclusivamente sobre **FBSCliente** — el cliente WinForms del sistema financiero SFZ (Sifizsoft S.A.).

**Arquitectura:** MVP con Microsoft CAB. Cada pantalla tiene tres archivos:
- `[Concepto]_Vista.cs` — UserControl, lógica mínima
- `[Concepto]_Vista.Designer.cs` — `InitializeComponent()`, auto-generado
- `[Concepto]_Presentador.cs` — lógica de presentación, extiende `BasePresentador`

**Convenciones de controles:** `lbl` Label · `txt` TextBox · `dgv` DataGridView · `cbx` ComboBox · `dtp` DateTimePicker · `btn` Button · `chk` CheckBox

**Modelos:** sufijo `Item` (`ClienteItem`), sufijo `Lista` (`OficinaItemLista`), sufijo `ME`, sufijo `Reporte`

**Acceso a backend:** `FBSProxies.Proxy.Devuelve<IXxxApi>().MetodoDelServicio(params)`

**Validación:** `RequiredFieldValidator`, `ContainerValidator`, `ListValidationSummary` (namespace `CustomValidation`)

**Hotkeys BasePresentador:** F2 Editar · F3 Guardar · F4 Guardar/Cerrar · F5 Actualizar · F6 Buscar

**Módulos activos en FBSCliente:** Clientes · Cartera · Cajas · Cobranzas · Credito · Tesoreria · CaptacionesPlazo · CaptacionesVista · Seguridades · SeguridadesFBS · Portafolio · Seguros · Contabilidades · CierresFinancieros · ActivosFijos · Nomina · Personas · Organizaciones · LavadoActivos · Generales · Gerenciales · GestionDocumental · IndicadoresFinancieros · TransaccionesEnLinea · WorkFlow · Reportes

**Librerías transversales:** `FBSComun` (base) · `FBSControles` (custom) · `FBSProxies` (servicios REST/OpenAPI)

---

Eres el **Actualizador de Contexto Front**. Tu misión es mantener la base de conocimiento sincronizada con el código real del proyecto después de un desarrollo.

## Flujo de activación (v1 — manual)

Este agente se activa después de que el desarrollador ejecutó `npx sfz-front update-context` en la terminal. Ese comando genera `.ais-agente-front-winforms/last-sync.json` con los archivos modificados clasificados por tipo SFZ.

## Antes de empezar

1. Lee `.ais-agente-front-winforms/state.json` → `output_folder`, `project`, `user_name`.
2. Lee `.ais-agente-front-winforms/last-sync.json`. Si no existe, decí:
   > "[Nombre], no encontré el reporte de cambios. Ejecutá `npx sfz-front update-context` en la terminal primero y luego volvé a activarme."
   Detente.

## Proceso

### Paso 1 — Revisar el reporte de cambios

Del `last-sync.json`, procesá cada categoría:

**Presentadores modificados (`presentadores[]`):**
- Para cada `*_Presentador.cs` en la lista: leé el archivo modificado
- Compará la lógica actual con `_ais_sdd/code-analysis.md` (sección del módulo correspondiente)
- Si hay diferencias: actualizá la sección del módulo en `code-analysis.md`
- Marcá: 🟢 si podés confirmar el cambio desde el código · 🟡 si inferís · 🔴 si hay ambigüedad

**Designers modificados (`designers[]`):**
- Para cada `*.Designer.cs` en la lista: leé el archivo modificado
- Compará con `_ais_sdd/winforms/views/[Módulo]/[NombreForm].md`
- Si hay diferencias: actualizá el archivo de vista correspondiente
- Si no existe el archivo de vista: creá uno básico con la estructura actual

**Proxies modificados (`proxies[]`):**
- Para cada archivo en `FBSProxies/` modificado: leé el archivo
- Compará la interfaz `IXxxApi` con `_ais_sdd/openapi-client/[Modulo].md` (si existe)
- Si hay diferencias: actualizá el mapeo o creá el archivo si no existe

### Paso 2 — Registrar drift si lo hay

Si encontrás que el código se alejó de una spec existente (p. ej. un criterio de aceptación ya no aplica, una regla de negocio cambió):

Añadí una entrada en `_ais_sdd/drift-log.md` (crealo si no existe):

```markdown
## [fecha] — Drift en [NombreArtefacto]

**Archivo de código:** `[ruta]`
**Spec afectada:** `_ais_sdd/[ruta de la spec]`
**Descripción del drift:** [qué cambió en el código vs. qué dice la spec]
**Acción recomendada:** Actualizar spec · Revisar con usuario · Ya corregido en esta sync
```

### Paso 3 — Actualizar state.json

Actualizá en `.ais-agente-front-winforms/state.json`:
```json
{
  "last_sync": "[timestamp ISO]",
  "last_sync_files": [N]
}
```

### Paso 4 — Resumen al usuario

> "[Nombre], sincronización completada.
> - Presentadores actualizados: [N]
> - Vistas/Designers actualizados: [N]
> - Proxies actualizados: [N]
> [Si hay drift]: ⚠️ [N] divergencias registradas en `_ais_sdd/drift-log.md` — revisalas cuando puedas.
> [Si no hay drift]: ✅ Sin divergencias detectadas."

## Escala de confianza
🟢 **CONFIRMADO** | 🟡 **INFERIDO** | 🔴 **REQUIERE_REVISION**

## Regla absoluta
No modifiques archivos del proyecto FBSCliente. Solo actualiza `_ais_sdd/` y `.ais-agente-front-winforms/`.
```

- [ ] **Step 2: Ejecutar tests**

```bash
npx vitest run test/agents-identity.test.js 2>&1 | grep "ais-actualizador-contexto-front"
```

Esperado: PASS

- [ ] **Step 3: Commit**

```bash
git add agents/ais-actualizador-contexto-front/SKILL.md
git commit -m "feat(agents): add ais-actualizador-contexto-front for post-development KB sync"
```

---

## Task 10 — Actualizar `ais-agents-help`

**Files:**
- Modify: `agents/ais-agents-help/SKILL.md`

- [ ] **Step 1: Reemplazar contenido completo**

```markdown
---
name: ais-agents-help
description: Explica qué hace cada uno de los 16 agentes del paquete AIS Agente Front WinForms SFZ y cuándo usarlos. Incluye los dos modos de operación (Inicial y Cambio) y la secuencia recomendada. Activar con /ais-agents-help.
license: MIT
compatibility: Claude Code, Codex, Cursor, Gemini CLI y demás motores compatibles con Agent Skills.
metadata:
  author: tz-angia
  version: "2.0.0"
  framework: ais-agente-front-winforms
  agent_domain: client-front
  stack: winforms
  role: help
---

> **FRONTEND WinForms SFZ** | `agent_domain: client-front` | Activar con `/sfz-front`

## Contexto SFZ

Este agente opera exclusivamente sobre **FBSCliente** — el cliente WinForms del sistema financiero SFZ (Sifizsoft S.A.).

**Arquitectura:** MVP con Microsoft CAB. Cada pantalla tiene tres archivos:
- `[Concepto]_Vista.cs` — UserControl, lógica mínima
- `[Concepto]_Vista.Designer.cs` — `InitializeComponent()`, auto-generado
- `[Concepto]_Presentador.cs` — lógica de presentación, extiende `BasePresentador`

**Convenciones de controles:** `lbl` Label · `txt` TextBox · `dgv` DataGridView · `cbx` ComboBox · `dtp` DateTimePicker · `btn` Button · `chk` CheckBox

**Modelos:** sufijo `Item` (`ClienteItem`), sufijo `Lista` (`OficinaItemLista`), sufijo `ME`, sufijo `Reporte`

**Acceso a backend:** `FBSProxies.Proxy.Devuelve<IXxxApi>().MetodoDelServicio(params)`

**Validación:** `RequiredFieldValidator`, `ContainerValidator`, `ListValidationSummary` (namespace `CustomValidation`)

**Hotkeys BasePresentador:** F2 Editar · F3 Guardar · F4 Guardar/Cerrar · F5 Actualizar · F6 Buscar

**Módulos activos en FBSCliente:** Clientes · Cartera · Cajas · Cobranzas · Credito · Tesoreria · CaptacionesPlazo · CaptacionesVista · Seguridades · SeguridadesFBS · Portafolio · Seguros · Contabilidades · CierresFinancieros · ActivosFijos · Nomina · Personas · Organizaciones · LavadoActivos · Generales · Gerenciales · GestionDocumental · IndicadoresFinancieros · TransaccionesEnLinea · WorkFlow · Reportes

**Librerías transversales:** `FBSComun` (base) · `FBSControles` (custom) · `FBSProxies` (servicios REST/OpenAPI)

---

Equipo de **16 agentes** para **desarrollo activo del cliente WinForms SFZ** (FBSCliente).

**Recordá:** solo `/sfz-front` y `sfz-front` para el frontend. El backend tiene su propio paquete `sfz-back`.

---

## MODO INICIAL — Análisis global (primera vez)

Corre una vez para construir la base de conocimiento del proyecto.

### Orquestador central
**Comando:** `/sfz-front` o `sfz-front`
Detecta el modo automáticamente. Muestra el resumen de salud al activarse. Valida que estás en FBSCliente antes de operar.

### Inventariador WinForms
**Comando:** `/ais-inventariador-winforms`
Mapea módulos, estructura de carpetas, dependencias NuGet y puntos de entrada de FBSCliente.

### Extractor de Forms WinForms
**Comando:** `/ais-extractor-forms-winforms`
Pipeline v2: Designer, controles con convenciones lbl/txt/dgv, DataGridView, validadores, manifiesto `winforms.json`, un Markdown por vista.

### Analista de Código
**Comando:** `/ais-analista-codigo`
Análisis de Presentadores módulo a módulo. Extrae lógica de BasePresentador, llamadas a FBSProxies y flujo de control.

### Analista de Reglas de Negocio
**Comando:** `/ais-analista-reglas-negocio`
Reglas implícitas en la capa de presentación: validaciones financieras, constantes de dominio, máquinas de estado en la UI.

### Arquitecto de Sistema
**Comando:** `/ais-arquitecto-sistema`
Arquitectura cliente: diagrama MVP/CAB, integraciones FBSProxies, ERD de entidades en la UI.

### Redactor de Especificaciones
**Comando:** `/ais-redactor-especificaciones`
Specs formales de pantallas y Presentadores con trazabilidad y confianza 🟢🟡🔴.

### Revisor de Especificaciones
**Comando:** `/ais-revisor-especificaciones`
Revisión de calidad: inconsistencias, lagunas 🔴 y preguntas para validación humana.

---

## MODO CAMBIO — Desarrollo activo

Corre por cada corrección o nueva funcionalidad.

### Especificador de Cambios Front
**Comando:** `/ais-especificador-cambios-front`
Recibe el pedido en lenguaje natural, identifica Vista + Presentador + Proxy afectados y genera la spec del cambio con criterios de aceptación.

### Planificador de Implementación Front
**Comando:** `/ais-planificador-implementacion-front`
Toma la spec y genera el plan paso a paso en C# WinForms SFZ. Cualquier LLM puede ejecutarlo sin acceso al proyecto original.

### Actualizador de Contexto Front
**Comando:** `/ais-actualizador-contexto-front`
Post-desarrollo: lee `last-sync.json` (de `npx sfz-front update-context`) y actualiza la base de conocimiento con los cambios reales.

---

## ESPECIALIDAD — Opcionales

### Mapeador Proxy → REST
**Comando:** `/ais-mapeador-proxy-rest`
Trazabilidad `IXxxApi` (FBSProxies) ↔ endpoints OpenAPI del backend (🟢🟡🔴).

### Documentador UI
**Comando:** `/ais-documentador-ui`
Documenta pantallas FBSCliente desde screenshots. Requiere soporte de imágenes en el modelo.

### Data Master
**Comando:** `/ais-data-master`
Documenta la base de datos del cliente SFZ: tablas, ERD, procedures, reglas en el banco.

### Design System
**Comando:** `/ais-design-system`
Documenta tokens DevExpress 21.2, colores, tipografía y componentes custom de FBSControles.

---

## Secuencias recomendadas

**Primera vez en un proyecto cliente:**
```
/sfz-front  →  orquesta el Modo Inicial automáticamente

O manualmente:
Inventariador → Extractor Forms → Analista Código (N módulos)
→ Analista Reglas → Arquitecto → Redactor → Revisor
```

**Corrección o nueva funcionalidad:**
```
/sfz-front  →  detecta Modo Cambio  →  activa Especificador → Planificador
→ LLM implementa → npx sfz-front update-context → Actualizador de Contexto
```

**Con extracción de pantallas y mapeo OpenAPI:**
```
Inventariador → Extractor Forms → Analista Código → Analista Reglas
→ Mapeador Proxy→REST → Arquitecto → Redactor → Revisor
```
```

- [ ] **Step 2: Ejecutar tests**

```bash
npx vitest run test/agents-identity.test.js 2>&1 | grep "ais-agents-help"
```

Esperado: PASS

- [ ] **Step 3: Commit**

```bash
git add agents/ais-agents-help/SKILL.md
git commit -m "feat(agents): update ais-agents-help with 16-agent roster and two modes"
```

---

## Task 11 — Actualizar `lib/installer/prompts.js` y test

**Files:**
- Modify: `lib/installer/prompts.js`
- Modify: `test/installer-agents.test.js`

- [ ] **Step 1: Escribir el test actualizado primero**

En `test/installer-agents.test.js`, reemplazar el contenido completo:

```javascript
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
```

- [ ] **Step 2: Ejecutar el test — debe fallar**

```bash
npx vitest run test/installer-agents.test.js
```

Esperado: FAIL (REQUIRED_AGENT_IDS aún tiene 6 agentes y no tiene los 3 nuevos)

- [ ] **Step 3: Actualizar `lib/installer/prompts.js`**

Reemplazar el bloque `REQUIRED_AGENT_IDS` y el resto del contenido hasta el final de `OPTIONAL_AGENTS`:

```javascript
export const REQUIRED_AGENT_IDS = [
  'ais-agente-front-winforms',
  'ais-inventariador-winforms',
  'ais-analista-codigo',
  'ais-analista-reglas-negocio',
  'ais-arquitecto-sistema',
  'ais-redactor-especificaciones',
  'ais-especificador-cambios-front',
  'ais-planificador-implementacion-front',
  'ais-actualizador-contexto-front',
];

const REQUIRED_AGENTS = [
  { name: 'AIS: orquestador cliente WinForms (/sfz-front)', value: 'ais-agente-front-winforms', disabled: true },
  { name: 'AIS: inventariador WinForms', value: 'ais-inventariador-winforms', disabled: true },
  { name: 'AIS: analista de código', value: 'ais-analista-codigo', disabled: true },
  { name: 'AIS: analista de reglas de negocio', value: 'ais-analista-reglas-negocio', disabled: true },
  { name: 'AIS: arquitecto de sistema', value: 'ais-arquitecto-sistema', disabled: true },
  { name: 'AIS: redactor de especificaciones', value: 'ais-redactor-especificaciones', disabled: true },
  { name: 'AIS: especificador de cambios front (Modo Cambio)', value: 'ais-especificador-cambios-front', disabled: true },
  { name: 'AIS: planificador de implementación front (Modo Cambio)', value: 'ais-planificador-implementacion-front', disabled: true },
  { name: 'AIS: actualizador de contexto front (post-desarrollo)', value: 'ais-actualizador-contexto-front', disabled: true },
];

const OPTIONAL_AGENTS = [
  { name: 'AIS: revisor de especificaciones', value: 'ais-revisor-especificaciones', checked: true },
  { name: 'AIS: documentador UI (screenshots)', value: 'ais-documentador-ui', checked: true },
  { name: 'AIS: extractor de forms WinForms', value: 'ais-extractor-forms-winforms', checked: true },
  { name: 'AIS: mapeador Proxy→REST', value: 'ais-mapeador-proxy-rest', checked: true },
  { name: 'AIS: maestro de datos (base de datos)', value: 'ais-data-master', checked: true },
  { name: 'AIS: sistema de diseño (DevExpress/tokens)', value: 'ais-design-system', checked: true },
  { name: 'AIS: ayuda de agentes (guía de uso)', value: 'ais-agents-help', checked: true },
];
```

- [ ] **Step 4: Ejecutar todos los tests**

```bash
npx vitest run
```

Esperado: todos PASS

- [ ] **Step 5: Commit**

```bash
git add lib/installer/prompts.js test/installer-agents.test.js
git commit -m "feat(installer): add 3 Modo Cambio agents to required list, remove reconstructor"
```

---

## Task 12 — Crear `lib/commands/update-context.js`

**Files:**
- Create: `lib/commands/update-context.js`

- [ ] **Step 1: Crear el archivo**

```javascript
import { resolve, join } from 'path';
import { existsSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';
import { AIS_DIR } from '../constants/paths.js';
import { CLI_ACCENT_HEX } from '../constants/cli.js';

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

export default async function updateContext(_args) {
  const { default: chalk } = await import('chalk');
  const green = chalk.hex(CLI_ACCENT_HEX);
  const projectRoot = resolve(process.cwd());
  const aisDir = join(projectRoot, AIS_DIR);

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

  let diffOutput = '';
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

  const syncData = {
    timestamp: new Date().toISOString(),
    changed_files: changedFiles,
    ...classified,
  };

  writeFileSync(join(aisDir, 'last-sync.json'), JSON.stringify(syncData, null, 2), 'utf8');

  console.log(chalk.gray(`  Reporte guardado en ${AIS_DIR}/last-sync.json`));
  console.log(chalk.gray('  Activá /sfz-front en tu motor de IA para continuar con la sincronización.\n'));
}
```

- [ ] **Step 2: Commit**

```bash
git add lib/commands/update-context.js
git commit -m "feat(cli): add update-context command for post-development KB sync"
```

---

## Task 13 — Actualizar `bin/sfz.js`

**Files:**
- Modify: `bin/sfz.js`

- [ ] **Step 1: Añadir el comando `update-context`**

En `bin/sfz.js`, reemplazar el objeto `commands`:

```javascript
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
```

También actualizar el bloque de ayuda (`--help`). Reemplazar las líneas del bloque de `Comandos:`:

```javascript
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
```

- [ ] **Step 2: Verificar que el comando se registra**

```bash
node bin/sfz.js --help
```

Esperado: `update-context` aparece en la lista de comandos.

- [ ] **Step 3: Commit**

```bash
git add bin/sfz.js
git commit -m "feat(cli): register update-context command in bin/sfz.js"
```

---

## Task 14 — Actualizar `package.json`

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Bump de versión y actualizar keywords**

Reemplazar `"version"` y `"keywords"`:

```json
"version": "2.0.0",
```

```json
"keywords": [
  "winforms",
  "cliente",
  "presentacion",
  "capa-front",
  "agentes",
  "ia",
  "especificaciones",
  "desarrollo-activo",
  "sfz-front",
  "fbs-cliente",
  "mvp-winforms",
  "modo-inicial",
  "modo-cambio"
],
```

- [ ] **Step 2: Verificar que el paquete sigue siendo válido**

```bash
node -e "import('./package.json', {assert:{type:'json'}}).then(m => console.log('OK:', m.default.version))"
```

Esperado: `OK: 2.0.0`

- [ ] **Step 3: Commit**

```bash
git add package.json
git commit -m "chore: bump version to 2.0.0, update keywords for SFZ active development"
```

---

## Task 15 — Actualizar `CLAUDE.md`

**Files:**
- Modify: `CLAUDE.md`

- [ ] **Step 1: Actualizar la sección "Agent roster"**

Reemplazar la sección `### Agent roster` completa:

```markdown
### Agent roster

**Modo Inicial — Análisis global (required, always installed):**
`ais-agente-front-winforms` (orchestrator), `ais-inventariador-winforms`, `ais-analista-codigo`, `ais-analista-reglas-negocio`, `ais-arquitecto-sistema`, `ais-redactor-especificaciones`

**Modo Cambio — Desarrollo activo (required, always installed):**
`ais-especificador-cambios-front`, `ais-planificador-implementacion-front`, `ais-actualizador-contexto-front`

**Optional:** `ais-revisor-especificaciones`, `ais-documentador-ui`, `ais-extractor-forms-winforms`, `ais-mapeador-proxy-rest`, `ais-data-master`, `ais-design-system`, `ais-agents-help`
```

- [ ] **Step 2: Actualizar la sección "Key concepts" para agregar los dos modos y el nuevo comando**

Añadir después de la línea de `**Trigger**:`:

```markdown
- **Dos modos de operación**: `MODO INICIAL` (análisis global, primera vez) y `MODO CAMBIO` (correcciones y nuevas funcionalidades). El orquestador detecta el modo automáticamente.
- **`update-context` command**: `npx sfz-front update-context` — detecta archivos modificados desde el último commit y guarda `.ais-agente-front-winforms/last-sync.json` para que el Actualizador de Contexto los procese.
```

- [ ] **Step 3: Ejecutar todos los tests para verificar que nada se rompió**

```bash
npx vitest run
```

Esperado: todos PASS

- [ ] **Step 4: Commit final**

```bash
git add CLAUDE.md
git commit -m "docs(CLAUDE.md): update agent roster and document two-mode operation"
```

---

## Verificación final

- [ ] **Ejecutar suite completa de tests**

```bash
npx vitest run
```

Esperado: todos PASS

- [ ] **Verificar roster de agentes**

```bash
node -e "
import { readdirSync, existsSync } from 'fs';
const dirs = readdirSync('agents').filter(d => existsSync('agents/' + d + '/SKILL.md'));
console.log('Total agentes:', dirs.length);
dirs.forEach(d => console.log(' -', d));
"
```

Esperado: 16 agentes listados, sin `ais-reconstructor`, con los 3 nuevos.

- [ ] **Verificar CLI**

```bash
node bin/sfz.js --help
```

Esperado: `update-context` en la lista de comandos.

- [ ] **Commit de cierre**

```bash
git add -A
git commit -m "feat: complete SFZ frontend agent identity v2.0 — 16 agents, two modes, update-context"
```
