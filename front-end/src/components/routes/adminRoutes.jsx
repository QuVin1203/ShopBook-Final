import React from "react";
import { Route } from "react-router-dom";
import ProtectedRoute from "../auth/ProtectedRouter";
import Dashboard from "../admin/Dashboard";
import ListProducts from "../admin/ListProducts";
import NewProduct from "../admin/NewProduct";
import UpdateProduct from "../admin/UpdateProduct";
import UploadImages from "../admin/UploadImages";
import ListOrders from "../admin/ListOrders";
import AdminLayout from "../layout/AdminLayout";
import ProcessOrder from "../admin/ProcessOrder";
import ListUser from "../admin/ListUser";
import UpdateUser from "../admin/UpdateUser";
import ProductPreviews from "../admin/ProductPreviews";
import AdminVouchers from "../admin/AdminVouchers";

const adminRoutes=()=>{
    
    return (
    <>
    <Route
    path="/admin/dashboard"
    element={
        <ProtectedRoute admin={true}>
            <Dashboard/>

        </ProtectedRoute>
        }
        />

<Route
    path="/admin/product"
    element={
        <ProtectedRoute admin={true}>
            

        <ListProducts/></ProtectedRoute>
        }
        />
        <Route
    path="/admin/product/new"
    element={
        <ProtectedRoute admin={true}>
            <NewProduct/>

        </ProtectedRoute>
        }
        />
        <Route
    path="/admin/product/:id"
    element={
        <ProtectedRoute admin={true}>
            <UpdateProduct/>

        </ProtectedRoute>
        }
        />
        <Route
    path="/admin/product/:id/upload_images"
    element={
        <ProtectedRoute admin={true}>
            <UploadImages/>

        </ProtectedRoute>
        }
        />
        <Route
    path="/admin/orders"
    element={
        <ProtectedRoute admin={true}>
            <ListOrders/>

        </ProtectedRoute>
        }
        />
        <Route
    path="/admin/orders/:id"
    element={
        <ProtectedRoute admin={true}>
            <ProcessOrder/>

        </ProtectedRoute>
        }
        />
        <Route
    path="/admin/users"
    element={
        <ProtectedRoute admin={true}>
            <ListUser/>

        </ProtectedRoute>
        }
        />
         <Route
    path="/admin/users/:id"
    element={
        <ProtectedRoute admin={true}>
            <UpdateUser/>

        </ProtectedRoute>
        }
        />
         <Route
    path="admin/reviews"
    element={
        <ProtectedRoute admin={true}>
            <ProductPreviews/>

        </ProtectedRoute>
        }
        />
        <Route
  path="/admin/vouchers"
  element={<AdminVouchers />}
/>
    </>

    
    )
}
export default adminRoutes