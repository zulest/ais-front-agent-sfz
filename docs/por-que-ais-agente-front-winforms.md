# Por qué existe AIS Agente Front WinForms

## El problema clásico

Imagina un sistema WinForms que entró en producción hace años. Nadie que lo escribió sigue en la empresa. La documentación original era un archivo Word que nadie sabe dónde fue a parar. El código funciona, genera ingresos todos los días, pero hay pantallas y módulos que nadie se atreve a tocar porque "cambias esto, rompes aquello".

Ese cliente de escritorio carga años de conocimiento acumulado: reglas de negocio implícitas en formularios y validaciones, decisiones arquitectónicas tomadas bajo presión, lógica crítica enterrada en event handlers. El conocimiento existe. Está en el código. Pero está atrapado ahí dentro, inaccesible para cualquier agente de IA que quiera ayudarte a **desarrollar** o **evolucionar** el front con seguridad.

---

## El problema con los agentes de IA

Los agentes de IA son transformadores para crear y evolucionar software. Pero dependen de especificaciones para operar con seguridad.

Para sistemas nuevos funciona bien: escribes la spec, el agente ejecuta. ¿Pero para un WinForms heredado? El agente no puede saber qué no puede romper. Si le pedís "agregá un campo a este formulario", lo hará basándose en lo que el código *parece* hacer, sin saber lo que el flujo *debe* cumplir.

El resultado es ese momento clásico: el agente rompe una regla de negocio o un contrato con el servidor que nadie había documentado.

---

## La solución

**AIS Agente Front WinForms** es el puente entre el **cliente WinForms** y los agentes de IA (`agent_domain: client-front`).

Analiza el código existente del cliente y extrae conocimiento: pantallas, validaciones, proxies, flujos entre formularios. Luego transforma todo en especificaciones ejecutables y trazables, listas para que un agente codifique o refactorice el front con más contexto.

El resultado no es documentación para leer una tarde tranquila. Son **contratos operacionales** que permiten evolucionar el cliente con fidelidad a lo que ya existe.

---

## Para quién es

- **Equipos con WinForms en producción** que quieren documentar y desarrollar con ayuda de IA
- **Proyectos donde el backend vive en otro repo** — este paquete se instala en el **front**; los agentes de servidor conviven como otro producto (ver [Convivencia de paquetes](convivencia-paquetes-agentes.md))
- **Desarrolladores que heredaron un cliente** y necesitan entender qué hace antes de cambiar algo

---

## Lo que AIS Agente Front WinForms no es

No es un reemplazo del IDE ni un analizador estático clásico. Es un framework de **extracción de conocimiento** orientado al cliente de escritorio.

Tampoco es una solución mágica. Las partes inaccesibles por análisis aparecerán como brechas (🔴), esperando validación humana. La honestidad es parte del diseño.
