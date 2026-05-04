# Schema — .ais-agente-front-winforms/context/modules.json

Archivo generado por `ais-analista-codigo`. Lo consumen `ais-analista-reglas-negocio`, `ais-arquitecto-sistema` y `ais-redactor-especificaciones`.

## Estructura completa

```json
{
  "generated_at": "2026-05-03T00:00:00Z",
  "modules": [
    {
      "name": "Clientes",
      "path": "FBSCliente/Clientes",
      "purpose": "Gestión de clientes: alta, edición, búsqueda, validación PEPs y generación de fichas",
      "primary_files": [
        "FBSCliente/Clientes/Mantenimiento/Cliente_NuevoPresentador.cs",
        "FBSCliente/Clientes/Mantenimiento/Cliente_EdicionPresentador.cs",
        "FBSCliente/Clientes/Busqueda/BusquedaCliente_Presentador.cs"
      ],
      "functions": [
        {
          "name": "GuardarCliente",
          "file": "FBSCliente/Clientes/Mantenimiento/Cliente_NuevoPresentador.cs",
          "params": [],
          "returns": "void",
          "confidence": "confirmed"
        },
        {
          "name": "SeleccionarDetalleItem",
          "file": "FBSCliente/Clientes/Busqueda/BusquedaCliente_Presentador.cs",
          "params": [],
          "returns": "void",
          "confidence": "confirmed"
        }
      ],
      "entities": [
        {
          "name": "ClienteMSE",
          "fields": [
            { "name": "Secuencial", "type": "int", "required": true },
            { "name": "SecuencialPersona", "type": "int", "required": true },
            { "name": "IdentificacionPersona", "type": "string", "required": true },
            { "name": "NombrePersona", "type": "string", "required": true },
            { "name": "EsPersonaNatural", "type": "bool", "required": true },
            { "name": "NumeroCliente", "type": "int", "required": false },
            { "name": "EsSocio", "type": "bool", "required": false },
            { "name": "CodigoUsuarioOficial", "type": "string", "required": false },
            { "name": "NombreUsuarioOficial", "type": "string", "required": false },
            { "name": "SecuencialDivisionOficina", "type": "int", "required": false },
            { "name": "NombreDivisionOficina", "type": "string", "required": false }
          ],
          "confidence": "confirmed"
        }
      ],
      "business_rules": [
        {
          "description": "Al actualizar un cliente siempre se fuerza EsSocio = true",
          "location": "FBSCliente/Clientes/Mantenimiento/Cliente_EdicionPresentador.cs:221",
          "confidence": "confirmed"
        },
        {
          "description": "Si la persona ya existe como cliente en la empresa, la validación falla (no se puede crear duplicado)",
          "location": "FBSCliente/Clientes/Mantenimiento/Cliente_NuevoPresentador.cs:347",
          "confidence": "confirmed"
        },
        {
          "description": "Al guardar nuevo cliente, si hay motivos de apertura configurados, el diálogo de motivo es obligatorio",
          "location": "FBSCliente/Clientes/Mantenimiento/Cliente_NuevoPresentador.cs:183",
          "confidence": "confirmed"
        }
      ],
      "proxies": [
        "IClienteApi",
        "IListaControlDatoPersonaApi",
        "IPersonaApi",
        "IPersonaNaturalApi",
        "IClienteMotivoAperturaApi",
        "IClientePersonalizadoApi"
      ],
      "dependencies": ["Personas", "Generales"],
      "algorithms": [],
      "complexity": "high"
    }
  ]
}
```

## Niveles de confianza

| Valor | Equivalente | Significado |
|-------|-------------|-------------|
| `"confirmed"` | 🟢 | Extraído directamente del código |
| `"inferred"` | 🟡 | Basado en patrones del código |
| `"unknown"` | 🔴 | No determinable sin runtime |

## Campos obligatorios por módulo

`name`, `path`, `purpose`, `primary_files`

## Campo `proxies`

Lista los contratos de `FBSProxies` que el módulo consume. Se usa para cruzar con el mapa generado por `ais-mapeador-proxy-rest`.

## Nota operativa

Guardar checkpoint en `.ais-agente-front-winforms/state.json` después de cada módulo analizado, antes de iniciar el siguiente.
