const path = require('path');
const rootPath = __dirname;

module.exports = {
    rootPath,
    uploadPath: path.join(rootPath, 'public', 'uploads'),
    mysqlOption: {
        host: 'localhost',
        user: 'ramazan',
        password: '11122001',
        database: 'inventory'
    }
};