import Database from 'better-sqlite3';


// Configure o banco de dados
const db = new Database('db.sqlite', { verbose: console.log });

// Exemplo: Criar tabela se não existir
db.exec(`
  CREATE TABLE IF NOT EXISTS logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    logtext TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL
  )
`);

export default db;
