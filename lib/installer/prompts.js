import inquirer from 'inquirer';
import { applyOrangeTheme, ORANGE_PREFIX } from './orange-prompts.js';

applyOrangeTheme();

export const REQUIRED_AGENT_IDS = [
  'ais-agente-front-winforms',
  'ais-inventariador-winforms',
  'ais-analista-codigo',
  'ais-analista-reglas-negocio',
  'ais-arquitecto-sistema',
  'ais-redactor-especificaciones',
  'ais-especificador-cambios-front',
  'ais-planificador-implementacion-front',
  'ais-actualizador-contexto-front',
];

const REQUIRED_AGENTS = [
  { name: 'AIS: orquestador cliente WinForms (/sfz-front)', value: 'ais-agente-front-winforms', disabled: true },
  { name: 'AIS: inventariador WinForms', value: 'ais-inventariador-winforms', disabled: true },
  { name: 'AIS: analista de código', value: 'ais-analista-codigo', disabled: true },
  { name: 'AIS: analista de reglas de negocio', value: 'ais-analista-reglas-negocio', disabled: true },
  { name: 'AIS: arquitecto de sistema', value: 'ais-arquitecto-sistema', disabled: true },
  { name: 'AIS: redactor de especificaciones', value: 'ais-redactor-especificaciones', disabled: true },
  { name: 'AIS: especificador de cambios front (Modo Cambio)', value: 'ais-especificador-cambios-front', disabled: true },
  { name: 'AIS: planificador de implementación front (Modo Cambio)', value: 'ais-planificador-implementacion-front', disabled: true },
  { name: 'AIS: actualizador de contexto front (post-desarrollo)', value: 'ais-actualizador-contexto-front', disabled: true },
];

const OPTIONAL_AGENTS = [
  { name: 'AIS: revisor de especificaciones', value: 'ais-revisor-especificaciones', checked: true },
  { name: 'AIS: documentador UI (screenshots)', value: 'ais-documentador-ui', checked: true },
  { name: 'AIS: extractor de forms WinForms', value: 'ais-extractor-forms-winforms', checked: true },
  { name: 'AIS: mapeador Proxy→REST', value: 'ais-mapeador-proxy-rest', checked: true },
  { name: 'AIS: maestro de datos (base de datos)', value: 'ais-data-master', checked: true },
  { name: 'AIS: sistema de diseño (DevExpress/tokens)', value: 'ais-design-system', checked: true },
  { name: 'AIS: ayuda de agentes (guía de uso)', value: 'ais-agents-help', checked: true },
];

const P = { prefix: ORANGE_PREFIX };

export async function runInstallPrompts(detectedEngines) {
  const engineChoices = detectedEngines.map(e => ({
    name: `${e.name}${e.star ? ' ⭐' : ''}`,
    value: e.id,
    checked: e.detected,
  }));

  const answers = await inquirer.prompt([
    {
      ...P,
      type: 'checkbox',
      name: 'engines',
      message: '¿Qué engines quieres soportar?',
      choices: engineChoices,
      loop: false,
      validate: (selected) => selected.length > 0 || 'Selecciona al menos un engine.',
    },
    {
      ...P,
      type: 'checkbox',
      name: 'optional_agents',
      message: 'Agentes a instalar:',
      choices: [
        new inquirer.Separator('── Requeridos (siempre instalados) ──'),
        ...REQUIRED_AGENTS,
        new inquirer.Separator('── Opcionales ──'),
        ...OPTIONAL_AGENTS,
      ],
      loop: false,
    },
    {
      ...P,
      type: 'input',
      name: 'project_name',
      message: 'Nombre del proyecto:',
      default: process.cwd().split(/[\\/]/).pop(),
      validate: (v) => v.trim().length > 0 || 'El nombre no puede estar vacío.',
    },
    {
      ...P,
      type: 'input',
      name: 'user_name',
      message: '¿Cómo deben llamarte los agentes?',
      validate: (v) => v.trim().length > 0 || 'El nombre no puede estar vacío.',
    },
    {
      ...P,
      type: 'input',
      name: 'chat_language',
      message: 'Idioma para interacciones en el chat:',
      default: 'es',
    },
    {
      ...P,
      type: 'input',
      name: 'doc_language',
      message: 'Idioma para documentos y specs generados:',
      default: 'es',
    },
    {
      ...P,
      type: 'input',
      name: 'output_folder',
      message: 'Carpeta de salida para specs:',
      default: '_ais_sdd',
    },
    {
      ...P,
      type: 'list',
      name: 'git_strategy',
      message: '¿Cómo manejar los artefactos en git?',
      loop: false,
      choices: [
        { name: 'Commit junto al proyecto (recomendado para equipos)', value: 'commit' },
        { name: 'Agregar al .gitignore (uso personal)', value: 'gitignore' },
      ],
    },
    {
      ...P,
      type: 'list',
      name: 'answer_mode',
      message: '¿Cómo prefieres responder preguntas del agente?',
      loop: false,
      choices: [
        { name: 'En el chat (más rápido)', value: 'chat' },
        { name: 'En el archivo questions.md (más organizado)', value: 'file' },
      ],
    },
  ]);

  const requiredAgentValues = REQUIRED_AGENT_IDS;
  return {
    ...answers,
    agents: [...requiredAgentValues, ...answers.optional_agents],
  };
}

export async function askMergeStrategy(filePath) {
  const { strategy } = await inquirer.prompt([
    {
      ...P,
      type: 'list',
      name: 'strategy',
      message: `The file "${filePath}" already exists. What to do?`,
      loop: false,
      choices: [
        { name: 'Merge: añadir contenido de AIS Agente Front WinForms al final', value: 'merge' },
        { name: 'Skip: keep the file as is', value: 'skip' },
      ],
    },
  ]);
  return strategy;
}
