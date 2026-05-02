# Convivencia entre paquetes de agentes (front vs backend)

Este repositorio publica el paquete **`ais-agente-front-winforms`**: agentes para **desarrollo y especificación del cliente WinForms**.

## Cómo se identifica el paquete

| Señal | Valor en este paquete |
|--------|------------------------|
| Nombre npm | `ais-agente-front-winforms` |
| Orquestador (skill) | `ais-agente-front-winforms` |
| Carpeta de estado en el repo instalado | `.ais-agente-front-winforms/` |
| `state.json` | `product_id`: `ais-agente-front-winforms`, `agent_domain`: `client-front`, `target_stack`: `winforms` |
| Comando en el chat | **`/sfz-front`** o **`sfz-front`** (nunca `/sfz` ni `sfz` aquí) |
| CLI | **`npx sfz-front`** (único binario de entrada: `sfz-front`; también `npx ais-agente-front-winforms`) |

**Importante:** no uses **`/sfz`** ni **`sfz`** con este paquete. Reservá esos triggers para el **paquete de backend** (u otro AIS) y así evitás que el modelo active el orquestador equivocado.

## Backend en otro proyecto

El paquete de **servidor** debería tener otro nombre npm, otro id de orquestador, otra carpeta de estado y otros comandos de chat (por ejemplo `/sfz-api`), documentados en sus propias plantillas.

## Alcance

AIS Agente Front WinForms se limita al **cliente WinForms**. La integración con APIs REST del servidor se documenta con los agentes existentes (p. ej. mapeo proxy ↔ OpenAPI) cuando el equipo lo necesite; no forma parte de un relato separado de “migración web”.
