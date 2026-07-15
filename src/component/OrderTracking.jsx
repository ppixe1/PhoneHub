import React from 'react';

const theme = {
  primary: '#B00000',
  background: '#FAFAFA',
  accent: '#FFD129',
  fontFamily: "'Kanit', sans-serif"
};

// ข้อมูลจำลองประวัติออเดอร์
const mockOrders = [
  { id: 'ORD-2026-001', date: '12/07/2026', items: 'iPhone 15 Pro (1 เครื่อง)', total: 39000, status: 'กำลังจัดส่ง', trackNo: '123-123-1123' },
  { id: 'ORD-2026-002', date: '10/07/2026', items: 'iPhone 15 (1 เครื่อง)', total: 32900, status: 'สำเร็จ', trackNo: '123-123-1122' }
];

export default function OrderTracking({ user }) {
  return (
    <div style={{ fontFamily: theme.fontFamily, backgroundColor: theme.background, minHeight: '100vh' }}>
      <div style={{ backgroundColor: theme.primary, color: '#fff', padding: '15px 5%' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>/user-profile--order-tracking</h1>
      </div>

      <div style={{ padding: '30px 5%', maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '20px' }}>
          ยินดีต้อนรับคุณ : {user?.name || 'แขกผู้มาเยือน'}
        </div>

        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '15px' }}>ประวัติการสั่งซื้อและสถานะสินค้าล่าสุด</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {mockOrders.map(order => (
            <div key={order.id} style={{ backgroundColor: '#D9D9D9', padding: '20px', borderRadius: '4px' }}>
              <div style={{ fontSize: '14px', marginBottom: '8px' }}>
                <strong>หมายเลขคำสั่งซื้อ :</strong> #{order.id} | <strong>วันที่</strong> {order.date}
              </div>
              <div style={{ fontSize: '14px', marginBottom: '12px' }}>
                <strong>สินค้า :</strong> {order.items} | <strong>ยอดรวม :</strong> {order.total.toLocaleString()} .-
              </div>
              <hr style={{ border: 'none', borderTop: '1px solid #bbb', margin: '10px 0' }} />
              <div style={{ fontSize: '14px' }}>
                <strong>สถานะปัจจุบัน :</strong> <span style={{ color: order.status === 'สำเร็จ' ? 'green' : theme.primary, fontWeight: 'bold' }}>[{order.status}]</span>
              </div>
              <div style={{ fontSize: '14px', marginTop: '4px' }}>
                <strong>เลขพัสดุ :</strong> {order.trackNo}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}