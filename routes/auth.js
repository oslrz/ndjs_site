const {Router} = require('express'),
    router = Router(),
    express = require("express"),  
    Reg = require('../models/pg_registr.js'),
    pg_Log = require('../models/pg_login.js'),
    jsonParser = express.json()


router.get('/', async (req,res)=>{
    res.render('../pages/auth/login.hbs',{
        title : 'Авторизація',
        isLogin: true
    })
})


router.post('/',jsonParser, (req,res) =>{
    const login = new pg_Log("password='"+req.body.password+"' and login='"+req.body.login+"'");
    let data ='';
    login.send().then(value =>{
        res.send(value);
    });
});


router.post('/registration',jsonParser,(req,res)=>{
    const vidpr = new Reg("'"+req.body.name+"', "+"'"+req.body.surname+"', "+"'"+req.body.phone_number+"', "+"'"+req.body.password+"', "+"'"+req.body.email+"'",req.body.adress);
    vidpr.consend();
})


router.post('/smsreg',jsonParser,(request,response)=>{
    function randomizer() {        //////// рандомний код
        let text = "";
        let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (let i = 0; i < 6; i++)
          text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
    }
    console.log(request.body.phone);
    let code = randomizer();
    let data = JSON.stringify({
        "recipients":[
            request.body.phone
        ],
        "sms":{
            "sender": "solyar.site",
            "text": code
        }
    })
    const https = require('https')

    const options = {
        hostname: 'api.turbosms.ua',
        port: 443,
        path: '/message/send.json',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic 0d80d2e4f1e40d4454e6f57706c76cddb2588c15'
        }
    }

    const req = https.request(options, res => {
        console.log(`statusCode: ${res.statusCode}`)

        res.on('data', data => {
            process.stdout.write(data)
        })
    })
    req.on('error', error => {
    console.error(error)
    })
    req.write(data);
    req.end();
    response.send(code)
})


module.exports = router;