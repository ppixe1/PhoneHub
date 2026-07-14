import { Route, Routes } from 'react-router-dom'

// ######### assets #########
import './App.css'

// ######### Layout #########
import GuestLayout from './layout/GuestLayout'
import HomeLayout from './layout/HomeLayout'
import PageNotFound from './layout/PageNotFound'
import Login from './user/Login/Login'

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<GuestLayout />} />
        <Route path='/home' element={<HomeLayout />} />
        <Route path='/login' element={<Login />} />
        <Route path='*' element={<PageNotFound />} />
      </Routes>
    </>
  )
}

export default App
