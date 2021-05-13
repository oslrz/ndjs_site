const {Router, response} = require('express'),
     { Client } = require('pg'),
     router = Router(),
     express = require("express"), 
     app = express()

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //Включно з мінімальним та виключаючи максимальне значення
  
}

let date_ob = new Date();
let date = ("0" + date_ob.getDate()).slice(-2);
let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
let year = date_ob.getFullYear();

const jsonParser = express.json();

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: '000000',
    port: 5432
});
client.connect()


router.post('/', jsonParser,(req,res) =>{

        let data = req.body.data;
        let adress = req.body.adress;
        if(req.body.login === undefined){
            client.query("INSERT INTO pokypka VALUES('"+getRandomInt(100000,999999)+"', '"+data+"', '~', '"+adress+"', '"+date+"/"+month+"/"+year+"');", (err, res) => {
                if (err) {
                    console.error(err);
                    return;
                }
                console.log('INSERTED')
            });
        }else{
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