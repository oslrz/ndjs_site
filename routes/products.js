const {Router} = require('express'),
    express = require("express"),  
    router = Router(),
    { Client } = require('pg'),
    app = express(), 
    jsonParser = express.json()


var data = '';

router.get('/:id/:val', (req,res) =>{
    // console.log(req.params.id)
    // console.log(req.params.val)
    let photo;
    const client = new Client({
        user: 'postgres',
        host: 'localhost',
        database: 'postgres',
        password: '000000',
        port: 5432,
    });
    client.connect().then(()=>{
        return new Promise((resolve,rejected)=>{
            client.query("select * from "+req.params.id+" where code='"+req.params.val+"';", (err, res) => {
                if (err) {
                    console.error(err);
                    return;
                }
                photo = res.rows[0]['img'];
                photo = photo.split(',');
                resolve(res.rows);
            })
        })
    }).then(value =>{
        let data = value;
        console.log(data)
        res.render('product_page', {
            data,
            photo
        })
    }).then(()=>{
        client.end();
    })

})

router.get('/:id', (req,res) =>{
    const client = new Client({
        user: 'postgres',
        host: 'localhost',
        database: 'postgres',
        password: '000000',
        port: 5432,
    });
    client.connect();
    return new Promise((resolve,rejected)=>{
        const query = "SELECT * FROM "+req.params.id;
        client.query(query, (err, res) => {
            if (err) {
                console.error(err);
                return;
            }
            //console.log(res.rows.length);


            for(let i = 0;i<res.rows.length;i++){
                let photo = res.rows[i]['img'];
                photo = photo.split(',');
                res.rows[i]['img'] = photo[0];
            }

            resolve(res.rows);
            client.end();
        })
    }).then(value =>{
        data = value;
        res.render('page', {
            title:req.params.id,
            isTovary:true,
            data
        });
    }).then(()=>{
        client.end();
    })
})

router.post('/table_sort',jsonParser, (res,req)=>{
    console.log('teeeeext',res.body.table);
})



module.exports = router; 