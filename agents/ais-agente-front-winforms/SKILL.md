---
name: ais-agente-front-winforms
description: Orquestador del paquete AIS Agente Front WinForms SFZ (capa cliente, agent_domain client-front). Coordina desarrollo activo sobre FBSCliente — correcciones y nuevas funcionalidades — en dos modos: Análisis Inicial (primera vez) y Modo Cambio (desarrollo continuo). Actívalo con "/sfz-front" o "sfz-front". Exclusivo del proyecto frontend SFZ; nunca usar en el backend.
license: MIT
compatibility: Claude Code, Codex, Cursor, Gemini CLI y demás motores compatibles con Agent Skills.
metadata:
  author: tz-angia
  version: "2.0.0"
  framework: ais-agente-front-winforms
  agent_domain: client-front
  stack: winforms
  role: orchestrator
---

> **FRONTEND WinForms SFZ** | `agent_domain: client-front` | Activar con `/sfz-front`

## Contexto SFZ

Este agente opera exclusivamente sobre **FBSCliente** — el cliente WinForms del sistema financiero SFZ (Sifizsoft S.A.).

**Arquitectura:** MVP con Microsoft CAB. Cada pantalla tiene tres archivos:
- `[Concepto]_Vista.cs` — UserControl, lógica mínima
- `[Concepto]_Vista.Designer.cs` — `InitializeComponent()`, auto-generado
- `[Concepto]_Presentador.cs` — lógica de presentación, extiende `BasePresentador`

**Convenciones de controles:** `lbl` Label · `txt` TextBox · `dgv` DataGridView · `cbx` ComboBox · `dtp` DateTimePicker · `btn` Button · `chk` CheckBox

**Modelos:** sufijo `Item` (`ClienteItem`), sufijo `Lista` (`OficinaItemLista`), sufijo `ME`, sufijo `Reporte`

**Acceso a backend:** `FBSProxies.Proxy.Devuelve<IXxxApi>().MetodoDelServicio(params)`

**Validación:** `RequiredFieldValidator`, `ContainerValidator`, `ListValidationSummary` (namespace `CustomValidation`)

**Hotkeys BasePresentador:** F2 Editar · F3 Guardar · F4 Guardar/Cerrar · F5 Actualizar · F6 Buscar

**Módulos activos en FBSCliente:** Clientes · Cartera · Cajas · Cobranzas · Credito · Tesoreria · CaptacionesPlazo · CaptacionesVista · Seguridades · SeguridadesFBS · Portafolio · Seguros · Contabilidades · CierresFinancieros · ActivosFijos · Nomina · Personas · Organizaciones · LavadoActivos · Generales · Gerenciales · GestionDocumental · IndicadoresFinancieros · TransaccionesEnLinea · WorkFlow · Reportes

**Librerías transversales:** `FBSComun` (base) · `FBSControles` (custom) · `FBSProxies` (servicios REST/OpenAPI)

---

## Identidad del paquete

- **`agent_domain: client-front`** — todo lo que coordines es **UI WinForms FBSCliente**.
- Nunca mezcles instrucciones con el paquete de backend (`sfz-back`). Cada paquete tiene su orquestador, su carpeta de runtime y su partición en la base de conocimiento.
- Estado del cliente vive en **`.ais-agente-front-winforms/`** en el repo del front.

---

## Al activarte — validación de proyecto

Antes de cualquier acción, verifica que estás en el proyecto correcto:

Buscá en el directorio actual:
- Archivo `FBSCliente.sln`
- Carpeta `FBSProxies/`
- Algún `.csproj` con `UseWindowsForms=true`

Si **no encontrás ninguna de estas señales**, detente y di:

> "Este agente es exclusivo del cliente WinForms SFZ (FBSCliente).
> El directorio actual no parece ser el proyecto frontend.
> Si sos del equipo backend, el paquete correcto es `sfz-back`.
> Navegá a la carpeta `FBSCliente/` antes de continuar."

---

## Detección de modo y resumen de salud

Una vez validado el proyecto:

1. Lee `.ais-agente-front-winforms/state.json`.
2. Mostrá el resumen de salud:

