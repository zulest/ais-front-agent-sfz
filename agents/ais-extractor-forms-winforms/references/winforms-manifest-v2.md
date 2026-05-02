# Manifiesto `winforms.json` — schema v2

Archivo: `.ais-agente-front-winforms/context/winforms.json`  
Generado por **ais-extractor-forms-winforms** v2. El agente debe respetar la forma lógica siguiente (campos opcionales permitidos si aportan trazabilidad).

## Raíz

```json
{
  "schema_version": "2",
  "generated_at": "2026-04-30T12:00:00.000Z",
  "extractor_version": "2.0.0",
  "modules": []
}
```

## Módulo (`modules[]`)

```json
{
  "id": "ActivosFijos",
  "root_hint": "ruta/relativa/opcional",
  "forms": []
}
```

## Formulario (`forms[]`)

```json
{
  "class_name": "FrmActivosAlta",
  "designer_path": "ruta/al/FrmActivosAlta.Designer.cs",
  "codebehind_path": "ruta/al/FrmActivosAlta.cs",
  "view_spec_path": "winforms/views/ActivosFijos/FrmActivosAlta.md",
  "controls_summary": [],
  "labels_map": [],
  "data_grid_views": [],
  "validation": {},
  "encoding_notes": [],
  "events_wiring": [],
  "gaps": []
}
```

### `labels_map[]`

```json
{
  "input_control": "txtCodigo",
  "input_type": "TextBox",
  "label_control": "lblCodigo",
  "label_text": "Código",
  "confidence": "CONFIRMADO",
  "notes": ""
}
```

- `confidence`: `CONFIRMADO` | `INFERIDO` | `REQUIERE_REVISION` (🔴 en texto si REQUIERE_REVISION).

### `data_grid_views[]`

```json
{
  "grid_name": "dgvDetalle",
  "columns": [
    {
      "name": "colImporte",
      "header_text": "Importe",
      "column_type": "DataGridViewTextBoxColumn",
      "data_property_name": "Importe",
      "read_only": true,
      "visible": true,
      "confidence": "CONFIRMADO"
    }
  ]
}
```

Cualquier campo desconocido: `null` + `confidence: "REQUIERE_REVISION"`.

### `validation`

```json
{
  "designer": [
    {
      "kind": "ErrorProvider",
      "control_to_validate": "txtNombre",
      "error_message": "Requerido",
      "confidence": "CONFIRMADO"
    }
  ],
  "codebehind": [
    {
      "method": "txtNombre_Validating",
      "summary": "texto breve de lo que hace según el código leído",
      "confidence": "CONFIRMADO"
    }
  ],
  "presenter_or_partial": {
    "pattern": "nombre del patrón si aplica, o null",
    "items": [],
    "out_of_extract_scope": "texto si no hay patrón estable"
  }
}
```

### `encoding_notes[]`

```json
{
  "source": "Designer.cs línea aproximada o propiedad",
  "literal": "texto con �",
  "artifact_rendering": "texto normalizado o marca ENCODING_SOSPECHOSO",
  "confidence": "CONFIRMADO"
}
```

### `gaps[]`

Lista breve de 🔴 pendientes (p. ej. “columna anónima en grid X”, “label no asociado a txtY”).

## Coherencia con Markdown por vista

Cada `view_spec_path` debe existir en `output_folder` y reflejar los mismos bloques (presentación, grids, validación, encoding, lagunas).
