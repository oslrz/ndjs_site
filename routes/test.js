const {Router} = require('express');
const router = Router();


router.get('/', (req,res) =>{
    res.render('test', {
        title:"Тестова сторінка"
    });
})

router.post('/', (req,res) =>{
    console.log(req.body)
    res.redirect('/test')
});

module.exports = router;