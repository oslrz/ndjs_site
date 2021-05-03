const {Router} = require('express');
const router = Router();


router.get('/', (req,res) =>{
    // console.log(res.body);
    // console.log(req.body);
})

// router.post('/', (req,res) =>{
//     console.log('post res = '+ res);
//     console.log('post req = '+ req);
// });

module.exports = router;