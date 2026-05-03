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
