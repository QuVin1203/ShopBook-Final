import React, { useEffect, useState } from "react";
import { useForgotPasswordMutation } from "../../redux/api/userApi";
import {useNavigate} from 'react-router-dom'
import { useSelector } from "react-redux";
import toast from 'react-hot-toast'

const ForgotPassword=()=>{
    const [email,setEmail]=useState('')

    const [forgotPassword,{isLoading,error,isSuccess}]=useForgotPasswordMutation()

    const navigate=useNavigate()

    const {isAuThenticated}=useSelector((state)=>state.auth)

    
    useEffect(()=>{
      if(isAuThenticated){
        navigate('/')
      }
        if(error){
            toast.error(error?.data?.message)
        }
        if(isSuccess){
            toast.success('Email sent.Please check your inbox')
        }
    },[error,isAuThenticated,isSuccess])

    const submitHandler=(e)=>{
        e.preventDefault()    //ngăn trình duyệt tải lại trang khi form được gửi đi

       
        forgotPassword({email})
    }
    return(
        <div className="row wrapper">
        <div className="col-10 col-lg-5">
          <form
            className="shadow rounded bg-body"
            onSubmit={submitHandler}
          >
            <h2 className="mb-4">Forgot Password</h2>
            <div className="mt-3">
              <label htmlFor="email_field" className="form-label">Enter Email</label>
              <input
                type="email"
                id="email_field"
                className="form-control"
                name="email"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
              />
            </div>
  
            <button
              id="forgot_password_button"
              type="submit"
              className="btn w-100 py-2"
              disabled={isLoading}
            >
              {isLoading?'Sending':'Send email'}
            </button>
          </form>
        </div>
      </div>

    )
}
export default ForgotPassword