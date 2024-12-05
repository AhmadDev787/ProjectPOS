const mysql = require('mysql');
try {
    const con = mysql.createConnection({
        host:"localhost",
        user:"root",
        password:"",
        database:"bizopDb"
    });
} catch (error) {
    console.log("DB connection Error:",error);
}

con.connect((err)=>{
    if(err){
        console.log(err);
    }else{
        console.log("connected")
    }
})
module.exports=con;