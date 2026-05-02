# Diseño: Identidad Frontend + Base de Conocimiento Viva — AIS Agente Front SFZ

**Fecha:** 2026-05-02  
**Estado:** Aprobado por usuario  
**Versión:** 1.0  

---

## Contexto

Este paquete (`ais-agente-front-winforms`) fue copiado de un proyecto de migración. El nuevo propósito es distinto: asistir el **desarrollo activo** sobre el cliente WinForms SFZ (correcciones y nuevas funcionalidades), **no** migrar a otro stack.

El servicio opera en modelo **SaaS**: Tomas Zules (tz-angia) provee los agentes a 65 clientes que usan el sistema SFZ. El valor no es la generación única de specs sino el mantenimiento continuo de una base de conocimiento viva que crece con cada commit. Sin los agentes, la documentación se desactualiza — eso crea dependencia real.

---

## Aplicativo objetivo: FBSCliente (SFZ)

**Sistema:** SFZ — sistema financiero (cooperativa/banco), desarrollado por Sifizsoft S.A.  
**Ruta de referencia:** `C:\code\sfz\SanFranciscoAsis\FBSCliente`

### Arquitectura

- **Patrón:** MVP con Microsoft CAB (Composite Application Block)
- **Stack:** .NET 7.0-windows, DevExpress 21.2, WinForms
- **Módulos:** 36 proyectos C#, ~1,000 pantallas/forms

### Estructura de cada pantalla

```
[Concepto]_Vista.cs          → UserControl, lógica mínima
[Concepto]_Vista.Designer.cs → InitializeComponent(), auto-generado por VS
[Concepto]_Presentador.cs    → Lógica de presentación, extiende BasePresentador
```

### Convenciones de nombres

| Tipo | Prefijo/Sufijo | Ejemplo |
|------|---------------|---------|
| Label | `lbl` | `lblClienteName` |
| TextBox | `txt` | `txtIdentificacion` |
| DataGridView | `dgv` | `dgvClientes` |
| ComboBox | `cbx` | `cbxOficina` |
| DateTimePicker | `dtp` | `dtpFecha` |
| Button | `btn` | `btnBuscar` |
| CheckBox | `chk` | `chkActivo` |
| Modelo | sufijo `Item` | `ClienteItem`, `OficinaItemLista` |

### Acceso a backend

```csharp
FBSProxies.Proxy.Devuelve<IXxxApi>().MetodoDelServicio(params)
```

### Validación

`RequiredFieldValidator`, `ContainerValidator`, `ListValidationSummary` (namespace `CustomValidation`)

### Hotkeys del BasePresentador

F2 Editar · F3 Guardar · F4 Guardar/Cerrar · F5 Actualizar · F6 Buscar

### Módulos de negocio

Clientes, Cartera, Cajas, Cobranzas, Credito, Tesoreria, CaptacionesPlazo, CaptacionesVista, Seguridades, SeguridadesFBS, Portafolio, Seguros, Contabilidades, CierresFinancieros, ActivosFijos, Nomina, Personas, Organizaciones, LavadoActivos, Generales, Gerenciales, GestionDocumental, IndicadoresFinancieros, TransaccionesEnLinea, WorkFlow, Reportes

### Librerías transversales

- `FBSComun` — base de presentadores, constantes, utilidades
- `FBSControles` — componentes WinForms custom
- `FBSProxies` — capa de acceso a servicios REST/OpenAPI

---

## Arquitectura del sistema

### Dos modos de operación

```
/sfz-front → el orquestador detecta el modo automáticamente:

MODO INICIAL (primera vez por tenant o reset)
  Inventariador → Extractor Forms → Analista Código (N módulos)
  → Analista Reglas → Arquitecto → Redactor → Revisor
  → Guarda base de conocimiento en DB (partición front del tenant)

MODO CAMBIO (cuando ya existe base de conocimiento)
  Especificador de Cambios → Planificador de Implementación
  → LLM implementa → Actualizador de Contexto (manual, post-desarrollo)
```

