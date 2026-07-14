import { useState, useEffect } from "react";
import axios from 'axios'

// LAYOUT
import UserLayout from '../layout/UserLayout'
import AdminLayout from '../layout/AdminLayout'
import ManagerLayout from '../layout/ManagerLayout'

const HomeLayout = () => {
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');
  const [userId, setUserId] = useState('');
  const [name, setName] = useState('');

  const getUserData = async () => {
    try {
      const token = sessionStorage.getItem('token');
      if (!token) return alert('คุณไม่มี Token กรุณาเข้าสู่ระบบใหม่อีกครั้ง')

      const res = await axios.get(`http://localhost:3000/auth/me/${token}`)
      setUsername(res.data.user.username)
      setRole(res.data.user.role)
      setUserId(res.data.user.id)
      setName(res.data.user.name)
    }
    catch (error) {
      console.error('Error getting user data:', error)
    }
  }

  useEffect(() => {
    getUserData()
  }, [])
  
  useEffect(() => {
    console.log(username, role, userId, name)
  }, [username, role, userId, name])

  return ( 
  <>
    {role === 'user' && <UserLayout />}
    {role === 'admin' && <AdminLayout />}
    {role === 'manager' && <ManagerLayout />}
  </>
  );
}

export default HomeLayout;