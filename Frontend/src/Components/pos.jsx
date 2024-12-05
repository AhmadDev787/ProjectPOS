import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import Alert from './alert';
import { useLocation, useNavigate } from 'react-router-dom';
import Calculator from './calculator';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
const Pos = () => {
  const [apiRes,setApiRes]=useState(null);
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
            Navigate('/pos');
          }
          if(!data.data.includes("CSH")){
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
      // const location = useLocation(); 
      // const {name} = location.state || {};
      const [name,setName]=useState('');
      useEffect(()=>{
        let a=localStorage.getItem("name");
        setName(a);
      },[])
    const [products,setProducts]= useState([]);
    const [invoiceHtml, setInvoiceHtml] = useState('');
    const [totalPrice, setTotalPrice] =useState(0);
    const [payment, setPayment] = useState(0); // Payment entered by the customer
    const [returnAmount, setReturnAmount] = useState(0); // Amount to return to customer
    const [paymentMode, setPaymentMode] = useState('cash');
    const [showCalculator, setShowCalculator] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [lowStockAlert, setLowStockAlert] = useState([]);
    const [alertVisible, setAlertVisible] = useState(true);
    const [showCardPayment, setShowCardPayment] = useState(false);
    const { register,handleSubmit,reset, formState:{errors} }= useForm();
    const toggleCalculator = () => {
        setShowCalculator(!showCalculator);
    };
    const onSubmit =(data)=>{
        const price = parseFloat(data.productPrice);
        const discount= data.productDiscount ? parseFloat(data.productDiscount) :0;
        const discountedPrice = discount > 0 ? price - (price * discount / 100) : price;
        const quantity = data.productQuantity > 1 ? (data.productQuantity * discountedPrice):discountedPrice;
        const newProduct={
            name:data.productName,
            price:price,
            discount:discount,
            discountedPrice:quantity,
            quantity:data.productQuantity
        }
        setProducts((prevProducts)=>{
            const updatedProducts= [...prevProducts,newProduct];
            const newTotalPrice= updatedProducts.reduce((acc,product)=>acc+product.discountedPrice,0);
            setTotalPrice(newTotalPrice);
            return updatedProducts;
        })
        reset();
    }
    const handleSearch = async (e)=>{
        const query = e.target.value;
        if(query){
            try {
                const response = await fetch(`http://localhost:3000/api/products/search?name=${query}`);
                const data = await response.json();
                setSearchResults(data);
            } catch (error) {
                console.log("Error in Fetching Products:",err)
            }
        }
        else{
            setSearchResults([]);
        }
    }
    const selectProduct = (product)=>{
        reset({
            productName: product.name,
            productPrice: product.price,
            productQuantity: 1,
            productDiscount: 0,
        })
        setSearchResults([]);
    }


    const removeProduct=(index)=>{
        setProducts((prevProducts)=>{
            const updatedProducts=prevProducts.filter((_,i)=>i!==index);
            const newTotalPrice= updatedProducts.reduce((acc,product)=>acc+product.discountedPrice,0);
            setTotalPrice(newTotalPrice);
            return updatedProducts;
        });
    };
    const handleChange = (e)=>{
        const givenPayment = parseFloat(e.target.value);
        setPayment(givenPayment);
        if(givenPayment >= totalPrice){
            setReturnAmount(givenPayment - totalPrice)
        }else{
            setReturnAmount(0);
        }
    };
     const handlePaymentModeChange = (e)=>{
        setPaymentMode(e.target.value);
        
     }
   async function sendSalesData(){
    const invoiceData = {
      products,         // Array of products
      totalPrice,       // Total price of all products
      payment,          // Payment received
      returnAmount,     // Return amount to customer
      paymentMode,      // Payment mode (cash/card)
      cashierName: name // Cashier's name
  };
  try {
          const response =await fetch('http://localhost:3000/api/management/manager/salesData',{
            method:"POST",
            headers:{
              "Content-Type":"application/json",
            },
            body:JSON.stringify(invoiceData)
          })
          let data = await response.json();
        } catch (error) {
          console.log(error);
        }
   }
     const generateInvoice = async () => {
        const invoiceData = {
            products,         // Array of products
            totalPrice,       // Total price of all products
            payment,          // Payment received
            returnAmount,     // Return amount to customer
            paymentMode,      // Payment mode (cash/card)
            cashierName: name // Cashier's name
        };
        sendSalesData();
        setProducts([]);
        try {
            // Sending the invoice data to the backend to generate the HTML
            const response = await fetch('http://localhost:3000/api/generateInvoice', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(invoiceData)
            });

            // Assuming the response contains the HTML of the invoice
            const data = await response.text();  // Get HTML as text
            setInvoiceHtml(data);  // Set the invoice HTML to state
            const stockUpdateData = products.map(product => ({
                name: product.name,
                quantitySold: product.quantity
              }));
              const stockUpdateResponse = await fetch('http://localhost:3000/api/products/updateStock', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ products: stockUpdateData })
              });
        
              const stockUpdateResult = await stockUpdateResponse.json();
              if (stockUpdateResult.success) {
              } else {
                setApiRes(stockUpdateData.msg)
                console.error('Error updating stock:', stockUpdateResult.error);
              }
              const synth = window.speechSynthesis;
              const message = new SpeechSynthesisUtterance("Thank you for choosing Bizops. We hope to see you again soon Have a wonderful day!");
              message.rate = 1.5; // Adjust the rate of speech
              synth.speak(message);
        } catch (error) {
            console.error('Error generating invoice:', error);
        }
    };

    // Function to trigger print
    const printInvoice = () => {
        const printWindow = window.open('', '_blank', 'width=600,height=600');
        printWindow.document.write(invoiceHtml);
        printWindow.document.close();
        printWindow.print();
    };
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
    
  return (
    <>
    {apiRes !=null?<Alert message={apiRes} />:""}
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
    <div className='flex justify-between items-center'>
      <button className='p-1 m-1 bg-bizopBlue text-white rounded' onClick={logout}>Logout</button>
    <h1 className='text-bizopTextBlue text-3xl'>Bizops Store</h1>
    <div></div>
    </div>
    <main className='flex gap-1'>
        {errors.productName && <Alert message={errors.productName.message} /> }
        {errors.productPrice && <Alert message={errors.productPrice.message} />}
        {errors.productQuantity && <Alert message={errors.productQuantity.message} />}
       
      <section className='border flex flex-col gap-1' style={{height:"70vh",width:"60vw",overflow:"auto"}}>
        <div className='text-bizopTextBlue p-1 text-2xl'>Products:</div>
        <div className='flex justify-between'>
            <h1></h1>
            <h1 className='font-bold text-lg text-bizopTextBlue'>Product Name</h1>
            <h1 className='font-bold text-lg text-bizopTextBlue'>Quantity</h1>
            <h1 className='font-bold text-lg text-bizopTextBlue'>Price</h1>
            <h1 className='font-bold text-lg text-bizopTextBlue'>Discount</h1>
            <h1 className='font-bold text-lg text-bizopTextBlue'>FinalPrice</h1>
        </div>
      
        {products.map((item,index)=>{
            return(
                <div key={index} className='bg-bizopBlue p-1 text-white text-base flex justify-between items-center'>
                <button onClick={()=>removeProduct(index)}  className='border bg-red-600 text-white p-1 px-2'>X</button>
                <h1>{item.name}</h1>
                <h1>x{item.quantity}</h1>
                <h1>{item.price}</h1>
                <h1>{item.discount}%</h1>
                <h1>{item.discountedPrice}</h1>
                </div>
            )
        })}
      
    </section>
    <section className='border' style={{width:"40vw"}}>
        <form className='flex flex-col p-1'>
        <label>Search Product</label>
            <input type='text' placeholder='Search Product' className='border p-1' onChange={handleSearch}></input>
            <div className='my-1'>
            <button className='border p-1'>Search</button>
            <div className=''>
              {searchResults.length > 0 && (
                <div className="search-results bg-bizopBlue p-1" style={{position:"absolute",minWidth:"25vw",maxHeight:"40vh",overflowY:"auto"}}>
                  <ul style={{overflowY:"auto"}}>
                    {searchResults.map((product) => (
                      <li className='bg-white p-1 my-1' key={product.id} onClick={() => selectProduct(product)}>{product.name} - Rs. {product.price}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            </div>
        </form>
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col p-1'>
            <label>Product Name:</label>
            <input type='text' placeholder='Product Name' className='border p-1' {...register('productName',{required:"Please Enter Product Name !"})}></input>
            <label>Product Price:</label>
            <input type='number' placeholder='Product Price' className='border p-1' {...register('productPrice',{required:"Please Enter Product Price !"})}></input>
            <label>Quantity:</label>
            <input type='number' placeholder='Quantity' className='border p-1' {...register('productQuantity',{required:"Please Enter Valid Quantity !"})}></input>
            <label>Discount:</label>
            <input type='text' placeholder='Product Discount' className='border p-1' {...register('productDiscount')}></input>
            <div className='my-1'>
            <button className='border p-1'>Add Product</button>
            <div>
            <button className="border bg-blue-600 text-white p-2 mt-4" onClick={toggleCalculator}>
                Calculator 
            </button>

            {showCalculator && <Calculator closeCalculator={toggleCalculator} />}
            </div>
            <h1 className='text-bizopTextBlue font-bold'>On Duty: {name}</h1>
            </div>
        </form>
    </section>
    </main>
    <div className='my-1 bg-bizopBlue p-1'>
        <span className='text-lg font-bold text-white'>Total: </span>
        <span className='text-lg font-bold text-white'>{totalPrice.toFixed(2)} /Rs.</span>
      </div>
      <div className='bg-bizopBlue p-1 my-1 flex gap-2'>
        <span className='text-white text-xl'>Payment :  </span>
        <input type='number' value={payment} onChange={handleChange} placeholder='Enter Payment' className='border p-1'></input>
        <span className='text-white text-xl'>Return :  </span>
        <input type='number' value={returnAmount.toFixed(2)} disabled className='border p-1'></input>
      </div>
      <div className='my-1 bg-bizopBlue text-white p-1 flex items-center gap-2 text-lg'>
        <span>Payment Mode : </span>
          <label className=''>
            <input
              type="radio"
              value="cash"
              checked={paymentMode === 'cash'}
              onChange={handlePaymentModeChange}
            />
            Cash
          </label>

          <label>
            <input
              type="radio"
              value="card"
              checked={paymentMode === 'card'}
              onChange={handlePaymentModeChange}
            />
            Card
          </label>
            {/* Button to generate invoice */}
            <button
                        onClick={generateInvoice}
                        className="border bg-blue-600 text-white p-2"
                    >
                        Generate Invoice
                    </button>

                    {/* Button to print the generated invoice */}
                    {invoiceHtml && (
                        <button
                            onClick={printInvoice}
                            className="border bg-green-600 text-white p-2"
                        >
                            Print Invoice
                        </button>
                    )}
        </div>
        
     
      <footer className='flex justify-center' style={{width:"100vw",position:"fixed",bottom:"0vh"}}>
      <h1 className='text-lg'>Bizops POS Software</h1>
      </footer>
    </>
  )
}

export default Pos;



