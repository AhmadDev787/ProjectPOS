import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useForm } from 'react-hook-form'
const Manager = () => {
  const {register,handleSubmit,reset,formState:{errors}}=useForm();
  const [showLoginModal, setShowLoginModal] =useState(false);
  const [verifyRes,setVerifyRes]=useState("");
  
  async function logoutUser(token){
    const response = await fetch('http://localhost:3000/logout',{
      method:"POST",
      headers:{
        "Content-type":"application/json",
      },
      body:JSON.stringify({authToken:token})
    })
    const data = await response.json();
  }
  const logout = ()=>{
    const confirmation = window.confirm("Are You Sure ? You Want To Logout ! ");
    if(confirmation){
      let token = localStorage.getItem('authenticationToken');
      logoutUser(token);
      localStorage.removeItem('authenticationToken');
      localStorage.removeItem('name');
      window.location.reload();
    }
  }
  async function verifyUser (data){
    const response = await fetch('http://localhost:3000/api/management/manager/verifyUser',{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
      },
      body:JSON.stringify({data:data})
    })
    const finalResponse = await response.json();
    setVerifyRes(finalResponse)
  }
  const onSubmit = (data)=>{
    verifyUser(data)
    reset();

  }
  function closeModal(){
    setShowLoginModal(false);
  }
  function LoginModal(){
    let confirmation = window.confirm("Are You Sure You Want To Delete History?");
    if(confirmation){
      setShowLoginModal(true);
    }
  }
  
  return (
    <>
    <main className='bg-bizopBlue text-white'  style={{height:"100vh",width:"20vw"}}>
      <nav className=' flex flex-col gap-4 p-2'>
        <h1 className='text-2xl font-bold '>Manager Dashboard</h1>
        <NavLink to='/management/manager/inventory' className='p-2 bg-bizopTextBlue text-lg font-semibold rounded-sm'>Inventory Management</NavLink>
        <NavLink to='/management/manager/addNewProduct' className='p-2 bg-bizopTextBlue text-lg font-semibold rounded-sm'>Add New Product</NavLink>
        <NavLink to='/management/manager/addProduct' className='p-2 bg-bizopTextBlue text-lg font-semibold rounded-sm'>Add Product</NavLink>
        <NavLink to='/management/manager/addUser' className='p-2 bg-bizopTextBlue text-lg font-semibold rounded-sm'>Add User</NavLink>
        <NavLink to="/management/manager/reports" className='p-2 bg-bizopTextBlue text-lg font-semibold rounded-sm'>Sales</NavLink>
        <NavLink to="/management/manager/usersActivity" className='p-2 bg-bizopTextBlue text-lg font-semibold rounded-sm'>Users Activity Logs</NavLink>
        <NavLink to="/management/manager/suppliersData" className='p-2 bg-bizopTextBlue text-lg font-semibold rounded-sm'>Suppliers Data</NavLink>
        <button className='p-1 m-1 bg-red-600 text-white font-semibold text-lg px-3 rounded' onClick={logout}>Logout</button>
        <div className=' p-1 rounded-md'>
          <h1 className='text-white font-bold text-xl '>Dangerous Section :</h1>

        <button className='p-1 m-1 bg-red-600 text-white font-semibold text-lg px-3 rounded' onClick={LoginModal} >Clear History</button>
        
        </div>
      </nav>
    </main>


    {/* modal */}
    {showLoginModal && 
    <main className='flex items-center justify-center' style={{height:"100vh",width:"100vw",position:"absolute",backgroundColor:"rgba(0,0,0,.3)",backdropFilter:"blur(2px)"}}>
      <form className='flex flex-col p-2 gap-2 text-lg' style={{minWidth:"40vw"}} onSubmit={handleSubmit(onSubmit)}>
        <div className='flex justify-end'>
          <button className='bg-bizopBlue text-white text-xl p-2 px-3' onClick={closeModal}>X</button>
        </div>
        <div>
          <h1 className='text-2xl my-4'>For Delete Actions. Please Again Enter Your Details!</h1>
          <h1 className='text-lg my-2 bg-bizopBlue text-white p-1'>For Delete Sales History Type "DeleteSalesBizops" in Action Field!</h1>
          <h1 className='text-lg my-2 bg-bizopBlue text-white p-1'>For Delete Login History Type "DeleteLoginBizops" in Action Field!</h1>
        </div>
        <label>SpecialId</label>
        <input type='text' className='border p-2' placeholder='Please Enter Your Special ID' {...register("specialId",{required:"Special Id is Required For This Action!"})}></input>
        <label>SpecialId</label>
        <input type='password' className='border p-2' placeholder='Please Enter Your Special ID' {...register("password",{required:"Password is Required For This Action!"})}></input>
        <label>Action</label>
        <input type='text' className='border p-2' placeholder='Please Enter Your Special ID' {...register("action",{required:"Action is Required!"})}></input>
        <div>
          <button type='submit' className='p-2 bg-bizopBlue text-white'>Submit</button>
        </div>
        <div>
          {verifyRes != "" && 
            <div className='bg-bizopBlue text-white p-2 my-2'>{verifyRes.msg}</div>
          }
        </div>
      </form>
    </main>
        }
    </>
  )
}

export default Manager
