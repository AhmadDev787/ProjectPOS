import React, { useState, useEffect } from 'react'
import Manager from '../manager'
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Alert from '../alert';
const Inventory = () => {
  const [token,setToken]=useState();
  const [suggestions,setSuggestions] =useState([]);
  const [lowStockAlert, setLowStockAlert] = useState([]);
  const [alertVisible, setAlertVisible] = useState(true);
    const Navigate = useNavigate();
    useEffect(() => {
        const authToken = localStorage.getItem("authenticationToken");
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
          Navigate('/management/manager/inventory');
          }
          if(!data.data.includes("MNG")){
            Navigate('/')
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
      const [allProducts,setAllProducts]= useState([]);
     async function fetchAllProducts(){
      const response = await fetch('http://localhost:3000/api/products/allProducts');
      let data = await response.json();
      setAllProducts(data.data);
      }
  useEffect(()=>{
    fetchAllProducts();
  },[])

  const checkLowStock = async()=>{
    try {
        const response = await fetch('http://localhost:3000/api/products/lowStock');
        const lowStockProducts = await response.json();
        setLowStockAlert(lowStockProducts);
    } catch (error) {
        console.log('Error In Low Stock:',err)
    }
};
 useEffect(()=>{
    checkLowStock();
 },[])
 const handleCloseAlert = () => {
    setAlertVisible(false); // Hide the alert when clicked
};
  const handleSearch = async (e)=>{
    const query = e.target.value;
    if(query){
        try {
            const response = await fetch(`http://localhost:3000/api/products/search?name=${query}`);
            const data = await response.json();
            setSuggestions(data);
        } catch (error) {
            console.log("Error in Fetching Products:",error)
        }
    }
    else{
        setSuggestions([]);
    }
}
  
  return (
    <main className='flex' style={{height:"100vh",width:"100vw",overflowX:"hidden" }}>
    <Manager/>
    <main className='p-1' style={{height:"100vh",width:"79vw"}}>
    {lowStockAlert.length > 0 && alertVisible && (
                <div className="bg-yellow-500 text-black p-2 mb-2 flex justify-between" style={{position:"absolute",minWidth:"25vw"}}>
                    <div>

                    <strong>Low Stock Alert!</strong>
                    <ul>
                        {lowStockAlert.map((product) => (
                            <li key={product.id}>{product.name} (Stock: {product.stock})</li>
                            ))}
                    </ul>
                            </div>
                            <div>

                    <button className='bg-white p-1 px-2 text-red-600 font-bold'
                        onClick={handleCloseAlert} 
                        style={{}}
                        >
                        X
                    </button>
                        </div>
                </div>
            )}
      <div className='flex justify-center items-center p-1'>
      <h1 className='font-bold text-4xl text-bizopTextBlue'>Inventory Managment</h1>
      </div>
     
      <h1 className='text-2xl font-bold'>Available Products</h1>
      <div className='flex flex-col'>
        <label>Search Products</label>
        <input type='text' placeholder='Search products Here' className='border p-2 my-2 rounded-sm' onChange={handleSearch} ></input>
      </div>
  <div className='flex justify-between items-center p-1'>
    <h1 className='font-bold text-lg'>Product Name</h1>
    <h1></h1>
    <h1 className='font-bold text-lg'>Stock Level</h1>
    <h1 className='font-bold text-lg'>Product Price</h1>
    <h1 className='font-bold text-lg'>Original Price</h1>
    <h1 className='font-bold text-lg'>Provider</h1>
    <h1></h1>
    <h1></h1>
    <h1></h1>
    <h1 className='font-bold text-lg'>Updated At</h1>
  </div>
  <main className='bg-bizopBlue'>
{
  suggestions.length >0 && suggestions.map((item)=>{
    const formattedDate = new Date(item.created_at).toLocaleString('en-GB', {
      weekday: 'short', // "Mon", "Tue"
      year: 'numeric', // "2024"
      month: 'short', // "Nov"
      day: 'numeric', // "13"
      hour: '2-digit', // "14"
      minute: '2-digit', // "32"
      second: '2-digit', // "05"
    });
    return(
      <>
      <main className=' p-1 bg-bizopBlue text-white'>

      <div className='' style={{width:"20vw",display:"inline-block"}}>
      <h1 className=''>{item.name}</h1>
  </div>
      <div className='' style={{width:"5vw",display:"inline-block"}}>
      <h1 className=''>{item.stock}</h1>
  </div>
  <div className='' style={{width:"5vw",display:"inline-block"}}>
  </div>
      <div className='' style={{width:"5vw",display:"inline-block"}}>
      <h1 className=''>{item.price}</h1>
  </div>
  <div className='' style={{width:"5vw",display:"inline-block"}}>
  </div>
      <div className='' style={{width:"5vw",display:"inline-block"}}>
      <h1 className=''>{item.originalPrice}</h1>
  </div>
      <div className='' style={{width:"5vw",display:"inline-block"}}>
  </div>
      <div className='' style={{width:"10vw",display:"inline-block"}}>
      <h1 className='mx-auto'>{item.provider}</h1>
  </div>
      <div className='' style={{width:"16vw",display:"inline-block"}}>
      <h1 className='' style={{float:"right"}}>{formattedDate}</h1>
  </div>
      </main>
      </>
  )}
  ) 
}
{ suggestions.length <= 0 &&
  allProducts.map((item)=>{
    const formattedDate = new Date(item.created_at).toLocaleString('en-GB', {
      weekday: 'short', // "Mon", "Tue"
      year: 'numeric', // "2024"
      month: 'short', // "Nov"
      day: 'numeric', // "13"
      hour: '2-digit', // "14"
      minute: '2-digit', // "32"
      second: '2-digit', // "05"
    });
    return(
      <>
      <main className=' p-1 bg-bizopBlue text-white'>

      <div className='' style={{width:"20vw",display:"inline-block"}}>
      <h1 className=''>{item.name}</h1>
  </div>
      <div className='' style={{width:"5vw",display:"inline-block"}}>
      <h1 className=''>{item.stock}</h1>
  </div>
  <div className='' style={{width:"5vw",display:"inline-block"}}>
  </div>
      <div className='' style={{width:"5vw",display:"inline-block"}}>
      <h1 className=''>{item.price}</h1>
  </div>
  <div className='' style={{width:"5vw",display:"inline-block"}}>
  </div>
      <div className='' style={{width:"5vw",display:"inline-block"}}>
      <h1 className=''>{item.originalPrice}</h1>
  </div>
      <div className='' style={{width:"5vw",display:"inline-block"}}>
  </div>
      <div className='' style={{width:"10vw",display:"inline-block"}}>
      <h1 className='mx-auto'>{item.provider}</h1>
  </div>
      <div className='' style={{width:"16vw",display:"inline-block"}}>
      <h1 className='' style={{float:"right"}}>{formattedDate}</h1>
  </div>
      </main>
      </>
    )
  })
}
</main>

    </main>
  </main>
  )
}

export default Inventory
