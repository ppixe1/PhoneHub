import { Route, Routes } from 'react-router-dom'
import { Toaster } from 'sonner';

// ######### assets #########
import './App.css'

// ######### Layout #########
import GuestLayout from './layout/GuestLayout'
import HomeLayout from './layout/HomeLayout'
import PageNotFound from './layout/PageNotFound'

// ######### Pages #########
import Login from './user/Login/Login'
import Cart from './user/Cart/Cart'
import Payment from './user/Payment/Payment'
import OrderHistory from './user/OrderHistory/OrderHistory'

function App() {
  return (
    <>
      <Toaster position="top-right" richColors />
      <Routes>
        <Route path='/' element={<GuestLayout />} />
        <Route path='/home' element={<HomeLayout />} />
        <Route path='/login' element={<Login />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/payment' element={<Payment />} />
        <Route path='/order-history' element={<OrderHistory />} />
        <Route path='*' element={<PageNotFound />} />
      </Routes>
    </>
  )
}

export default App
