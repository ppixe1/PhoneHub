import { Route, Routes } from 'react-router-dom'

// ######### assets #########
import './App.css'

// ######### Layout #########
import GuestLayout from './layout/GuestLayout'
import HomeLayout from './layout/HomeLayout'
import PageNotFound from './layout/PageNotFound'

// ######### Pages #########
import Login from './user/Login/Login'
import Cart from './user/Cart/Cart'
import OrderHistory from './user/OrderHistory/OrderHistory'

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<GuestLayout />} />
        <Route path='/home' element={<HomeLayout />} />
        <Route path='/login' element={<Login />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/order-history' element={<OrderHistory />} />
        <Route path='*' element={<PageNotFound />} />
      </Routes>
    </>
  )
}

export default App
