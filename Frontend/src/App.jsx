import React from "react"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import LandingPage from "./Components/landingPage"
import Pos from "./Components/pos"
import "./cssFiles/utilities.css"
import Inventory from "./Components/manager/inventory"
import UsersActivity from "./Components/manager/usersActivity"
import SuppliersData from "./Components/manager/suppliersData"
import Reports from "./Components/manager/reports"
import AddNewProducts from "./Components/manager/addNewProducts"
import AddProducts from "./Components/manager/addProducts"
import AddNewUser from "./Components/manager/AddUser"
function App() {
  const ROUTER = createBrowserRouter([
    {
      path:"*",
      element:<>404 Error. Page Not Found!</>
    },
    {
      path:"/",
      element:<><LandingPage/></>
    },
    {
      path:"/pos",
      element:<><Pos/></>
    },
    {
      path:"/management/manager/inventory",
      element:<><Inventory/></>
    },
    {
      path:"/management/manager/usersActivity",
      element:<><UsersActivity/></>
    },
    {
      path:"/management/manager/suppliersData",
      element:<><SuppliersData/></>
    },
    {
      path:"/management/manager/reports",
      element:<><Reports/></>
    },{
      path:"/management/manager/addNewProduct",
      element:<><AddNewProducts/></>
    }
    ,{
      path:"/management/manager/addProduct",
      element:<><AddProducts/></>
    }
    ,{
      path:"/management/manager/addUser",
      element:<><AddNewUser/></>
    }


  ])
  return (
    <>
    <RouterProvider router={ROUTER}/>
   
    </>
  )
}

export default App
