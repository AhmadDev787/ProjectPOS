const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
const login = require('./routes/login');
const invoice = require('./routes/invoice');
const search = require('./routes/search'); 
const lowStock = require('./routes/lowStock'); 
const updateStock = require('./routes/updateStock'); 
const activity = require('./routes/manager/activity')
const authPos = require('./routes/authPos');
const allProducts = require('./routes/manager/allProducts');
const addNewStock = require('./routes/manager/addNewStock');
const addStock = require('./routes/manager/addStock');
const logout = require('./routes/logout');
const salesData = require('./routes/manager/sales');
const getSalesData = require('./routes/manager/salesGet');
const addSupplier = require('./routes/manager/suppliers');
const getSupplier = require('./routes/manager/getSupplier');
const verifyUser = require('./routes/verifyUser');
const addUser = require('./routes/manager/adduser');
const getUser = require('./routes/manager/getUsers')
app.use(express.json());
app.use('/login',login);
app.use('/logout',logout);
app.use('/authPos',authPos);
app.use('/api/generateInvoice',invoice);
app.use('/api/products/lowStock',lowStock);
app.use('/api/products/search',search);
app.use('/api/products/allProducts',allProducts);
app.use('/api/products/updateStock',updateStock);
app.use('/api/products/addNewStock',addNewStock);
app.use('/api/products/addStock',addStock);
app.use('/api/management/manager/usersActivity',activity);
app.use('/api/management/manager/salesData',salesData);
app.use('/api/management/manager/getSalesData',getSalesData);
app.use('/api/management/manager/addSupplier',addSupplier);
app.use('/api/management/manager/getSupplier',getSupplier);
app.use('/api/management/manager/verifyUser',verifyUser);
app.use('/api/management/manager/addUser',addUser);
app.use('/api/management/manager/getUser',getUser);


app.get('/',(req,res)=>{
    
})
app.listen(3000,()=>{console.log('running')});