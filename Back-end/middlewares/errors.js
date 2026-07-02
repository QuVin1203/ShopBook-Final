//middleware này được sử dụng để xử lý các loại lỗi trong ứng dụng Express.js 
//bằng cách trả về một phản hồi JSON với thông điệp lỗi tương ứng và mã trạng thái HTTP.

import ErrorHandler from "../utils/errorHandler.js"


export default (err,req,res,next)=>{  //Đây là một hàm middleware được xuất ra mặc định
    let error={
        statusCode:err?.statusCode || 500,
        message:err?.message || 'Internal Server Error'
    }

    //Handle invalad mongoose id error
    if(err.name==='CastError'){
        const message=`Resource not founf.Invalid:${err?.path}`
        error=new ErrorHandler(message,404)
    }
    //Handle validation errors
    //ValidationError xảy ra khi dữ liệu gửi lên không hợp lệ với schema.
    if(err.name==='ValidationError'){
        const message=Object.values(err.errors).map((value)=>value.message)
        error=new ErrorHandler(message,404)
    }

    //Hiển thị chi tiết lỗi (gồm message, stack trace, toàn bộ object lỗi).
    if(process.env.NODE_ENV === 'DEVELOPMENT'){
        res.status(error.statusCode).json({
            message:error.message,
            error:err,
            stack:err?.stack,
        })
    }
    //Chỉ gửi message ngắn gọn cho client (tránh lộ thông tin nhạy cảm).
    if(process.env.NODE_ENV === 'PRODUCTION'){
        res.status(error.statusCode).json({
            message:error.message,
        })
    }
}

/*[Client gửi request]
        ↓
[Route]  →  [Controller]  →  [Mongoose / Logic app]
                    ↓
           (Xảy ra lỗi? ví dụ: sai ID, thiếu dữ liệu)
                    ↓
         next(new ErrorHandler(...))
                    ↓
       [Middleware catchAsyncErrors] 
                    ↓
       [Middleware xử lý lỗi (error.js)]
                    ↓
  Trả phản hồi JSON cho client (status + message) */