import {createApi,fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import { setIsAuthenticated, setLoading, setUser } from '../features/userSlice'



const API_URL = process.env.REACT_APP_API_URL;
export const userApi=createApi({
    reducerPath:'userApi',
    baseQuery:fetchBaseQuery({baseUrl:`${API_URL}/api/v1`, credentials: "include"}), 
    tagTypes:['User','AdminUsers','AdminUser'], //tất cả các truy vấn sẽ được gửi đến đường dẫn bắt đầu bằng '/api/v1'
    endpoints:(builder)=>({                        //định nghĩa endpoint login
        getMe:builder.query({
            query:()=>'/me',
            transformResponse:(result)=>result.user,
            async onQueryStarted(args,{dispatch,queryFulfilled}){
                try{
                    const {data}=await queryFulfilled
                    dispatch(setUser(data))
                    dispatch(setIsAuthenticated(true))
                    dispatch(setLoading(false))
                }catch(error){
                    dispatch(setLoading(false))
                    console.log(error)
                }
            },
            invalidatesTags:['User']
        }),
      
        updateProfile:builder.mutation({
            query(body){
                return {
                    url:'/me/update',
                    method:'PUT',
                    body,

                }
            },
            invalidatesTags:['User']
        }),
        uploadAvatar:builder.mutation({
            query(body){
                return {
                    url:'/me/upload_avatar',
                    method:'PUT',
                    body,

                }
            },
            invalidatesTags:['User']
        }),
        updatePassword:builder.mutation({
            query(body){
                return {
                    url:'/password/update',
                    method:'PUT',
                    body,

                }
            },
          
        }),
        forgotPassword:builder.mutation({
            query(body){
                return {
                    url:'/password/forgot',
                    method:'POST',
                    body,

                }
            },
          
        }),
        resetPassword: builder.mutation({
  query({ token, password }) {
    return {
      url: `/password/reset/${token}`,
      method: "PUT",
      body: { password },
    };
  },
}),
        getAdminUsers:builder.query({
            query:()=>`/admin/users`,
            providesTags:['AdminUsers']
                    
           
          
        }),
        getUserDetails:builder.query({
            query:(id)=>`/admin/users/${id}`,
            providesTags:['AdminUser']
                    
           
          
        }),
        updateUser:builder.mutation({
            query({id,body}){

             return {
                url:`/admin/users/${id}`,
                method:'PUT',
            body,
                    
        }
        
    },
    invalidatesTags:['AdminUsers']
          
        }),
        deleteUser:builder.mutation({
            query(id){

             return {
                url:`/admin/users/${id}`,
                method:'DELETE',
            
                    
        }
        
    },
    invalidatesTags:['AdminUsers']
          
        })
       
    })
    })
  //export const {useGetMeQuery,useUpdateProfileMutation,useUploadAvatarMutation}=userApi
  export const { useGetMeQuery, 
    useUpdateProfileMutation,
    useUploadAvatarMutation,
    useUpdatePasswordMutation,
    useForgotPasswordMutation ,
useGetAdminUsersQuery,
useGetUserDetailsQuery,
useUpdateUserMutation,
useDeleteUserMutation,
useResetPasswordMutation} = userApi;
