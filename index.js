// Require //////////////////////////////////////////
const express = require("express");                //                 
const exphbs = require("express-handlebars");      //         
const app = express();                             //         
const homeRoutes = require('./routes/home');       //         
const regRoutes = require('./routes/auth');        //     
const salesRoutes = require('./routes/sales');     //   
const aboutRoutes = require('./routes/about');     //
const testRoutes = require('./routes/test');       //
const pageRouter = require('./routes/products');   //
const ff = require('./public/authorization');      //
const busket = require('./models/busket');         //
const coshyk = require('./routes/coshyk');
const coshyk_v2 = require('./routes/routfornologinbskt');       //
const plsusminusdel = require('./models/plusminusdel');
const pokypka = require('./routes/pokypka');
const admin = require('./routes/admin');
const sort = require('./models/sorting');
/////////////////////////////////////////////////////

const fs = require('fs');
const path = require('path');


// Налаштування Handlebars /////////
const hbs = exphbs.create({       //
    defaultLayout:"main",         //
    extname:"hbs"                 //   
});                               //            
app.engine("hbs",hbs.engine);     //
app.set("view engine", "hbs");    //
app.set("views", "pages");        //
app.use(express.static('public'));//
app.use(express.urlencoded({extended: true})); //
////////////////////////////////////


// Routes ////////////////////////////
app.use('/',homeRoutes);            //
app.use('/auth',regRoutes);         //
app.use('/sales',salesRoutes);      //
app.use('/about',aboutRoutes);      // 
app.use('/test',testRoutes);        //
app.use('/products',pageRouter);    //
//////////////////////////////////////
app.use('/buy_bttn',busket);
app.use('/vlad',ff);
app.use('/bskt',coshyk);
app.use('/noLoginBskt',coshyk_v2);
app.use('/plnmdel', plsusminusdel);
app.use('/pokypka', pokypka);
app.use('/admin', admin);
app.use('/sorting',sort);

app.get("/test", (req,res) =>{
    fs.readFile(
        path.join(__dirname,'pages','test.html'),
        'utf-8',
        (err, content) =>{
            if(err){
                throw err
            }
            res.end(content);
        }
        );
});

app.get('/public/table.xlsx',function(req,res){
    res.download('C:\\Users\\я\\Documents\\vsc\\NODEjS\\public\\table.xlsx','table.xlsx');
})

const jsonParser = express.json();
const { Client } = require('pg');

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`server is runing on port ${PORT}`);
});

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

