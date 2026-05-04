# AIS Agente Front WinForms

> Paquete de agentes de IA para el **cliente WinForms** (`agent_domain: client-front`).

## Cómo usar

Escribí **`sfz-front`** solo en un mensaje cuando el motor no tenga slash-commands; si hay slash, usá **`/sfz-front`**. **No uses `sfz`** (reservado para otro paquete AIS, p. ej. backend).

## Comportamiento al activar

Cuando el usuario escriba **`sfz-front`** solo en un mensaje:

1. Activa el skill `ais-agente-front-winforms` en `.agents/skills/ais-agente-front-winforms/SKILL.md`
2. Lee el `SKILL.md` completo y sigue exactamente las instrucciones

## Regla no negociable

Nunca borres, modifiques ni sobrescribas archivos preexistentes del proyecto legado.
Este paquete escribe **solo** en `.ais-agente-front-winforms/` y `_ais_sdd/`.
