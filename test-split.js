
const fs = require('fs');
const path = require('path');

const sqlPath = path.join(__dirname, 'server/database/add-test-activity.sql');
const sqlContent = fs.readFileSync(sqlPath, 'utf8');

console.log('--- CONTENT ---');
console.log(sqlContent);
console.log('--- END CONTENT ---');

const statements = sqlContent
    .split(';')
    .map(stmt => stmt.trim())
    .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

console.log('--- STATEMENTS ---');
console.log(statements);
console.log('--- END STATEMENTS ---');
