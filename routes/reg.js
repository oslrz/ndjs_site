const {Router} = require('express');
const router = Router();
// const Reg = require('../models/pg_registr.js');


router.get('/', (req,res) =>{
    res.render('reg',{
        title: "реєстрація",
        isReg:true
    });
})

router.post('/', (req,res) =>{
    console.log('-----------------------');
    console.log(req.body.name)
    console.log(req.body.surname)
    console.log(req.body.phone_number)
    console.log(req.body.password)
    console.log(req.body.email)
    console.log('-----------------------');
    // const vidpr = new Reg("'"+req.body.name+"', "+"'"+req.body.surname+"', "+"'"+req.body.phone_number+"', "+"'"+req.body.password+"', "+"'"+req.body.email+"'");
    // vidpr.consend();
});


module.exports = router;