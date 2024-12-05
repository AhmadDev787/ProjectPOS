import React, { useState,useEffect } from 'react'
import Manager from '../manager'
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
const AddProducts = () => {
  const {register,handleSubmit,reset, formState: {errors} }=useForm();
  const Navigate = useNavigate();
  const [productResponse,setProductResponse] = useState(null);
  const [showAlert,setShowAlert] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
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
        Navigate('/management/manager/addProduct');
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

  async function addProducts(data){
    const response = await fetch('http://localhost:3000/api/products/addStock',{
      method:"POST",
      headers:{
        "Content-Type": "application/json",
      },
      body:JSON.stringify(data),
    });
    let result = await response.json();
    setProductResponse(result.msg);
    setShowAlert(true)
  }
  if(showAlert){
    setTimeout(() => {
        setShowAlert(false);
    }, 3000);
  }

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
const handleSuggestionSelect = (product) => {
  setSelectedProduct(product);
  reset({
    productName:product.name,
    productOriginalPrice:product.originalPrice,
    productRetailPrice:product.price,
  })
  setSuggestions([])
};

  const onSubmit=(data)=>{
    const confirmation = window.confirm("Are You Sure ? You Want To Update The Stock!");
    if(confirmation){
      addProducts(data)
      reset();
    }
  }
  return (

   <main className='flex' style={{height:"100vh",width:"100vw"}}>
    <Manager/>
    <main className='p-1' style={{height:"100vh",width:"80vw"}}>
        <h1 className='text-3xl font-bold'>Add Product To Stock</h1>
        <form className='flex flex-col'>
          <label>Search Products</label>
          <input type='text' className='border p-2' placeholder='Please Search Products Here' onChange={handleSearch} ></input>
          <div>

{suggestions.length > 0 && (
  <ul className="suggestions-list flex flex-col gap-1 bg-bizopBlue text-white font-semibold p-2 rounded-sm my-1" style={{position:"absolute",maxHeight:"40vh",minWidth:"25vw"}}>
    {suggestions.map((product) => (
      <li
      key={product.id}
      className="suggestion-item cursor-pointer border"
      onClick={() => handleSuggestionSelect(product)}  // Handle selection
      >
        {product.name}
      </li>
    ))}
  </ul>
)}
</div>
        </form>
    <form className='flex flex-col p-1 gap-1' onSubmit={handleSubmit(onSubmit)}>
          <label>Product Name</label>
          <input className='p-1 border' type='text' placeholder='Enter Product Name' {...register('productName',{required:"Please Enter Product Name."})}></input>
      
          <label>Product Original Price</label>
          <input className='p-1 border' type='number' placeholder='Enter Product Original Price' {...register('productOriginalPrice',{required:"Please Enter Product Original Price."})}></input>
          <label>Product Retail Price</label>
          <input className='p-1 border' type='number' placeholder='Enter Product Retail Price' {...register('productRetailPrice',{required:"Please Enter Product Retail Price."})}></input>
          <label>Stock</label>
          <input className='p-1 border' type='number' placeholder='Enter Stock Amount' {...register('productStockCount',{required:"Please Enter Products Stock Amount."})}></input>
          <label>Provider</label>
          <input className='p-1 border' type='text' placeholder='Enter Provider Name' {...register('productProvider',{required:"Please Enter Products Provider's Name."})}></input>
       
          <div className='my-2'>
          <button className='bg-bizopBlue text-white p-2 rounded-sm' type='submit'>Update Product</button>
          </div>
          <div className='flex'>
            {productResponse !==null && showAlert && 
          <span className='bg-bizopBlue rounded-sm text-white font-semibold text-xl p-2'>{productResponse}</span>
            }
          </div>
        </form>
    </main>
  </main>
  )
}

export default AddProducts
