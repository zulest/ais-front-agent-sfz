# Cómo usar

## Activar el orquestador (cliente WinForms)

Después de instalar, abre el proyecto en tu agente de IA:

=== "Claude Code / Cursor / Gemini CLI"

    ```
    /sfz-front
    ```

=== "Codex y motores sin slash commands"

    ```
    sfz-front
    ```

**No uses `/sfz` ni `sfz`:** este paquete no los registra; dejalos para tu orquestador de **backend** u otro producto AIS.

El skill `ais-agente-front-winforms` coordina el flujo sobre el **cliente WinForms**.

---

## Qué ocurre al activarlo

**Primera vez:** plan de exploración, aprobación, fase 1.

**Sesión retomada:** lee `.ais-agente-front-winforms/state.json` y continúa donde quedó.

---

## Flujo típico

```
Escribís /sfz-front (o sfz-front)
        ↓
Plan de exploración y aprobación
        ↓
Inventariador
        ↓
Nivel de documentación
        ↓
Analista de código (módulo por módulo)
        ↓
Analista de reglas · Arquitecto
        ↓
Redactor · Revisor
        ↓
Especificaciones en _ais_sdd/
```

---

## Desbordamiento de contexto

> "Voy a pausar aquí. Todo está guardado. Escribí `/sfz-front` o `sfz-front` en una nueva sesión para continuar."

---

## Nivel de documentación

Tras el inventariador, el orquestador pregunta el nivel (`doc_level` en `state.json`): esencial, completo o detallado.

---

## Un agente suelto

```
/ais-inventariador-winforms
/ais-analista-reglas-negocio
```

---

## Convivencia con backend

[Convivencia de paquetes](convivencia-paquetes-agentes.md).