### Resumen de salud (al activar el orquestador)

```
📊 Salud del proyecto [NombreCliente] — YYYY-MM-DD
   Tenant: [id] | Domain: client-front
   Base de conocimiento: N specs · última actualización hace X días
   ⚠️  N specs con drift detectado
   ✅  N specs al día
   Modo: CAMBIO — ¿qué querés hacer hoy?
```

---

## Capa de datos híbrida

### Componentes

```
IDE del cliente (Claude Code / Cursor / Codex)
  │
  Agent Skills ──► MCP Server (ais-front-mcp)
                        │
                   SQLite cifrado
               .ais-agente-front-winforms/ais.db
                        │
                      sync
                        │
              Cloud DB (PostgreSQL/Supabase)
              Fuente de verdad — infra tz-angia
```

### SQLite local (caché cifrada)

- Archivo: `.ais-agente-front-winforms/ais.db`
- Cifrado AES-256; clave derivada de `token_suscripcion + fingerprint_proyecto`
- Sin token válido: ilegible. Los agentes no operan.
- Los agentes nunca leen/escriben archivos KB directamente — todo vía MCP.

### MCP Server (`ais-front-mcp`)

| Herramienta | Función |
|---|---|
| `ais_validate_token` | Verifica suscripción + retorna `tenant_id` y `domain` |
| `ais_read_state` | Lee estado del proyecto del tenant activo |
| `ais_write_artifact` | Guarda spec/análisis con versión + hash |
| `ais_read_artifact` | Lee artefacto por ID/tipo del tenant activo |
| `ais_log_drift` | Registra divergencia código ↔ spec |
| `ais_get_health` | Devuelve resumen de salud del tenant |
| `ais_sync` | Sincroniza caché local → Cloud DB |

### Cloud DB — estructura multi-tenant

```
tenant
  ├── id
  ├── nombre_cliente
  ├── suscripcion_activa (bool)
  ├── front/                    ← agent_domain: client-front
  │     ├── artifacts[]         (specs, análisis, artefactos con versión+hash)
  │     ├── drift_log[]
  │     ├── audit_log[]
  │     └── module_registry[]   (módulos activos + versión .NET por tenant)
  └── back/                     ← agent_domain: server-back
        └── (gestionado por paquete sfz-back)
```

**65 clientes = 130 particiones** (front + back por tenant), completamente aisladas.

### Control de violaciones

| Escenario | Mecanismo |
|---|---|
| Cliente cancela suscripción | Token revocado → `ais_validate_token` falla → agentes se detienen |
| Intento de copiar `ais.db` | Cifrado con token + fingerprint → ilegible sin credenciales |
| LLM trabaja sin agentes | Specs no están en texto plano en el repo |
| Agentes front usados en proyecto back | `ais_validate_token` retorna `client-front`; fingerprint check falla |

### Sincronización (v1 — manual)

Se dispara manualmente con `npx sfz-front update-context` después de un desarrollo.  
**v2 (futuro):** integración Azure DevOps pipeline, trigger automático post-push.

---

## Protección anti-colisión front/back

### Nivel 1 — Metadata de identidad

Todos los agentes llevan en frontmatter:
```yaml
agent_domain: client-front
stack: winforms
framework: ais-agente-front-winforms
```

Primera línea visible de cada SKILL.md:
```
> FRONTEND WinForms SFZ | agent_domain: client-front | Activar con /sfz-front
```

### Nivel 2 — Validación activa en el orquestador

Al activarse, el orquestador verifica que está en el proyecto correcto buscando:
- `FBSCliente.sln`
- Carpeta `FBSProxies/`
- `UseWindowsForms=true` en algún `.csproj`

