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

Equipo de **17 agentes** para **desarrollo activo del cliente WinForms SFZ** (FBSCliente).

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

### Normalizador de Estándares Front
**Comando:** `/ais-normalizador-estandares-front`
Lee el código real de FBSCliente para extraer convenciones implícitas, detectar inconsistencias y generar el documento de estándares de programación del equipo con ADRs retroactivos.

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

**Para generar el documento de estándares del equipo:**
```
Analista Código (varios módulos) → Normalizador de Estándares Front
→ _ais_sdd/standards/coding-standards.md
```
