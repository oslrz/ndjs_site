const {Router} = require('express'),
    express = require("express"),
    router = Router(),
    e = require('express'),
    app = express(),
    { Client } = require('pg')


const jsonParser = express.json();

router.get('/:id', (req,res) =>{
    const client = new Client({
        user: 'postgres',
        host: 'localhost',
        database: 'postgres',
        password: '000000',
        port: 5432,
    });
    client.connect().then(()=>{
        return new Promise((resolve,reject)=>{
            client.query("select * from users where login = '"+req.params.id+"';", (err,respons) =>{
                if (err) {
                    console.error(err);
                    return;
                }
                let data  = respons.rows;
                resolve(data);
            })
        }).then(value =>{
            data = value;
            res.render('user', {
                title:"Клієнт",
                data
            });
            client.end()
        })
        
    })
})


router.post('/select_user/:id',jsonParser,(req,res)=>{
    const client = new Client({
        user: 'postgres',
        host: 'localhost',
        database: 'postgres',
        password: '000000',
        port: 5432,
    });
    client.connect().then(()=>{
        client.query("select * from pokypka where client_id='"+req.params.id+"';", (error, response) => {
            if (error) {
                console.error(error);
                return;
            }
            res.send(response.rows);
        });
    })
})


router.post('/change_data',jsonParser,(req,res)=>{
    let data  = req.body
    console.log(data)
})

module.exports = router;