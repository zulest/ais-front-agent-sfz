# Plantilla: especificación de vista WinForms (v2)

Reemplazar `{FormClass}`, `{Module}`, rutas y tablas con datos reales. Eliminar secciones vacías solo si no aplican; si no hay datos, dejar **🔴 REQUIERE_REVISION** explícita.

---

# Vista: `{FormClass}`

- **Módulo:** `{Module}`
- **Designer:** `…/*.Designer.cs`
- **Code-behind:** `…/*.cs`

## Resumen

- Propósito de la pantalla (1–2 frases, solo si consta en nombres/comentarios/UI).
- Confianza global: 🟢 / 🟡 / 🔴

## Presentación — etiquetas ↔ controles

| Control entrada | Tipo | Label / caption | Texto mostrado | Notas |
|-----------------|------|-----------------|----------------|-------|
| … | … | … | … | … |

## DataBindings — mapeo DTO

> Extraídos de `DataBindings.Add(...)` en el Designer. Omitir sección si no hay bindings declarativos.

| Control | Propiedad DTO | Dirección |
|---------|--------------|-----------|
| … | … | ↔ / ← / → |

## DataGridView

### `{gridName}`

| Columna (name) | Encabezado | Tipo columna | DataPropertyName | ReadOnly | Visible |
|----------------|------------|--------------|------------------|----------|---------|
| … | … | … | … | … | … |

## Validación consolidada

### Designer (declarativo)

- …

### Code-behind (`*_Validating`, etc.)

- …

### Presentadores / partials

- Patrón detectado: … **o** Fuera del extractor — …

## Encoding (artefacto)

- Literales corregidos o marcados: …

## Eventos visibles (Designer / wiring)

- …

## Lagunas (🔴)

- …

---

*Generado por ais-extractor-forms-winforms v2. No modifica el código fuente del legado.*
