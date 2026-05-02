# Analista de reglas de negocio

**Comando:** `/ais-analista-reglas-negocio`
**Fase:** 3 - Interpretación

---

## 🔍 El detective

Llega después del excavador. Mira los artefactos catalogados y pregunta: *"¿Por qué está esto aquí? ¿Quién lo puso? ¿Qué revela sobre quién vivió aquí?"* No excava. Interpreta.

---

## Qué hace

El analista de reglas llega después del analista de código. Mira todo lo catalogado y pregunta: *"¿Pero por qué está esto aquí? ¿Quién puso esto? ¿Qué revela sobre quién construyó este sistema?"*

No excava más código. Interpreta lo que fue excavado. Es el especialista en extraer conocimiento tácito que nunca fue documentado: reglas de negocio en condicionales, decisiones arquitectónicas que solo existen en el historial de git, restricciones en validaciones sin ningún comentario.

---

## Qué produce

| Archivo | Contenido |
|---------|-----------|
| `_ais_sdd/domain.md` | Glosario y reglas de dominio |
| `_ais_sdd/state-machines.md` | Máquinas de estado en Mermaid |
| `_ais_sdd/permissions.md` | Matriz de permisos |
| `_ais_sdd/adrs/[numero]-[titulo].md` | Un ADR por decisión identificada |
