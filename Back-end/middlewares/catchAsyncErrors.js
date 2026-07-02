// Hàm này dùng để "bọc" (wrap) các controller async 
// nhằm tự động bắt lỗi mà không cần try...catch trong mỗi controller

export default (controllerFunction)=>   // Nhận vào một hàm controller (ví dụ: newProduct, getProducts, ...)
    (req,res,next)=>    // Trả về một middleware Express tiêu chuẩn (nhận req, res, next)
    Promise.resolve(controllerFunction(req,res,next))  //// Đảm bảo controllerFunction luôn được chuyển thành Promise,goi hàm controller gốc
           .catch(next)



//thay vì sử dụng promise trong mỗi function contronller thì sử sụng export để sử dụng cho mỗi function trong contronller
//xử lí bất đồng bộ async để bắt lỗi, thành công thì chạy function, lỗi thì bắt catch

//Promise :