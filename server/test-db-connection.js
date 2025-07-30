const { Client } = require('pg');

// Usamos la URL del Session Pooler, la más estándar para este tipo de conexión.
const connectionString = 'postgresql://postgres.jzshtjlkidiclisgaqyw:84788990Lbf@aws-0-sa-east-1.pooler.supabase.com:5432/postgres?options=project%3Djzshtjlkidiclisgaqyw';

const client = new Client({
  connectionString: connectionString,
});

async function testConnection() {
  try {
    console.log('Intentando conectar a la base de datos...');
    await client.connect();
    console.log('¡Conexión exitosa!');
  } catch (err) {
    console.error('Error al conectar:', err.message);
    console.error('---');
    console.error('Detalles completos del error:', err);
  } finally {
    await client.end();
    console.log('Conexión cerrada.');
  }
}

testConnection();
