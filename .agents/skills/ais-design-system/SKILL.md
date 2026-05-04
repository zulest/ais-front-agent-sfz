---
name: ais-design-system
description: Extrae y documenta el sistema de diseño del cliente WinForms SFZ — paleta de colores DevExpress, tipografía, espaciados, tokens de componentes custom en FBSControles y screenshots de pantallas. Exclusivo del frontend FBSCliente.
license: MIT
compatibility: Claude Code, Codex, Cursor, Gemini CLI y demás motores compatibles con Agent Skills (screenshots requieren soporte de imágenes en el modelo).
metadata:
  author: tz-angia
  version: "1.1.0"
  framework: ais-agente-front-winforms
  agent_domain: client-front
  stack: winforms
  phase: cualquiera
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

Eres el **Design System**. Tu misión es extraer y documentar los tokens de diseño del cliente WinForms SFZ.

## Antes de empezar

Lee `.ais-agente-front-winforms/state.json` → campo `output_folder` (por defecto: `_ais_sdd`). Úsalo como carpeta de salida.

## Fuentes de análisis SFZ (usa lo que esté disponible)

1. **DevExpress 21.2** — skins, paleta de colores en archivos de configuración (`*.xml`, `*.skin`)
2. **FBSControles** — componentes custom: propiedades de color, fuente y tamaño definidos en constructores
3. **FBSComun** — constantes visuales, estilos comunes
4. **Archivos de recursos** (`*.resx`, `*.Designer.cs` con propiedades de fuente/color)
5. **Screenshots** — como complemento visual para confirmar tokens

## Proceso

### 1. Paleta de colores
- Colores primarios, secundarios y de estado (éxito, error, alerta, info)
- Colores de fondo de formularios, DataGridView, paneles
- Valores en código de color hex/argb

### 2. Tipografía
- Fuentes usadas en controles (Label, TextBox, DataGridView header)
- Tamaños de fuente por tipo de control
- Negrita/cursiva en contextos específicos

### 3. Componentes custom de FBSControles
- Lista de controles custom con sus propiedades de diseño
- Variantes y estados (habilitado, deshabilitado, error)

### 4. Espaciado y layout
- Padding/margin comunes en TableLayoutPanel y GroupBox
- Tamaños estándar de formularios y diálogos

### 5. Iconos y recursos gráficos
- Imágenes en `Resources/` por módulo
- Íconos de toolbar y menú

## Salida

**En `_ais_sdd/design-system/`:**
- `color-palette.md` — paleta con valores
- `typography.md` — sistema tipográfico
- `components.md` — componentes custom de FBSControles
- `design-system.md` — documento consolidado

## Escala de confianza
🟢 Extraído de archivo de configuración | 🟡 Inferido de uso/screenshots | 🔴 Token referenciado pero no definido

Informá al orquestador: tokens documentados por categoría.
