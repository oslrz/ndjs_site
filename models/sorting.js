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
                    if(data[i] == 'price'){
                        try{
                            zapyt = await (client.query("SELECT max(price) FROM "+table_name+";"));
                        }
                        catch(err){
                            console.error(err);
                        }
                        finally{
                            objects+=JSON.stringify(zapyt.rows);
                        }
                        try{
                            zapyt = await (client.query("SELECT min(price) FROM "+table_name+";"));
                        }
                        catch(err){
                            console.error(err);
                        }
                        finally{
                            objects+=JSON.stringify(zapyt.rows);
                        }
                    }else{
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
                    
                }
                return(objects)
            }
            panel_rows(value).then(objects=>{
                req.send(objects)
            })
        })
        
    });

    
})
router.post('/sort',jsonParser, (req,res)=>{
    console.log(req.body)
    let table_name = req.body.table;
    let sort_str = '';
    for(let keys in req.body){
        if(keys!='table' && keys!='min' && keys!='max'){
            let data = req.body[keys];
            data = data.split(',');
            if(data.length > 1){
                for(let i = 0;i<data.length;i++){
                    if(i+1 == data.length){
                        sort_str+= keys+" = '"+data[i]+"' and ";
                    }else{
                        sort_str+= keys+" = '"+data[i]+"' or ";
                    }
                }
            }else{
                sort_str+=keys+" = '"+data[0]+"' and ";
            }
        }
    }
    sort_str = sort_str.slice(0,sort_str.length-5);
    if(sort_str.length == 0){
        sort_str+= "price>= '"+parseInt(req.body['min'])+"' and price<= '"+parseInt(req.body['max'])+"'";
    }else{
        sort_str+= " and price>= '"+parseInt(req.body['min'])+"' and price<= '"+parseInt(req.body['max'])+"'";
    }
    console.log(sort_str);
    const client = new Client({
        user: 'postgres',
        host: 'localhost',
        database: 'postgres',
        password: '000000',
        port: 5432,
    });
    client.connect().then(()=>{
        return new Promise((resolve,reject)=>{
            const query = "SELECT * FROM "+table_name+" WHERE "+sort_str;
            console.log(query);
            client.query(query, (error, response) => {
                if (error) {
                    console.error(error);
                    return;
                }
                for(let i = 0;i<response.rows.length;i++){
                    let photo = response.rows[i]['img'];
                    photo = photo.split(',');
                    response.rows[i]['img'] = photo[0];
                }
                resolve(response.rows);
            });
        })
    }).then(value=>{
        const data = value;
        let content = '';
        if(data.length == 0){
            content+= "за вашими фільтрами нічого не знайдено";
        }else{
            for(let i = 0;i<data.length;i++){
                content+='<div class="card" style="width: 16rem;"><img src="'+data[i].img+'" class="card-img-top" alt="..." style="align-self: center;"><div class="card-body"><h5 class="card-title">'+data[i].brand+'</h5><p class="card-text">'+data[i].model+'</p><p>ціна: '+data[i].price+'</p><button class="btn btn-primary" code="'+data[i].code+'" id="'+data[i].code+'" onclick="bo('+data[i].code+')">купити</button></div></div>';
            }
        }
        res.send(content)
    })
})


module.exports = router;