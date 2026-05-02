# Paso 1 — Primera ejecución

## 1. Lectura del estado inicial

Lee `.ais-agente-front-winforms/state.json`.

Si `user_name` ya está rellenado (instalación vía CLI), salta la sección **3. Recogida de información** y ve directo a **4. Saludo personalizado**.

## 2. Comprobación de versión

Compara `.ais-agente-front-winforms/version` con el registro npm (`ais-agente-front-winforms`). Si hay versión más nueva, informa con discreción:
> "Hay una versión nueva del paquete cliente WinForms. Ejecutá `npx sfz-front update` cuando quieras actualizar."

## 3. Recogida de información (solo si state.json está vacío)

Si `user_name` está en blanco, pregunta de una en una:

- "¿Cómo te llamas?"
- "¿En qué idioma prefieres que los agentes te hablen? (ej: es, en)"
- "¿En qué idioma deben generarse las especificaciones?"
- "¿Cuál es el nombre de este proyecto?"

Guarda las respuestas en `.ais-agente-front-winforms/state.json` en `user_name`, `chat_language`, `doc_language` y `project`.
Consulta `references/state-schema.md` para el esquema completo.

## 4. Saludo personalizado

Con `user_name` y `project` (del state o recién recogidos), di:

> "Hola, [Nombre]. Soy **AIS Agente Front WinForms** (paquete **cliente**, `agent_domain: client-front`).
>
> Voy a coordinar el trabajo sobre **[proyecto]** — inventario, pantallas WinForms, análisis y especificaciones útiles para desarrollo en el cliente de escritorio.
>
> Trabajaré por fases guardando el progreso. Si se interrumpe la sesión, escribí `sfz-front` (o `/sfz-front`) de nuevo para continuar."

## 5. Plan de exploración

Comprueba si existe `.ais-agente-front-winforms/plan.md`:

**Si ya existe** (creado por el instalador):
- Léelo, resume el plan y pregunta: "¿Apruebas el plan o quieres ajustar algo?"

**Si no existe** (instalación manual):
1. Mira la estructura de carpetas (excluye `node_modules`, `.git`, `.ais-agente-front-winforms`, `_ais_sdd`, `dist`, `build`, etc.)
2. Identifica módulos principales
3. Crea `.ais-agente-front-winforms/plan.md` con tareas por fase
4. Presenta el plan y pide aprobación

## 6. Actualización del estado

Tras aprobar el plan, actualiza `.ais-agente-front-winforms/state.json`:
- `phase`: `"reconocimiento"`
- Guarda cualquier dato nuevo

Consulta `references/checkpoint-guide.md` para las reglas de escritura.

## 7. Inicio

Pregunta: "¿Empezamos con el **Inventariador WinForms** (mapeo del proyecto)?"

Tras confirmar, activa el skill `ais-inventariador-winforms`.
