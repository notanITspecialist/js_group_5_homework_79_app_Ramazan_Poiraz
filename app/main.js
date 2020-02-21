const express = require('express');
const path = require('path');
const mysqlConnection = require('../mysqlConnect');

const multer = require('multer');
const config = require('../configuration');
const nanoid = require('nanoid');

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cd) => {
        cd(null, config.uploadPath)
    },
    filename: (req, file, cd) => {
        cd(null, nanoid() + path.extname(file.originalname));
    }
});

const upload = multer({storage});

router.get('/',async (req, res) => {
    const data = await mysqlConnection.appealConnection().query(`
     select 
        id,
        category_id,
        location_id,
        name
     from inventory
    `);
    res.send(data);
});

router.get('/:id',async (req, res) => {
    const data = await mysqlConnection.appealConnection().query(`
    select
      *
    from inventory where id = ?
    `, req.params.id);
    data.length > 0 ? res.send(data[0]) : res.status(404).send({error: 'This element not found'});
});

router.post('/', upload.single('image'), async (req, res) => {
    if(!req.body.category_id || !req.body.location_id || !req.body.name){
        res.status(404).send({error: 'Fields not filled'})
        return
    }
    if(req.file){
        req.body.image = req.file.filename;
    }
    const date = new Date().toISOString();
    const reqData = {
        category_id: req.body.category_id,
        location_id: req.body.location_id,
        name: req.body.name,
        description: req.body.description,
        image: req.body.image,
        date: date,
    };
    const data = await mysqlConnection.appealConnection().query(`
    insert into inventory (category_id, location_id, name, description, image, date) values`+`
    (?,?,?,?,?,?);`
        ,[reqData.category_id ,reqData.location_id ,reqData.name ,reqData.description, reqData.image,reqData.date] );

    res.send({id: data.insertId ,...reqData})
});

router.delete('/:id',async (req, res) => {
    const data = await mysqlConnection.appealConnection().query(`delete from inventory where id = ` + req.params.id);
    res.send({delete: `Element with id ${req.params.id} deleted`})
});

router.put('/:id',async (req, res) => {
    const date = new Date().toISOString();
    const reqData = {
        category_id: req.body.category_id,
        location_id: req.body.location_id,
        name: req.body.name,
        description: req.body.description,
        date: date,
    };
    const keys = Object.keys(reqData);
    const data = await mysqlConnection.appealConnection().query(`
    update inventory
    set
    category_id = ?,
    location_id = ?,
    name = ?,
    description = ?,
    date = ?
    where id = ?
    `, [...keys.map(e => reqData[e]), req.params.id]);
    res.send({id: req.params.id ,...reqData})
});

module.exports = router;