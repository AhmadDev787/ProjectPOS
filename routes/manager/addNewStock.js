const express =require('express');
const router = express.Router();
const con = require('../../db');


router.post('/',(req,res)=>{
    const data = req.body;
    con.query('INSERT INTO products (name,price,stock,originalPrice,provider) VALUES(?,?,?,?,?)',[data.productName,data.productRetailPrice,data.productStockCount,data.productOriginalPrice,data.productProvider],(err,result)=>{
        if(err){
            console.log(err)
            res.status(500).json({msg:"Some Error Occured"});
        }else{
            console.log(result)
            res.status(200).json({msg:"Product Added Successfully!"});
        }
    })
    
})


module.exports=router;