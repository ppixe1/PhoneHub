import { useState } from 'react';
import Navbar from '../AdminPage/component/Navbar';
import TabMenu from '../AdminPage/component/TabMenu';
import DashboardTab from '../AdminPage/component/DashboardTab';
import InventoryTab from '../AdminPage/component/InventoryTab';
import OrdersManagementTap from '../AdminPage/component/OrdersManagementTap';

const AdminLayout = () => {
    const [activeTab, setActiveTab] = useState("orders");

    return (
        <div className="d-flex flex-column" style={{ minHeight: '100vh', backgroundColor: '#FAFAFA', color: '#212529' }}>
      <div style={{ position: 'sticky', top: 0, zIndex: 50 }}>
        <Navbar />
        <TabMenu activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      <main className="container-lg flex-grow-1" style={{ padding: '1rem 0', marginTop: '1rem', marginBottom: '2rem' }}>
        {activeTab === "dashboard" && <DashboardTab />}
        {activeTab === "inventory" && <InventoryTab />}
        {activeTab === "orders" && <OrdersManagementTap />}
      </main>
    </div>
    );
};

export default AdminLayout;