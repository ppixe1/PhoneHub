import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode';

// LAYOUT
import UserLayout from '../layout/UserLayout'
import AdminLayout from '../layout/AdminLayout'
import ManagerLayout from '../layout/ManagerLayout'

const HomeLayout = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');
  const [userId, setUserId] = useState('');
  const [name, setName] = useState('');

  const getUserData = async () => {
    try {
      const token = sessionStorage.getItem('token');
      if (!token) return alert('คุณไม่มี Token กรุณาเข้าสู่ระบบใหม่อีกครั้ง')

      const data = jwtDecode(token)
      
      setUsername(data.username)
      setRole(data.role)
      setUserId(data.user_id)
      setName(data.name)
    }
    catch (error) {
      console.error('Error getting user data:', error)
    }
  }

  useEffect(() => {
    if (!sessionStorage.getItem('token')) {
      navigate('/login')
    }
    getUserData()
  }, [])

  return ( 
  <>
    {role === 'user' && <UserLayout />}
    {role === 'admin' && <AdminLayout />}
    {role === 'manager' && <ManagerLayout />}
  </>
  );
}

export default HomeLayout;