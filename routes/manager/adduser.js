const express = require('express');
const router = express.Router();
const con = require('../../db');

router.post('/',(req,res)=>{
    let data = req.body.data;
    con.query('INSERT INTO users (specialId,password,name,post) VALUES(?,?,?,?)',[data.specialId,data.password,data.name,data.post],(err,result)=>{
        if(err) console.log(err);
        res.status(200).json({msg:"Users Added Successfully!"});
    })
})


module.exports=router;