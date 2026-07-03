import express from 'express'
const app=express()


import cors from 'cors'
app.use(cors({
    origin: "https://shop-book-final.vercel.app",
    credentials: true
}))



import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
dotenv.config({path:'Back-end/config/config.env'})  //load biến môi trường từ file .env vào process.env


//Bắt lỗi nghiêm trọng ngoài dự kiến, ví dụ biến chưa khai báo, lỗi syntax/runtime.
process.on('uncaughtException',(err)=>{
    console.log(`ERROR: ${err}`)
    console.log('Shutting down server due to uncaught exception')
    
        process.exit(1)
   
})

//connecting db
connectDB()

app.set("query parser", "extended");

app.use(express.json({limit:'10mb'})) //đọc dữ liệu JSON từ request body
app.use(cookieParser()) //đọc cookie, ví dụ JWT token

//import all routes
import productRoutes from './routes/products.js'
import authRoutes from './routes/auth.js'
import voucherRoutes from "./routes/voucherRoutes.js";
import orderRoutes from './routes/order.js'
import { connectDB } from './config/dbConnect.js'
import errorMiddlewares from './middlewares/errors.js'


//define main routes
app.use('/api/v1', productRoutes)
app.use('/api/v1', authRoutes)
app.use('/api/v1', orderRoutes)
app.use("/api/v1", voucherRoutes);


//using error middlewares
app.use(errorMiddlewares)


const server=app.listen(process.env.PORT,()=>{
    console.log(`Server start  on PORT: ${process.env.PORT} in ${process.env.NODE_ENV} mode`)
})

//handle unhandle promise rejection:dùng để hiện ra lỗi
process.on('unhandledRejection',(err)=>{
    console.log(`ERROR: ${err}`)
    console.log('Shutting down server due to Unhandled Promise Rejection')
    server.close(()=>{
        process.exit(1)
    })
})








/*
Controller (async)
   ↓
catchAsyncErrors()   → Bắt lỗi async
   ↓
next(error)          → Gửi lỗi đến middleware lỗi
   ↓
ErrorHandler         → Định nghĩa cấu trúc lỗi
   ↓
errorMiddleware      → Trả response JSON cho client 

app.js là file chính của backend. Nó dùng Express để tạo server, dotenv để đọc biến môi trường, 
cookie-parser để xử lý cookie JWT, kết nối MongoDB, khai báo các route chính như product, user authentication và order
. Cuối cùng, nó sử dụng middleware xử lý lỗi tập trung và chạy server trên PORT được cấu hình trong file môi trường.

*/