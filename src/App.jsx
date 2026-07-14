import React, { useState } from 'react';
import Auth from './component/Auth';
import Products from './component/Products';
import Cart from './component/Cart';
import Payment from './component/Payment';
import OrderTracking from './component/OrderTracking';

export default function App() {
  const [step, setStep] = useState('auth'); // หน้าเริ่มต้น: auth, home, cart, payment, tracking
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);

  // ฟังก์ชันเมื่อล็อกอินสำเร็จ
  const handleLogin = (userData) => { 
    setUser(userData); 
    setStep('home'); 
  };

  // ฟังก์ชันเพิ่มสินค้าลงตะกร้า
  const handleAddToCart = (product) => {
    setCartItems(prev => {
      const exist = prev.find(item => item.id === product.id);
      if (exist) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  // ฟังก์ชันปรับจำนวนสินค้าในตะกร้า
  const handleUpdateQuantity = (id, q) => {
    if (q <= 0) return;
    setCartItems(prev => prev.map(item => item.id === id ? { ...item, quantity: q } : item));
  };

  // ฟังก์ชันลบสินค้าออกจากตะกร้า
  const handleRemove = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  // คำนวณจำนวนชิ้นของสินค้าทั้งหมดในตะกร้าเพื่อส่งไปแสดงที่ไอคอน
  const totalCartCount = cartItems.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div>
      {/* ลบแถบเมนูทดสอบสีดำออกเรียบร้อยแล้ว */}

      {/* ส่วนแสดงผลแต่ละหน้าตาม Step */}
      {step === 'auth' && (
        <Auth onLoginSuccess={handleLogin} />
      )}
      
      {step === 'home' && (
        <Products 
          onAddToCart={handleAddToCart} 
          cartCount={totalCartCount} 
          onViewCart={() => setStep('cart')} 
        />
      )}
      
      {step === 'cart' && (
        <Cart 
          cartItems={cartItems} 
          onUpdateQuantity={handleUpdateQuantity} 
          onRemove={handleRemove} 
          onNextStep={() => setStep('payment')} 
          onBack={() => setStep('home')} 
        />
      )}
      
      {step === 'payment' && (
        <Payment 
          cartItems={cartItems} 
          onPaymentSuccess={() => {
            // เมื่อจ่ายเงินสำเร็จ ให้ล้างสินค้าในตะกร้าออก แล้วเด้งไปหน้าติดตามสถานะ
            setCartItems([]);
            setStep('tracking');
          }} 
        />
      )}
      
      {step === 'tracking' && (
        <OrderTracking user={user} />
      )}
    </div>
  );
}