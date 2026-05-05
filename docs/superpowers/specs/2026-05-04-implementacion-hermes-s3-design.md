---
title: Implementación Hermes + S3
status: in-progress
created: 2026-05-04
updated: 2026-05-04
---

# Diseño: Migración de Skills Locales a Hermes + S3

## Contexto y problema

El sistema actual distribuye los agentes como archivos SKILL.md instalados localmente via npm. Esto expone la IP (prompts, lógica de análisis) a los clientes, que podrían copiarlos o redistribuirlos. El objetivo es pasar a un modelo de servicio donde los agentes son inaccesibles para el cliente.

## Decisiones clave tomadas

- **Scope de agentes:** solo análisis y documentación. La implementación de código la sigue haciendo el IDE (Claude Code, Cursor, etc.)
- **No Hermes como backend propio:** Hermes (NousResearch) es la nube de agentes del servicio, no se construye backend propio
- **IP protegida:** los SKILL.md nunca llegan al cliente en la nueva arquitectura
- **graphify solo sobre `_ais_sdd/`:** nunca sobre código fuente C#. El código tiene 9600+ archivos y cualquier estrategia de partición es frágil. `_ais_sdd/` es documentación generada — acotada por naturaleza, siempre bajo el límite.
- **graphify es backend privado de los agentes:** el usuario nunca consulta graphify directamente. Los agentes sfz-front son los únicos clientes del knowledge graph. En AHORA esto es una convención documentada; en DESPUÉS (Hermes) se vuelve técnicamente inevitable porque los agentes corren server-side.
- **Integración graphify: soft (check-and-fallback):** los agentes verifican si sfz-knowledge MCP responde. Si sí → usan el graph. Si no → leen docs directamente y notifican. No bloquean si el graph no está configurado.
- **graphify acceso vía MCP (opción c):** los agentes usan los MCP tools nativos (`query_graph`, `get_node`, `god_nodes`, `shortest_path`). Leer graph.json crudo no es viable (formato NetworkX complejo). No existe CLI `python -m graphify query` — el único path correcto es MCP.

---

## Roadmap de implementación

### AHORA — infraestructura local (sin Hermes)

#### Diseño completo aprobado (2026-05-04)

**Infraestructura graphify:**

graphify MCP se configura una vez en `claude_desktop_config.json` del cliente como `sfz-knowledge`. Es el backend privado de los agentes — el usuario no lo usa directamente.

```json
"sfz-knowledge": {
  "command": "python",
  "args": ["-m", "graphify.serve", "<proyecto>/_ais_sdd/graphify-out/graph.json"]
}
```

Graphify es `pip install graphifyy`. El knowledge graph se construye corriendo `/graphify _ais_sdd/` en Claude Code después del Modo Inicial. Se actualiza incrementalmente con `/graphify _ais_sdd/ --update` después de cada `update-context`.

**Bloque estándar graphify para SKILL.md de agentes:**

```markdown
### Knowledge base (sfz-knowledge)

Antes de leer documentos en `_ais_sdd/`:
1. Intentá llamar `query_graph "<concepto-clave>"` (MCP tool de sfz-knowledge)
2. Si responde → usá los resultados como contexto principal.
   Complementá con `get_node "<id>"` para detalles de nodos específicos.
   Solo leé docs directamente si el graph no da suficiente contexto.
3. Si no responde → leé docs directamente. Notificá al usuario:
   "sfz-knowledge MCP no configurado — el agente operará sin knowledge graph."
```

**Cambios por archivo:**

| Archivo | Cambio |
|---|---|
| `agents/ais-agente-front-winforms/SKILL.md` | Al cerrar Modo Inicial: paso de cierre que guía a correr `/graphify _ais_sdd/` y configurar `sfz-knowledge` MCP |
| `agents/ais-especificador-cambios-front/SKILL.md` | Bloque estándar + `query_graph "<funcionalidad-pedida>"` para impacto |
| `agents/ais-planificador-implementacion-front/SKILL.md` | Bloque estándar + `shortest_path` para dependencias |
| `agents/ais-actualizador-contexto-front/SKILL.md` | Al terminar: "Corré `/graphify _ais_sdd/ --update`" |
| `agents/ais-detector-deriva/SKILL.md` | Bloque estándar + `god_nodes` para detectar nodos de mayor riesgo |
| `lib/commands/update-context.js` | Si `_ais_sdd/graphify-out/graph.json` existe → imprimir reminder de `--update` |
| `lib/commands/install.js` | Sección post-install: instrucciones para construir graph + configurar sfz-knowledge MCP |

