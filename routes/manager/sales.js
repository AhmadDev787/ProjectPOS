const express = require('express');
const router = express.Router();
const con = require('../../db');

router.post('/',(req,res)=>{
    let data = req.body;
    // console.log(data.products.name);
    let products = req.body.products;
    let arr1 = [];
    let arr2 = [];
    products.forEach(item => {
        arr1.push(item.name)
        arr2.push(item.quantity)
    });
    let arrNames = JSON.stringify(arr1);
    let arrQuantity = JSON.stringify(arr2);

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
    con.query('INSERT INTO salesData (products,quantity,totalPrice,payment,returnAmount,paymentMode,cashierName,dateTime) VALUES (?,?,?,?,?,?,?,?)',[arrNames,arrQuantity,data.totalPrice,data.payment,data.returnAmount,data.paymentMode,data.cashierName,formattedDate],(err,result)=>{
        if(err)console.log(err)
        console.log(result);
    })
    
})



module.exports=router;