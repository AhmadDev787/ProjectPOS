import React, { useEffect, useState } from 'react'
import Manager from '../manager'
import { useNavigate } from 'react-router-dom';

const Reports = () => {
  const [salesData,setSalesData] = useState([]);
  const [token,setToken]=useState();
  const Navigate = useNavigate();
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
        Navigate('/management/manager/reports');
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

  async function getSalesData(){
    try {
      const response = await fetch('http://localhost:3000/api/management/manager/getSalesData');
      const data = await response.json();
      setSalesData(data.data);
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(()=>{
    getSalesData();
  },[])
  return (
    <main className='flex' style={{height:"100vh",width:"100vw"}}>
    <Manager/>
    <main className='p-1' style={{height:"100vh",width:"80vw"}}>
      <div className='flex justify-center items-center text-white bg-bizopBlue p-2 my-2 rounded-sm'>
        <h1 className='text-3xl  font-semibold'>All Sales</h1>
      </div>
      <div className='flex justify-between items-center'>
        <h1 className='text-xl font-semibold'>Total Price</h1>
        <h1 className='text-xl font-semibold'>Payment Mode</h1>
        <h1></h1>
        <h1 className='text-xl font-semibold'>Cashier Name</h1>
        <h1></h1>
        <h1></h1>
        <h1 className='text-xl font-semibold'>Date And Time</h1>
      </div>
      <section className='m-2'>
        {
          salesData.map((item)=>{
            return(
              <>
              <div className='flex justify-between items-center'>
              <h1>{item.totalPrice}</h1>
              <h1>{item.paymentMode}</h1>
              <h1>{item.cashierName}</h1>
              <h1>{item.dateTime}</h1>
              </div>
              </>
            )
          })
        }
      </section>
    </main>
  </main>
  )
}

export default Reports
