# SDD Template — AIS Agente Front WinForms
> Nivel: `completo` | Sistema: FBSCliente WinForms | Dominio: `client-front`

---

```markdown
---
title: "[Componente] — SDD"
component: NombreComponente
type: Presentador | Vista | WorkItem
namespace: Modulo.Submodulo
source_file: ruta/al/Archivo.cs
module: NombreModulo
generated_at: "YYYY-MM-DD"
agent: ais-redactor-especificaciones
doc_level: completo
status: draft
---

# [Componente] — Software Design Document

## 1. Responsabilidades

| # | Responsabilidad | Prioridad (MoSCoW) | Confianza |
|---|-----------------|-------------------|-----------|
| R1 | ... | Must | 🟢 |
| R2 | ... | Should | 🟡 |

> **Must** — camino crítico o llamado por múltiples componentes  
> **Should** — importante pero con alternativa/fallback  
> **Could** — solo casos borde o uso infrecuente  
> **Won't** — comentado, flag apagada, deprecado

---

## 2. Dependencias

### Entradas

| Fuente | Tipo | Descripción | Confianza |
|--------|------|-------------|-----------|
| `NombreClase` | Parámetro constructor | ... | 🟢 |
| `WorkItem.Evento` | Evento CAB | ... | 🟢 |

### Salidas / Efectos

| Destino | Tipo | Descripción | Confianza |
|---------|------|-------------|-----------|
| `IXxxApi.Metodo()` | Llamada REST | ... | 🟢 |
| `WorkItem.PublicaEvento` | Evento CAB | ... | 🟢 |

### Proxies REST consumidos

| Interface | Método | Endpoint | Swagger | Confianza |
|-----------|--------|----------|---------|-----------|
| `IXxxApi` | `MetodoXxx` | `POST /Xxx/MetodoXxx` | `Xxx.Command.swagger.json` | 🟢 |

---

## 3. Flujos principales

### Flujo: [Nombre del flujo]

```
Precondición: ...

1. ...
2. ...
   → Si condición A: ...
   → Si condición B: ...
3. ...

Postcondición: ...
```

Confianza: 🟢

---

## 4. Reglas de negocio

| Código | Descripción | Origen en código | Confianza |
|--------|-------------|-----------------|-----------|
| RN-01  | ...         | `Clase.Metodo()` | 🟢 |
| RN-02  | ...         | Inferido por patrón | 🟡 |

---

## 5. Validaciones

| Validador / Campo | Regla | Aplicado en | Confianza |
|-------------------|-------|-------------|-----------|
| `containerValidator1` | Valida todos los campos antes de guardar | Presentador | 🟢 |

---

## 6. Requisitos no funcionales

> Solo incluir si hay evidencia directa en el código. No inventar.

| Categoría | Detalle | Evidencia en código | Confianza |
|-----------|---------|---------------------|-----------|
| Seguridad | ... | `VerificaAccesoPresentador` | 🟢 |
| Performance | ... | timeout explícito | 🟡 |
| Disponibilidad | ... | retry logic / circuit breaker | 🟡 |

---

## 7. Criterios de aceptación

### CA-01: [Happy path — nombre descriptivo]

```
Dado:     ...
Cuando:   ...
Entonces: ...
```

Confianza: 🟢

### CA-02: [Caso de fallo — nombre descriptivo]

```
Dado:     ...
Cuando:   ...
Entonces: ...
```

Confianza: 🟡

---

## 8. Trazabilidad de código

| Archivo | Clase / Función | Cobertura |
|---------|-----------------|-----------|
| `ruta/Archivo.cs` | `NombreClase` | 🟢 |

---

## 9. Preguntas abiertas 🔴

| # | Pregunta | Impacto | Confianza |
|---|----------|---------|-----------|
| P1 | ... | Alto / Medio / Bajo | 🔴 |

---

## Escala de confianza

🟢 **CONFIRMADO** — extraído directamente del código fuente  
🟡 **INFERIDO** — deducido por patrón o contexto, sin leer todos los archivos  
🔴 **REQUIERE_REVISIÓN** — no determinable sin ejecución o código faltante
```
