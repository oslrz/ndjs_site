const { Logger } = require('log4js');

const {Router} = require('express'),
    router = Router(),
    path = require('path'),
    bodyParser = require('body-parser'),
    multer = require('multer'),
    { Client } = require('pg'),
    express = require("express"),  
    { resolve } = require('path'),
    { rejects } = require('assert'),
    e = require('express'),
    app = express(),
    fs = require('fs'),
    fs1 = require ('fs.extra')



const jsonParser = express.json();
    


let photos_code;
let photos_table;
let storageConfig;



router.get('/', (req,res) =>{
    res.render('admin', {});
})

router.get('/admin_xlsx', (req,res)=>{
    res.render('admin_xlsx', {});
})

router.get('/admin_input', (req,res)=>{
    res.render('admin_input', {});
})

router.get('/admin_download_xlsx', (req,res)=>{
    res.render('admin_download_xlsx', {});
})

router.get('/pokypka', (req,res)=>{
    res.render('admin_pokypka', {});
})

router.get('/add_photo', (req,res) =>{
    res.render('add_photo', {});
})

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: '000000',
    port: 5432
});


client.connect()

function splitString(stringToSplit, separator) {
    const arrayOfStrings = stringToSplit.split(separator);
    return(arrayOfStrings);
} 





router.post('/add_by_code',jsonParser,(req,res) =>{
    photos_code = req.body.code;
    return new Promise((resolve,reject)=>{
        client.query(`SELECT table_name FROM information_schema.tables
        WHERE table_schema NOT IN ('information_schema','pg_catalog');`,(error,response)=>{
            resolve(response.rows);
        })
    }).then(async value=>{
        let zapyt;
        console.log(photos_code)
        for(let elem of value){
            //console.log('table', elem.table_name)
            try{
                zapyt = await (client.query("SELECT * FROM "+elem.table_name+" where code ='"+photos_code+"';"))
            }
            catch{
                console.error("Тут немає --> " + elem.table_name);//0673545745 igor 
            }
            finally{
                if(zapyt.rows[0]){  ////////////ПОПРАВИТИ ПЕРЕВІРКУ!
                    photos_table = elem.table_name;
                    return(zapyt.rows[0]);
                    
                }
            }
        }
    }).then(value =>{
        fs.mkdir('../public/files/'+photos_table, function(err){
            if(err){
                console.error(err)
                return;
            }
            console.log('papka1 was stvorena')
        })
        fs.mkdir(path.join(__dirname, '../public/files/'+photos_table+"/"+photos_code), function(err){
            if(err){
                console.error(err)
                return;
            }
            console.log('papka2 was stvorena')
            console.log('../public/files/'+photos_table+"/"+photos_code);
        })
        res.send(value)
    })
})

storageConfig = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, "uploads");
    },
    filename: (req, file, cb) =>{
        cb(null, file.originalname);
    }
});

router.use(multer({storage:storageConfig}).single("photos"));
router.use(express.static(path.join(__dirname, 'public')));


router.post("/add_files",jsonParser, function (req, res, next) { 
    let filedata = req.file;
    //console.log(filedata)
    console.log('table',photos_table);
    console.log('code',photos_code);


    fs.readdir('uploads', async function(err, items) {
        console.log(items);
        for (let i=0; i<items.length; i++) {
            console.log(items[i]);
            let oldPath = path.join(__dirname,'uploads/'+items[i])
            let newPath = path.join(__dirname,'/public/files/'+photos_table+'/'+photos_code+'/'+items[i])
            // try {
            //     await fs.copyFile(oldPath, newPath, constants.COPYFILE_EXCL);
            //     console.log('source.txt was copied to destination.txt');
            //   } catch {
            //     console.log('The file could not be copied');
            //     console.log('old',oldPath);
            //     console.log('new',newPath)
            //   }
            fs.unlink(oldPath)
        }
    });
    //console.log('papk', papk)
})



async function perebor(products,objekt){
    let string = '';
    let dat;
    for(let i = 0;i<products.length-1;i++){
        if(products[i] === undefined){
            continue;
        }else{
            let keys = splitString(products[i],':');
            let val = keys[1];
            keys = keys[0];
            //console.log(keys)
            for(let j = 0;j<objekt.length;j++){
                try{
                    dat = await  (client.query("SELECT * FROM "+objekt[j].table_name+" where code ='"+keys+"';"))
                }
                catch ( err ) {
                    // console.log(err)
                }
                finally {
                    if(dat.rows[0] != undefined){
                        string+=dat.rows[0].brand +" "+ dat.rows[0].model+",";
                        break;
                    }
                }
            }
            
        }
    }
    return(string);
}



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



router.post('/customer_pokypka', (req,res)=>{
        client.query("select name, username, login from users", (error, response) => {
            if (error) {
                console.error(error);
                return;
            }
            res.send(response.rows);
        });
    
})


