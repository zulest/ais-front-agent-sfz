# AIS Agente Front WinForms

> Paquete de agentes de IA para el **cliente WinForms** (`agent_domain: client-front`). El backend u otros dominios usan **otro** orquestador en otro proyecto.

## Cómo usar

Escribí **`/sfz-front`** o la palabra **`sfz-front`** para iniciar el orquestador. **No uses `/sfz` ni `sfz`** con este paquete (reservados para el paquete de servidor u otro AIS).

## Comportamiento al activar

Cuando el usuario escriba `/sfz-front` o `sfz-front`:

1. Activa el skill `ais-agente-front-winforms` en `.claude/skills/ais-agente-front-winforms/SKILL.md`
2. Si no está en `.claude/skills/`, usa `.agents/skills/ais-agente-front-winforms/SKILL.md`
3. Lee el `SKILL.md` completo y sigue exactamente las instrucciones

## Regla no negociable

Nunca borres, modifiques ni sobrescribas archivos preexistentes del proyecto legado.
Este paquete escribe **solo** en `.ais-agente-front-winforms/` y `_ais_sdd/`.
