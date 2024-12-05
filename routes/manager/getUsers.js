const express = require('express');
const router = express.Router();
const con = require('../../db');

router.get('/',(req,res)=>{
   con.query('SELECT * FROM users',(err,result)=>{
    if(err)console.log(err);
    res.json({data:result});
   })
})


module.exports=router;