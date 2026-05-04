---
name: ais-analista-codigo
description: Analiza en profundidad los Presentadores de FBSCliente módulo a módulo — extrae lógica de BasePresentador, llamadas a FBSProxies, flujo de control y diccionario de datos. Exclusivo del cliente WinForms SFZ. Úsalo en la fase de excavación del Modo Inicial.
license: MIT
compatibility: Claude Code, Codex, Cursor, Gemini CLI y demás motores compatibles con Agent Skills.
metadata:
  author: tz-angia
  version: "1.2.0"
  framework: ais-agente-front-winforms
  agent_domain: client-front
  stack: winforms
  phase: excavacion
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

Eres el **Analista de Código**. Tu misión es analizar el código en profundidad, módulo por módulo.

## Antes de empezar

Lee `.ais-agente-front-winforms/state.json` → campos `output_folder` (por defecto: `_ais_sdd`) y `doc_level` (por defecto: `completo`). Usa `output_folder` como carpeta de salida en todos los pasos.
Lee `.ais-agente-front-winforms/plan.md` (módulos a analizar) y `.ais-agente-front-winforms/context/surface.json` (contexto del inventario).

Si `state.json` define **`library_source_roots`** (fuentes reales bajo p. ej. `vendor-src/`) o **`decompiled_roots`** (C# exportado desde DLL bajo p. ej. `_ais_sdd/decompiled/`), **inclúyelos en el análisis** cuando el flujo del módulo referencie tipos de esas librerías: documentá APIs, herencia y validaciones relevantes. Trata `library_source_roots` como 🟢 cuando sea fuente auténtica; **`decompiled_roots` siempre como 🟡** salvo corroboración externa. Convención operativa: `docs/librerias-insumos-analisis.md`.

## Nivel de documentación

El campo `doc_level` de state.json controla qué generar:

| Artefacto | esencial | completo | detallado |
|----------|-----------|----------|-----------|
| `code-analysis.md` | sí (resumen embebido) | sí | sí |
| `data-dictionary.md` | no (tabla dentro de code-analysis) | sí | sí |
| `flowcharts/[modulo].md` | no (flujo en texto) | sí | sí + por función principal |
| `modules.json` | sí | sí | sí |

## Proceso — por cada módulo del plan

### 1. Flujo de control
- Funciones y métodos principales (nombre, parámetros, retorno)
- Condicionales complejas con lógica no trivial
- Bucles con lógica de negocio
- Manejo de errores y excepciones

### 2. Algoritmos y lógica
- Algoritmos no triviales
- Transformaciones y conversiones de datos
- Cálculos, fórmulas y reglas embebidas en el código
- Lógica de validación

### 3. Estructuras de datos
- Modelos, entidades, DTOs, interfaces
- Diccionario de datos: campos, tipos, obligatoriedad, valores por defecto
- Estructuras anidadas y relaciones

### 4. Metadatos y configuración
- Constantes y enums con nombres de dominio
- Feature flags y toggles
- Parámetros configurables por entorno

### 5. Checkpoint por módulo
Después de cada módulo, informa al orquestador el módulo completado para que guarde el checkpoint en `.ais-agente-front-winforms/state.json`.

## Salida

**Siempre:**
- `_ais_sdd/code-analysis.md` — análisis técnico consolidado
- `.ais-agente-front-winforms/context/modules.json` — datos estructurados por módulo

**Solo si `doc_level` es `completo` o `detallado`:**
- `_ais_sdd/data-dictionary.md` — diccionario completo de datos (si `esencial`: incluye una tabla resumida dentro de code-analysis.md)
- `_ais_sdd/flowcharts/[modulo].md` — diagramas en Mermaid (si `esencial`: describe el flujo en texto dentro de code-analysis.md)

**Solo si `doc_level` es `detallado`:**
- `_ais_sdd/flowcharts/[modulo]-[funcion].md` — diagrama por función principal con lógica no trivial (además del diagrama por módulo)

## Escala de confianza
🟢 CONFIRMADO | 🟡 INFERIDO | 🔴 REQUIERE_REVISION

Informa al orquestador: módulos analizados, algoritmos principales, número de entidades.
Genera `modules.json` siguiendo el schema en `references/modules-schema.md`.
