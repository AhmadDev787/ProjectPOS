const express = require('express');
const router = express.Router();
const con = require('../db');
router.get('/',(req,res)=>{
    const query = req.query.name || "";
    const sqlQuery= `SELECT * FROM products WHERE name LIKE ? AND stock > 0`;
    con.query(sqlQuery,[`%${query}%`],(err,result)=>{
        if(err){
            console.log("Error:",err);
            res.status(500).json({msg:"Error Fetch ing Products"});
        }else{
            res.status(200).json(result);
        }
    })
})
module.exports = router;