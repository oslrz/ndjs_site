const { Client } = require('pg');
const express = require("express");  
const {Router} = require('express');
const router = Router();
const app = express(); 
const jsonParser = express.json();

router.post('/left_panel_sort', jsonParser, (res,req)=>{
    let table_name = res.body.table;
    const client = new Client({
        user: 'postgres',
        host: 'localhost',
        database: 'postgres',
        password: '000000',
        port: 5432,
    });
    client.connect().then(() => console.log('connected')).catch(err => console.error('connection error', err.stack)).then(()=>{
        return new Promise((resolve,reject)=>{
            const query = "SELECT sort FROM sort_list where tablet = '"+table_name+"'";
            client.query(query, (err, res1) => {
                if (err) {
                    console.error(err);
                    return;
                }
                let data = res1.rows[0].sort;
                resolve(data);
            });
        }).then(value =>{
            async function panel_rows(x){
                let data = x.split(",");
                let zapyt;
                let objects=[]
                for(let i =0; i<data.length; i++){
                    try{
                        zapyt = await (client.query("SELECT distinct "+data[i]+" FROM "+table_name+";"));
                    }
                    catch(err){
                        console.error(err);
                    }
                    finally{
                        objects+=JSON.stringify(zapyt.rows);
                    }
                }
                return(objects)
            }
            panel_rows(value).then(objects=>{
                req.send(objects)
            })
        })
        
    });

    
})


module.exports = router;