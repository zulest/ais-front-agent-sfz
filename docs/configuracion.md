# Configuración

AIS Agente Front WinForms guarda toda su configuración y estado del análisis dentro de la carpeta `.ais-agente-front-winforms/` en la raíz del proyecto cliente.

---

## Estructura de la carpeta `.ais-agente-front-winforms/`

```
.ais-agente-front-winforms/
├── state.json          ← estado del análisis entre sesiones
├── config.toml         ← configuración del proyecto
├── config.user.toml    ← tus preferencias personales (no commitear)
├── plan.md             ← plan de exploración (puedes editarlo)
├── version             ← versión instalada de sfz
├── context/
│   ├── surface.json    ← datos generados por el inventariador
│   └── modules.json    ← datos generados por el analista de código
└── _config/
    ├── manifest.yaml           ← metadatos de la instalación
    └── files-manifest.json     ← hashes SHA-256 para updates seguros
```

!!! tip "Librerías (DLL) — prioridad alta"
    En `state.json` podés declarar **`library_source_roots`** (fuentes bajo `vendor-src/`) y **`decompiled_roots`** (C# exportado bajo `_ais_sdd/decompiled/`). Sin eso, el análisis de proyectos con muchas DLL queda incompleto. Guía: [Insumos para librerías (análisis)](librerias-insumos-analisis.md).

---

## `config.toml`: configuración del proyecto

```toml
[project]
name = "mi-proyecto"
language = "es"

[agents]
installed = ["ais-agente-front-winforms", "ais-inventariador-winforms", "ais-analista-codigo", "ais-analista-reglas-negocio", "ais-arquitecto-sistema", "ais-redactor-especificaciones", "ais-revisor-especificaciones"]

[output]
folder = "_ais_sdd"

[engines]
active = ["claude-code"]
```

---

## `config.user.toml`: preferencias personales

```toml
[user]
name = "Tu Nombre"
answer_mode = "chat"  # "chat" o "file"
```

!!! warning "No commitear"
    Agrega `config.user.toml` al `.gitignore`. Cada miembro del equipo puede tener sus propias preferencias sin afectar a los demás.

---

## Modo de respuesta (`answer_mode`)

| Modo | Comportamiento |
|------|----------------|
| `chat` (por defecto) | Las preguntas aparecen en el chat, una a una. Respondes en la conversación. |
| `file` | El revisor genera un archivo `_ais_sdd/questions.md` con todas las preguntas. Lo rellenás y avisás cuando termines. |

---

## Nivel de documentación (`doc_level`)

Define el volumen de artefactos que cada agente genera durante el análisis. **No se configura en la instalación:** sfz lo pregunta al inicio del primer análisis, después de que el inventariador mapea el proyecto, para que decidas con información real.

| Valor | Cuándo usar | Artefactos generados |
|-------|-------------|----------------------|
| `essencial` | Proyectos simples, scripts, prototipos | Análisis de código, dominio, arquitectura (C4 contexto), specs SDD |
| `completo` | Proyectos medianos, equipos pequeños (por defecto) | Todo lo esencial + diagramas C4 completos, ERD, ADRs, OpenAPI, user stories, matrices de trazabilidad |
| `detallado` | Sistemas enterprise, alta criticidad | Todo lo completo + flowcharts por función, ADRs expandidos, diagrama de deployment, revisión cruzada obligatoria |

La elección se guarda en `.ais-agente-front-winforms/state.json` en el campo `doc_level`. Puedes editarlo manualmente en cualquier momento para ajustar el nivel durante un análisis en curso.
