# Agentes

AIS Agente Front WinForms coordina un equipo de especialistas para el **cliente WinForms**. Cada agente hace una cosa y la hace bien.

---

## Agentes obligatorios

| Agente | Fase | Analogía | Función |
|--------|------|----------|---------|
| [Orquestador](orquestador.md) | Orquestación | El director de orquesta | Coordina todos los agentes, guarda checkpoints, guía al usuario |
| [Inventariador WinForms](inventariador-winforms.md) | Reconocimiento | El agente inmobiliario | Mapea la superficie: carpetas, lenguajes, frameworks, dependencias |
| [Analista de código](analista-codigo.md) | Excavación | El excavador | Análisis profundo módulo a módulo: algoritmos, flujos, estructuras de datos |
| [Analista de reglas de negocio](analista-reglas-negocio.md) | Interpretación | El detective | Extrae reglas de negocio implícitas, ADRs, máquinas de estado, permisos |
| [Arquitecto de sistema](arquitecto-sistema.md) | Interpretación | El cartógrafo | Sintetiza todo en diagramas C4, ERD y mapa de integraciones |
| [Redactor de especificaciones](redactor-especificaciones.md) | Generación | El notario | Genera specs SDD, OpenAPI e historias de usuario con trazabilidad de código |

---

## Agentes opcionales

| Agente | Analogía | Cuándo usar |
|--------|----------|-------------|
| [Revisor de especificaciones](revisor-especificaciones.md) | El revisor de specs | Después del redactor: revisa specs críticamente y valida brechas |
| [Documentador UI](documentador-ui.md) | El ilustrador forense | Cuando tengas capturas del sistema disponibles |
| [Maestro de datos](maestro-datos.md) | El geólogo | Cuando haya DDL, migraciones o modelos ORM disponibles |
| [Sistema de diseño](sistema-diseno.md) | El estilista | Cuando haya archivos CSS, temas o capturas de interfaz |

---

## Secuencia recomendada

```
/sfz-front (o sfz-front) → orquesta todo automáticamente

O manualmente:
Inventariador → Analista de código (N sesiones) → Analista de reglas → Arquitecto → Redactor → Revisor

Cliente WinForms + extracción de pantallas + alineación con OpenAPI local (si aplica):
Inventariador → Extractor de forms → Analista de código (N) → Analista de reglas → Mapeador proxy→REST
  → Arquitecto → Redactor → Revisor

Opcionales en cualquier fase:
Documentador UI · Maestro de datos · Sistema de diseño
```

> En el proyecto instalado, los skills usan IDs `ais-*` (p. ej. `ais-inventariador-winforms`). Cada fila de la tabla enlaza a la **página de documentación** con el mismo nombre de rol.

**Prioridad máxima (DLL):** [**Insumos para librerías — análisis**](../librerias-insumos-analisis.md) (`vendor-src/`, `_ais_sdd/decompiled/`, `state.json`).
