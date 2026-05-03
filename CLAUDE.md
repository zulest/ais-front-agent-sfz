# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install          # install dependencies
npm test             # run all tests (vitest run)
npx vitest run test/paths.test.js   # run a single test file
```

To test CLI commands locally:
```bash
node bin/sfz.js install
node bin/sfz.js status
node bin/sfz.js update
```

## Architecture

This is an **npm CLI package** (`ais-agente-front-winforms`) that installs AI agents into a WinForms client project. It does **not** run agents itself — it deploys agent skill files (`agents/`) and scaffolding into the target project's working directory.

### Key concepts

- **`agent_domain: client-front`** — this package is scoped exclusively to WinForms UI / desktop client. It must not be confused with backend AIS packages.
- **Trigger**: Users activate the orchestrator in their AI engine by typing `/sfz-front` (slash-capable engines) or `sfz-front` (Codex). Never `/sfz` — that name is reserved for the backend package.
- **Dos modos de operación**: `MODO INICIAL` (análisis global, primera vez) y `MODO CAMBIO` (correcciones y nuevas funcionalidades). El orquestador detecta el modo automáticamente.
- **`update-context` command**: `npx sfz-front update-context` — detecta archivos modificados desde el último commit y guarda `.ais-agente-front-winforms/last-sync.json` para que el Actualizador de Contexto los procese.
- **Runtime directory**: After install, all state lives in `.ais-agente-front-winforms/` inside the **target project**, not this repo.
- **Output directory**: Generated specs go to `_ais_sdd/` by default (configurable in `state.json`).

### Install pipeline (`lib/commands/install.js`)

1. Detects which AI engines are present (`lib/installer/detector.js` — checks for `.claude`, `.cursor`, `AGENTS.md`, etc.)
2. Runs interactive prompts (`lib/installer/prompts.js`) to collect engine selection, agent selection, project name, language prefs, output folder, git strategy
3. `Writer` (`lib/installer/writer.js`) copies `agents/<id>/` into the engine's `skillsDir` (e.g. `.claude/skills/` for Claude Code, `.agents/skills/` for most others) and writes engine entry files from `templates/engines/`
4. Creates `.ais-agente-front-winforms/` structure: `state.json`, `config.toml`, `plan.md`, `version`
5. Saves a SHA-256 file manifest to `.ais-agente-front-winforms/_config/files-manifest.json` for update diffing

### Update logic (`lib/commands/update.js`)

Classifies installed files as `intact | modified | missing` by comparing against the stored SHA-256 manifest. Modified files (user-edited) are skipped; intact and missing files are overwritten from the package source.

### Agent roster

**Modo Inicial — Análisis global (required, always installed):**
`ais-agente-front-winforms` (orchestrator), `ais-inventariador-winforms`, `ais-analista-codigo`, `ais-analista-reglas-negocio`, `ais-arquitecto-sistema`, `ais-redactor-especificaciones`

**Modo Cambio — Desarrollo activo (required, always installed):**
`ais-especificador-cambios-front`, `ais-planificador-implementacion-front`, `ais-actualizador-contexto-front`

**Optional:** `ais-revisor-especificaciones`, `ais-documentador-ui`, `ais-extractor-forms-winforms`, `ais-mapeador-proxy-rest`, `ais-data-master`, `ais-design-system`, `ais-agents-help`

Each agent lives in `agents/<id>/SKILL.md` plus optional `references/` files.

### Engine entry files

Each supported AI engine gets its own entry file template in `templates/engines/`. Claude Code uses `CLAUDE.md` with `skillsDir: .claude/skills`; all other engines use `.agents/skills` as the universal skills directory.

### Absolute rule enforced by the orchestrator

The agents **never** modify pre-existing project files. They only write to `.ais-agente-front-winforms/` and the configured output folder (`_ais_sdd/` by default).
