import React, { useEffect, useState } from 'react'
import Manager from '../manager'
import { useNavigate } from 'react-router-dom';
const UsersActivity = () => {
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
            Navigate('/management/manager/usersActivity');
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
   




    const [activity,setActivity]=useState([]);
    useEffect(()=>{
       async function getActivity(){
        const response = await fetch('http://localhost:3000/api/management/manager/usersActivity');
        let data = await response.json();
        setActivity(data.data)
        
       }
       getActivity();
    },[])
  return (
    <main className='flex' style={{height:"100vh",width:"100vw",overflowX:"hidden"}}>
    <Manager/>
    <main className='p-1' style={{minHeight:"100vh",width:"78vw"}}>
        <div className=' bg-bizopBlue p-2 my-2 flex justify-center items-center'>
            <h1 className=' text-white text-2xl'>User's Activity</h1>
        </div>
<div className='flex justify-between bg-slate-500 text-white p-2'>
<h1>UserName</h1>
<h1>UserSpecialId</h1>
<h1>Time And Date</h1>
<h1>Action</h1>
</div>
{
    activity.map((item,i)=>{
        return(
            <>
            <div key={i} className='flex justify-between text-base my-1 p-2'>
            <h1>{item.userName}</h1>
            <h1>{item.userSpecialId}</h1>
            <h1>{item.timeStamp}</h1>
            <h1>{item.action}</h1>
            </div>
            </>
        )
        
    })
}
    </main>
  </main>
  )
}

export default UsersActivity
