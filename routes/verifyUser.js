const express = require('express');
const router = express.Router();
const con = require('../db');

router.post('/',(req,res)=>{
    let data = req.body.data;
    let action = data.action;
    con.query('SELECT * FROM users WHERE specialId = ? AND password = ?',[data.specialId,data.password],(err,result)=>{
        if(err) console.log(err);
        if(result.length > 0 && result[0].post == "Manager"){
                if(action == "DeleteLoginBizops"){
                    con.query('DELETE FROM users_activity_logs',(err,result)=>{
                            if(err) console.log(err);
                        res.status(200).json({msg:"Login History Cleared Successfully!"})
                        })
                    }else if(action == "DeleteSalesBizops"){
                        con.query('DELETE FROM salesdata',(err,result)=>{
                                if(err) console.log(err);
                            res.status(200).json({msg:"Sales History Cleared Successfully!"})
                            })
                        }else{
                            res.status(400).json({msg:"Action is Not Correctly Defined!"})
                        }
                    
            
        }else{
            res.status(400).json({status:false,msg:"Request Cancelled ! Because Looking You Are Unauthorized User."})
        }
    })
})


module.exports=router;