Si no encuentra estas señales:
```
"Este agente es exclusivo del cliente WinForms SFZ (FBSCliente).
 El directorio actual no parece ser el proyecto frontend.
 Si sos del equipo backend, el paquete correcto es sfz-back.
 Navegá a la carpeta FBSCliente/ antes de continuar."
```

### Nivel 3 — Cerrojo en DB

El token retorna `domain: client-front`. Cualquier operación MCP sobre la partición `back` del tenant es rechazada con error de autorización.

---

## Roster de agentes (16 agentes)

### Modo Inicial — análisis global

| # | Agente | Rol | Estado |
|---|--------|-----|--------|
| 1 | `ais-agente-front-winforms` | Orquestador | Conservar + actualizar |
| 2 | `ais-inventariador-winforms` | Mapeo de módulos y dependencias SFZ | Conservar + adaptar a MCP |
| 3 | `ais-extractor-forms-winforms` | Extracción de forms (Designer + code-behind) | Conservar + adaptar a MCP |
| 4 | `ais-analista-codigo` | Análisis de presentadores módulo a módulo | Conservar + adaptar a MCP |
| 5 | `ais-analista-reglas-negocio` | Reglas de negocio en la capa de presentación | Conservar + adaptar a MCP |
| 6 | `ais-arquitecto-sistema` | Arquitectura MVP, proxies, integraciones | Conservar + adaptar a MCP |
| 7 | `ais-redactor-especificaciones` | Specs formales con trazabilidad | Conservar + escribe a DB |
| 8 | `ais-revisor-especificaciones` | Calidad y consistencia de specs | Conservar + lee desde DB |

### Modo Cambio — desarrollo activo

| # | Agente | Rol | Estado |
|---|--------|-----|--------|
| 9 | `ais-especificador-cambios-front` | Recibe pedido, genera spec del cambio | **Nuevo** |
| 10 | `ais-planificador-implementacion-front` | Plan paso a paso en C# WinForms SFZ | **Reconvertido** (era `ais-reconstructor`) |
| 11 | `ais-actualizador-contexto-front` | Sincroniza KB post-desarrollo (manual v1) | **Nuevo** |

### Especialidad — opcionales

| # | Agente | Rol | Estado |
|---|--------|-----|--------|
| 12 | `ais-mapeador-proxy-rest` | Mapea FBSProxies ↔ OpenAPI backend | Conservar + adaptar a MCP |
| 13 | `ais-documentador-ui` | Documenta pantallas desde screenshots | Conservar + adaptar a MCP |
| 14 | `ais-data-master` | Documenta BD del cliente | Traducir PT→ES + adaptar a MCP |
| 15 | `ais-design-system` | Tokens DevExpress SFZ y componentes custom | Traducir PT→ES + adaptar a MCP |
| 16 | `ais-agents-help` | Explica agentes y cuándo usarlos | Conservar + actualizar contenido |

---

## Diseño de agentes nuevos

### `ais-especificador-cambios-front`

**Propósito:** Recibe el pedido en lenguaje natural y genera la spec completa del cambio.

**Flujo:**
1. Valida token vía `ais_validate_token` (tenant + domain: client-front)
2. Lee KB del tenant desde DB: spec actual de la pantalla/módulo afectado
3. Localiza archivos involucrados usando contexto SFZ embebido (`*_Vista.cs`, `*_Presentador.cs`, `IXxxApi` en FBSProxies)
4. Genera spec del cambio:
   - **Estado actual** (qué hace hoy, con 🟢/🟡/🔴)
   - **Estado deseado** (qué debe hacer)
   - **Archivos impactados** (Vista, Presentador, DTOs, interfaz proxy si aplica)
   - **Criterios de aceptación** (Dado/Cuando/Entonces)
   - **Impacto en otros módulos** (si la interfaz IApi cambia, qué presentadores la usan)
5. Guarda spec en DB vía `ais_write_artifact` con versión + hash

---

### `ais-planificador-implementacion-front`

