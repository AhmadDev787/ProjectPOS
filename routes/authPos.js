const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const SECRETKEY="BIZOPSISVERYSECURE787";

router.post('/',(req,res)=>{
    let data = req.body.token;
    console.log(data)
    jwt.verify(data,SECRETKEY,(err,result)=>{
        if(err){
            res.status(400).json({msg:"Invalid Token",state:false});
        }else{
            res.status(200).json({state:true,data:result})
            console.log(result)
        }
    })
    
});

module.exports=router;