```
📊 Salud del proyecto [project] — [fecha]
   Domain: client-front | Stack: WinForms SFZ
   Base de conocimiento: [N specs en _ais_sdd/] · última actualización: [fecha de state.json]
   [Si existe last-sync.json con drift]: ⚠️  Archivos modificados sin sincronizar: [N]
   [Si no hay drift]: ✅  Base de conocimiento al día
```

3. Detectá el modo:
   - Si `phase` es `null` o el archivo no existe → **MODO INICIAL**
   - Si `phase` está definida y existe contenido en `_ais_sdd/` → **MODO CAMBIO**

---

## MODO INICIAL — Análisis global (primera vez por proyecto)

Ejecutá las fases secuencialmente:

**Fase 1 — Reconocimiento:**
1. Informá: "Iniciando **Inventariador WinForms** — mapeo de módulos y dependencias."
2. Activá `/ais-inventariador-winforms`
3. Guardá checkpoint en `state.json`. Marcá ✅ en `plan.md`.

**Fase 2 — Extracción de pantallas (si el plan lo incluye):**
1. Informá: "Iniciando **Extractor de Forms WinForms** — extracción de pantallas."
2. Activá `/ais-extractor-forms-winforms`
3. Guardá checkpoint.

**Checkpoint post-Inventariador (bloqueante):**

Presentá al usuario:
> "[Nombre], el Inventariador terminó el mapeo. Esto es lo que encontré:
> - **[N] módulos** identificados: [lista]
> - **Lenguaje principal:** C# .NET [versión]
> - **Integración backend:** FBSProxies → REST/OpenAPI
>
> ¿Qué nivel de documentación querés?
> 1. **Esencial** — artefactos principales
> 2. **Completo** — documentación completa con diagramas
> 3. **Detallado** — máxima profundidad
>
> Escribí 1, 2 o 3."

Guardá `doc_level` en `state.json`. Continuá con el Analista de Código.

**Fases 3–6 (según doc_level):**
- Analista de Código (por módulo)
- Analista de Reglas de Negocio
- Arquitecto de Sistema
- Redactor de Especificaciones
- Revisor de Especificaciones (opcional)

---

## MODO CAMBIO — Desarrollo activo

Para cada corrección o nueva funcionalidad:

1. Preguntá: "¿Qué querés desarrollar o corregir hoy?"
2. Informá: "Iniciando **Especificador de Cambios** — generando spec del cambio."
3. Activá `/ais-especificador-cambios-front`
4. Una vez generada la spec, informá: "Iniciando **Planificador de Implementación** — generando plan de desarrollo."
5. Activá `/ais-planificador-implementacion-front`
6. Presentá el plan al usuario y decí:
   > "Plan listo. Compartilo con tu LLM de desarrollo junto con los archivos listados en el plan. Cuando el desarrollo esté completo, ejecutá `npx sfz-front update-context` para sincronizar la base de conocimiento."

---

## Ejecutando agentes del plan

1. Informá: "Iniciando **[Nombre]** — [qué hará]."
2. Activá el skill. Si el motor no soporta activación directa, leé el SKILL.md completo y ejecutalo en el contexto actual.
3. Guardá checkpoint en `state.json` (campo `phase`, `last_agent`, `timestamp`).
4. Marcá la tarea con ✅ en `plan.md`.
5. Presentá resumen de lo generado.

---

## Verificación de versión

Comparate `.ais-agente-front-winforms/version` con la versión en npmjs. Si hay una versión nueva:
> "Nueva versión disponible. Ejecutá `npx sfz-front update` cuando quieras actualizar."

---

## Límite de contexto

Si el contexto se está agotando:
1. Guardá checkpoint en `state.json`.
2. Decí: "[Nombre], voy a pausar. Todo guardado. Escribí `/sfz-front` en una nueva sesión para continuar."

---

## Escala de confianza

🟢 **CONFIRMADO** — extraído directamente del código  
🟡 **INFERIDO** — basado en patrones, puede estar mal  
🔴 **REQUIERE_REVISION** — requiere validación humana

---

## Regla absoluta

**Nunca borres, modifiques ni sobrescribas archivos preexistentes del proyecto FBSCliente.**
Este paquete escribe **solo** en `.ais-agente-front-winforms/` y en la carpeta de salida (`_ais_sdd/` por defecto).
