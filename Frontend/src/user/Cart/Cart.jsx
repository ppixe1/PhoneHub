import React, { useState } from 'react';

const theme = {
  primary: '#B00000',
  background: '#FAFAFA',
  accent: '#FFD129',
  fontFamily: "'Kanit', sans-serif"
};

// เพิ่มพรอพ onBack เข้ามาสำหรับปุ่มย้อนกลับ
export default function Cart() {
  const [cartItem, setCartItem] = useState([]);


  return (
    <div style={{ fontFamily: theme.fontFamily, backgroundColor: theme.background, minHeight: '100vh' }}>
      {/* Header พร้อมไอคอนย้อนกลับ */}
      <div style={{ backgroundColor: theme.primary, color: '#fff', padding: '15px 5%', display: 'flex', alignItems: 'center', gap: '15px' }}>
        {/* ไอคอนย้อนกลับ (ลูกศรซ้าย) */}
        <div 
          onClick={onBack} 
          style={{ 
            display: 'flex', 
            alignItems: 'center',
            cursor: 'pointer',
            padding: '4px',
            borderRadius: '50%',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </div>
        
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, fontFamily: theme.fontFamily, lineHeight: 1 }}>
          ตะกร้าสินค้า
        </h1>
      </div>

      {/* ปรับเป็น 2 คอลัมน์ "เมื่อมีการติ๊กเลือกสินค้า" เท่านั้น */}
      <div style={{ 
        padding: '40px 5%', 
        display: 'grid', 
        gridTemplateColumns: hasSelectedItems ? '2fr 1fr' : '1fr', 
        gap: '30px' 
      }}>
        {/* รายการสินค้าฝั่งซ้าย */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', minHeight: '300px' }}>
          {!hasCartItems ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1, height: '100%' }}>
              <p style={{ fontSize: '18px', color: '#666', fontWeight: '500', fontFamily: theme.fontFamily }}>ไม่มีสินค้าในตะกร้า</p>
            </div>
          ) : (
            cartItems.map(item => (
              <div key={item.id} style={{ backgroundColor: '#fff', border: '1px solid #ddd', padding: '15px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  {/* เพิ่ม Checkbox ฝั่งซ้ายสุด */}
                  <input 
                    type="checkbox" 
                    checked={selectedItems.includes(item.id)}
                    onChange={() => handleToggleItem(item.id)}
                    style={{ 
                      width: '20px', 
                      height: '20px', 
                      accentColor: theme.primary, // เปลี่ยนสี Checkbox เป็นสีแดงตอนที่ติ๊ก
                      cursor: 'pointer' 
                    }} 
                  />
                  
                  <div style={{ width: '60px', height: '60px', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
                    <img src={item.img} alt={item.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '600', fontFamily: theme.fontFamily }}>{item.name}</div>
                    <div style={{ fontSize: '12px', color: theme.primary, fontFamily: theme.fontFamily }}>฿{item.price.toLocaleString()}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)} style={{ padding: '2px 8px', fontFamily: theme.fontFamily }}>-</button>
                  <span style={{ fontSize: '14px', fontFamily: theme.fontFamily }}>{item.quantity}</span>
                  <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} style={{ padding: '2px 8px', fontFamily: theme.fontFamily }}>+</button>
                  <button onClick={() => onRemove(item.id)} style={{ marginLeft: '15px', color: 'red', border: 'none', background: 'none', cursor: 'pointer', fontSize: '12px', fontFamily: theme.fontFamily }}>ลบ</button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* รายการสรุปฝั่งขวา: แสดงชื่อและรูปสินค้าที่เลือก */}
        {hasSelectedItems && (
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #ddd', padding: '20px', borderRadius: '4px', height: 'fit-content' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 15px 0', borderBottom: '1px solid #eee', paddingBottom: '10px', fontFamily: theme.fontFamily }}>รายการยอดรวมสินค้า</h3>
            
            {/* ส่วนแสดงรายชื่อและรูปสินค้าที่ถูกเลือก */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '15px', maxHeight: '200px', overflowY: 'auto' }}>
              {selectedCartItems.map(item => (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' }}>
                  <div style={{ width: '40px', height: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid #eee', borderRadius: '4px', backgroundColor: '#fff', flexShrink: 0 }}>
                    <img src={item.img} alt={item.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                  </div>
                  <div style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontFamily: theme.fontFamily }}>
                    {item.name}
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
              <span>฿{totalAmount.toLocaleString()}</span>
            </div>
            <button 
              onClick={onNextStep}
              style={{ 
                width: '100%', 
                backgroundColor: theme.primary, 
                color: '#fff', 
                border: 'none', 
                padding: '12px', 
                fontSize: '16px', 
                fontWeight: '600', 
                cursor: 'pointer', 
                textAlign: 'center',
                borderRadius: '4px',
                fontFamily: theme.fontFamily
              }}
            >
              ชำระเงิน
            </button>
          </div>
        )}
      </div>
    </div>
  );
}