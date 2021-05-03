const { Client } = require('pg');
const express = require("express");  
const {Router} = require('express');
const router = Router();
const app = express(); 

const jsonParser = express.json();
router.post('/', jsonParser, (req,res) =>{
    // if(req.body.login === undefined){
    //     console.log('undefined');
    // }else{
    //     console.log('noo')
    // }
    let id = '0';
    const client = new Client({
        user: 'postgres',
        host: 'localhost',
        database: 'postgres',
        password: '000000',
        port: 5432
    });
    client.connect();
    function select(){
        return new Promise((resolve, reject) => {
            console.log(req.body.login)
            client.query("select login from users where login='"+req.body.login+"';", (err, res) => {
                if (err) {
                    console.error(err);
                    return;
                }
                id = res.rows[0].login
                client.query("select products from basket where login='"+id+"';", (error, response) => {
                    if (error) {
                        console.error(error);
                        return;
                    }
                    resolve(response.rows);
                })
            })
            
        });
    };
    select().then(value =>{           ////////////////////////////////////////////////////////////////////////////////////////
        if(value[0] === undefined){
            client.query("insert into basket(login) values('"+id+"');", (err, res) => {
                if (err) {
                    console.error(err);
                    return;
                }
            })
        }
        return new Promise((resolve, reject) => {
            client.query("select products from basket where login='"+id+"';", (err, res) => {
                if (err) {
                    console.error(err);
                    return;
                }
                resolve(res.rows);
            })
        });
    }).then(value =>{     /////////////////////////////////////////////////////////////////////////////////////////////////////
         if(Boolean(value[0].products)){
            client.query("select products from basket where login='"+id+"';", (err, res) => {
                if (err) {
                    console.error(err);
                    return;
                }
                console.log(req.body.code)
                let obj = res.rows;
                obj = obj[0].products;
                obj = JSON.parse(obj);
                let chyslo = obj[req.body.code];
                if(obj[req.body.code]){
                    obj[req.body.code] = chyslo+1;
                }else{
                    obj[req.body.code] = 1
                }
                obj = JSON.stringify(obj);
                client.query("update basket set products='"+obj+"' where login='"+id+"';", (err, res) => {
                    if (err) {
                        console.error(err);
                        return;
                    }
                })
            })
        }else{
            let obj = req.body.code //код товару з сторінки сайта
            let data ={
                [obj] : 1
            }
            client.query("update basket set products='"+JSON.stringify(data)+"' where login='"+id+"';", (err, res) => {
                if (err) {
                    console.error(err);
                    return;
                }
            })
        }
    })
})

module.exports = router;