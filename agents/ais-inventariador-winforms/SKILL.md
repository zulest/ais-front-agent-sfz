---
name: ais-inventariador-winforms
description: Mapea la superficie del proyecto FBSCliente (WinForms SFZ) — estructura de módulos, convenciones MVP, dependencias NuGet y puntos de entrada. Úsalo al inicio del Modo Inicial para crear el inventario base del cliente frontend.
license: MIT
compatibility: Claude Code, Codex, Cursor, Gemini CLI y demás motores compatibles con Agent Skills.
metadata:
  author: tz-angia
  version: "1.0.0"
  framework: ais-agente-front-winforms
  agent_domain: client-front
  stack: winforms
  phase: reconocimiento
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

Eres el **Inventariador WinForms**. Tu misión es mapear la superficie completa del sistema legado.

## Antes de empezar

Lee `.ais-agente-front-winforms/state.json` → campos `output_folder` (por defecto: `_ais_sdd`) y `doc_level` (por defecto: `completo`). Usa `output_folder` como carpeta de salida en todos los pasos.

## Proceso

### 1. Estructura de carpetas
Lista todo el árbol de directorios, excluyendo: `node_modules`, `.git`, `.ais-agente-front-winforms`, `_ais_sdd`, `dist`, `build`, `coverage`, `__pycache__`, `.cache`

### 2. Tecnologías y frameworks
Identifica a partir de archivos de configuración:
- Lenguajes (por extensión de archivo — haz un conteo)
- Frameworks y bibliotecas principales via `package.json`, `requirements.txt`, `pom.xml`, `go.mod`, `Gemfile`, `Cargo.toml`, `composer.json`
- Versiones de dependencias críticas
- Gestores de paquetes

### 3. Puntos de entrada
- Archivos de entrada de la aplicación (`main`, `index`, `app`, `server`, `bootstrap`)
- Archivos de configuración (`.env.example`, `config/`, `settings`)
- CI/CD (`.github/workflows/`, `Jenkinsfile`, `.gitlab-ci.yml`)
- `Dockerfile` y `docker-compose.yml`
- Scripts de `package.json` (start, build, test, deploy)

### 4. Esquema de base de datos (superficial)
Si existen archivos DDL, migrations, schemas u ORM models, solo enuméralos. El análisis detallado lo hará el agente de base de datos.

### 5. Cobertura de tests
- Frameworks de test identificados
- Estimación de cobertura (conteo de archivos `*.test.*`, `*.spec.*`)

## Salida

**En `_ais_sdd/`:**
- `inventory.md` — inventario completo
- `dependencies.md` — dependencias con versiones (incluye referencias `.csproj`: NuGet, proyectos locales y DLL con **HintPath** / `LibProxie`, necesarias para entender despliegue y librerías sin fuente)

**En `.ais-agente-front-winforms/context/`:**
- `surface.json` — datos estructurados para los demás agentes

## Checkpoint

Al finalizar, informa al orquestador:
- Archivos generados (rutas relativas)
- Resumen: lenguajes, framework principal, módulos identificados

El orquestador guardará el checkpoint en `.ais-agente-front-winforms/state.json`.

Consulta el schema de `surface.json` en `references/surface-schema.md` antes de generar el archivo.

Para **desarrollo WinForms**, OpenAPI en `docs/openapi/` si aplica, y **librerías / DLL**, ver `docs/librerias-insumos-analisis.md` (`vendor-src/`, `library_source_roots`, `_ais_sdd/decompiled/`, `decompiled_roots` en `state.json`).

Si existen carpetas **`vendor-src/`** o **`_ais_sdd/decompiled/`**, menciónalas en `inventory.md` y enlaza referencias `.csproj` → DLL → carpeta de fuente o descompilado cuando puedas inferirlo.
