const express = require('express');
const router =express.Router();
const con = require('../db');
const jwt = require('jsonwebtoken');
const SECRETKEY="BIZOPSISVERYSECURE787";

router.post('/',(req,res)=>{
    const id=req.body.authToken;
    const now = new Date();
    const formattedDate = now.toLocaleString('en-GB', {
        weekday: 'long',  // Day of the week (e.g. "Monday")
        year: 'numeric',  // Full year (e.g. "2024")
        month: 'long',    // Full month name (e.g. "November")
        day: 'numeric',   // Day of the month (e.g. "13")
        hour: 'numeric',  // Hour (e.g. "14")
        minute: 'numeric',// Minute (e.g. "30")
        second: 'numeric',// Second (e.g. "05")
        hour12: false      // 24-hour clock format (true for AM/PM format)
    });
    jwt.verify(id,SECRETKEY,(err,encoded)=>{
        if(err)console.log(err)
        con.query('SELECT * FROM users WHERE specialId=?',encoded,(err,result)=>{
            con.query("INSERT INTO users_activity_logs (userName,userSpecialId,timeStamp,action) VALUES (?,?,?,'Logout')",[result[0].name,result[0].specialId,formattedDate],(err,result)=>{
                if(err){
                    console.log("Error:",err);
                    res.status(500).json({msg:"Log Not Updated"})
                }else{
                }
            });
        })
    })

})


module.exports=router;