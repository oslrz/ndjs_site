const {Router} = require('express');
const router = Router();

const path = require('path');
const bodyParser = require('body-parser');
const multer = require('multer');

const { Client } = require('pg');
const express = require("express");  
const { resolve } = require('path');
const { rejects } = require('assert');
const app = express(); 

const jsonParser = express.json();

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: '000000',
    port: 5432
});
client.connect();


router.get('/', (req,res) =>{
    res.render('admin', {

    });
})


router.post('/tabs',jsonParser,(res,req) =>{
    client.query("SELECT table_name FROM information_schema.tables WHERE table_schema NOT IN ('information_schema','pg_catalog');", (error, response) => {
        if (error) {
            console.error(error);
            return;
        }else{
            req.send(response.rows);
        }
    });
})

router.post('/jsontoxlsx',jsonParser,(res,req)=>{
    let data;
    let table_name = res.body.content;
    return new Promise((resolve,rejects) =>{
        client.query("SELECT * from "+table_name+";", (error, response) => {
            if (error) {
                console.error(error);
                return;
            }else{
                resolve(response.rows);
            }
        });
    }).then(value =>{
        data  = value;
        return new Promise((res,rej) =>{
            client.query("select column_name from information_schema.columns where table_name = '"+table_name+"';", (error, respo) => {
                if (error) {
                    console.error(error);
                    return;
                }else{
                    res(respo.rows);
                }
            });
        })
    }).then(value =>{
        //let headingColumnNames = value;
        const xl = require('excel4node');
        const wb = new xl.Workbook();
        const ws = wb.addWorksheet('Worksheet Name');

        // const data = [
        //  {
        //     "name":"Shadab Shaikh",
        //     "email":"shadab@gmail.com",
        //     "mobile":"1234567890"
        //  }
        // ]
        let headingColumnNames= [];
        for(let elem of value){
            headingColumnNames.push(elem.column_name);
        }
        // const headingColumnNames = [
        //     "Name",
        //     "Email",
        //     "Mobile",
        // ]
        // console.log(typeof headingColumnNames);
        // console.log('old', headingColumnNames);
        // console.log('------------------');
        // console.log(typeof headingColumnNames1);
        // console.log('new', headingColumnNames1)

        //Write Column Title in Excel file
        let headingColumnIndex = 1;
        headingColumnNames.forEach(heading => {
            ws.cell(1, headingColumnIndex++)
                .string(heading)
        });

        //Write Data in Excel file
        let rowIndex = 2;
        data.forEach( record=> {
            let columnIndex = 1;
            Object.keys(record ).forEach(columnName =>{
                ws.cell(rowIndex,columnIndex++)
                    .string(record [columnName])
            });
            rowIndex++;
        }); 
        wb.write('public\\table.xlsx');
    })
    req.send('done');
})


router.post('/polyatabl',jsonParser,(res,req) =>{
    client.query("SELECT column_name FROM information_schema.columns WHERE table_schema='public' and table_name='"+res.body.content+"'", (error, response) => {
        if (error) {
            console.error(error);
            return;
        }else{
            req.send(response.rows);
        }
    });
})


router.post('/delxlsx',jsonParser,(res,req) =>{
    var path = require('path');
    var mime = require('mime');
    var fs = require('fs');
    // var file = 'table.xlsx';

    // var filename = path.basename(file);
    // var mimetype = mime.lookup(file);

    // res.setHeader('Content-disposition', 'attachment; filename=' + filename);
    // res.setHeader('Content-type', mimetype);

    // var filestream = fs.createReadStream(file);
    // filestream.pipe(res);
    // fs.readFile(filePath1, function(error, data){
              
    //     if(error){
                  
    //         response.statusCode = 404;
    //         response.end("Resourse not found!");
    //     }   
    //     else{
    //         req.send(data);
    //     }
    // });
    var filePath = 'public\\table.xlsx'; 
    fs.unlinkSync(filePath);
})


router.post('/insert',jsonParser,(res,req) =>{
    let data = res.body;
    console.log(data)
    let table_name = '';
    let polya = '';
    let danni = '';
    for(let keys in data){
        if(keys == 'table'){
            table_name = data[keys];
        }else if(data[keys]=''){
            polya+=keys+",";
            danni+="'NULL', ";
        }else{
            polya+=keys+",";
            danni+="'"+data[keys]+"', ";
        }
    }
    polya = polya.slice(0,-1);
    danni = danni.slice(0,-2);
    // console.log("polya" , polya);
    // console.log("data", danni);
    client.query("insert into "+table_name+"("+polya+") values("+danni+")", (error, response) => {
        if (error) {
            console.error(error);
            return;
        }else{
            console.log('done!')
        }
    });
})



/////////////////////////////////////////////////////////////////// EXCEL FILES ////////////// 
router.use(express.static(__dirname));
router.use(multer({dest:"uploads"}).single("xlsx1"));
router.post("/xlsx",jsonParser, function (req, res, next) { 
    let spysok = JSON.parse(req.body.spysok);
    let tab_name = '';
    let poryadok = '';
    for(let keys in spysok){
        if(keys == "table"){
            tab_name = spysok[keys];
        }else{
            poryadok+=spysok[keys]+",";
        }
    }
    poryadok = poryadok.slice(0,poryadok.length-1);
    let filename = '';
    let filedata = req.file;
    filename = filedata.filename;
    if(!filedata){
        console.log("Помилка при загрузці");
    }
    else{
        console.log("Файл загружено");
    }
    var XLSX = require('xlsx');
    var workbook = XLSX.readFile("C:\\Users\\я\\Documents\\vsc\\NODEjS\\uploads\\"+filename);
    var sheet_name_list = workbook.SheetNames;
    sheet_name_list.forEach(function(y) {
        var worksheet = workbook.Sheets[y];
        var headers = {};
        var data = [];
        for(z in worksheet) {
            if(z[0] === '!') continue;
            //parse out the column, row, and value
            var tt = 0;
            for (var i = 0; i < z.length; i++) {
                if (!isNaN(z[i])) {
                    tt = i;
                    break;
                }
            };
            var col = z.substring(0,tt);
            var row = parseInt(z.substring(tt));
            var value = worksheet[z].v;

            //store header names
            if(row == 1 && value) {
                headers[col] = value;
                continue;
            }

            if(!data[row]) data[row]={};
            data[row][headers[col]] = value;
        }
    //drop those first two rows which are empty
        data.shift();
        data.shift();
        for(let i = 0;i<data.length;i++){
            let str='';
            console.log('data '+i);
            for(keys in data[i]){
                str+="'"+data[i][keys]+"', ";
            }
            str = str.slice(0, str.length-2);
            console.log("insert into "+tab_name+"("+poryadok+") values("+str+")");
            client.query("insert into "+tab_name+"("+poryadok+") values("+str+")", (error, response) => {
                if (error) {
                    console.error(error);
                    return;
                }else{
                    console.log('done!')
                }
            });
            str='';
        }
    });
});
/////////////////////////////////////////////////////////////////////////////////////////////

module.exports = router;