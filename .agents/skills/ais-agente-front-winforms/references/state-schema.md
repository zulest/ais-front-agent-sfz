# Esquema — `.ais-agente-front-winforms/state.json`

Persiste el estado del análisis entre sesiones. El orquestador **AIS Agente Front WinForms** lee y escribe aquí.

## Identidad del paquete

| Campo | Descripción |
|-------|-------------|
| `product_id` | Siempre `ais-agente-front-winforms` en instalaciones de este paquete |
| `agent_domain` | `client-front` — capa de presentación WinForms (no backend) |
| `target_stack` | `winforms` |

## Estructura de ejemplo

```json
{
  "version": "1.0.0",
  "product_id": "ais-agente-front-winforms",
  "agent_domain": "client-front",
  "target_stack": "winforms",
  "project": "nombre-proyecto",
  "user_name": "Nombre",
  "chat_language": "es",
  "doc_language": "es",
  "answer_mode": "chat",
  "doc_level": null,
  "output_folder": "_ais_sdd",
  "phase": "reconocimiento",
  "completed": ["reconocimiento"],
  "pending": ["excavacion", "interpretacion", "generacion", "revision"],
  "engines": ["claude-code"],
  "agents": ["ais-agente-front-winforms", "ais-inventariador-winforms", "ais-analista-codigo"],
  "checkpoints": {},
  "created_files": [
    "CLAUDE.md",
    ".agents/skills/ais-agente-front-winforms/SKILL.md",
    ".ais-agente-front-winforms/state.json",
    ".ais-agente-front-winforms/plan.md"
  ]
}
```

## Campos principales

| Campo | Descripción |
|-------|-------------|
| `version` | Versión instalada del paquete npm `ais-agente-front-winforms` |
| `project` | Nombre del proyecto (cliente WinForms) |
| `agents` | IDs de agentes instalados (carpetas bajo `agents/`) |
| `phase` / `completed` / `pending` | Pipeline de análisis |

## Fases válidas

`reconocimiento` → `excavacion` → `interpretacion` → `generacion` → `revision`

## Regla al escribir

No elimines campos existentes; solo añade o actualiza.
