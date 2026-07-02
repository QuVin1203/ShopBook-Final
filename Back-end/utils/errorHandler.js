class ErrorHandler extends Error {   //Error là class có sẵn trong JS, dùng để biểu diễn lỗi
    constructor(message,statusCode){
        super(message)
        this.statusCode=statusCode

        //create  stack property
        Error.captureStackTrace(this,this.constructor)//tạo stack để lưu trữ thông tin lỗi
    }
}

export default ErrorHandler


//kiến thức về classes