# AIS Agente Front WinForms
<small>por tz-angia</small>

**Agentes de IA para desarrollo y especificación del cliente WinForms** (`agent_domain: client-front`).

[![Documentación](https://img.shields.io/badge/Docs-MkDocs-c60b1e?style=for-the-badge&logo=material-for-mkdocs&logoColor=white&labelColor=2d2d2d)](https://achiong-angia.github.io/ais-agente-sfz/)

Este paquete npm (`ais-agente-front-winforms`) está pensado para el **cliente de escritorio WinForms**. Si en tu organización hay otro paquete AIS para **backend**, usá siempre **`/sfz-front`** y **`npx sfz-front`** aquí para no cruzar orquestadores. Detalle: [docs/convivencia-paquetes-agentes.md](docs/convivencia-paquetes-agentes.md).

---

## Para qué existe

Los clientes WinForms en producción concentran reglas, validaciones e integración con servicios. Los agentes de IA necesitan **contexto y specs** para trabajar ese código con criterio.

**AIS Agente Front WinForms** coordina skills (inventario, extractor de pantallas, analista, redactor, etc.) que escriben **solo** en `.ais-agente-front-winforms/` y tu carpeta de salida (por defecto `_ais_sdd/`), sin modificar por regla el código legado preexistente.

---

## Instalación

En la raíz del **proyecto cliente** (solución WinForms):

```bash
npx sfz-front install
```

**Requisitos:** Node.js 18+

> Los agentes escriben **solo** en `.ais-agente-front-winforms/` y en la carpeta de salida (`_ais_sdd/` por defecto).

> Hacé backup y versioná en Git antes de análisis largos; los modelos pueden equivocarse.

---

## Uso

En el agente de IA:

```
/sfz-front
```

En motores sin slash-commands, escribí solo:

```
sfz-front
```

**No uses `/sfz` ni `sfz` con este paquete:** esos nombres quedan reservados para que tu paquete de **backend** (u otro producto AIS) los defina sin colisiones.

---

## Librerías (DLL) — crítico en .NET / WinForms grandes

Los agentes **no** descompilan binarios solos. Colocá **fuente** bajo `vendor-src/<Lib>/` y/o **C# exportado** bajo `_ais_sdd/decompiled/<Ensamblado>/`, y registrá rutas en `.ais-agente-front-winforms/state.json` (`library_source_roots`, `decompiled_roots`). Guía: [docs/librerias-insumos-analisis.md](docs/librerias-insumos-analisis.md).

---

## Pipeline (resumen)

```
Reconocimiento  Excavación    Interpretación   Generación  Revisión
   Scout        Arqueólogo     Detective        Redactor    Revisor
                               Arquitecto
```

Documentación local en `docs/`; sitio publicado histórico: [MkDocs](https://achiong-angia.github.io/ais-agente-sfz/).

---

## CLI

```bash
npx sfz-front install
npx sfz-front status
npx sfz-front update
npx sfz-front add-agent
npx sfz-front add-engine
npx sfz-front uninstall
```

---

## Contribuir

Abrí un issue antes de un PR grande. `npm install`, `npm test`.

---

## Licencia

MIT — ver [LICENSE](LICENSE).
