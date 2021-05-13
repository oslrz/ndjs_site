const { Client } = require('pg'),
    express = require("express"),  
    {Router} = require('express'),
    router = Router(),
    app = express()


const jsonParser = express.json();

function splitString(stringToSplit, separator) {
    const arrayOfStrings = stringToSplit.split(separator);
    return(arrayOfStrings);
}
const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: '000000',
    port: 5432
});
client.connect()
router.post('/', jsonParser, (req,res) =>{
    
        let data = splitString(req.body.data,":");
        let login = req.body.login;
        let id = '';
        function select(){
            return new Promise((resolve, reject) => {
                client.query("select id from users where login='"+login+"';", (err, res) => {
                    if (err) {
                        console.error(err);
                        return;
                    }
                    id = res.rows[0].id
                    client.query("select products from basket where id='"+id+"';", (error, response) => {
                        if (error) {
                            console.error(error);
                            return;
                        }
                        resolve(response.rows);
                    })
                })

            });
        };
        if(data[0] == "plus"){
            select().then(value=>{
                let products = value[0].products;
                products = JSON.parse(products)
                // console.log(products)
                for(let keys in products){
                    if(keys == data[1]){
                        let chyslo = products[keys];
                        products[keys] = chyslo+1;
                    }
                }
                products = JSON.stringify(products);
                client.query("update basket set products = '"+products+"' where id='"+id+"';", (error, response) => {
                    if (error) {
                        console.error(error);
                        return;
                    }
                    //console.log(response);
                })
            })
        }else if(data[0] == "minus"){
            select().then(value=>{
            let products = value[0].products;
            products = JSON.parse(products)
            // console.log(products)
            for(let keys in products){
                if(keys == data[1]){
                    let chyslo = products[keys];
                    if(chyslo == 1 || chyslo == '1'){
                        delete products[keys];
                    }else{
                        products[keys] = chyslo-1;
                    }
                }
            }
            products = JSON.stringify(products);
            // console.log(products);
            client.query("update basket set products = '"+products+"' where id='"+id+"';", (error, response) => {
                if (error) {
                    console.error(error);
                    return;
                }
                //console.log(response);
            })
        })
        }else if(data[0] == "delete"){
            select().then(value=>{
                let products = value[0].products;
                products = JSON.parse(products)
                // console.log(products)
                for(let keys in products){
                    if(keys == data[1]){
                        delete products[keys];
                    }
                }
                products = JSON.stringify(products);
                // console.log(products);
                client.query("update basket set products = '"+products+"' where id='"+id+"';", (error, response) => {
                    if (error) {
                        console.error(error);
                        return;
                    }
                    //console.log(response);
                })
            })
        }
});
module.exports = router;