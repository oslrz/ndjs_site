const {Router} = require('express');
const { Client } = require('pg');
const express = require("express"); 
const router = Router();
const app = express(); 

const jsonParser = express.json();


function splitString(stringToSplit, separator) {
    const arrayOfStrings = stringToSplit.split(separator);
    return(arrayOfStrings);
}
router.post('/',jsonParser, (req,res) =>{
    const client = new Client({
        user: 'postgres',
        host: 'localhost',
        database: 'postgres',
        password: '000000',
        port: 5432
    });
    client.connect().then(()=>{
        if(req.body.data!=undefined){
            let inf = req.body.data;
        inf = inf.substring(0, inf.length - 1);
        let data = splitString(inf,",");
        function main(){
            return new Promise((resolve, reject) =>{
                client.query("SELECT table_name FROM information_schema.tables WHERE table_schema NOT IN ('information_schema','pg_catalog');", (error, response) => {
                    if (error) {
                        console.error(error);
                        return;
                    }
                    resolve(response.rows);
                });
            });
        }
        main().then(async value=>{
            let objekt = value;  
            let string = [];
            for(let i = 0;i<data.length;i++){
                let keys = splitString(data[i],':');
                let val = keys[1];
                keys = keys[0];
                // console.log(keys)
                for(let j = 0;j<objekt.length;j++){
                    try{
                        dat = await  (client.query("SELECT * FROM "+objekt[j].table_name+" where code ='"+keys+"';"))
                    }
                    catch ( err ) {
                        // console.log(err)
                    }
                    finally {
                        if(dat.rows[0] != undefined){
                            let newdat = dat.rows[0];
                            newdat['count'] = val;
                            string.push(newdat);
                            break;
                        }
                    }
                } 
            }
            return(string);
        }).then(value=>{
            let data = value;
            console.log(data)
            res.render('busket',{
                title: "Кошик",
                isBusket:true,
                data
            });
        }).then(()=>{
            client.end();
        })
        }
    })
    
});


module.exports = router;