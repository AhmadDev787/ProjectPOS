const express= require('express');
const con = require('../db');
const router = express.Router();

router.get('/',(req,res)=>{
    const threshold = 5;
    const sqlQuery = `SELECT * FROM products WHERE stock <=?`;
    con.query(sqlQuery,[threshold],(err,result)=>{
        if(err){
            console.log("Error:",err);
            res.status(500).json({msg:"Error in Fetching Low Stock Products."});
        }
        else{
            res.status(200).json(result);
        }
    })
})

module.exports = router;