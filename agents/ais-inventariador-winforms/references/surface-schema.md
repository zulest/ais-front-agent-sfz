# Schema — .ais-agente-front-winforms/context/surface.json

Archivo generado por el Inventariador. Usado por los demás agentes como fuente de contexto estructurado.

## Campos obligatorios

`generated_at`, `project_root`, `languages`, `primary_language`, `frameworks`, `entry_points`, `modules`

## Campos opcionales

Incluí solo los que sean aplicables al proyecto.

## Estructura completa

```json
{
  "generated_at": "2026-05-03T00:00:00Z",
  "project_root": "/ruta/al/proyecto",
  "project": "FBSCliente",
  "version": "2.5",
  "company": "Sifizsoft S.A.",
  "agent_domain": "client-front",

  "languages": [
    { "name": "C#", "extensions": [".cs"], "file_count": 9641, "lang_version": "12" },
    { "name": "RDLC", "extensions": [".rdlc"], "file_count": 415 }
  ],
  "primary_language": "C#",
  "frameworks": [
    { "name": "Windows Forms", "version": "net7.0-windows10.0.18362.0", "source": "FBSShell.csproj" },
    { "name": "Microsoft CAB", "version": "legado", "source": "Financial.Cliente.Comun.Core 2.3.3" },
    { "name": "DevExpress WinForms", "version": "21.2", "source": "Lib.Core/*.dll" }
  ],
  "package_manager": "NuGet",
  "output_path": "Salida.Core/",

  "entry_points": [
    { "path": "FBSCliente/FBSShell/FBSApplication.cs", "type": "app_entry" },
    { "path": "FBSCliente/FBSShell/FBSForm1.cs", "type": "main_form" },
    { "path": "FBSCliente/FBSShell/LoginForm.cs", "type": "login_form" }
  ],
  "config_files": [
    "FBSCliente/FBSShell/appsettings.json",
    "FBSCliente/FBSShell/app.config",
    "FBSCliente/FBSShell/Financial2_5.sqlite"
  ],
  "ci_cd": [],
  "docker": null,

  "database_hints": [
    { "path": "FBSCliente/FBSShell/Financial2_5.sqlite", "type": "sqlite_local" }
  ],
  "test_framework": null,
  "test_file_count": 0,
  "projects_count": 39,

  "modules": [
    "FBSShell", "FBSComun", "FBSControles", "FBSProxies",
    "Clientes", "Credito", "Cartera", "Cajas", "Tesoreria"
  ],
  "module_subfolders_pattern": [
    "Busqueda", "Mantenimiento", "Consulta", "Proceso",
    "Transaccion", "Documentos", "Reportes", "WorkItems", "Constantes", "Resources"
  ],

  "architecture_pattern": "MVP + Microsoft CAB",
  "screen_convention": {
    "view": "*_Vista.cs (UserControl, [SmartPart])",
    "view_designer": "*_Vista.Designer.cs",
    "presenter": "*_Presentador.cs (extends BasePresentador)"
  },
  "control_prefixes": {
    "Label": "lbl",
    "TextBox": "txt",
    "DataGridView": "dgv",
    "ComboBox": "cbx",
    "DateTimePicker": "dtp",
    "Button": "btn",
    "CheckBox": "chk"
  },
  "model_suffixes": ["Item", "Lista", "ME", "Reporte"],

  "backend_access_pattern": "FBSProxies.Proxy.Devuelve<IXxxApi>().MetodoDelServicio(params)",
  "backend": {
    "protocol": "REST / HTTP",
    "default_host": "http://localhost",
    "default_port": 8090,
    "login_endpoint": "Autorizacion/Autorizacion/Login",
    "refresh_endpoint": "Autorizacion/Autorizacion/RefreshToken",
    "realtime": "SignalR Client 7.0.5"
  },
  "service_discovery": "Consul 1.6.10.9",
  "http_libraries": ["Flurl.Http 3.2.4", "RestSharp 106.11.7"],
  "retry_library": "Polly 7.2.3",

  "reporting": {
    "engine": "ReportViewerCore.WinForms 15.1.24",
    "format": "RDLC",
    "file_count": 415
  },
  "validation_components": [
    "RequiredFieldValidator", "ContainerValidator", "ListValidationSummary"
  ],
  "validation_namespace": "CustomValidation",
  "hotkeys": {
    "F2": "Editar",
    "F3": "Guardar",
    "F4": "Guardar/Cerrar",
    "F5": "Actualizar",
    "F6": "Buscar"
  },
  "external_dll_folders": [
    { "path": "Lib.Core/", "description": "DevExpress v21.2 + Biometrika" },
    { "path": "LibProxie/", "description": "FBSProxies.*.dll pre-compilados (uno por dominio)" },
    { "path": "Lib/", "description": "Integraciones externas: WIA, FacturacionElectronica, BCE, e-Canales" }
  ],
  "total_files": 9641
}
```

## Nota

Usá este schema como guía. Si un campo no aplica al proyecto, omitilo. El schema refleja el proyecto SFZ/FBSCliente — proyectos con stacks diferentes tendrán campos distintos.
