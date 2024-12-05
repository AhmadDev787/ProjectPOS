const express = require('express');
const router = express.Router();
const con = require('../../db');

router.get('/',(req,res)=>{
    con.query("SELECT * FROM users_activity_logs",(err,result)=>{
        if(err){
            console.log("Error:",err)
        }else{
            res.status(200).json({data:result});
        }
    });
})


module.exports = router;