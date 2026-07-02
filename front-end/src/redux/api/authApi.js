import {createApi,fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import { userApi } from './userApi'


//fetchBaseQuery : fetchBaseQuery: là hàm tiện ích giúp bạn gửi request đến backend mà không cần tự viết fetch() hay axios.
export const authApi=createApi({
    reducerPath:'authApi',
    baseQuery:fetchBaseQuery({baseUrl:'/api/v1'}),  //tất cả các truy vấn sẽ được gửi đến đường dẫn bắt đầu bằng '/api/v1'
    endpoints:(builder)=>({                        //định nghĩa endpoint login
        
        register:builder.mutation({               //builder.mutation() dùng cho các request có thay đổi dữ liệu (POST, PUT, DELETE...).
            query(body){                          //định nghĩa request gửi đi:
                return {
                    url:'/register',
                    method:'POST',
                    body,

                }
            }                                    //Hook tự động được tạo ra là:
                                                //useRegisterMutation() Dùng trong React component để gọi API:
        }),
        login:builder.mutation({
            query(body){
                return {
                    url:'/login',
                    method:'POST',
                    body,

                }
            },
            async onQueryStarted(args,{dispatch,queryFulfilled}){
                try{
                    await queryFulfilled
                    await dispatch(userApi.endpoints.getMe.initiate(null))
                }catch(error)
                {console.log(error)}
            }
        }),
        logout:builder.query({
            query:()=>'/logout'
        })
        
        
        
        
    })
    })
  export const {useLoginMutation,useRegisterMutation,useLazyLogoutQuery}=authApi



  // goi api backend
  //login/register/logout
  // quan ly loading,error,data
  //đồngbộ redux store

  //fetch:
  //api:(url) cổng giao tiep giữa các phần mềm
  //Backend => API => Fetch => JSON=> Render UI