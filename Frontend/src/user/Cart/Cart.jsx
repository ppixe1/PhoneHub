import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const theme = {
  primary: '#B00000',
  background: '#FAFAFA',
  accent: '#FFD129',
  fontFamily: "'Kanit', sans-serif"
};

export default function Cart() {
  // ---------------------------------------------------------------------------
  // 1. STATES
  // ---------------------------------------------------------------------------
  const [cartItems, setCartItems] = useState([]); // รายการสินค้าทั้งหมดในตะกร้า (มี quantity ของแต่ละตัวอยู่แล้ว)
  const [selectedItems, setSelectedItems] = useState([]); // เก็บ ID ของสินค้าที่ถูกติ๊กเลือก
  const [isLoading, setIsLoading] = useState(true); // สถานะรอโหลดข้อมูลจาก API

  const navigate = useNavigate();

  // ---------------------------------------------------------------------------
  // 2. COMPUTED VALUES
  // ---------------------------------------------------------------------------
  const hasCartItems = cartItems.length > 0;
  const hasSelectedItems = selectedItems.length > 0;
  
  const selectedCartItems = cartItems.filter(item => selectedItems.includes(item.id));
  
  const totalAmount = selectedCartItems.reduce(
    (sum, item) => sum + (item.price * item.quantity), 
    0
  );

  // ---------------------------------------------------------------------------
  // 3. API FUNCTIONS
  // ---------------------------------------------------------------------------
  
  // ดึงข้อมูลตะกร้าสินค้าตอนเปิดหน้านี้ครั้งแรก (ดึง quantity ของแต่ละชิ้นมาจาก DB)
  useEffect(() => {
    const fetchCartData = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get('http://localhost:3000/cart', {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`
          }
        });
        // ใน res.data จะมีข้อมูลแต่ละ item เป็น { id, model, price, quantity, img, ... }
        setCartItems((res.data) );
      } catch (error) {
        console.error("Failed to fetch cart:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCartData();
  }, []);

  // ฟังก์ชันติ๊กเลือก/เลิกเลือก สินค้า
  const handleToggleItem = (id) => {
    setSelectedItems(prev =>
      prev.includes(id) 
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    );
  };

  // ฟังก์ชันอัปเดตจำนวนสินค้า (แยกตาม ID ของสินค้าแต่ละชิ้น)
  const updateQuantity = async (id, action) => {
    // หาข้อมูลสินค้าปัจจุบันที่ต้องการอัปเดต
    const targetItem = cartItems.find(item => item.id === id);
    if (!targetItem) return;

    // คำนวณค่า quantity ใหม่
    let newQuantity = targetItem.quantity;
    if (action === '+') {
      newQuantity += 1;
    } else {
      newQuantity = targetItem.quantity > 1 ? targetItem.quantity - 1 : 1;
    }

    // เจตนาทำ Optimistic UI: อัปเดตหน้าจอทันทีเพื่อให้ผู้ใช้รู้สึกลื่นไหล
    setCartItems(prev => 
      prev.map(item => item.id === id ? { ...item, quantity: newQuantity } : item)
    );

    // ยิง API ไปบันทึกที่ Database
    try {
      await axios.put('http://localhost:3000/cart', 
        { id, quantity: newQuantity }, 
        {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`
          }
        }
      );
    } catch (error) {
      console.error("Failed to update quantity in DB:", error);
      // ถ้ายิง API พลาด สามารถดึงข้อมูลใหม่มาทับเพื่อ Rollback ได้
    }
  };

  // ฟังก์ชันลบสินค้าออกจากตะกร้า
  const onRemove = async (id) => {
    try {
      // แนะนำให้แก้ไอดีส่งไปลบให้ตรงกับหลังบ้านด้วยครับ (ใช้ item.id หรือ item.product_id)
      await axios.delete(`http://localhost:3000/cart/${id}`);
      
      setCartItems(prev => prev.filter(item => item.id !== id));
      setSelectedItems(prev => prev.filter(itemId => itemId !== id));
    } catch (error) {
      console.error("Failed to remove item:", error);
    }
  };

  const onNextStep = async () => {
    console.log("Proceeding to checkout with items:", selectedCartItems);
    console.log("Total Amount:", totalAmount);
  };

  const onBack = () => {
    navigate('/home');
  };

  // ---------------------------------------------------------------------------
  // 4. RENDER UI
  // ---------------------------------------------------------------------------
  return (
    <div style={{ fontFamily: theme.fontFamily, backgroundColor: theme.background, minHeight: '100vh' }}>
      <div className='position-sticky top-0 z-3' style={{ backgroundColor: theme.primary, color: '#fff', padding: '15px 5%', display: 'flex', alignItems: 'center', gap: '15px', maxHeight:'60px' }}>
        <div 
          onClick={onBack} 
          style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', padding: '4px', borderRadius: '50%', transition: 'background-color 0.2s' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </div>
        
        <h3 className='ps-3' style={{ borderLeft:'12px solid #FFD129'}}>ตะกร้าสินค้า</h3>
      </div>

      <div style={{ padding: '40px 5%', display: 'grid', gridTemplateColumns: hasSelectedItems ? '2fr 1fr' : '1fr', gap: '30px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', minHeight: '300px' }}>
          
          {isLoading ? (
             <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1, height: '100%' }}>
               <p style={{ fontSize: '18px', color: '#666', fontWeight: '500', fontFamily: theme.fontFamily }}>กำลังโหลด...</p>
             </div>
          ) : !hasCartItems ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1, height: '100%' }}>
              <p style={{ fontSize: '18px', color: '#666', fontWeight: '500', fontFamily: theme.fontFamily }}>ไม่มีสินค้าในตะกร้า</p>
            </div>
          ) : (
            cartItems.map(item => (
              <div key={item.id} style={{ backgroundColor: '#fff', border: '1px solid #ddd', padding: '15px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <input 
                    type="checkbox" 
                    checked={selectedItems.includes(item.id)}
                    onChange={() => handleToggleItem(item.id)}
                    style={{ width: '20px', height: '20px', accentColor: theme.primary, cursor: 'pointer' }} 
                  />
                  
                  <div style={{ width: '60px', height: '60px', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
                    <img src={item.img} alt={item.model} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '600', fontFamily: theme.fontFamily }}>{item.model}</div>
                    <div style={{ fontSize: '14px', fontWeight: 'normal', fontFamily: theme.fontFamily }}>สี: {item.color} ความจุ: {item.storage}</div>
                    <div style={{ fontSize: '12px', color: theme.primary, fontFamily: theme.fontFamily }}>฿{item.price.toLocaleString()}</div>
                  </div>
                </div>
                
                {/* แก้ไขส่วนนี้: เปลี่ยนจาก quantity เฉยๆ เป็น item.quantity */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button className='btn btn-outline-secondary' onClick={() => updateQuantity(item.id, "-")} style={{ padding: '2px 8px', fontFamily: theme.fontFamily, cursor: 'pointer' }}>-</button>
                  <span style={{ fontSize: '14px', fontFamily: theme.fontFamily, width: '20px', textAlign: 'center' }}>{item.quantity}</span>
                  <button className='btn btn-outline-secondary' onClick={() => updateQuantity(item.id, "+")} style={{ padding: '2px 8px', fontFamily: theme.fontFamily, cursor: 'pointer' }}>+</button>
                  <button onClick={() => onRemove(item.id)} style={{ marginLeft: '15px', color: 'red', border: 'none', background: 'none', cursor: 'pointer', fontSize: '12px', fontFamily: theme.fontFamily }}>ลบ</button>
                </div>
              </div>
            ))
          )}
        </div>

        {hasSelectedItems && (
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #ddd', padding: '20px', borderRadius: '4px', height: 'fit-content' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 15px 0', borderBottom: '1px solid #eee', paddingBottom: '10px', fontFamily: theme.fontFamily }}>รายการยอดรวมสินค้า</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '15px', maxHeight: '200px', overflowY: 'auto' }}>
              {selectedCartItems.map(item => (
                <div key={`summary-${item.id}`} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' }}>
                  <div style={{ width: '40px', height: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid #eee', borderRadius: '4px', backgroundColor: '#fff', flexShrink: 0 }}>
                    <img src={item.img} alt={item.model} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                  </div>
                  <div style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontFamily: theme.fontFamily }}>
                    {item.model}
                  </div>
                  <div style={{ color: '#666', flexShrink: 0, fontFamily: theme.fontFamily }}>
                    x{item.quantity}
                  </div>
                </div>
              ))}
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '15px 0' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '10px', fontFamily: theme.fontFamily }}>
              <span>ยอดรวม</span>
              <span>฿{totalAmount.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '10px', fontFamily: theme.fontFamily }}>
              <span>ส่วนลด</span>
              <span>-฿0</span>
            </div>
            <hr style={{ border: 'none', borderTop: '1px solid #ccc', margin: '15px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: 'bold', marginBottom: '20px', fontFamily: theme.fontFamily }}>
              <span>ยอดรวมสุทธิ</span>
              <span style={{ color: theme.primary }}>฿{totalAmount.toLocaleString()}</span>
            </div>
            <button 
              onClick={onNextStep}
              style={{ width: '100%', backgroundColor: theme.primary, color: '#fff', border: 'none', padding: '12px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', textAlign: 'center', borderRadius: '4px', fontFamily: theme.fontFamily }}
            >
              ชำระเงิน
            </button>
          </div>
        )}
      </div>
    </div>
  );
}