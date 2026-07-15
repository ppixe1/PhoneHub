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

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<GuestLayout />} />
        <Route path='/home' element={<HomeLayout />} />
        <Route path='/login' element={<Login />} />
        <Route path='/home/cart' element={<Cart />} />
        <Route path='*' element={<PageNotFound />} />
      </Routes>
    </>
  )
}

export default App
