import {createApi,fetchBaseQuery} from '@reduxjs/toolkit/query/react'
//import { getAdminProduct } from '../../../../Back-end/controllers/productControllers'
//import { canUserReview } from '../../../../Back-end/controllers/productControllers'
//import { getProducts } from '../../../../Back-end/controllers/productControllers.js'
//Gửi request đến backend.
//Quản lý trạng thái (isLoading, error, data, v.v.) mà không cần code thủ công.

const API_URL = process.env.REACT_APP_API_URL;
console.log("API_URL =", API_URL);
export const productApi=createApi({
    reducerPath:'productApi',
    baseQuery:fetchBaseQuery({baseUrl:`${API_URL}/api/v1`}),
    tagTypes:['Product','AdminProducts','Reviews'],
    endpoints:(builder)=>({
        getProducts: builder.query({
  query: (params = {}) => ({
    url: "/product",
    params: {
      page: params?.page,
      keyword: params?.keyword,
      category: params?.category,
      resPerPage: params?.resPerPage,

      "price[gte]": params?.["price[gte]"],
      "price[lte]": params?.["price[lte]"],
      "ratings[gte]": params?.["ratings[gte]"],
    },
  }),
}),
        getProductDetails:builder.query({
            query:(id)=>`/product/${id}`,
            providesTags:['Product']
        }),
        submitReview:builder.mutation({
            query(body){
                return{
                    url:'/reviews',
                    method:'PUT',
                    body,
                }
            },
            invalidatesTags:['Product']
        }),
        canUserReview:builder.query({
            query:(productId)=>`/can_review/?productId=${productId}`,
            
        }),
        getAdminProduct:builder.query({
            query:()=>`/admin/product`,
            providesTags:['AdminProducts']
            
        }),
        createProduct:builder.mutation({
            query(body) {
                return {
                    url:'./admin/product',
                    method:'POST',
                    body,
                }
            },
            invalidatesTags:['AdminProducts']
            
        }),
        updateProduct:builder.mutation({
            query({id,body}) {
                return {
                    url:`./admin/product/${id}`,
                    method:'PUT',
                    body,
                }
            },
            invalidatesTags:['Product','AdminProducts']
            
        }),
        uploadProductImages:builder.mutation({
            query({id,body}) {
                return {
                    url:`./admin/product/${id}/upload_images`,
                    method:'PUT',
                    body,
                }
            },
            invalidatesTags:['Product']
            
        }),
        deleteProductImages:builder.mutation({
            query({id,body}) {
                return {
                    url:`./admin/product/${id}/delete_images`,
                    method:'PUT',
                    body,
                }
            },
            invalidatesTags:['Product']
            
        }),
        deleteProduct:builder.mutation({
            query(id) {
                return {
                    url:`/admin/product/${id}`,
                    method:'DELETE',
                   
                }
            },
            invalidatesTags:['AdminProducts']
            
        }),
        getProductReviews:builder.query({
            query:(productId)=>`/reviews?id=${productId}`,
            providesTags:['Reviews']
           
            
        }),
        deleteReview:builder.mutation({
            query({productId,id}) {
                return {
                    url:`/admin/reviews?productId=${productId}&id=${id}`,
                    method:'DELETE',
                   
                }
            },
            invalidatesTags:['Reviews']
            
        }),
    })
    })
  export const {useGetProductsQuery,
    useGetProductDetailsQuery,
useSubmitReviewMutation,
useCanUserReviewQuery,
useGetAdminProductQuery,
useCreateProductMutation,
useUpdateProductMutation,
useUploadProductImagesMutation,
useDeleteProductImagesMutation,
useDeleteProductMutation,
useLazyGetProductReviewsQuery,
useDeleteReviewMutation}=productApi