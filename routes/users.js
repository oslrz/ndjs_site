const {Router} = require('express'),
    express = require("express"),
    router = Router(),
    e = require('express'),
    app = express(),
    { Client } = require('pg'),
    bodyParser = require('body-parser')


router.get('/:id', (req,res) =>{
    console.log(req.params.id)
    res.render('test', {
        title:"Тестова сторінка"
    });
})



module.exports = router;