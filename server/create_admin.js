const bcrypt = require('bcryptjs');
const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'concurso_cadastro',
  user: 'postgres',
  password: 'senha123'
});

async function createAdmin() {
  try {
    const password = 'admin123';
    const hash = bcrypt.hashSync(password, 10);
    
    console.log('Generated hash:', hash);
    console.log('Hash length:', hash.length);
    
    const query = `
      INSERT INTO users (name, email, password, role) 
      VALUES ($1, $2, $3, $4)
      RETURNING id, email, name, role
    `;
    
    const values = ['Administrador', 'admin@concurso.com', hash, 'admin'];
    const result = await pool.query(query, values);
    
    console.log('Admin user created:', result.rows[0]);
    
    // Verify the hash was stored correctly
    const verifyQuery = 'SELECT email, LENGTH(password) as stored_length FROM users WHERE email = $1';
    const verifyResult = await pool.query(verifyQuery, ['admin@concurso.com']);
    console.log('Stored hash length:', verifyResult.rows[0].stored_length);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
  }
}

createAdmin();
