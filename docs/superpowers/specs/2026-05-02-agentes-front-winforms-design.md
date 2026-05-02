# Diseño: AIS Agente Front WinForms (actualizado)

**Fecha:** 2026-05-02  
**Objetivo:** Paquete **solo** para **desarrollo y especificación del cliente WinForms** (`agent_domain: client-front`), claramente separado del paquete de **backend** que vivirá en otro proyecto.

## Decisiones

1. **Nombre npm:** `ais-agente-front-winforms`; CLI **`npx sfz-front`**; binarios **`sfz-front`** y `ais-agente-front-winforms`. **Sin** binario ni comando `sfz`.
2. **Triggers de chat:** únicamente **`/sfz-front`** y **`sfz-front`**. **`/sfz` y `sfz` no son de este paquete** — quedan libres para el orquestador de servidor.
3. **Estado instalado:** `.ais-agente-front-winforms/` y campos `product_id`, `agent_domain`, `target_stack` en `state.json`.
4. **Mensaje del producto:** enfoque en WinForms; **sin** guía ni narrativa de “migración Next.js” en la documentación publicada del paquete.

## Criterio de éxito

- Ningún archivo del producto presente `/sfz` o `sfz` como alias o activación del orquestador front.
- Tests `npm test` en verde.
