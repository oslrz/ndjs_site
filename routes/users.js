const {Router} = require('express'),
    express = require("express"),
    router = Router(),
    e = require('express'),
    app = express(),
    { Client } = require('pg')



const jsonParser = express.json();

function splitString(stringToSplit, separator) {
    const arrayOfStrings = stringToSplit.split(separator);
    return(arrayOfStrings);
}



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
            let data = response.rows;
            let dat;
            for(let i = 0;i<data.length;i++){
                let products = data[i].products;
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
                        console.log(products)
                        for(let j = 0;j<products.length;j++){
                            let keys = splitString(products[j],':')
                            //console.log(keys)
                            let val = keys[1];
                            keys = keys[0];
                            // console.log(keys)
                            //for(let j = 0;j<objekt.length;j++){
                                //console.log("SELECT brand, model FROM "+objekt[j].table_name+" where code ='"+keys+"';");
                                // try{
                                //     dat = await  (client.query("SELECT brand, model FROM "+objekt[j].table_name+" where code ='"+keys+"';"))
                                    
                                // }
                                // catch ( err ) {
                                //     //console.log(err)
                                // }
                                // finally {
                                //     if(dat.rows[0] != undefined){
                                //         let newdat = dat.rows[0];
                                //         newdat['count'] = val;
                                //         string.push(newdat);
                                //         break;
                                //     }
                                // }
                            //} 
                        }
                        return(string);
                    }).then(value=>{
                        console.log(value);
                    })
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