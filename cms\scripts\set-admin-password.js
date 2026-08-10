// Uso: node scripts/set-admin-password.js correo@dominio.com "NuevaPasswordSegura123"
require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('../db');

const [, , email, password] = process.argv;

if (!email || !password) {
  console.log('Uso: node scripts/set-admin-password.js correo@dominio.com "NuevaPasswordSegura123"');
  process.exit(1);
}
if (password.length < 10) {
  console.log('La contraseña debe tener al menos 10 caracteres.');
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 12);
const result = db.setAdminPassword(email, hash);
console.log(result === 'updated' ? 'Contraseña actualizada para ' + email : 'Nuevo usuario admin creado: ' + email);
