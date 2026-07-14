import { Route, Routes } from 'react-router-dom'

// ######### assets #########
import './App.css'

// ######### Layout #########
import GuestLayout from './layout/GuestLayout'
import UserLayout from './layout/UserLayout'
import AdminLayout from './layout/AdminLayout'
import ManagerLayout from './layout/ManagerLayout'
import PageNotFound from './layout/PageNotFound'

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<GuestLayout />} />
        <Route path='/user' element={<UserLayout />} />
        <Route path='/admin/*' element={<AdminLayout />} />
        <Route path='/manager/*' element={<ManagerLayout />} />
        <Route path='*' element={<PageNotFound />} />
      </Routes>
    </>
  )
}

export default App
