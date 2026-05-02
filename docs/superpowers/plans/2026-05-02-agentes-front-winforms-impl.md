# Plan de implementación — AIS Agente Front WinForms

> **Goal:** Cliente WinForms claramente identificado; **sin** alias `/sfz`/`sfz`; **sin** documentación de migración Next.js en el producto.

**Verificación:** `npm test`

---

### Tareas

- [x] Quitar bin `sfz` de `package.json` y referencias a alias en `cli.js`, banner CLI, `package-lock`.
- [x] Orquestador y plantillas de motores: solo `/sfz-front` y `sfz-front`; prohibir `/sfz`/`sfz` para este paquete.
- [x] Eliminar `docs/migracion-winforms-nextjs.md` y referencias; ajustar pipeline, librerías, agentes, ayuda.
- [x] Ejemplos en `surface-schema.md` alineados a WinForms / C#.
- [x] Revisor / `questions-template`: aviso post-respuesta con `sfz-front`, no `sfz`.
