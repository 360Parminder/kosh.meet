const { createToken } = require('../kosh/src/lib/auth');
require('dotenv').config({ path: '../kosh/.env' });

const token = createToken('test-user', 'test-session');
console.log(token);
