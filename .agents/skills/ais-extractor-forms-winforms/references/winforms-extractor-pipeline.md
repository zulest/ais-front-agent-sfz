# Pipeline del Extractor WinForms (v2)

Documento de referencia para el agente **ais-extractor-forms-winforms** y para quien orqueste **`/sfz-front`**. Define el **orden fijo** de fases y qué queda dentro o fuera del extractor.

## Orden de ejecución (reproducible)

1. **Fase A — Estructura desde Designer**  
   Leer `*.Designer.cs` del módulo (o alcance acordado): árbol de controles, nombres, tipos, propiedades visibles (`Visible`, `Enabled`, `ReadOnly`, `MaxLength`, máscaras, etc.).

2. **Fase B — Etiquetas ↔ entradas**  
   Construir `labels_map`: para cada control de entrada, asociar `.Text` de `Label` (u otra convención documentada en evidencia). Sin evidencia → 🔴.

3. **Fase C — DataGridView**  
   Por cada grid, extraer columnas de forma determinista: nombre, encabezado, tipo, `DataPropertyName`, lectura/edición si consta. Sin filas inventadas.

4. **Fase D — Validación consolidada**  
   Unir: (i) validación declarativa en Designer; (ii) `*_Validating` / equivalentes en el `.cs` del mismo formulario. Presentadores/partial: **solo** si hay patrón de equipo explícito; si no, “fuera del extractor”.

5. **Fase E — Encoding en artefactos**  
   Detectar `�` o literales rotos; corregir o etiquetar **solo** en `_ais_sdd/` (nunca reescribir el legado).

6. **Fase F — Escritura**  
   Actualizar o crear `context/winforms.json` (v2), `winforms/forms-index.md`, y `winforms/views/<Modulo>/<Form>.md` por cada vista.

## Qué cubre cada fase (manifiesto)

| Fase | Cubre | No cubre |
|------|--------|----------|
| A–C | Esqueleto UI, captions, columnas de grid | Lógica de negocio en servidor |
| D | Validación **visible** en UI (Designer + code-behind del form) | Reglas solo en API, permisos globales |
| E | Legibilidad de specs generadas | Arreglar encoding del repo fuente |
| F | Trazabilidad y un MD por vista | OpenAPI, proxy, permisos |

## Dependencias

- **Entrada:** `surface.json` (módulos/rutas), `state.json` (`output_folder`).
- **Idealmente después de:** `ais-inventariador-winforms`.
- **Antes de:** `ais-analista-codigo` por módulo (el analista puede usar las vistas ya consolidadas).

## Comando

En motores con skills: **`/ais-extractor-forms-winforms`** (o lectura completa de este skill).
