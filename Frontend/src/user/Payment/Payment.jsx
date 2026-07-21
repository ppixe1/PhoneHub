import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';

const theme = {
  primary: '#B00000',
  background: '#FAFAFA',
  accent: '#FFD129',
  fontFamily: "'Kanit', sans-serif"
};

export default function Payment() {
  const [method, setMethod] = useState('qr');
  const location = useLocation();
  const navigate = useNavigate();

  const {
    selectedCartItems = [],
    totalAmount = 0
  } = location.state || {};
  
  const [address, setAddress] = useState({
    fullName: '',
    phone: '',
    houseNo: '',
    subDistrict: '',
    district: '',
    province: '',
    postalCode: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddress(prev => ({ ...prev, [name]: value }));
  };

  const handlePayment = () => {
    // ตรวจสอบค่า address ก่อนการสั่งซื้อ
    if (!address.fullName || !address.phone || !address.houseNo || !address.subDistrict || !address.district || !address.province || !address.postalCode) {
      toast.warning('กรุณากรอกข้อมูลที่อยู่ให้ครบ');
      return;
    }

    const orderData = {
      totalPrice: totalAmount,
      shippingAddress: address,
      customerName: address.fullName,
      customerPhone: address.phone,
      items: selectedCartItems
    };

    console.log(orderData);

    axios.post('http://localhost:3000/order', orderData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
      }
    })
    .then(res => {
      toast.success(res.data.msg);
      navigate('/order-history');
      window.scrollTo(0, 0);
    })
    .catch(error => {
      if (error.response.status === 400 || error.response.status === 500) {
        toast.error(error.response.data.msg);
      }
    });
  };

  const inputStyle = {
    width: '100%',
    padding: '8px 12px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    boxSizing: 'border-box',
    fontSize: '14px',
    fontFamily: theme.fontFamily,
    outline: 'none'
  };

  const labelStyle = {
    fontSize: '13px',
    display: 'block',
    marginBottom: '5px',
    fontFamily: theme.fontFamily
  };

  const textStyle = {
    fontFamily: theme.fontFamily
  };

  const iconWrapperStyle = {
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  };

  const onBack = () => {
    navigate('/cart');
  }

  return (
    <div style={{ fontFamily: theme.fontFamily, backgroundColor: theme.background, minHeight: '100vh' }}>
      <div className='bg-color-primary text-white px-5 py-3 d-flex align-items-center position-sticky top-0' style={{ maxHeight:'60px' }}>
        <div 
          className='me-3'
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

        <h3 className='ps-3' style={{ borderLeft:'12px solid #FFD129'}}>หน้าชำระเงิน</h3>
      </div>

      <div style={{ padding: '30px 5%', maxWidth: '900px', margin: '0 auto' }}>
        
        {/* 1. ที่อยู่สำหรับจัดส่ง */}
        <div style={{ backgroundColor: '#ffffff', padding: '20px', marginBottom: '20px', borderRadius: '4px', border: '1px solid #eee' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 15px 0', fontFamily: theme.fontFamily }}>ที่อยู่ในการจัดส่ง</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
            <div>
              <label style={labelStyle}>ชื่อ-นามสกุล ผู้รับ</label>
              <input type="text" name="fullName" value={address.fullName} onChange={handleInputChange} style={inputStyle} placeholder="เช่น นายสมชาย ใจดี" />
            </div>
            <div>
              <label style={labelStyle}>เบอร์โทรศัพท์</label>
              <input type="text" name="phone" value={address.phone} onChange={handleInputChange} style={inputStyle} placeholder="เช่น 0999999999" />
            </div>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={labelStyle}>ที่อยู่ (บ้านเลขที่, หมู่บ้าน, ซอย, ถนน)</label>
            <input type="text" name="houseNo" value={address.houseNo} onChange={handleInputChange} style={inputStyle} placeholder="เช่น 123/4 หมู่ 5 ถนนพหลโยธิน" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
            <div>
              <label style={labelStyle}>แขวง / ตำบล</label>
              <input type="text" name="subDistrict" value={address.subDistrict} onChange={handleInputChange} style={inputStyle} placeholder='จตุจักร' />
            </div>
            <div>
              <label style={labelStyle}>เขต / อำเภอ</label>
              <input type="text" name="district" value={address.district} onChange={handleInputChange} style={inputStyle} placeholder='จตุจักร' />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label style={labelStyle}>จังหวัด</label>
              <input type="text" name="province" value={address.province} onChange={handleInputChange} style={inputStyle} placeholder='กรุงเทพมหานคร' />
            </div>
            <div>
              <label style={labelStyle}>รหัสไปรษณีย์</label>
              <input type="text" name="postalCode" value={address.postalCode} onChange={handleInputChange} style={inputStyle} placeholder='10900' />
            </div>
          </div>
        </div>

        {/* 2. สรุปรายการสินค้าที่มีรูปสินค้า */}
        <div style={{ backgroundColor: '#ffffff', padding: '20px', marginBottom: '20px', borderRadius: '4px', border: '1px solid #eee', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', margin: 0, fontFamily: theme.fontFamily }}>สรุปรายการสั่งซื้อ</h3>
          {selectedCartItems.map(item => (
            <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '14px', paddingBottom: '10px', borderBottom: '1px solid #f5f5f5', ...textStyle }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ width: '50px', height: '50px', display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid #eee', borderRadius: '4px', backgroundColor: '#fff', flexShrink: 0 }}>
                  <img src={item.img} alt={item.model} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                </div>
                <div>
                  <div className='b2' style={{ fontWeight: 'normal', fontFamily: theme.fontFamily }}>{item.brand} {item.model}</div>
                  <div className='b2 text-secondary' style={{ fontWeight: 'normal', fontFamily: theme.fontFamily }}>สี: {item.color} ความจุ: {item.storage}</div>
                  <div className='b2' style={{ fontSize: '12px', fontFamily: theme.fontFamily }}>x{item.quantity}</div>
                </div>
              </div>
              <span className='b1 text-color-primary' style={{ fontWeight: 'bold', fontFamily: theme.fontFamily }}>฿{(item.price * item.quantity).toLocaleString()}</span>
            </div>
          ))}
        </div>

        {/* 3. เลือกช่องทางจ่ายเงิน */}
        <div style={{ backgroundColor: '#ffffff', padding: '20px 20px 4px 20px', marginBottom: '20px', borderRadius: '4px', border: '1px solid #eee' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#333', fontFamily: theme.fontFamily }}>ช่องทางการชำระเงินอื่น</h3>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            
            {/* ช่องทางที่ 1: QR พร้อมเพย์ */}
            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid #eee', cursor: 'pointer', ...textStyle }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={iconWrapperStyle}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0056B3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="4" />
                    <rect x="6" y="6" width="4" height="4" />
                    <rect x="14" y="6" width="4" height="4" />
                    <rect x="6" y="14" width="4" height="4" />
                    <path d="M14 14h2v2h-2z M16 16h2v2h-2z M14 18h2v2h-2z M18 14h2v2h-2z" />
                  </svg>
                </div>
                <span style={{ fontSize: '15px', fontWeight: '500', color: '#222', fontFamily: theme.fontFamily }}>QR พร้อมเพย์</span>
              </div>
              <input type="radio" name="pay" checked={method === 'qr'} onChange={() => setMethod('qr')} style={{ width: '22px', height: '22px', accentColor: '#B00000', cursor: 'pointer' }} />
            </label>

            {/* ช่องทางที่ 2: เก็บเงินปลายทาง */}
            {/* <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid #eee', cursor: 'pointer', ...textStyle }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={iconWrapperStyle}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#FF4D2D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="1" y="3" width="15" height="13" rx="2" />
                    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                    <circle cx="5.5" cy="18.5" r="2.5" fill="#FF4D2D" />
                    <circle cx="18.5" cy="18.5" r="2.5" fill="#FF4D2D" />
                  </svg>
                </div>
                <span style={{ fontSize: '15px', fontWeight: '500', color: '#222', fontFamily: theme.fontFamily }}>เก็บเงินปลายทาง (COD)</span>
              </div>
              <input type="radio" name="pay" checked={method === 'cod'} onChange={() => setMethod('cod')} style={{ width: '22px', height: '22px', accentColor: '#B00000', cursor: 'pointer' }} />
            </label> */}

            {/* ช่องทางที่ 3: Mobile Banking */}
            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid #eee', cursor: 'pointer', ...textStyle }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={iconWrapperStyle}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#28A745" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="5" y="2" width="14" height="20" rx="2" />
                    <line x1="12" y1="18" x2="12.01" y2="18" strokeWidth="3" />
                  </svg>
                </div>
                <span style={{ fontSize: '15px', fontWeight: '500', color: '#222', fontFamily: theme.fontFamily }}>Mobile Banking</span>
              </div>
              <input type="radio" name="pay" checked={method === 'bank'} onChange={() => setMethod('bank')} style={{ width: '22px', height: '22px', accentColor: '#B00000', cursor: 'pointer' }} />
            </label>

            {/* ช่องทางที่ 4: บัตรเครดิต/เดบิต */}
            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', cursor: 'pointer', ...textStyle }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={iconWrapperStyle}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E0A800" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="5" width="20" height="14" rx="2" />
                    <line x1="2" y1="10" x2="22" y2="10" />
                  </svg>
                </div>
                <span style={{ fontSize: '15px', fontWeight: '500', color: '#222', fontFamily: theme.fontFamily }}>บัตรเครดิต / บัตรเดบิต</span>
              </div>
              <input type="radio" name="pay" checked={method === 'card'} onChange={() => setMethod('card')} style={{ width: '22px', height: '22px', accentColor: '#B00000', cursor: 'pointer' }} />
            </label>

          </div>
        </div>

        {/* ยอดสุทธิและปุ่มจ่ายเงิน */}
        <div className='bg-white p-4 br-primary' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '30px' }}>
          <div style={{ fontSize: '20px', fontWeight: 'bold', fontFamily: theme.fontFamily }}>
            <span className='me-2' style={{ color: '#000000', fontFamily: theme.fontFamily }}>ยอดรวมสุทธิ:</span>
            <span style={{ color: theme.primary, fontFamily: theme.fontFamily }}>฿{totalAmount.toLocaleString()}</span>
          </div>
          <button 
            onClick={handlePayment}
            style={{ backgroundColor: theme.primary, color: '#fff', border: 'none', padding: '12px 40px', fontSize: '16px', fontWeight: '600', borderRadius: '4px', cursor: 'pointer', fontFamily: theme.fontFamily }}
          >
            สั่งซื้อสินค้า
          </button>
        </div>
      </div>
    </div>
  );
}