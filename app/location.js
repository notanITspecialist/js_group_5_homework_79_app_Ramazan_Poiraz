const express = require('express');
const path = require('path');
const mysqlConnection = require('../mysqlConnect');

const router = express.Router();

router.get('/',async (req, res) => {
    const data = await mysqlConnection.appealConnection().query(`
     select 
        id,
        name
     from location
    `);
    res.send(data);
});

router.get('/:id',async (req, res) => {
    const data = await mysqlConnection.appealConnection().query(`
    select
      *
    from location where id = ?
    `, req.params.id);
    data.length > 0 ? res.send(data[0]) : res.status(404).send({error: 'This element not found'});
});

router.post('/', async (req, res) => {
    if(!req.body.name){
        res.status(404).send({error: 'Fields not filled'});
        return
    }

    const data = await mysqlConnection.appealConnection().query(`
    insert into location (name, description) values`+`
    (?,?);`
        ,[req.body.name, req.body.description]);

    res.send({id: data.insertId , name: req.body.name, description: req.body.description})
});

router.delete('/:id',async (req, res) => {
    const data = await mysqlConnection.appealConnection().query(`
    delete from location where id = ` + req.params.id).catch(e => {
        if(e.code === 'ER_ROW_IS_REFERENCED_'+req.params.id){
            res.status(404).send({error: `У елемента с id ${req.params.id} есть связанные с ним таблицы`})
        }
    });
    res.send({delete: `Element with id ${req.params.id} deleted`})
});

router.put('/:id',async (req, res) => {
    const data = await mysqlConnection.appealConnection().query(`
    update location
    set
    name = ?,
    description = ?
    where id = ?
    `, [req.body.name, req.body.description, req.params.id]);
    res.send({id: req.params.id , name: req.body.name, description: req.body.description})
});

module.exports = router;