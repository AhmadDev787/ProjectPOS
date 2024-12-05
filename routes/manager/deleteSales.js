const express = require('express');
const router = express.Router();
const con = require('../../db');

router.get('/',(err,result)=>{
    if(err) console.log(err)
    console.log(result)
    result.status(200).json({msg:"Deleted Successfully!"});
})

module.exports=router;