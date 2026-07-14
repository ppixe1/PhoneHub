import React, { useState } from 'react';

const theme = {
  primary: '#B00000',
  background: '#FAFAFA',
  accent: '#FFD129',
  fontFamily: "'Kanit', sans-serif"
};

export default function Auth({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false); // สเตทสำหรับลืมรหัสผ่าน
  const [username, setUsername] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isForgotPassword) {
      // จัดการระบบส่งลิงก์รีเซ็ตรหัสผ่านที่นี่
      alert(`ส่งลิงก์กู้คืนรหัสผ่านไปยัง ${username} เรียบร้อยแล้ว`);
      setIsForgotPassword(false);
      setIsLogin(true);
    } else if (username.trim()) {
      onLoginSuccess({ name: username, id: 'USER-007' });
    }
  };

  // กำหนดหัวข้อตามสถานะหน้าจอ
  const getTitle = () => {
    if (isForgotPassword) return 'ลืมรหัสผ่าน';
    return isLogin ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก';
  };

  return (
    <div style={{ fontFamily: theme.fontFamily, backgroundColor: theme.background, minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: theme.primary, textAlign: 'center', margin: '0 0 24px 0' }}>PhoneHub</h1>
        <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '20px', textAlign: 'center' }}>{getTitle()}</h2>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px' }}>ชื่อผู้ใช้ (Username)</label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
              style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box', fontSize: '14px' }}
            />
          </div>

          {/* ซ่อนช่องรหัสผ่านเมื่ออยู่ในหน้าลืมรหัสผ่าน */}
          {!isForgotPassword && (
            <div>
              <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px' }}>รหัสผ่าน (Password)</label>
              <input type="password" required style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }} />
              
              {/* ปุ่มลืมรหัสผ่าน (แสดงเฉพาะตอนหน้าล็อกอิน) */}
              {isLogin && (
                <div style={{ textAlign: 'right', marginTop: '8px' }}>
                  <span 
                    onClick={() => { setIsForgotPassword(true); setIsLogin(false); }}
                    style={{ fontSize: '13px', color: theme.primary, cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    ลืมรหัสผ่าน?
                  </span>
                </div>
              )}
            </div>
          )}

          <button type="submit" style={{ backgroundColor: theme.primary, color: '#fff', border: 'none', padding: '12px', fontSize: '16px', fontWeight: '600', borderRadius: '4px', cursor: 'pointer', marginTop: '10px' }}>
            {isForgotPassword ? 'ส่งลิงก์รีเซ็ทรหัสผ่าน' : isLogin ? 'เข้าสู่ระบบ' : 'ยืนยันสมัครสมาชิก'}
          </button>
        </form>

        {/* ปุ่มสลับหน้าจอด้านล่างสุด */}
        <div style={{ fontSize: '14px', textAlign: 'center', marginTop: '20px', cursor: 'pointer', color: '#666' }}>
          {isForgotPassword ? (
            <span onClick={() => { setIsForgotPassword(false); setIsLogin(true); }}>
              กลับไปหน้าเข้าสู่ระบบ
            </span>
          ) : isLogin ? (
            <span onClick={() => setIsLogin(false)}>ยังไม่มีบัญชี? สมัครสมาชิกที่นี่</span>
          ) : (
            <span onClick={() => setIsLogin(true)}>มีบัญชีอยู่แล้ว? เข้าสู่ระบบ</span>
          )}
        </div>
      </div>
    </div>
  );
}