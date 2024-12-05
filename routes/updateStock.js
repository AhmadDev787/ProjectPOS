const express= require('express');
const con = require('../db');
const router = express.Router();

router.post('/',(req,res)=>{
    const products = req.body.products;
    products.forEach(product => {
        const {name,quantitySold}=product;
        const query = `UPDATE products SET stock = stock - ?  WHERE name = ?`;
        con.query(query,[quantitySold,name],(err,result)=>{
            if(err){
                console.log("Error:",err);
               return res.status(500).json({success:false,msg:"Failed To Update the Stock."});
            }
            if(result.affectedRows === 0){
                return res.status(404).json({msg:"Product Name Not Found"});
            }
        })
    });

    res.status(200).json({success:true})
})


module.exports=router;