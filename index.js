const express = require('express');
const cors = require('cors');
const mysqlConnection = require('./mysqlConnect');

const inventory = require('./app/main');
const categories = require('./app/category');
const location = require('./app/location');

const config = require('./configuration');
const port = 7000;

const app = express();
let connect;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.use('/inventory', inventory);
app.use('/categories', categories);
app.use('/location', location);

const run = async () => {
  await mysqlConnection.connect();

    app.listen(port, () => {
        console.log(`Server started on ${port} port!`)
    });

    process.on('exit', () => mysqlConnection.disconnect());
};

run().catch(e => console.log(e));