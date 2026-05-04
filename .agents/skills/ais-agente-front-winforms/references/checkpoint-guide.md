# Guía de checkpoints — `.ais-agente-front-winforms/state.json`

Solo el **orquestador AIS Agente Front WinForms** **escribe** en `state.json`. Los demás agentes solo leen.

## Reglas absolutas

1. **No borres campos existentes.** Solo añade o actualiza.
2. **Lee el archivo antes de escribir** — otro paso puede haber tocado `checkpoints`.
3. **Guarda al terminar cada fase**, no solo al final.
4. **Si el contexto se agota**, guarda de inmediato antes de pausar.

## Qué guardar por fase

### Al iniciar una fase
```json
{
  "phase": "reconocimiento"
}
```

### Al concluir un agente (ejemplo inventariador)
```json
{
  "checkpoints": {
    "inventariador": {
      "completed_at": "2026-04-26T10:30:00Z",
      "files": [
        "_ais_sdd/inventory.md",
        "_ais_sdd/dependencies.md",
        ".ais-agente-front-winforms/context/surface.json"
      ]
    }
  }
}
```

### Al concluir una fase completa
```json
{
  "phase": "excavacion",
  "completed": ["reconocimiento"],
  "pending": ["excavacion", "interpretacion", "generacion", "revision"]
}
```

## Secuencia de fases

```
null → reconocimiento → excavacion → interpretacion → generacion → revision
```

## Ejemplo de `state.json` en curso

```json
{
  "version": "1.0.0",
  "project": "mi-sistema",
  "user_name": "Ana",
  "chat_language": "es",
  "doc_language": "es",
  "answer_mode": "chat",
  "output_folder": "_ais_sdd",
  "phase": "excavacion",
  "completed": ["reconocimiento"],
  "pending": ["excavacion", "interpretacion", "generacion", "revision"],
  "checkpoints": {
    "inventariador": {
      "completed_at": "2026-04-26T10:30:00Z",
      "files": [
        "_ais_sdd/inventory.md",
        ".ais-agente-front-winforms/context/surface.json"
      ]
    }
  },
  "engines": ["claude-code"],
  "agents": ["ais-agente-front-winforms", "ais-inventariador-winforms", "ais-analista-codigo"],
  "created_files": []
}
```

## Mensaje de pausa por límite de contexto

> "[Nombre], pauso aquí para preservar contexto. Todo está en `.ais-agente-front-winforms/state.json`. En una sesión nueva escribe `/sfz-front` o `sfz-front` para continuar."