**Detalle CLI — `update-context.js`:**

Al final del output, condicionalmente si el graph existe:
```
📊 Knowledge graph: /graphify _ais_sdd/ --update
```

**Detalle CLI — `install.js`:**

Agregar sección al final del output post-install:
```
─── Knowledge graph de los agentes (después del Modo Inicial) ─
  1. Corré /graphify _ais_sdd/ en Claude Code
  2. Configurá sfz-knowledge en claude_desktop_config.json
     (ver .ais-agente-front-winforms/config.toml para la ruta)
────────────────────────────────────────────────────────────────
```

**Estado:** diseño aprobado, pendiente writing-plans + implementación.

---

### PRÓXIMO — S3 para estado compartido

Mover el estado del proyecto de local a S3. Útil **sin Hermes** — múltiples devs del mismo proyecto comparten estado sin pisarse.

**Estructura S3:**

```
s3://ais-servicio/
  {cliente-id}/
    {proyecto-id}/
      state.json
      config.toml
      plan.md
      audit/
      last-sync.json
      sdd/
        *.md
      graphify-out/
        graph.json
        GRAPH_REPORT.md
      health.md
```

**Lo que hay que construir:**

1. Adaptar escritura de outputs a S3 — hoy el CLI usa `fs` de Node. Cambiar a AWS SDK S3 con fallback local si no hay credenciales configuradas.
2. Sincronizar `graphify-out/graph.json` a S3 post-update.
3. Definir estructura de credenciales por cliente (env vars o config.toml).

---

### DESPUÉS — Hermes (cuando los agentes estén maduros y estables)

La condición "agentes maduros" aplica **solo** a esta fase. Las fases anteriores no dependen de ella.

**Arquitectura objetivo:**

```
Cliente (IDE: Claude Code / Cursor / etc.)
   ↓ MCP
MCP Server local (npm thin-client — sin prompts, sin IP)
   ↓ red
Tu instancia de Hermes (agentes con toda la lógica)
   ↓ MCP (de vuelta)
MCP Server local → lee código C# del proyecto
                 → sirve graph.json de _ais_sdd/ (graphify MCP, sfz-knowledge)
   ↓ escribe outputs
S3 (por cliente/proyecto)
```

En esta fase, `sfz-knowledge` corre server-side junto con los agentes en Hermes. El cliente no puede acceder al graph directamente — la restricción es técnica, no solo documental.

**Lo que hay que construir:**

1. Convertir SKILL.md a definiciones de agente compatibles con Hermes
2. Construir MCP server thin-client (reemplaza el npm actual de skills) — sin prompts, sin IP
3. Definir estructura de auth/tokens para que el MCP server acceda a Hermes
4. Migrar clientes existentes

**Dependencias previas:**

- Agentes de análisis/documentación maduros y estables
- Entender el modelo de deployment de agentes en Hermes (NousResearch)
- Definir estrategia de auth cliente ↔ Hermes
- Fase "Próximo" (S3) completada — el thin-client escribe al mismo S3

---

## Beneficios acumulativos por fase

| Beneficio | Ahora | Próximo | Después |
|---|---|---|---|
| Knowledge base navegable de `_ais_sdd/` | ✅ | ✅ | ✅ |
| Agentes consultan docs sin releer todo | ✅ | ✅ | ✅ |
| Estado compartido entre devs del proyecto | ❌ | ✅ | ✅ |
| Upgrades silenciosos de agentes | ❌ | ❌ | ✅ |
| IP protegida (cliente no ve prompts) | ❌ | ❌ | ✅ |
| Modelo de servicio (cobro por acceso) | ❌ | ❌ | ✅ |
