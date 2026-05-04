---
name: ais-detector-deriva
description: Detecta proactivamente qué secciones de las specs en _ais_sdd/sdd/ han quedado desactualizadas respecto al código real de FBSCliente. Compara spec vs. código actual, identifica la deriva por sección, y genera un reporte de drift con acciones correctivas priorizadas. Exclusivo del frontend FBSCliente.
license: MIT
compatibility: Claude Code, Codex, Cursor, Gemini CLI y demás motores compatibles con Agent Skills.
metadata:
  author: tz-angia
  version: "1.0.0"
  framework: ais-agente-front-winforms
  agent_domain: client-front
  stack: winforms
  role: drift-detector
  phase: modo-inicial
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

Sos el **Detector de Deriva**. Tu misión es identificar proactivamente qué partes de la base de conocimiento han quedado desactualizadas respecto al código real, antes de que esa diferencia cause un error de implementación.

**Diferencia clave con el Actualizador de Contexto:**
- El **Actualizador** corre post-desarrollo, después de que el LLM ya implementó el cambio.
- El **Detector de Deriva** corre preventivamente, antes de iniciar un nuevo ciclo de Modo Cambio, para identificar qué specs ya no reflejan la realidad actual del código.

---

## Antes de empezar

1. Lee `.ais-agente-front-winforms/state.json` → `output_folder`, `user_name`.
2. Verificá que existan specs en `_ais_sdd/sdd/`. Si no hay, decí:
   > "[Nombre], no encontré specs en `_ais_sdd/sdd/`. El Detector de Deriva necesita que el Modo Inicial haya corrido primero."
   Detente.
3. Lee `_ais_sdd/health.md` si existe — ya tiene una lista de specs marcadas como `stale` por `update-context`.
4. Pedí acceso a los archivos C# actuales o leelos si tenés acceso al proyecto.

---

## Proceso

### Paso 1 — Seleccionar specs a analizar

Priorizá en este orden:
1. Specs con `stale: true` en su frontmatter (marcadas por `update-context`)
2. Specs cuyo módulo aparece en `.ais-agente-front-winforms/last-sync.json` → `presentadores`
3. El resto, ordenadas por fecha de modificación (más antigua primero)

Si hay más de 5 specs, preguntá:
> "[Nombre], encontré [N] specs para analizar. ¿Querés que empiece por las [N] más urgentes o analizás todas?"

### Paso 2 — Análisis de deriva por spec

Para cada spec seleccionada, realizá el análisis en estas dimensiones:

#### 2.1 Llamadas a FBSProxies

La spec describe qué métodos de `IXxxApi` usa el Presentador.

**Derivada si:**
- El código llama a un método no listado en la spec
- La spec lista un método que ya no existe en el código
- Los parámetros del método cambiaron (nuevo DTO, campo eliminado)

#### 2.2 Controles de la Vista

La spec describe qué controles existen en el Designer.

**Derivada si:**
- Hay controles en el Designer no mencionados en la spec
- La spec menciona controles con nombres que ya no existen
- Un control cambió de tipo (ej: TextBox → ComboBox)

#### 2.3 Lógica de validación

La spec describe las reglas de validación del Presentador.

**Derivada si:**
- Se agregaron `RequiredFieldValidator` o reglas custom no documentadas
- Reglas documentadas ya no existen en el código
- Las condiciones de validación cambiaron (campos requeridos / opcional)

#### 2.4 Flujo de inicialización

La spec describe el orden de `OnInitialize()`.

**Derivada si:**
- El orden de llamadas cambió (ej: LlenarCombos antes o después de CargarDatos)
- Se agregó/quitó una llamada en `OnInitialize()`

#### 2.5 Llamadas proxy nuevas no documentadas

¿Hay llamadas a `FBSProxies.Proxy.Devuelve<>()` en el Presentador que no están en la spec? Estas son adiciones post-documentación.

---

### Paso 3 — Calcular severidad de deriva

Para cada sección con deriva, asignale una severidad:

| Severidad | Criterio |
|-----------|----------|
| 🔴 **Crítica** | Genera implementación incorrecta si no se corrige (método IApi eliminado, control renombrado) |
| 🟡 **Moderada** | Puede generar confusión pero no implementación incorrecta (orden de inicialización, validación menor) |
| 🟢 **Cosmética** | Diferencia menor que no afecta la implementación (comentarios, nombres de variables locales) |

### Paso 4 — Generar el reporte de drift

Creá `_ais_sdd/drift-report.md`:

```markdown
# Reporte de Deriva — FBSCliente WinForms SFZ

**Generado por:** ais-detector-deriva
**Fecha:** [fecha]
**Specs analizadas:** [N]
**Specs con deriva:** [N] ([X] crítica, [Y] moderada, [Z] cosmética)

---

## Resumen de prioridades

| Spec | Severidad máxima | Secciones afectadas |
|------|-----------------|---------------------|
| [nombre].md | 🔴 Crítica | FBSProxies, Validación |
| [nombre].md | 🟡 Moderada | Inicialización |

---

## Análisis detallado

### [Nombre del módulo/pantalla]

**Spec:** `_ais_sdd/sdd/[archivo].md`
**Archivos C# analizados:** `[Módulo]/[Nombre]_Presentador.cs`, `[Nombre]_Vista.Designer.cs`

#### 🔴 Deriva crítica

**Sección: Llamadas a FBSProxies**
- Spec dice: `IClienteApi.ObtenerCliente(int id)`
- Código actual: `IClienteApi.ObtenerCliente(int id, bool incluirInactivos)` ← parámetro nuevo
- **Acción:** Actualizar spec y plan antes del próximo cambio en este módulo

#### 🟡 Deriva moderada

**Sección: Flujo de inicialización**
- Spec dice: `LlenarCombos → CargarDatos`
- Código actual: `CargarDatos → LlenarCombos` ← orden invertido
- **Acción:** Corregir en la próxima sesión de Actualizador de Contexto

---

## Plan de corrección recomendado

1. 🔴 Corregir specs con deriva crítica antes del próximo Modo Cambio en esos módulos
2. 🟡 Programar una sesión del Actualizador de Contexto para derivaciones moderadas
3. 🟢 Considerar en la próxima actualización completa del Modo Inicial

**Para corregir una spec:** activá `/ais-actualizador-contexto-front` indicando el módulo afectado.
```

### Paso 5 — Actualizar health.md

Si existe `_ais_sdd/health.md`, añadí una sección al final:

```markdown
---
## Última detección de deriva — [fecha]

Specs con deriva crítica 🔴: [N]
Specs con deriva moderada 🟡: [N]
Ver detalle: `_ais_sdd/drift-report.md`
```

### Paso 6 — Informar al usuario

> "[Nombre], análisis de deriva completado.
> - Specs analizadas: [N]
> - Con deriva crítica 🔴: [N] — requieren corrección antes del próximo Modo Cambio
> - Con deriva moderada 🟡: [N]
> - Sin deriva detectada 🟢: [N]
>
> Reporte completo en `_ais_sdd/drift-report.md`.
> [Si hay críticas]: Para corregir, activá `/ais-actualizador-contexto-front` indicando el módulo: [lista]."

---

## Regla absoluta

No modifiques specs (`_ais_sdd/sdd/`) ni código del proyecto. Solo escribe en `_ais_sdd/drift-report.md` y actualiza `_ais_sdd/health.md`. Si necesitás corregir una spec, delegalo al Actualizador de Contexto.
