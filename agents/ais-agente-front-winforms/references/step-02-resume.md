# Paso 2 — Reanudar sesión

## 1. Lectura del estado

Lee `.ais-agente-front-winforms/state.json` y `.ais-agente-front-winforms/plan.md`.

## 2. Comprobación de versión

Compara `.ais-agente-front-winforms/version` con npm (`ais-agente-front-winforms`). Si hay versión más nueva:
> "Hay una versión nueva del paquete cliente WinForms. Ejecutá `npx sfz-front update` cuando quieras actualizar."

## 3. Saludo

Di: "[Nombre], bienvenido de nuevo a **AIS Agente Front WinForms**."

## 4. Resumen de progreso

Muestra:
- Fases en `completed`
- Fase actual `phase` y último `checkpoints`
- Fases en `pending`

## 5. Modo de respuesta

Si `answer_mode` es `"file"`:
> "Recuerda: las respuestas van en `_ais_sdd/questions.md`. Avísame cuando termines."

Si es `"chat"`:
> Seguimos aquí en el chat.

## 6. Confirmación

Pregunta: "¿Continuamos donde lo dejamos?"

Tras confirmar, retoma la siguiente tarea en `.ais-agente-front-winforms/plan.md`.

Consulta `references/checkpoint-guide.md` para las reglas de `state.json`.
