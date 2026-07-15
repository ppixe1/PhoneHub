import { Route, Routes } from 'react-router-dom';


// ######### Pages #########
import OrderHistory from '../user/OrderHistory/OrderHistory'
import Products from '../user/Products/Products'
import Cart from '../user/Cart/Cart'


const UserLayout = () => {
  return ( 
    <>
      {/* <h1>User Layout</h1> */}

      <Products />
    </>
  );
}

export default UserLayout;