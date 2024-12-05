const express = require('express');
const router = express.Router();
const con = require('../../db');

router.post('/',(req,res)=>{
    const data = req.body.data;
    con.query('INSERT INTO suppliers (supplierName,supplierAddress,supplierContact,supplierMail) VALUES (?,?,?,?)',[data.supplierName,data.supplierAddress,data.supplierTel,data.supplierMail],(err,result)=>{
        if(err) console.log(err);
        res.status(200).json({msg:"Supplier Added Successfully !"});
    })
})


module.exports=router;