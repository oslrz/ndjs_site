const { resolve } = require("path");

const express = require("express"),                    
    exphbs = require("express-handlebars"),             
    app = express(),                                     
    homeRoutes = require('./routes/home'),                
    regRoutes = require('./routes/auth'),            
    salesRoutes = require('./routes/sales'),       
    aboutRoutes = require('./routes/about'),           
    pageRouter = require('./routes/products'),   
    ff = require('./public/authorization');      
    busket = require('./models/busket'),         
    coshyk = require('./routes/coshyk'),
    coshyk_v2 = require('./routes/routfornologinbskt'),       
    plsusminusdel = require('./models/plusminusdel'),
    pokypka = require('./routes/pokypka'),
    admin = require('./routes/admin'),
    sort = require('./models/sorting'),
    fs = require('fs'),
    path = require('path'),
    { Client } = require('pg'),
    usersRouter = require('./routes/users'),
    log4js = require("log4js")
    
    
var logger = log4js.getLogger();
logger.level = "debug";

    

const hbs = exphbs.create({       
    defaultLayout:"main",         
    extname:"hbs"                  
});                                         
app.engine("hbs",hbs.engine);     
app.set("view engine", "hbs");    
app.set("views", "pages");        
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));



app.use('/',homeRoutes);            
app.use('/auth',regRoutes);         
app.use('/sales',salesRoutes);      
app.use('/about',aboutRoutes);             
app.use('/products',pageRouter);    
app.use('/buy_bttn',busket);
app.use('/vlad',ff);
app.use('/bskt',coshyk);
app.use('/noLoginBskt',coshyk_v2);
app.use('/plnmdel', plsusminusdel);
app.use('/pokypka', pokypka);
app.use('/admin', admin);
app.use('/sorting',sort);
app.use('/user', usersRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    logger.info(`server is runing on port ${PORT}`);
});



app.get('/public/table.xlsx',function(req,res){
    res.download('C:\\Users\\я\\Documents\\vsc\\NODEjS\\public\\table.xlsx','table.xlsx');
})

const jsonParser = express.json();

app.post("/makelogin", jsonParser, function (request, response) {
    const client = new Client({
        user: 'postgres',
        host: 'localhost',
        database: 'postgres',
        password: '000000',
        port: 5432
    });
    client.connect();
    
    let data = "login = '"+request.body.login+"' and password = '"+request.body.password+"';";
    async function bo(){
        return new Promise((resolve, reject) => {
            console.log(data)
            client.query("SELECT name, username from users WHERE "+data+";", (err, res) => {
                if (err) {
                    console.error(err);
                    return;
                }
                resolve(res.rows)
            })
        });
    }
    bo().then(value =>{
        if(!request.body) return response.sendStatus(400);
        response.json(value); // отправляем пришедший ответ обратно
    })
});
app.post('/table_names',(req,res)=>{
    const client = new Client({
        user: 'postgres',
        host: 'localhost',
        database: 'postgres',
        password: '000000',
        port: 5432,
    })
    client.connect().then(()=>{
        return new Promise((resolve,reject)=>{
            client.query(`SELECT * FROM table_names`, (error,response)=>{
                if(error){
                    console.error(error);
                    return;
                }
                resolve(response.rows);
            })
        }).then(value => {
            // console.log(value)
            res.send(value);
        })
    })
})

app.post('/prod_photo',jsonParser,(req,res) =>{
    const client = new Client({
        user: 'postgres',
        host: 'localhost',
        database: 'postgres',
        password: '000000',
        port: 5432,
    })
    client.connect().then(()=>{
        return new Promise((resolve,reject)=>{
            client.query("SELECT img from "+req.body.table_name+" WHERE code= "+req.body.code+";", (error, response) => {
                if (error) {
                    console.error(error);
                    return;
                }
                resolve(response.rows)
            })
        }).then(value=>{
            let data = value[0]['img'];
            res.send(data)
        })
    })
})

app.get('/c1xlsx_get',(req,res)=>{
    res.send('geeeet');
})
app.post('/c1xlsx_post',(req,res)=>{
    res.send('pooooost');
})
// fs.mkdir('./public/files/mobile_phones/',(err)=>{
//        if(err){
//            console.error(err);
//         return;
//      }
// })


// async function make_papka(elem){
//     return new Promise((reso, reje)=>{
//         client.query(`SELECT code from `+elem.name, (error, response) => {
//             if (error) {
//                 logger.error(error);
//                 return;
//             }
//             reso(response.rows);
//         })
//     }).then(async value=>{
//         let all_papka = [];
//         await fs.readdir("./public/files/"+elem.name, (err, files) => {
//             files.forEach(file =>{
//                 all_papka.push(file);
//             });
//         })
//         console.log(all_papka);
//         for(let ell of value){
//             //console.log(ell.code)
//             if(!all_papka.includes(ell.code)){
//                 fs.mkdir('./public/files/'+elem.name+'/'+ell.code,(err)=>{
//                     if(err){
//                         console.error(err);
//                         return;
//                     }
//                 })
//             }
//         }
//     })
// }


const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: '000000',
    port: 5432
});
client.connect().then(()=>{
    return new Promise((resolve,reject) =>{
        client.query(`SELECT name from table_names;`, (error, response) => {
            if (error) {
                console.error(error);
                return;
            }
            resolve(response.rows)
        })
    }).then(value=>{
        let data = value;
        return new Promise(async (resolv,reject)=>{
            let all_files = [];
            await fs.readdir("./public/files", (err, files) => {
                files.forEach(file =>{
                    all_files.push(file);
                });
                resolv(all_files);
            })
        }).then(value=>{
            //console.log(value)
            for(let elem of data){
                //console.log(elem.name)
                if(!value.includes(elem.name)){
                    fs.mkdir('./public/files/'+elem.name,(err)=>{
                        if(err){
                            console.error(err);
                            return;
                        }
                    })
                }
                // console.log(elem.name)
                // make_papka(elem);
            }
        })
    })
})
















///////////////////////////////////////////////sms
// let data = JSON.stringify({
//     "recipients":[
//         "380973361871"
//     ],
//     "sms":{
//         "sender": "solyar.site",
//         "text": "text"
//     }
// })
// console.log('index.js', data)

// const https = require('https')

// const options = {
//   hostname: 'api.turbosms.ua',
//   port: 443,
//   path: '/message/send.json',
//   method: 'POST',
//   headers: {
//     'Content-Type': 'application/json',
//     'Authorization': 'Basic 0d80d2e4f1e40d4454e6f57706c76cddb2588c15'
//   }
// }

// const req = https.request(options, res => {
//   console.log(`statusCode: ${res.statusCode}`)

//   res.on('data', data => {
//     process.stdout.write(data)
//   })
// })

// req.on('error', error => {
//   console.error(error)
// })

// req.write(data)
// req.end()

