import React, { useEffect, useState } from 'react'
import Manager from '../manager'
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
const AddNewUser = () => {
  const {register,handleSubmit,reset,formState:{errors}}=useForm();
  const [showAlert,setShowAlert] = useState(false);
  const Navigate = useNavigate();
  const [apiRes,setApiRes] = useState(null);
    const [users,setUsers] = useState([]);
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
        Navigate('/management/manager/addUser');
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

    async function getUsers (){
        const response = await fetch('http://localhost:3000/api/management/manager/getUser');
        let result = await response.json();
        setUsers(result.data);
    }
    useEffect(()=>{
        getUsers();
    },[])
  async function addNewUser(data){
    const response = await fetch('http://localhost:3000/api/management/manager/addUser',{
      method:"POST",
      headers:{
        "Content-Type": "application/json",
      },
      body:JSON.stringify({data:data}),
    });
    let result = await response.json();
    setApiRes(result.msg);
    setShowAlert(true)
  }
  if(showAlert){
    setTimeout(() => {
        setShowAlert(false);
    }, 3000);
  }
  const onSubmit=(data)=>{
    const confirmation = window.confirm("Are You Sure ? You Want To Add A New User!");
    if(confirmation){
      addNewUser(data)
      reset();
    }
  }
  return (

   <main className='flex' style={{height:"100vh",width:"100vw"}}>
    <Manager/>
    <main className='p-1' style={{height:"100vh",width:"80vw"}}>
        <h1 className='text-3xl font-bold'>Add New User In Team.</h1>
    <form className='flex flex-col p-1 gap-1' onSubmit={handleSubmit(onSubmit)}>
          <label>User Name</label>
          <input className='p-1 border' type='text' placeholder='Enter User Name' {...register('name',{required:"Please Enter User Name."})}></input>
          <label>Special Id</label>
          <input className='p-1 border' type='text' placeholder='Enter Special Id' {...register('specialId',{required:"Please Enter Special Id."})}></input>
          <label>Post</label>
          <input className='p-1 border' type='text' placeholder='Enter User Post Price' {...register('post',{required:"Please Enter User Post."})}></input>
          <label>Password</label>
          <input className='p-1 border' type='text' placeholder='Enter Password' {...register('password',{required:"Please Enter Password."})}></input>
       
          <div className='my-2'>
          <button className='bg-bizopBlue text-white p-2 rounded-sm' type='submit'>Add New User</button>
          </div>
          <div className='flex'>
            {apiRes !==null && showAlert && 
          <span className='bg-bizopBlue rounded-sm text-white font-semibold text-xl p-2'>{apiRes}</span>
            }
          </div>
        </form>
        <div className='border'>
            <h1 className='text-2xl font-bold'>Users Table</h1>
            <div className='text-xl flex justify-between items-center p-2 font-bold'>
                <h1>Name</h1>
                <h1>Post</h1>
                <h1>SpecialId</h1>
            </div>
            {users.map((user)=>{
                return(
                    <div key={user.id} className='flex justify-between items-center p-2'>
                        <h1>{user.name}</h1>
                        <h1>{user.post}</h1>
                        <h1>{user.specialId}</h1>
                    </div>
                )
            })}
</div>
    </main>

  </main>
  )
}

export default AddNewUser
