# AIS Agente Front WinForms

**Especificaciones ejecutables y flujos de trabajo de IA para el cliente WinForms** (`agent_domain: client-front`).

¿Conocés ese sistema WinForms que nadie quiere tocar? **AIS Agente Front WinForms** coordina agentes para **inventariar, documentar pantallas, analizar código y generar specs** del cliente de escritorio, sin mezclar el alcance con el **backend** (otro repo / otro paquete AIS).

---

## ¿Qué es?

Marco de agentes que instalás en la raíz del **proyecto WinForms**, activás con tu motor de IA, y produce artefactos bajo `.ais-agente-front-winforms/` y la carpeta de salida. Convivencia con backend: [Convivencia de paquetes](convivencia-paquetes-agentes.md).

---

## Inicio rápido

```bash
npx sfz-front install
```

En el chat del agente:

```
/sfz-front
```

(o `sfz-front` en motores sin slash). **No uses `/sfz` ni `sfz`:** reservá esos triggers para tu paquete de servidor.

---

## Lo que encontrarás aquí

<div class="grid cards" markdown>

- **Insumos para librerías (DLL)** — **prioridad máxima**

    Sin `vendor-src/` o descompilados registrados, el análisis del cliente grande queda incompleto.

    [:octicons-arrow-right-24: Leer primero](librerias-insumos-analisis.md)

- **Por qué existe este paquete**

    [:octicons-arrow-right-24: Leer más](por-que-ais-agente-front-winforms.md)

- **Convivencia front / backend**

    [:octicons-arrow-right-24: Ver guía](convivencia-paquetes-agentes.md)

- **Instalación**

    [:octicons-arrow-right-24: Instalar](instalacion.md)

- **Pipeline de análisis**

    [:octicons-arrow-right-24: Ver pipeline](pipeline.md)

- **Agentes**

    [:octicons-arrow-right-24: Ver agentes](agentes/index.md)

</div>

---

## Garantía de seguridad

!!! danger "Hacé una copia de seguridad antes de empezar"
    Versioná en Git y usá remoto. Los agentes pueden equivocarse.

!!! warning "No toca tu código legado (por regla del framework)"
    Los agentes escriben **solo** en `.ais-agente-front-winforms/` y `_ais_sdd/` (o la carpeta configurada).

!!! info "Sin claves de API del producto"
    La inteligencia viene del agente que ya usás en tu entorno.
