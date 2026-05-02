# CLI

Gestión de la instalación y el ciclo de vida de los agentes en el **proyecto cliente WinForms**. Entrada única recomendada:

```bash
npx sfz-front <comando>
```

Equivalente: `npx ais-agente-front-winforms <comando>`.

No hay binario `sfz` en este paquete: evita colisiones con el CLI del **backend**.

---

## Comandos

### `install`

```bash
npx sfz-front install
```

### `status`

```bash
npx sfz-front status
```

### `update`

```bash
npx sfz-front update
```

### `add-agent` / `add-engine` / `uninstall`

```bash
npx sfz-front add-agent
npx sfz-front add-engine
npx sfz-front uninstall
```

!!! info
    `uninstall` elimina lo registrado por el instalador; el código legado del proyecto no se toca por regla del marco.
