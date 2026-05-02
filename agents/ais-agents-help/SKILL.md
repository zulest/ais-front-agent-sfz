---
name: ais-agents-help
description: Explica con analogías qué hace cada agente del paquete AIS Agente Front WinForms (cliente WinForms) y cuándo usarlo. Activa con /ais-agents-help.
license: MIT
compatibility: Claude Code, Codex, Cursor, Gemini CLI y demás motores compatibles con Agent Skills.
metadata:
  author: tz-angia
  version: "1.3.0"
  framework: ais-agente-front-winforms
  agent_domain: client-front
  stack: winforms
  role: help
---

Presenta el texto siguiente como guía principal. Este paquete es **`agent_domain: client-front`**: solo **WinForms / cliente de escritorio**. Si el usuario mezcla con un paquete de **backend**, recordá que cada uno tiene su orquestador y comandos distintos — ver `docs/convivencia-paquetes-agentes.md`.

**Librerías y DLL:** prioridad **`docs/librerias-insumos-analisis.md`** (`vendor-src/`, `_ais_sdd/decompiled/`, `library_source_roots`, `decompiled_roots`). **OpenAPI** en `docs/openapi/` cuando el equipo documente contratos REST para el cliente.

**Orquestador:** solo **`/sfz-front`** y **`sfz-front`**. No menciones `/sfz` ni `sfz` como activación de este paquete.

---

# Agentes AIS Agente Front WinForms — guía con analogías

Equipo de especialistas para **desarrollo y especificación del cliente WinForms**.

---

## Orquestador central
**Comando:** **`/sfz-front`** o **`sfz-front`**

Un director de orquesta no toca ningún instrumento. Conoce la partitura completa y dice quién entra, cuándo y en qué orden.

---

## Inventariador WinForms
**Comando:** `/ais-inventariador-winforms`

Primer recorrido: carpetas, lenguajes, frameworks, módulos, dependencias.

---

## Extractor de Forms WinForms
**Comando:** `/ais-extractor-forms-winforms`

Pipeline v2: Designer, DataGridView, validación, manifiesto `winforms.json`, un Markdown por vista.

---

## Analista de código
**Comando:** `/ais-analista-codigo`

Análisis módulo a módulo. Un módulo por sesión.

---

## Analista de reglas de negocio
**Comando:** `/ais-analista-reglas-negocio`

Reglas implícitas y contexto reflejado en el cliente.

---

## Mapeador Proxy → REST
**Comando:** `/ais-mapeador-proxy-rest`

Cliente proxy ↔ OpenAPI en el repo (🟢🟡🔴).

---

## Arquitecto de sistema
**Comando:** `/ais-arquitecto-sistema`

C4, ERD, integraciones a partir del análisis.

---

## Redactor de especificaciones
**Comando:** `/ais-redactor-especificaciones`

Specs formales con trazabilidad y confianza.

---

## Revisor de especificaciones
**Comando:** `/ais-revisor-especificaciones`

Contradicciones y preguntas de validación.

---

## Documentador UI · Data Master · Design System · Reconstructor

Comandos: `/ais-documentador-ui`, `/ais-data-master`, `/ais-design-system`, `/ais-reconstructor`.

---

## Secuencia recomendada

```
/sfz-front (o sfz-front) → orquesta todo automáticamente

O manualmente:
Inventariador → Analista de código (N) → Analista de reglas → Arquitecto → Redactor → Revisor

Con extracción de pantallas y alineación OpenAPI (si aplica):
Inventariador → Extractor forms → Analista de código (N) → Analista de reglas
  → Mapeador proxy→REST → Arquitecto → Redactor → Revisor
```

---

## Librerías y presentación

El **Inventariador** lista referencias; el **Analista** lee `.cs` del cliente y rutas en `state.json`: **`library_source_roots`**, **`decompiled_roots`** (🟡 salvo corroboración). Vistas en librerías: documentar herencia y contratos. Detalle: **`docs/librerias-insumos-analisis.md`**.
