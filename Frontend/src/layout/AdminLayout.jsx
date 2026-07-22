import { useState } from 'react';
import Navbar from '../adminPage/component/Navbar';
import TabMenu from '../adminPage/component/TabMenu';
import DashboardTab from '../adminPage/Dashbord/DashboardTab';
import InventoryTab from '../adminPage/Inventory/InventoryTab';
import OrdersManagementTap from '../adminPage/OrdersManagement/OrdersManagementTap';
import UserManagement from '../adminPage/UserManagement/UserManagement';

const AdminLayout = () => {
    const [activeTab, setActiveTab] = useState("dashboard");

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
        {activeTab === "usermanagement" && <UserManagement />}
      </main>
    </div>
    );
};

export default AdminLayout;