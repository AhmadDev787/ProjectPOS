const express = require('express');
const router = express.Router();
const con = require('../../db');
router.get('/',(req,res)=>{
    con.query('SELECT * FROM products',(err,result)=>{
        if(err) console.log(err)
        res.status(200).json({data:result});
    })
})

module.exports=router;