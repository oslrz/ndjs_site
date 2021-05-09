const {Router, response} = require('express');
const { Client } = require('pg');
const router = Router();
const express = require("express"); 
const app = express(); 

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //Включно з мінімальним та виключаючи максимальне значення
  
}
let date_ob = new Date();
let date = ("0" + date_ob.getDate()).slice(-2);
//console.log('date', date)
let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
//console.log('month',month);
let year = date_ob.getFullYear();
//console.log('year',year);

const jsonParser = express.json();
/////////////////////////////////////////DATABASE
const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: '000000',
    port: 5432
});
client.connect();
///////////////////////////////////////////POST
router.post('/', jsonParser,(req,res) =>{
    let data = req.body.data;
    let adress = req.body.adress;
    if(req.body.login === undefined){
        // console.log("UPDATE pokypka SET VALUES('"+getRandomInt(100000,999999)+"', '"+data+"', '~', '"+adress+"');")
        client.query("INSERT INTO pokypka VALUES('"+getRandomInt(100000,999999)+"', '"+data+"', '~', '"+adress+"', '"+date+"/"+month+"/"+year+"');", (err, res) => {
            if (err) {
                console.error(err);
                return;
            }
            console.log('INSERTED')
        });
    }else{
        // console.log("UPDATE pokypka SET VALUES('"+getRandomInt(100000,999999)+"', '"+data+"', '"+req.body.login+"', '"+adress+"');")
        client.query("INSERT INTO pokypka VALUES('"+getRandomInt(100000,999999)+"', '"+data+"', '"+req.body.login+"', '"+adress+"', '"+date+"/"+month+"/"+year+"');", (err, res) => {
            if (err) {
                console.error(err);
                return;
            }
            console.log('INSERTED')
        });
        client.query("UPDATE basket SET products = '' WHERE  login='"+req.body.login+"';", (err,res) =>{
            if (err) {
                console.error(err);
                return;
            }
            console.log('YPDATED')
        })
    }
    
})


module.exports = router;