router.post('/select_user',jsonParser,(req,res)=>{
        if(req.body.username == 'all'){
            client.query("select * from pokypka;", (error, response) => {
                if (error) {
                    console.error(error);
                    return;
                }
                data = response.rows;
            //console.log("Довжина", data.length)
            let dat;
            return new Promise((resolve, reject) =>{
                client.query("SELECT table_name FROM information_schema.tables WHERE table_schema NOT IN ('information_schema','pg_catalog');", (error, response) => {
                    if (error) {
                        console.error(error);
                        return;
                    }
                    resolve(response.rows);
                });
            }).then(async value =>{
                let objekt = value;  
                for(let i = 0;i<data.length;i++){
                    let products = data[i].products;
                    products = splitString(products,',')
                    try{
                        data[i].products =await perebor(products,objekt);
                    }
                    catch(err){
                        console.error(err)
                    }
                    finally{
                        //console.log(data[i])
                    }
                }
            }).then(()=>{
                let sender = JSON.stringify(data);
                res.send(sender);
            })
            });
        }else{
            client.query("select * from pokypka where client_id='"+req.body.username+"';", (error, response) => {
                if (error) {
                    console.error(error);
                    return;
                }
                data = response.rows;
            //console.log("Довжина", data.length)
            let dat;
            return new Promise((resolve, reject) =>{
                client.query("SELECT table_name FROM information_schema.tables WHERE table_schema NOT IN ('information_schema','pg_catalog');", (error, response) => {
                    if (error) {
                        console.error(error);
                        return;
                    }
                    resolve(response.rows);
                });
            }).then(async value =>{
                let objekt = value;  
                for(let i = 0;i<data.length;i++){
                    let products = data[i].products;
                    products = splitString(products,',')
                    try{
                        data[i].products =await perebor(products,objekt);
                    }
                    catch(err){
                        console.error(err)
                    }
                    finally{
                        //console.log(data[i])
                    }
                }
            }).then(()=>{
                let sender = JSON.stringify(data);
                res.send(sender);
            })
            });
        }
})



async function perebor_with_count(products,objekt){
    let string = '';
    let dat;
    products = splitString(products,',')
    for(let i = 0;i<products.length-1;i++){
        if(products[i] === undefined){
            continue;
        }else{
            let keys = splitString(products[i],':');
            //console.log(keys)
            let val = keys[1];
            keys = keys[0];
            //console.log(keys)
            for(let j = 0;j<objekt.length;j++){
                try{
                    dat = await  (client.query("SELECT * FROM "+objekt[j].table_name+" where code ='"+keys+"';"))
                }
                catch ( err ) {
                    // console.log(err)
                }
                finally {
                    if(dat.rows[0] != undefined){
                        string+=dat.rows[0].brand +" "+ dat.rows[0].model+":"+val+":"+dat.rows[0].price+", ";
                        break;
                    }
                }
            }
            
        }
    }
    return(string);
}

router.post('/print_order',jsonParser, (req,res)=>{
    return new Promise((resolve,rejects)=>{
        client.query("select * from pokypka where id_pokypku='"+req.body.id_pokypku+"';", (error,response)=>{
            if(error){
                console.log(error)
                return;
            }
            resolve(response.rows);
        })
    }).then(value=>{
        let products = value;
        //console.log(products)
        return new Promise((resolve, reject) =>{
            client.query("SELECT table_name FROM information_schema.tables WHERE table_schema NOT IN ('information_schema','pg_catalog');", (error, response) => {
                if (error) {
                    console.error(error);
                    return;
                }
                resolve(response.rows);
            });
        }).then(async value=>{
            try{
                products[0].products = await perebor_with_count(products[0].products,value);
            }
            catch(err){
                console.log(err)
            }
            finally{
                //console.log('doce')
            }
        }).then(()=>{
            //console.log(products);
            return new Promise((resol, rejec)=>{
                client.query("select * from users where login='"+products[0].client_id+"';", (error,response)=>{
                    if(error){
                        console.log(error)
                        return;
                    }
                    resol(response.rows);
                })
            }).then(value=>{
                products[0].client_id = value[0].name + " " + value[0].username;
                res.send(products);
            })
        })
    })
})

router.post('/remove_to_archive',jsonParser, (req,res)=>{
    let data = req.body.id;
    return new Promise((resolve,rejects)=>{
        client.query("select * from pokypka where id_pokypku = '"+data+"';",(err,ress)=>{
            if(err){
                console.log(err);
                return;
            }
            resolve(ress.rows)
        })
    }).then(value=>{
        let data_from_pokypku = value;
        return new Promise((resolv,rejects)=>{
            client.query("delete from pokypka where id_pokypku = '"+data+"';",(err,resspon)=>{
                if(err){
                    console.log(err);
                    return;
                }
                resolv(resspon)
            })
        }).then(()=>{
            console.log(data_from_pokypku)
            console.log(data_from_pokypku[0].id_pokypku)
            console.log(data_from_pokypku[0].products)
            console.log(data_from_pokypku[0].client_id)
            console.log(data_from_pokypku[0].adress)
            console.log(data_from_pokypku[0].date)

            client.query("insert into archive values('"+data_from_pokypku[0].id_pokypku+"', '"+data_from_pokypku[0].products+"', '"+data_from_pokypku[0].client_id+"', '"+data_from_pokypku[0].adress+"', '"+data_from_pokypku[0].date+"')", (err,resp)=>{
                if(err){
                    console.log(err);
                    return;
                }
                console.log(resp.rows);
            })
        })
    })
})


module.exports = router;