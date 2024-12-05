import React, { useState } from "react";
import Logo from "../Logos/onlyLogo.svg";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import "../cssFiles/utilities.css";
import Alert from "./alert";
import Footer from "./footer";
const LandingPage = () => {
  const [loginRes,setLoginRes]= useState("");
  const NAVIGATE = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting},
  } = useForm();
  const onSubmit = async (data) => {
      try {
        let response= await fetch('http://localhost:3000/login',{
          method:"POST",
          headers:{
            'Content-type':"application/json"
          },
          body: JSON.stringify(data)
         });
         let responseData = await response.json();
         if(responseData.msg==true && responseData.data[0].post == "Cashier"){
           NAVIGATE('/pos',{state:{name:responseData.data[0].name}});
           const token = responseData.token;
           localStorage.setItem("authenticationToken",token);
           localStorage.setItem("name",responseData.data[0].name);
         }else if(responseData.msg==true && responseData.data[0].post == "Manager"){
          NAVIGATE('/management/manager/inventory',{state:{name:responseData.data[0].name}});
          const token = responseData.token;
          localStorage.setItem("authenticationToken",token);
         }else{
          setLoginRes(responseData.msg);
         }
      } catch (error) {
        console.log('Error:',error)
      }
  };
   
  return (
    <>
      <section
        className=""
        style={{ height: "100vh", width: "100vw", overflowX: "hidden" }}
      >
        <div className="my-4 gap-2 flex flex-col justify-center items-center">
          <h1 className="text-bizopTextBlue text-5xl">BizOps</h1>
          <h1 className="text-bizopTextBlue">
            All-in-One Solutions for Every Business Need
          </h1>
        </div>
        {errors.password && <Alert message={errors.password.message} />}
        {errors.specialId && <Alert message={errors.specialId.message} />}
        {loginRes !=""?<Alert message={loginRes} />:""}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className=" flex flex-col gap-4 items-center justify-center"
        >
          <img src={Logo} alt="Logo" className="" style={{ height: "30vh" }} />
          <div className="flex justify-center items-center gap-2">
            <label>SpecialID</label>
            <input
              className="border p-2"
              type="text"
              placeholder="Enter Your ID."
              {...register("specialId", { required: "SpecialID is Required!" })}
              style={{ minWidth: "30vw" }}
            />
          </div>
          <div className="flex justify-center items-center gap-2">
            <label>Password</label>
            <input
              className="border p-2"
              type="password"
              placeholder="Enter Your Password."
              {...register("password", {
                required: "Password is Required!",
                minLength: {
                  value: "8",
                  message: "Password Must Be At Least 8 Characters Long!",
                },
              })}
              style={{ minWidth: "30vw" }}
            />
          </div>
          <div>
            <button
              className="text-bizopTextBlue text-lg border p-2 px-3 cursor-pointer rounded-lg"
              type="submit"
              disabled={isSubmitting}
            >
              Submit
            </button>
          </div>
          {isSubmitting && (
            <span className="p-2 bg-green-900 text-white rounded-xl">Submitting</span>
          )}
         
        </form>
        <Footer />
      </section>
    </>
  );
};

export default LandingPage;
