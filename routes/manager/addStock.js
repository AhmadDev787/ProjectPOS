const express =require('express');
const router = express.Router();
const con = require('../../db');


router.post('/',(req,res)=>{
    const data = req.body;
    con.query('UPDATE products SET price=?, stock=stock + ?, originalPrice=?, provider=? WHERE name=?',[data.productRetailPrice,data.productStockCount,data.productOriginalPrice,data.productProvider,data.productName],(err,result)=>{
        if(err){
            console.log(err)
            res.status(500).json({msg:"Some Error Occured"});
        }else{
            console.log(result)
            res.status(200).json({msg:"Product Updated Successfully!"});
        }
    })
})


module.exports=router;