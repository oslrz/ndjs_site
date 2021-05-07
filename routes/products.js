const {Router} = require('express');
const express = require("express");  
const router = Router();
const { Client } = require('pg');
const app = express(); 
const jsonParser = express.json();


var data = '';
const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: '000000',
    port: 5432,
});
client.connect().then(() => console.log('connected')).catch(err => console.error('connection error', err.stack));
const query = "SELECT * FROM mobile_phones;";
client.query(query, (err, res) => {
    if (err) {
        console.error(err);
        return;
    }
    // console.log('успіх!');
    data = res.rows;
    client.end()
});
router.get('/', (req,res) =>{
    res.render('page', {
        title:"Товари",
        isTovary:true
    });
})
router.get('/:id/:val', (req,res) =>{
    // console.log(req.params.id)
    // console.log(req.params.val)
    const client = new Client({
        user: 'postgres',
        host: 'localhost',
        database: 'postgres',
        password: '000000',
        port: 5432,
    });
    client.connect().then(()=>{
        return new Promise((resolve,rejected)=>{
            client.query("select * from "+req.params.id+" where code='"+req.params.val+"';", (err, res) => {
                if (err) {
                    console.error(err);
                    return;
                }
                resolve(res.rows);
            })
        })
    }).then(value =>{
        let data = value;
        console.log(data)
        res.render('product_page', {
            data
        })
    })

})

router.get('/:id', (req,res) =>{
    const client = new Client({
        user: 'postgres',
        host: 'localhost',
        database: 'postgres',
        password: '000000',
        port: 5432,
    });
    client.connect().then(() => console.log('connected')).catch(err => console.error('connection error', err.stack));
    return new Promise((resolve,rejected)=>{
        const query = "SELECT * FROM "+req.params.id;
        client.query(query, (err, res) => {
            if (err) {
                console.error(err);
                return;
            }
            resolve(res.rows);
            client.end();
        })
    }).then(value =>{
        data = value;
        res.render('page', {
            title:req.params.id,
            isTovary:true,
            data
        });
    })
})

router.post('/table_sort',jsonParser, (res,req)=>{
    console.log('teeeeext',res.body.table);
})


module.exports = router; 