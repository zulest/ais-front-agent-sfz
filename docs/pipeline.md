# Pipeline de análisis

AIS Agente Front WinForms organiza el trabajo sobre el **cliente** heredado en 5 fases de especificación.

!!! danger "Proyectos con muchas DLL"
    Antes de profundizar en fases, configurá **insumos de librerías** (`vendor-src/`, `_ais_sdd/decompiled/`, `library_source_roots`, `decompiled_roots` en `state.json`). Sin eso, la excavación e interpretación quedan incompletas. [Insumos para librerías (análisis)](librerias-insumos-analisis.md).

---

## Visión general

```
Fase 1          Fase 2        Fase 3              Fase 4        Fase 5
Reconocimiento  Excavación    Interpretación      Generación    Revisión
 Inventariador   Arqueólogo   Analista reglas      Redactor     Revisor
                               Arquitecto
```

**Agentes independientes** que corren en cualquier fase: **Visor**, **Data Master**, **Design System**

!!! info "WinForms, APIs y DLL"
    En clientes que llaman servicios REST vía proxies, podés encadenar **Extractor de forms** y **Mapeador proxy→REST** cuando el plan lo incluya. Colocá contratos OpenAPI en `docs/openapi/` si el equipo los usa. Para **librerías y DLL** del cliente, la referencia operativa es [Insumos para librerías (análisis)](librerias-insumos-analisis.md).

---

## Fase 1: Reconocimiento

**Agente:** Inventariador WinForms (`ais-inventariador-winforms`)

El inventariador hace el primer recorrido del proyecto. Como un agente inmobiliario visitando una propiedad por primera vez: no abre cajones, no lee todos los documentos, solo mapea el territorio.

---

Cuando termina, el orquestador presenta el resumen y pregunta el **nivel de documentación** (`doc_level`): esencial, completo o detallado. La elección define qué artefactos generará cada agente en las fases siguientes — consulta [Cómo usar](uso.md#nivel-de-documentación) para la tabla completa.

---

## Fase 2: Excavación

**Agente:** Analista de código (`ais-analista-codigo`)

El analista excava el código módulo a módulo. Con paciencia y precisión, cataloga cada artefacto: funciones, algoritmos, estructuras de datos, flujos de control. Sin interpretaciones: solo describe con precisión lo que hay.

**Importante:** analiza **un módulo por sesión**, a propósito. Intentar analizarlo todo de una vez consume contexto y reduce la calidad del análisis.

---

## Fase 3: Interpretación

**Agentes:** Analista de reglas (`ais-analista-reglas-negocio`) + Arquitecto (`ais-arquitecto-sistema`)

**El analista de reglas** interpreta lo catalogado: *"¿Por qué está esto aquí? ¿Quién tomó esta decisión? ¿Qué revela el historial de git?"* Extrae reglas de negocio implícitas, ADRs retroactivos, máquinas de estado y matrices de permisos.

**El arquitecto** sintetiza diagramas C4, ERD completo, mapa de integraciones y deuda técnica.

---

## Fase 4: Generación

**Agente:** Redactor (`ais-redactor-especificaciones`)

Transforma lo descubierto en contratos formales: specs SDD por componente, specs OpenAPI para las APIs, historias de usuario. Cada afirmación se marca con la [escala de confianza](escala-confianza.md). Genera un archivo a la vez, con tu aprobación antes de continuar.

---

## Fase 5: Revisión

**Agente:** Revisor (`ais-revisor-especificaciones`)

Intenta romper las specs: contradicciones, conflictos entre documentos, 🟢 mal aplicados, comportamientos no especificados. Recopila brechas 🔴 como preguntas para validación humana.

---

## Agentes independientes

| Agente | Cuándo usar |
|--------|-------------|
| **Visor** | Cuando tengas screenshots del sistema disponibles |
| **Data Master** | Cuando haya DDL, migraciones o modelos ORM disponibles |
| **Design System** | Cuando haya archivos CSS, temas o screenshots de interfaz |
