const {Router} = require('express');
const router = Router();


router.get('/', (req,res) =>{
    res.render('inf', {
        title:"Акції",
        isSales:true
    });
})

module.exports = router;