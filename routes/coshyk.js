const {Router, response} = require('express');
const { Client } = require('pg');
const router = Router();
const express = require("express"); 
const app = express(); 

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


router.get('/', (req,res) =>{
    res.render('busket',{
        title: "Кошик",
        isBusket:true
    });
})


router.post('/', jsonParser,(req,res) =>{
    let login = req.body.login;
    let basket = '';
    function getId(){
        let id = '0';
        return new Promise((vas) => {
            client.query("select login from users where login='"+login+"';", (err, res) => {
                if (err) {
                    console.error(err);
                    return;
                }
                vas(res.rows);
            });
        });
    }
    getId().then(value =>{
        return new Promise((resolve, reject) => {
            id = value[0].login;
            client.query("select products from basket where login='"+id+"';", (err, res) => {
                if (err) {
                    console.error(err);
                    return;
                }
                resolve(JSON.parse(res.rows[0].products)); //////////////////////////////////////тут починається срака SELECT table_name FROM information_schema.tables WHERE table_schema NOT IN ('information_schema','pg_catalog');
            })
        }).then(value=>{
            basket = value;
            return new Promise((resolve, reject) =>{
                client.query("SELECT table_name FROM information_schema.tables WHERE table_schema NOT IN ('information_schema','pg_catalog');", (error, response) => {
                    if (error) {
                        console.error(error);
                        return;
                    }
                    resolve(response.rows);
                });
            });
        }).then(async value=>{
            let objekt = value;  
            var dat;
            let string = [];
            console.log(basket)
            for(let keys in basket){
                console.log(basket[keys])
                for(let i = 0;i<objekt.length;i++){
                    try{
                        dat = await  (client.query("SELECT * FROM "+objekt[i].table_name+" where code ='"+keys+"';"))
                    }
                    catch ( err ) {
                        // handle the error
                    }
                    finally {
                        if(dat.rows[0] != undefined){
                            for(let i = 0;i<dat.rows.length;i++){
                                let photo = dat.rows[i]['img'];
                                photo = photo.split(',');
                                dat.rows[i]['img'] = photo[0];
                            }
                            let newdat = dat.rows[0];
                            newdat['count'] = basket[keys];
                            string.push(newdat); 
                            break;
                        }
                    }
                } 
            } 
            return(string);
        }).then(value =>{
            let data = value;
            // console.log(data)
            res.render('busket',{
                title: "Кошик",
                isBusket:true,
                data
            });
        }).then(()=>{
            client.end();
        })
    })
})
    

module.exports = router;