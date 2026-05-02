# Insumos para librerías (DLL): lo más importante del análisis

En sistemas WinForms grandes, **gran parte del comportamiento vive en librerías** (.dll propias o de terceros). AIS Agente Front WinForms **no descompila ni inspecciona binarios automáticamente**: el equipo **coloca código legible** (fuente real o C# exportado) donde los agentes puedan leerlo. Sin este paso, el análisis queda a ciegas y el costo de evolución o migración se dispara.

Esta página es la **referencia operativa** para fuentes y DLL en el **cliente WinForms**.

---

## Regla de oro

| Si tenés… | Hacé esto | Configuración en `state.json` |
|-----------|-----------|-------------------------------|
| **Código fuente** de la librería | Copiá o cloná el árbol bajo **`vendor-src/<NombreLib>/`** en la raíz del repo del cliente (junto a la `.sln`). | Array **`library_source_roots`**: rutas relativas, p. ej. `"vendor-src/FBSMensajeria"`. |
| **Solo DLL** y el equipo **puede** descompilar (legal / política interna) | Exportá C# con ILSpy, dnSpyEx, dotPeek u otra herramienta a **`_ais_sdd/decompiled/<NombreEnsamblado>/`**. | Array **`decompiled_roots`**: p. ej. `"_ais_sdd/decompiled/FBSMensajeria"`. |
| Ni fuente ni descompilación | El **Analista de código** solo documenta **uso observado** en vuestros `.cs` (🟡/🔴 en interior). | Dejá los arrays vacíos o sin esa librería. |

Los campos **`library_source_roots`** y **`decompiled_roots`** existen en la plantilla **`templates/state.json`**; rellenalos en **`.ais-agente-front-winforms/state.json`** del proyecto (si ya instalaste antes, agregalos a mano si faltan).

---

## Confianza en las specs

- **`library_source_roots`**: tratá como **🟢** cuando es fuente auténtica del equipo o proveedor interno.
- **`decompiled_roots`**: tratá siempre como **🟡** (nombres y flujo pueden diferir del original). Las specs deben **decir** que hubo descompilación.
- **Solo uso en cliente sin insumo**: comportamiento interno de la DLL = **🔴** o 🟡 según [escala de confianza](escala-confianza.md).

---

## Git y permisos

- **`.gitignore`:** si no querés versionar descompilados, ignorá **`_ais_sdd/decompiled/`**. Si el equipo **sí** versiona esa salida (acuerdo explícito), no la ignores.
- **Licencia / EULA:** descompilar solo si la **política del equipo y el contrato** lo permiten; el resultado es **documentación interna**, no redistribución del código del proveedor.

---

## Qué agentes usan esto

- **`ais-inventariador-winforms`:** lista `vendor-src/`, `_ais_sdd/decompiled/`, referencias `.csproj` → DLL, y enlaza DLL ↔ carpeta de insumo cuando se pueda inferir (`inventory.md`, `dependencies.md`).
- **`ais-analista-codigo`:** además del módulo del plan, **lee** rutas en `library_source_roots` y `decompiled_roots` cuando el flujo referencia tipos de esas librerías.

---

## Resumen en una frase

**Poné fuentes en `vendor-src/` o descompilados en `_ais_sdd/decompiled/` y registrá las rutas en `state.json`** — es el mecanismo previsto para que un sistema grande no deje librerías fuera del análisis.
