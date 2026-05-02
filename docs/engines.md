# Motores compatibles

AIS Agente Front WinForms funciona con los principales motores de IA del mercado. El instalador detecta automáticamente cuáles están presentes en el entorno; puedes añadir más con `npx sfz-front add-engine`.

---

## Compatibilidad

| Motor | Archivo creado | Skills path | Cómo activar |
|-------|---------------|-------------|--------------|
| **Claude Code** ⭐ | `CLAUDE.md` | `.claude/skills/ais-*/` y `.agents/skills/ais-*/` | `/sfz-front` |
| **Codex** ⭐ | `AGENTS.md` | `.agents/skills/ais-*/` | `sfz-front` |
| **Cursor** ⭐ | `.cursorrules` | `.agents/skills/ais-*/` | `/sfz-front` |
| **Gemini CLI** | `GEMINI.md` | `.agents/skills/ais-*/` | `/sfz-front` |
| **Windsurf** | `.windsurfrules` | `.agents/skills/ais-*/` | `/sfz-front` |
| **Antigravity** | `AGENTS.md` | `.agents/skills/ais-*/` | `sfz-front` |
| **Kiro** | `.kiro/steering/ais-agente-front-winforms.md` | `.agents/skills/ais-*/` | `/sfz-front` |
| **Opencode** | `AGENTS.md` | `.agents/skills/ais-*/` | `sfz-front` |

**No uses `/sfz` ni `sfz` con este paquete:** evitá colisión con el orquestador de **backend**.

---

## Claude Code

Slash commands nativos: **`/sfz-front`**.

---

## Codex y Opencode

Sin slash commands: escribí **`sfz-front`** solo en un mensaje, o el id del skill que necesites (p. ej. `ais-inventariador-winforms`).

---

## Kiro

El instalador crea `.kiro/steering/ais-agente-front-winforms.md`. Activación: **`/sfz-front`**.

---

## Múltiples motores en el mismo proyecto

Los agentes en `.agents/skills/` son compartidos. Cada integrante puede usar su motor con el mismo comando **`sfz-front`** / **`/sfz-front`**.
