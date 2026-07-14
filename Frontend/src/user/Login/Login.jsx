import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const theme = {
  primary: '#B00000',
  background: '#FAFAFA',
  accent: '#FFD129',
  fontFamily: "'Kanit', sans-serif"
};

export default function Auth({ onLoginSuccess }) {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [username, setUsername] = useState('');
  
  const [registerUsername, setRegisterUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isForgotPassword) {
      alert(`ส่งลิงก์กู้คืนรหัสผ่านไปยัง ${username} เรียบร้อยแล้ว`);
      setIsForgotPassword(false);
      setIsLogin(true);
    } else if (!isLogin) {
      alert(`สมัครสมาชิกสำเร็จ!\nUsername: ${registerUsername}\nชื่อ: ${fullName}\nอีเมล: ${email}\nเบอร์โทร: ${phone}`);
      setIsLogin(true); 
    } else if (username.trim()) {
      onLoginSuccess({ name: username, id: 'USER-007' });
    }
  };

  const getTitle = () => {
    if (isForgotPassword) return 'ลืมรหัสผ่าน';
    return isLogin ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก';
  };

  const submitBtn = () => {
    if (isLogin) {
      //login
      if (username && password) {
        axios.post('http://localhost:3000/auth/login', {
          username: username,
          password: password,
        })
        .then((res) => {
          if (!res) return alert('เกิดข้อผิดพลาด');
          if (res.status === 200) {
            alert(res.data.msg);
            sessionStorage.setItem('token', res.data.token);
            navigate('/home')
          }
        })
      }
    } else {
      //register
      if (registerUsername && fullName && email && phone && password) {
        axios.post('http://localhost:3000/auth/register', {
          username: registerUsername,
          password: password,
          email: email,
          phone: phone,
          name: fullName,
        })
        .then((res) => {
          if (!res) return alert('เกิดข้อผิดพลาด');
          if (res.status === 200) {
            alert(res.data.msg);
            sessionStorage.setItem('token', res.data.token);
            navigate('/home')
          }
        })
      }
    }
  }

  return (
    <div style={{ fontFamily: theme.fontFamily, backgroundColor: theme.background, minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: theme.primary, textAlign: 'center', margin: '0 0 24px 0' }}>PhoneHub</h1>
        <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '20px', textAlign: 'center' }}>{getTitle()}</h2>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* ส่วน Login ปกติ */}
          {isLogin && !isForgotPassword && (
            <div>
              <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px' }}>ชื่อผู้ใช้งาน / อีเมล</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }} />
            </div>
          )}

          {/* ส่วน ลืมรหัสผ่าน */}
          {isForgotPassword && (
            <div>
              <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px' }}>ชื่อผู้ใช้งาน / อีเมล</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }} />
            </div>
          )}

          {/* ส่วน สมัครสมาชิก (จัดตำแหน่งใหม่) */}
          {!isLogin && !isForgotPassword && (
            <>
              <div>
                <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px' }}>ชื่อผู้ใช้งาน (Username)</label>
                <input type="text" value={registerUsername} onChange={(e) => setRegisterUsername(e.target.value)} required style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }} />
              </div>
              
              {/* ย้ายรหัสผ่านมาไว้ใต้ Username */}
              <div>
                <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px' }}>รหัสผ่าน</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px' }}>ชื่อ-นามสกุล</label>
                <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px' }}>อีเมล</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px' }}>เบอร์โทรศัพท์</label>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }} />
              </div>
            </>
          )}

          {/* รหัสผ่านสำหรับหน้า Login ปกติ */}
          {isLogin && !isForgotPassword && (
            <div>
              <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px' }}>รหัสผ่าน</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }} />
              <div style={{ textAlign: 'right', marginTop: '8px' }}>
                <span onClick={() => { setIsForgotPassword(true); setIsLogin(false); }} style={{ fontSize: '13px', color: theme.primary, cursor: 'pointer', textDecoration: 'underline' }}>
                  ลืมรหัสผ่าน?
                </span>
              </div>
            </div>
          )}

          <button onClick={submitBtn} type="submit" style={{ backgroundColor: theme.primary, color: '#fff', border: 'none', padding: '12px', fontSize: '16px', fontWeight: '600', borderRadius: '4px', cursor: 'pointer', marginTop: '10px' }}>
            {isForgotPassword ? 'ส่งลิงก์รีเซ็ทรหัสผ่าน' : isLogin ? 'เข้าสู่ระบบ' : 'ยืนยันสมัครสมาชิก'}
          </button>
        </form>

        <div style={{ fontSize: '14px', textAlign: 'center', marginTop: '20px', cursor: 'pointer', color: '#666' }}>
          {isForgotPassword ? (
            <span onClick={() => { setIsForgotPassword(false); setIsLogin(true); }}>กลับไปหน้าเข้าสู่ระบบ</span>
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