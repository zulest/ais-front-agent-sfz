# Guía con analogías

¿No sabés qué agente llamar? Activá la guía:

```
/ais-agents-help
```

**Cliente WinForms:** DLL en [Insumos librerías](../librerias-insumos-analisis.md); OpenAPI en `docs/openapi/` cuando el equipo lo use. **Convivencia con backend:** [Convivencia de paquetes](../convivencia-paquetes-agentes.md). Activación del orquestador: **`/sfz-front`** o **`sfz-front`** únicamente.

---

## El equipo completo con analogías

### 🎼 Orquestador (`/sfz-front` o `sfz-front`)

Un director no toca ningún instrumento. Conoce la partitura completa y dice quién entra cuándo, en qué orden, a qué ritmo. Sin él, cada músico tocaría su parte sin conectarse con los demás.

> Usá **`/sfz-front`** o **`sfz-front`** para iniciar o retomar el flujo completo del **cliente**. No uses `/sfz` ni `sfz` con este paquete.

---

### 🗺️ Inventariador WinForms — el agente inmobiliario

Hace el primer recorrido de la propiedad. No abre cajones, no lee documentos, no toca nada. Solo mapea: cuántas habitaciones, qué instalaciones existen, cuál es el estado general.

> Usalo al principio. Genera el inventario del proyecto sin entrar en la lógica del código.

---

### ⛏️ Analista de código — el excavador

Excava el terreno con paciencia, capa a capa. Cataloga cada artefacto encontrado: tamaño, material, ubicación, forma. No interpreta la civilización, solo describe con precisión lo que hay.

> Usalo para analizar el código módulo a módulo. Un módulo por sesión para conservar tokens.

---

### 🔍 Analista de reglas de negocio — el detective

Llega después del excavador. Mira los artefactos catalogados y pregunta: *"¿Por qué está esto aquí? ¿Quién lo puso? ¿Qué revela sobre quién vivió aquí?"* No excava, interpreta.

> Usalo después del analista de código. Extrae reglas de negocio implícitas, lee el historial de git como un diario y reconstruye decisiones que nadie documentó.

---

### 📐 Arquitecto de sistema — el cartógrafo

El cartógrafo visita un territorio y produce mapas formales. Alguien que nunca estuvo allí puede entender todo mirando los mapas.

> Usalo después del analista de reglas. Sintetiza diagramas C4, ERD completo y mapa de integraciones.

---

### 📝 Redactor de especificaciones — el notario

Transforma lo descubierto en contratos formales, precisos y trazables. Cada cláusula tiene nivel de certeza declarado. El documento vale como contrato.

> Usalo después del arquitecto. Genera specs SDD, OpenAPI e historias de usuario con trazabilidad de código.

---

### ⚖️ Revisor de especificaciones

Toma los contratos del redactor e intenta hacerles agujeros. No para destruir, sino para garantizar que lo que quede sea sólido.

> Usalo después del redactor.

---

### 🖼️ Documentador UI — el ilustrador forense

Trabaja solo con imágenes. Recibe capturas del sistema y reconstruye la interfaz: pantallas, formularios, flujos de navegación.

> Usalo cuando tengas capturas disponibles.

---

### 🗄️ Data Master — el geólogo

Mapea el subsuelo: la capa que nadie ve pero que lo sostiene todo. Tablas, relaciones, restricciones, disparadores, procedimientos.

> Usalo cuando haya DDL, migraciones o modelos ORM disponibles.

---

### 🎨 Design System — el estilista

Cataloga el guardarropa: paleta de colores, tipografía, espaciados, tokens de diseño.

> Usalo cuando haya archivos CSS, temas o capturas de interfaz.

---

## Secuencia recomendada

```
/sfz-front (o sfz-front) → orquesta todo automáticamente

O manualmente:
Inventariador → Analista de código (N sesiones) → Analista de reglas → Arquitecto → Redactor → Revisor

WinForms + extracción de pantallas + contratos REST en repo (si aplica):
Inventariador → Extractor de forms → Analista de código (N) → Analista de reglas → Mapeador proxy→REST
  → Arquitecto → Redactor → Revisor

Opcionales en cualquier fase:
Documentador UI · Data Master · Design System
```
