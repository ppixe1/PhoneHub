import { LayoutDashboard, Package, ShoppingCart, Users } from 'lucide-react';

export default function TabMenu({ activeTab, setActiveTab }) {
  const tabs = [
    { id: "dashboard", label: "แดชบอร์ดสรุปผล", icon: <LayoutDashboard style={{ width: '16px', height: '16px' }} /> },
    { id: "inventory", label: "จัดการคลังสินค้า (Inventory)", icon: <Package style={{ width: '16px', height: '16px' }} /> },
    { id: "orders", label: "จัดการคำสั่งซื้อ (Orders)", icon: <ShoppingCart style={{ width: '16px', height: '16px' }} /> },
    { id: "usermanagement", label: "จัดการผู้ใช้ (Users)", icon: <Users style={{ width: '16px', height: '16px' }} /> },
  ];

  return (
    <div className="bg-white shadow-sm border-bottom" style={{ borderTopWidth: '1px', borderTopColor: '#e9ecef' }}>
      <div className="container">
        <div className="d-flex gap-5 overflow-x-auto no-scrollbar" style={{ fontSize: '14px' }}>
          {tabs.map(tab => (
            <div 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="d-flex align-items-center gap-2 cursor-pointer text-nowrap py-3"
              style={{
                borderBottomWidth: '3px',
                borderBottomStyle: 'solid',
                borderBottomColor: activeTab === tab.id ? '#B00000' : 'transparent',
                color: activeTab === tab.id ? '#B00000' : '#6c757d',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
            >
              {tab.icon} {tab.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}