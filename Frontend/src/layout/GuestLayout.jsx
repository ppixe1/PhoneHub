import { Route, Routes } from 'react-router-dom';
import Login from '../user/Login/Login'

const GuestLayout = () => {
  return ( 
    <>
      {/* <h1>Guest Layout</h1> */}

      <Login />
    </>
  );
}

export default GuestLayout;