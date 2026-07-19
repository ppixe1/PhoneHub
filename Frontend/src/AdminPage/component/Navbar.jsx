import { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

export default function Navbar() {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  // เปลี่ยนค่าเริ่มต้นของการแจ้งเตือนเป็น Array ว่างไปก่อนครับ
  const [notifications, setNotifications] = useState([]);
  const [username, setUsername] = useState('');
  const notifRef = useRef(null);

  const navigate = useNavigate();

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    const data = jwtDecode(token);

    setUsername(data.username);

    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const onLogout = () => {
    navigate('/login')
  }

  return (
    <nav className="navbar bg-color-primary shadow-sm" style={{ paddingBottom: '0.5rem', paddingTop: '0.5rem' }}>
      <div className="container">
        <div className="navbar-brand">
          <img 
            src="/PhoneHubLOGO.png"
            alt="PhoneHub Logo" 
            style={{ height: '35px', maxWidth: '100%', objectFit: 'contain', cursor: 'pointer', opacity: 1, transition: 'opacity 0.3s' }}
            onMouseEnter={(e) => e.target.style.opacity = '0.9'}
            onMouseLeave={(e) => e.target.style.opacity = '1'}
          />
        </div>
        
        <div className="d-flex align-items-center gap-3">
          <div className="position-relative" ref={notifRef}>
            <button 
              onClick={() => setIsNotifOpen(!isNotifOpen)} 
              className="btn btn-link text-white position-relative p-0"
              style={{ textDecoration: 'none' }}
            >
              <Bell style={{ width: '20px', height: '20px' }} />
              {unreadCount > 0 && (
                <span 
                  className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning text-dark"
                  style={{ fontSize: '10px', transform: 'translate(-50%, -50%)' }}
                >
                  {unreadCount}
                </span>
              )}
            </button>

            {isNotifOpen && (
              <div 
                className="position-absolute end-0 mt-2 bg-white rounded shadow-lg border"
                style={{ width: '320px', top: '100%', zIndex: 1050, maxHeight: '400px', overflowY: 'auto' }}
              >
                <div className="border-bottom bg-light p-3 d-flex justify-content-between align-items-center">
                  <span className="fw-bold" style={{ fontSize: '14px' }}>การแจ้งเตือน</span>
                  {unreadCount > 0 && (
                    <button 
                      onClick={markAllAsRead} 
                      className="btn btn-link p-0"
                      style={{ fontSize: '12px', color: '#B00000', textDecoration: 'none' }}
                    >
                      อ่านทั้งหมด
                    </button>
                  )}
                </div>
                <div>
                  {notifications.length > 0 ? notifications.map((notif) => (
                    <div 
                      key={notif.id} 
                      className="border-bottom p-3 cursor-pointer"
                      style={{ 
                        opacity: notif.read ? '0.6' : '1',
                        backgroundColor: notif.read ? 'white' : '#ffebee'
                      }}
                    >
                      <p className="fw-semibold mb-1" style={{ fontSize: '14px' }}>{notif.title}</p>
                      <p className="text-muted m-0" style={{ fontSize: '12px' }}>{notif.time}</p>
                    </div>
                  )) : (
                    <div className="p-3 text-center text-muted" style={{ fontSize: '14px' }}>
                      ไม่มีการแจ้งเตือน
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <span className="text-white d-none d-sm-inline" style={{ fontSize: '14px', fontWeight: '600' }}>
            {username}
          </span>
          <button 
            onClick={onLogout}
            className="btn text-color-primary fw-semibold"
            style={{ backgroundColor: 'white', fontSize: '14px', padding: '0.5rem 1rem' }}
          >
            ออกจากระบบ
          </button>
        </div>
      </div>
    </nav>
  );
}