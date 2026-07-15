import React, { useState } from 'react';
import axiosInstance from '../axiosConfig'; 

const theme = {
  primary: '#B00000',
  background: '#FAFAFA',
  accent: '#FFD129',
  fontFamily: "'Kanit', sans-serif"
};

export default function Cart({ cartItems, setCartItems, onNextStep, onBack }) {
  const [selectedItems, setSelectedItems] = useState([]);

  const handleToggleItem = (id) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    );
  };

  // ฟังก์ชันยิง API อัปเดตจำนวนสินค้า
  const handleUpdateQuantity = async (id, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await axiosInstance.patch(`/cart/update/${id}`, { quantity: newQuantity });
      const updatedItems = cartItems.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      );
      setCartItems(updatedItems);
    } catch (error) {
      console.error('Update quantity failed:', error);
      alert('ไม่สามารถอัปเดตจำนวนสินค้าได้');
    }
  };

  // ฟังก์ชันยิง API ลบสินค้า
  const handleRemove = async (id) => {
    try {
      await axiosInstance.delete(`/cart/remove/${id}`);
      const filteredItems = cartItems.filter(item => item.id !== id);
      setCartItems(filteredItems);
      setSelectedItems(prev => prev.filter(itemId => itemId !== id));
    } catch (error) {
      console.error('Remove item failed:', error);
      alert('ไม่สามารถลบสินค้าได้');
    }
  };

  const selectedCartItems = cartItems.filter(item => selectedItems.includes(item.id));
  const totalAmount = selectedCartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const hasCartItems = cartItems.length > 0;
  const hasSelectedItems = selectedItems.length > 0;

  return (
    <div style={{ fontFamily: theme.fontFamily, backgroundColor: theme.background, minHeight: '100vh' }}>
      <div style={{ backgroundColor: theme.primary, color: '#fff', padding: '15px 5%', display: 'flex', alignItems: 'center', gap: '15px' }}>
        <div onClick={onBack} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', padding: '4px', borderRadius: '50%' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </div>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>ตะกร้าสินค้า</h1>
      </div>

      <div style={{ padding: '40px 5%', display: 'grid', gridTemplateColumns: hasSelectedItems ? '2fr 1fr' : '1fr', gap: '30px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', minHeight: '300px' }}>
          {!hasCartItems ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
              <p style={{ fontSize: '18px', color: '#666' }}>ไม่มีสินค้าในตะกร้า</p>
            </div>
          ) : (
            cartItems.map(item => (
              <div key={item.id} style={{ backgroundColor: '#fff', border: '1px solid #ddd', padding: '15px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <input type="checkbox" checked={selectedItems.includes(item.id)} onChange={() => handleToggleItem(item.id)} style={{ width: '20px', height: '20px', accentColor: theme.primary, cursor: 'pointer' }} />
                  <div style={{ width: '60px', height: '60px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <img src={item.img} alt={item.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '600' }}>{item.name}</div>
                    <div style={{ fontSize: '12px', color: theme.primary }}>฿{item.price.toLocaleString()}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {/* เรียกใช้ฟังก์ชัน API ที่สร้างไว้ */}
                  <button onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}>-</button>
                  <span style={{ fontSize: '14px' }}>{item.quantity}</span>
                  <button onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}>+</button>
                  <button onClick={() => handleRemove(item.id)} style={{ marginLeft: '15px', color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>ลบ</button>
                </div>
              </div>
            ))
          )}
        </div>

        {hasSelectedItems && (
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #ddd', padding: '20px', borderRadius: '4px', height: 'fit-content' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '15px' }}>รายการยอดรวมสินค้า</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '15px', maxHeight: '200px', overflowY: 'auto' }}>
              {selectedCartItems.map(item => (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' }}>
                  <div style={{ width: '40px', height: '40px', border: '1px solid #eee', borderRadius: '4px', display: 'flex', alignItems: 'center' }}>
                    <img src={item.img} alt={item.name} style={{ maxWidth: '100%', maxHeight: '100%' }} />
                  </div>
                  <div style={{ flex: 1 }}>{item.name}</div>
                  <div>x{item.quantity}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '16px' }}>
              <span>ยอดรวมสุทธิ</span>
              <span>฿{totalAmount.toLocaleString()}</span>
            </div>
            <button onClick={onNextStep} style={{ width: '100%', backgroundColor: theme.primary, color: '#fff', border: 'none', padding: '12px', marginTop: '20px', borderRadius: '4px', cursor: 'pointer' }}>
              ชำระเงิน
            </button>
          </div>
        )}
      </div>
    </div>
  );
}