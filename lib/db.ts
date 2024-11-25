import Database from 'better-sqlite3';


// Configure o banco de dados
const db = new Database('db.sqlite');

// Exemplo: Criar tabela se não existir
db.exec(`
  CREATE TABLE IF NOT EXISTS logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ip TEXT NOT NULL,
    date TEXT NOT NULL,
    method TEXT NOT NULL,
    path TEXT NOT NULL,
    protocol TEXT NOT NULL,
    status INTEGER NOT NULL,
    bytes INTEGER NOT NULL,
    referer TEXT,
    agent TEXT NOT NULL,
    webserver TEXT NOT NULL,
    hash TEXT NOT NULL,
    UNIQUE (hash)
  );
`);

db.exec(
  `CREATE TABLE IF NOT EXISTS settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    system TEXT NOT NULL
  )
`);

export default db;