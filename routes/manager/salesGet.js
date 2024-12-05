const express = require('express');
const router = express.Router();
const con = require('../../db');

router.get('/',(req,res)=>{
    con.query('SELECT * FROM salesdata',(err,result)=>{
        if(err) console.log(err);
        console.log(result);
        res.json({data:result});
    })
})


module.exports=router;