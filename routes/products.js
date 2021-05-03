const {Router} = require('express');
const router = Router();
const { Client } = require('pg');
var data = '';
const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: '000000',
    port: 5432,
});
client.connect().then(() => console.log('connected')).catch(err => console.error('connection error', err.stack));
const query = "SELECT * FROM mobile_phones;";
client.query(query, (err, res) => {
    if (err) {
        console.error(err);
        return;
    }
    // console.log('успіх!');
    data = res.rows;
    client.end()
});
router.get('/', (req,res) =>{
    res.render('page', {
        title:"Товари",
        isTovary:true
    });
})
router.get('/:id', (req,res) =>{
    const client = new Client({
        user: 'postgres',
        host: 'localhost',
        database: 'postgres',
        password: '000000',
        port: 5432,
    });
    console.log(req.params.id)
    client.connect().then(() => console.log('connected')).catch(err => console.error('connection error', err.stack));
    return new Promise((resolve,rejected)=>{
        const query = "SELECT * FROM "+req.params.id;
        client.query(query, (err, res) => {
            if (err) {
                console.error(err);
                return;
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
    })
    
    
    
})


module.exports = router; 