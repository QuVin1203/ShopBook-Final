import express from "express";
const router=express.Router()

import { authorizeRoles, isAutheticatedUser } from "../middlewares/auth.js";
import { allOrders, deleteOrder, getOrderDetails, myOrders, newOrder, updateOrder ,confirmPayment, getDashboardSales,} from "../controllers/orderController.js";
//import { getSales } from "../controllers/productControllers.js";
//import { getDashboardSales } from "../controllers/orderController.js";

router.route('/orders/new').post(isAutheticatedUser,newOrder)
router.route('/orders/:id').get(isAutheticatedUser,getOrderDetails)
router.route('/me/orders').get(isAutheticatedUser,myOrders)

router
.route('/admin/get_sales')
.get(isAutheticatedUser,authorizeRoles('admin'),getDashboardSales)

router
.route('/admin/orders')
.get(isAutheticatedUser,authorizeRoles('admin'),allOrders)

router
.route('/admin/orders/:id')
.put(isAutheticatedUser,authorizeRoles('admin'),updateOrder)
.delete(isAutheticatedUser,authorizeRoles('admin'),deleteOrder)

router.put(
  "/admin/orders/:id/payment",
  isAutheticatedUser,
  authorizeRoles("admin"),
  confirmPayment
);


export default router