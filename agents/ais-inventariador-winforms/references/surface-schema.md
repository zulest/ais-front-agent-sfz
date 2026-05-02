# Schema — .ais-agente-front-winforms/context/surface.json

Arquivo gerado pelo Scout. Usado pelos demais agentes como fonte de contexto estruturado.

## Estrutura completa

```json
{
  "generated_at": "2026-04-26T10:00:00Z",
  "project_root": "/caminho/do/projeto",
  "languages": [
    { "name": "C#", "extensions": [".cs"], "file_count": 420 }
  ],
  "primary_language": "C#",
  "frameworks": [
    { "name": "Windows Forms", "version": ".NET Framework 4.8", "source": "*.csproj" }
  ],
  "package_manager": null,
  "entry_points": [
    { "path": "src/Program.cs", "type": "app_entry" }
  ],
  "config_files": [
    "App.config", "MyApp.csproj"
  ],
  "ci_cd": [
    ".github/workflows/deploy.yml"
  ],
  "docker": {
    "dockerfile": "Dockerfile",
    "compose": "docker-compose.yml"
  },
  "database_hints": [
    { "path": "prisma/schema.prisma", "type": "prisma_schema" },
    { "path": "prisma/migrations/", "type": "migrations_dir" }
  ],
  "test_framework": "Jest",
  "test_file_count": 47,
  "modules": [
    "auth", "orders", "payments", "users", "notifications"
  ],
  "total_files": 312
}
```

## Campos obrigatórios

`generated_at`, `languages`, `primary_language`, `frameworks`, `entry_points`, `modules`

## Campos opcionais

Todos os demais — inclua apenas o que for encontrado.

## Nota

Use este schema como guia. Se um campo não se aplicar ao projeto, omita-o.
