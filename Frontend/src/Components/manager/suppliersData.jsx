import React, { useEffect, useState } from 'react'
import Manager from '../manager'
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
const SuppliersData = () => {
  const {register,handleSubmit,reset,formState:{errors}}=useForm();
  const Navigate = useNavigate();
  const [apiResponse,setApiResponse] =useState(null);
  const [showAlert,setShowAlert] = useState(false)
  const [suppliers,setSuppliers]=useState([])
  const [token,setToken]=useState();
  useEffect(() => {
    const authToken = localStorage.getItem('authenticationToken');
    if (!authToken) {
      // If no token found, redirect to login page
      Navigate('/');
    } else {
      // Set the token state and call the verification function
      setToken(authToken);
    }
  }, [Navigate]); // This effect runs only once when the component mounts

  // Async function to verify the token from the backend
  const verifyUser = async () => {
    if (!token) return; // If token is not available, do nothing

    try {
      const response = await fetch('http://localhost:3000/authPos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();
      if (data.state === false) {
        // If token is invalid, redirect to login page
        Navigate('/');
      } else {
        // If token is valid, navigate to POS page
        Navigate('/management/manager/suppliersData');
      }
      if(!data.data.includes("MNG")){
        Navigate('/');
      }
    } catch (error) {
      console.error('Error verifying token:', error);
      // Handle any other error cases here (e.g., server is down)
    }
  };

  // This useEffect will be triggered when the token is set
  useEffect(() => {
    if (token) {
      // Only verify token if it exists
      verifyUser();
    }
  }, [token]);

  async function addSupplier(data){
    const response = await fetch('http://localhost:3000/api/management/manager/addSupplier',{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
      },
      body:JSON.stringify({data:data})
    })
    let comingData = await response.json();
    setApiResponse(comingData.msg);
  }
  const onSubmit = (data)=>{
    addSupplier(data);
    reset();
    setShowAlert(true);
    setTimeout(()=>{
      setShowAlert(false)
    },4000)
  }
  async function getSupplier(){
    const response = await fetch('http://localhost:3000/api/management/manager/getSupplier');
    let data = await response.json();
    setSuppliers(data.data)
  }
  useEffect(()=>{
    getSupplier();
  },[])
  return (
    <main className='flex' style={{height:"100vh",width:"100vw"}}>
    <Manager/>
    <main className='p-1' style={{height:"100vh",width:"80vw"}}>
      <section className=''>
        <div className='flex justify-center items-center bg-bizopBlue text-white rounded-sm p-2 my-2'>
        <h1 className='text-3xl'>Supplier's Data</h1>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col text-lg'>
          <label>Supplier Name</label>
          <input className='p-1 border' type='text' placeholder='Enter Supplier Name ' {...register('supplierName',{required:"Supplier Name Is Required!"})}></input>
          <label>Supplier Address</label>
          <input className='p-1 border' type='text' placeholder='Enter Supplier Address ' {...register('supplierAddress',{required:"Supplier Address Is Required!"})}></input>
          <label>Supplier Contact</label>
          <input className='p-1 border' type='tel' placeholder='Enter Supplier Contact ' {...register('supplierTel',{required:"Supplier Contact Is Required!"})}></input>
          <label>Supplier Mail</label>
          <input className='p-1 border' type='tel' placeholder='Enter Supplier Mail (Optional) ' {...register('supplierMail')}></input>
          <div>
          <button type='submit' className='border p-2 my-2'>Add Supplier</button>
          </div>
          {
            apiResponse != null && showAlert ==true && <div className=' text-white text-xl font-semibold p-2 px-3 flex justify-center'>
              <h1 className='bg-bizopBlue p-2'>{apiResponse}</h1>
            </div>
          }
        </form>
        <hr></hr>
        <hr></hr>
        <hr></hr>
        <hr></hr>
        <hr></hr>
        <section>
          <div className='flex justify-between items-center text-xl bg-bizopBlue text-white p-2'>
            <h1>Supplier Name</h1>
            <h1>Supplier Address</h1>
            <h1>Supplier Contact</h1>
            <h1>Supplier Mail</h1>
          </div>
          {suppliers.map((item)=>{
            return(
              <>
              <div key={item.id} className='flex justify-between items-center' >
                <h1>{item.supplierName}</h1>
                <h1>{item.supplierAddress}</h1>
                <h1>{item.supplierContact}</h1>
                <h1>{item.supplierMail}</h1>
              </div>
              </>
            )
          })}
        </section>
      </section>
    </main>
  </main>
  )
}

export default SuppliersData
