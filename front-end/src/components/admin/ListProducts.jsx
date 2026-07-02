import React, { useEffect, useState } from "react";

import toast from 'react-hot-toast'
import Loader from "../layout/Loader";
import {MDBDataTable} from'mdbreact'
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import { clearCart } from "../../redux/features/cartSlice";
import { useDeleteProductMutation, useGetAdminProductQuery } from "../../redux/api/productApi";
import AdminLayout from "../layout/AdminLayout";


const ListProducts=()=>{
    const {data,isLoading,error}=useGetAdminProductQuery()
    const [deleteProduct,{isLoading:isDeleteLoading,error:deleteError,isSuccess}]=useDeleteProductMutation()
    
 

    

    useEffect(()=>{
        
          if(error){
              toast.error(error?.data?.message)
          }
          if(deleteError){
            toast.error(deleteError?.data?.message)
          }
          if(isSuccess){
            toast.success('Product deleted')
          }
          
      },[error,deleteError,isSuccess])

      const deleteProductHandler=(id)=>{
        deleteProduct(id)
      }
     

      const setProducts=()=>{
        const products={
            columns:[
                {
                    label:'ID',
                    field:'id',
                    sort:'asc',
                },
                {
                    label:'Name',
                    field:'name',
                    sort:'asc',
                },
                {
                    label:'Stock',
                    field:'stock',
                    sort:'asc',
                },
                {
                    label:'Order Status',
                    field:'orderStatus',
                    sort:'asc',
                },
                {
                    label:'Actions',
                    field:'actions',
                    sort:'asc',
                },
            ],
            rows:[],
        }
        data?.product?.forEach((product)=>{
            products.rows.push({
                id:product?._id,
                name:product?.name,
                stock:product?.stock,
                
                actions:(
                    <div className="btn-group">
                    <Link to={`/admin/product/${product?._id}`}className="btn btn-outline-primary">
                        <i className=" fa fa-pencil"></i>
                    </Link>
                    <Link to={`/admin/product/${product?._id}/upload_images`}className="btn btn-outline-success ms-2">
                        <i className=" fa fa-image"></i>
                    </Link>
                    <button className="btn btn-outline-success ms-2"onClick={()=>deleteProductHandler(product?._id)}
                    disabled={isDeleteLoading}>
                        <i className="fa fa-trash"></i>

                    </button>
                    </div>
                )
            })
        })
        return products
      }

    return (
        <AdminLayout>
            <h1 className="my-5">{data?.product?.length} Products</h1>
            <MDBDataTable
            data={setProducts()}
            className='px-3'
            bordered
            striped
            hover
            />
            </AdminLayout>

    )
}

export default ListProducts