const express = require('express');
const app = express();
const router= express.Router();
app.use(express.json());
const con = require('../db');
const jwt = require('jsonwebtoken');
const SECRETKEY="BIZOPSISVERYSECURE787";


router.post('/',(req,res)=>{
    let data = req.body;
    con.query('SELECT * FROM users WHERE specialId = ? AND password=?',[req.body.specialId,req.body.password],(err,result)=>{
        if(result.length > 0){
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
const token= jwt.sign(req.body.specialId,SECRETKEY);
            res.status(200).json({msg:true,data:result,token:token});
            con.query("INSERT INTO users_activity_logs (userName,userSpecialId,timeStamp,action) VALUES (?,?,?,'Login')",[result[0].name,result[0].specialId,formattedDate],(err,result)=>{
                if(err){
                    console.log("Error:",err);
                    res.status(500).json({msg:"Log Not Updated"})
                }else{
                  
                }
            });

        }else{
            res.status(400).json({msg:"Invalid Credentials!"})
        }
    })
})
module.exports=router;