**Propósito:** Toma la spec del cambio y genera un plan paso a paso en C# WinForms SFZ que cualquier LLM puede ejecutar sin acceso al proyecto original.

**Estructura del plan:**
```
Tarea N — [acción] en [archivo relativo desde FBSCliente/]
  Archivo: [ruta exacta]
  Cambio: [descripción precisa del cambio en código]
  Patrón SFZ: [qué patrón aplicar — Presentador, Vista, Proxy, etc.]
  Prerequisito: Tarea X (si aplica)
  Listo cuando: [criterio verificable]
```

**Reglas:**
- Cada tarea referencia la ruta exacta relativa desde `FBSCliente/`
- Usa patrones SFZ conocidos (MVP, FBSProxies, DevExpress, validadores custom)
- Indica si el cambio requiere actualización de DTO en FBSProxies o solo lógica en Presentador
- Marca dependencias entre tareas
- No inventa patrones nuevos; si algo no tiene precedente en SFZ lo marca 🔴 y pregunta

---

### `ais-actualizador-contexto-front`

**Propósito:** Sincroniza la KB en DB después de que un desarrollador completó un cambio (v1: manual).

**Activación:** `npx sfz-front update-context`

**Flujo:**
1. Valida token vía `ais_validate_token`
2. Lee `git diff HEAD~1 --name-only` — archivos modificados en el último commit
3. Clasifica cada archivo por tipo SFZ:
   - `*_Presentador.cs` → actualiza spec de lógica del módulo
   - `*_Vista.Designer.cs` → actualiza spec de controles de la pantalla
   - `FBSProxies/**` → actualiza spec de contrato de API
4. Para cada archivo: compara hash actual vs hash en DB
5. Si hay divergencia código ↔ spec → llama `ais_log_drift`
6. Actualiza artefactos afectados en DB vía `ais_write_artifact`
7. Dispara `ais_sync` al finalizar

**Nota v2:** integración Azure DevOps para trigger automático post-push.

---

## Agentes eliminados del paquete

| Agente | Motivo |
|--------|--------|
| `ais-reconstructor` | Reemplazado por `ais-planificador-implementacion-front`. El concepto de "reconstrucción desde cero" no aplica al propósito de desarrollo activo SFZ. Sus archivos en `agents/ais-reconstructor/` se eliminan. |

---

## Cambios transversales a todos los agentes existentes

1. **Bloque de identidad** en primera línea visible:
   ```
   > FRONTEND WinForms SFZ | agent_domain: client-front | /sfz-front
   ```

2. **Contexto SFZ embebido** en sección `## Contexto SFZ` de cada SKILL.md con arquitectura MVP, convenciones y módulos conocidos

3. **Reemplazar lecturas/escrituras de archivo** por llamadas MCP:
   - `Lee .ais-agente-front-winforms/state.json` → `ais_read_state()`
   - `Escribe _ais_sdd/xxx.md` → `ais_write_artifact(type, content)`
   - `Lee _ais_sdd/xxx.md` → `ais_read_artifact(type)`

4. **Traducción PT→ES** de `ais-data-master` y `ais-design-system`

5. **Scope ajustado** al cliente WinForms — eliminar referencias a conceptos de backend o migración

---

## Scope v1 vs v2

### v1 (este diseño)
- Identidad frontend explícita en todos los agentes
- Base de conocimiento híbrida (SQLite local + Cloud DB) con multi-tenant
- Dos modos de operación (Inicial / Cambio)
- 3 agentes nuevos: Especificador, Planificador, Actualizador
- Sincronización manual post-desarrollo
- Protección anti-colisión front/back (3 niveles)

### v2 (futuro)
- Integración Azure DevOps para sync automático post-push
- Drift detection automático (alerta cuando código diverge de spec)
- Portal web para visualizar KB sin exportar texto plano
- Métricas de uso por tenant para facturación
