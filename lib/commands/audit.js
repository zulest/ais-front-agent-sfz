import { join } from 'path';
import { mkdirSync, appendFileSync, readFileSync, readdirSync, existsSync } from 'fs';

const AUDIT_DIR = 'audit';

/**
 * Appends a single structured entry to the monthly JSONL audit log.
 *
 * @param {string} aisDir  Absolute path to .ais-agente-front-winforms/
 * @param {object} entry
 * @param {string} entry.operation   e.g. 'update-context', 'approve', 'link-ticket'
 * @param {string} entry.agent       Agent or CLI that triggered the operation
 * @param {string} [entry.artifact]  Relative path of the artifact written/modified
 * @param {string} [entry.user]      User name from state.json (optional)
 * @param {object} [entry.meta]      Extra key-value data (optional)
 */
export function appendAuditEntry(aisDir, { operation, agent, artifact = null, user = null, meta = {} }) {
  const auditDir = join(aisDir, AUDIT_DIR);
  mkdirSync(auditDir, { recursive: true });

  const now = new Date();
  const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const logFile = join(auditDir, `${month}.jsonl`);

  const record = {
    ts: now.toISOString(),
    operation,
    agent,
    ...(artifact ? { artifact } : {}),
    ...(user ? { user } : {}),
    ...(Object.keys(meta).length ? { meta } : {}),
  };

  appendFileSync(logFile, JSON.stringify(record) + '\n', 'utf8');
}

/**
 * Reads all JSONL audit entries from the audit directory, newest first.
 *
 * @param {string} aisDir
 * @returns {object[]}
 */
export function readAuditLog(aisDir) {
  const auditDir = join(aisDir, AUDIT_DIR);
  if (!existsSync(auditDir)) return [];

  const files = readdirSync(auditDir)
    .filter(f => f.endsWith('.jsonl'))
    .sort()
    .reverse();

  const entries = [];
  for (const file of files) {
    const lines = readFileSync(join(auditDir, file), 'utf8').trim().split('\n').filter(Boolean);
    for (const line of lines) {
      try { entries.push(JSON.parse(line)); } catch { /* skip malformed lines */ }
    }
  }
  return entries;
}
