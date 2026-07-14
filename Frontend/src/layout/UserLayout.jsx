// ######### Pages #########
import { Route, Routes } from 'react-router-dom';
import OrderHistory from '../user/OrderHistory/OrderHistory'

const UserLayout = () => {
  return ( 
    <>
      {/* <h1>User Layout</h1> */}

      <OrderHistory />
    </>
  );
}

export default UserLayout;