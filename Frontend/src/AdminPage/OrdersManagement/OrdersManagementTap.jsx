import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, ListFilter, CheckCircle2, Clock, Package, Truck } from 'lucide-react';
import { getOrders, updateOrderStatus } from '../services/api';

export default function OrdersManagementTap() {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('สถานะทั้งหมด');
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  // States สำหรับเปิด/ปิด Custom Dropdown
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isModalStatusOpen, setIsModalStatusOpen] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadOrders = async () => {
      setIsLoading(true);
      setFetchError('');
      try {
        const data = await getOrders();
        if (mounted) setOrders(data);
      } catch (err) {
        console.error(err);
        if (mounted) setFetchError('ไม่สามารถโหลดคำสั่งซื้อได้');
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    loadOrders();
    return () => {
      mounted = false;
    };
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalStatus, setModalStatus] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  // ปรับแต่งสีของแต่ละสถานะ สำหรับ Badge
  const getStatusStyle = (status) => {
    switch (status) {
      case 'เสร็จสิ้น': return { bg: '#E8F5E9', text: '#2E7D32' };
      case 'รอดำเนินการ': return { bg: '#FFF8E1', text: '#F57F17' };
      case 'กำลังเตรียมจัดส่ง': return { bg: '#E3F2FD', text: '#1565C0' };
      case 'จัดส่งแล้ว': return { bg: '#F3E5F5', text: '#7B1FA2' };
      default: return { bg: '#F8F9FA', text: '#6C757D' };
    }
  };

  // ตัวเลือกสำหรับ Dropdown 
  const statusOptions = [
    { value: 'สถานะทั้งหมด', label: 'สถานะทั้งหมด', icon: <ListFilter size={16} color="#6C757D" /> },
    { value: 'รอดำเนินการ', label: 'รอดำเนินการ', icon: <Clock size={16} color="#F57F17" /> },
    { value: 'กำลังเตรียมจัดส่ง', label: 'กำลังเตรียมจัดส่ง', icon: <Package size={16} color="#1565C0" /> },
    { value: 'จัดส่งแล้ว', label: 'จัดส่งแล้ว', icon: <Truck size={16} color="#7B1FA2" /> },
    { value: 'เสร็จสิ้น', label: 'เสร็จสิ้น', icon: <CheckCircle2 size={16} color="#2E7D32" /> }
  ];

  // ตัวเลือกสำหรับใน Modal (ตัด "สถานะทั้งหมด" ออก)
  const modalStatusOptions = statusOptions.filter(opt => opt.value !== 'สถานะทั้งหมด');

  const handleInspectClick = (order) => {
    setSelectedOrder(order);
    setModalStatus(order.status);
    setIsModalOpen(true);
    setShowConfirm(false);
    setIsModalStatusOpen(false);
  };

  const handleSaveChanges = async () => {
    if (!selectedOrder) return;
    setShowConfirm(false);
    setIsSaving(true);

    try {
      const updatedOrder = await updateOrderStatus(selectedOrder.id, modalStatus);
      setOrders((prevOrders) =>
        prevOrders.map((ord) =>
          ord.id === selectedOrder.id ? { ...ord, status: updatedOrder?.status ?? modalStatus } : ord
        )
      );
      setIsModalOpen(false);
      setSelectedOrder(null);
    } catch (err) {
      console.error(err);
      window.alert('ไม่สามารถบันทึกสถานะคำสั่งซื้อได้ โปรดลองอีกครั้ง');
    } finally {
      setIsSaving(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    const firstItemName = order.items && order.items.length > 0 ? order.items[0].name : '';
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          firstItemName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'สถานะทั้งหมด' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '2rem' }}>
      
      {/* 1. ส่วนหัวกล่องแดง */}
      <div className="rounded-4 overflow-hidden shadow-sm border mb-4" style={{ borderColor: '#e9ecef' }}>
        <div className="text-white p-4" style={{ backgroundColor: '#B00000' }}>
          <h2 className="fw-bold mb-2" style={{ fontSize: '24px', borderLeft: '12px solid #FFD129', paddingLeft: '12px' }}>
            จัดการคำสั่งซื้อ (Orders)
          </h2>
          <p className="m-0 text-white-50" style={{ paddingLeft: '24px' }}>ตรวจสอบออเดอร์ แก้สถานะ และติดตามการจัดส่งทั้งหมดในระบบ</p>
        </div>
      </div>

      <div className="px-1">
        {/* 2. ส่วนตัวกรองและค้นหา */}
        <div className="d-flex flex-column flex-sm-row gap-3 mb-4 w-100">
          
          {/* Custom Dropdown สถานะ */}
          <div className="position-relative" style={{ minWidth: '180px' }}>
            <div 
              className="d-flex align-items-center justify-content-between bg-white border shadow-sm user-select-none"
              style={{ 
                borderRadius: '8px', 
                padding: '10px 16px', 
                cursor: 'pointer',
                borderColor: isFilterOpen ? '#B00000' : '#e9ecef',
                transition: 'all 0.2s'
              }}
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <div className="d-flex align-items-center gap-2">
                {statusOptions.find(opt => opt.value === statusFilter)?.icon}
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#495057' }}>
                  {statusFilter}
                </span>
              </div>
              <ChevronDown 
                size={16} 
                style={{ 
                  color: '#6c757d', 
                  transform: isFilterOpen ? 'rotate(180deg)' : 'none', 
                  transition: 'transform 0.3s ease' 
                }} 
              />
            </div>

            {/* Dropdown Menu */}
            {isFilterOpen && (
              <>
                <div className="position-fixed top-0 start-0 w-100 h-100" style={{ zIndex: 40 }} onClick={() => setIsFilterOpen(false)}></div>
                <div 
                  className="position-absolute w-100 bg-white border shadow-lg py-2 mt-1" 
                  style={{ zIndex: 50, borderRadius: '8px', borderColor: '#e9ecef' }}
                >
                  {statusOptions.map((opt) => (
                    <div
                      key={opt.value}
                      className="d-flex align-items-center gap-2 px-3 py-2 user-select-none"
                      style={{
                        fontSize: '14px',
                        cursor: 'pointer',
                        backgroundColor: statusFilter === opt.value ? 'rgba(176, 0, 0, 0.05)' : 'transparent',
                        color: statusFilter === opt.value ? '#B00000' : '#495057',
                        fontWeight: statusFilter === opt.value ? '600' : '500',
                        transition: 'background-color 0.15s ease'
                      }}
                      onMouseEnter={(e) => { if(statusFilter !== opt.value) e.currentTarget.style.backgroundColor = '#f8f9fa' }}
                      onMouseLeave={(e) => { if(statusFilter !== opt.value) e.currentTarget.style.backgroundColor = 'transparent' }}
                      onClick={() => {
                        setStatusFilter(opt.value);
                        setIsFilterOpen(false);
                      }}
                    >
                      {opt.icon}
                      {opt.label}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* ช่องค้นหา */}
          <div className="input-group shadow-sm" style={{ maxWidth: '350px', borderRadius: '8px', overflow: 'hidden' }}>
            <span className="input-group-text bg-white border-end-0" style={{ paddingLeft: '16px' }}>
              <Search size={18} style={{ color: "#999" }} />
            </span>
            <input 
              type="text" 
              placeholder="ค้นหารหัส, ชื่อลูกค้า, สินค้า..." 
              className="form-control border-start-0 ps-2 shadow-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ padding: '10px 0', fontSize: '14px' }}
            />
          </div>
        </div>

        {/* ตารางคำสั่งซื้อหลัก */}
        <div className="bg-white rounded-4 shadow-sm border overflow-hidden" style={{ borderColor: '#e9ecef' }}>
          <div className="table-responsive">
            <table className="table table-hover align-middle m-0" style={{ minWidth: '1000px' }}>
              <thead>
                <tr style={{ backgroundColor: '#B00000', color: 'white', fontSize: '14px' }}>
                  <th className="text-center py-3 px-4" style={{ width: '12%' }}>รหัสออเดอร์</th>
                  <th className="text-center py-3" style={{ width: '15%' }}>วันเวลาที่สั่งซื้อ</th>
                  <th className="py-3" style={{ width: '25%' }}>รายการสินค้า</th>
                  <th className="text-center py-3" style={{ width: '15%' }}>ชื่อลูกค้า</th>
                  <th className="text-center py-3" style={{ width: '13%' }}>ยอดชำระ (บาท)</th>
                  <th className="text-center py-3" style={{ width: '10%' }}>สถานะ</th>
                  <th className="text-center py-3" style={{ width: '10%' }}>จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => {
                    const hasItems = order.items && order.items.length > 0;
                    const firstItem = hasItems ? order.items[0] : null;
                    const extraItemsCount = hasItems ? order.items.length - 1 : 0;
                    const statusStyle = getStatusStyle(order.status);

                    return (
                      <tr key={order.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                        <td className="text-center fw-bold" style={{ fontSize: '14px' }}>ORD-{order.id}</td>
                        <td className="text-center text-muted" style={{ fontSize: '13px' }}>{order.date}</td>
                        <td className="py-3">
                          {firstItem ? (
                            <div className="d-flex align-items-center gap-3">
                              <div className="bg-light d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '48px', height: '48px', borderRadius: '8px', border: '1px solid #e9ecef', overflow: 'hidden' }}>
                                <img 
                                  src={firstItem.image} 
                                  alt={firstItem.name} 
                                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                              </div>
                              <div style={{ minWidth: 0 }}>
                                <div className="fw-bold text-dark mb-1" style={{ fontSize: '14px' }}>{firstItem.name}</div>
                                <div className="text-muted text-truncate" style={{ fontSize: '12px' }}>
                                  {firstItem.storage && `${firstItem.storage}`} {firstItem.color && ` • สี ${firstItem.color}`}
                                </div>
                                {extraItemsCount > 0 && (
                                  <button
                                    type="button"
                                    onClick={() => handleInspectClick(order)}
                                    className="btn btn-link p-0 fw-bold mt-1"
                                    style={{ fontSize: '12px', color: '#B00000', textDecoration: 'none' }}
                                  >
                                    + อีก {extraItemsCount} รายการ
                                  </button>
                                )}
                              </div>
                            </div>
                          ) : (
                            <span className="text-muted">ไม่มีรายการสินค้า</span>
                          )}
                        </td>
                        <td className="text-center fw-medium text-dark" style={{ fontSize: '14px' }}>{order.customer}</td>
                        <td className="text-center fw-bold" style={{ fontSize: '15px', color: '#B00000' }}>
                       
                          {String(order.price).replace('.-', '')} .-
                        </td>
                        <td className="text-center">
                          <span 
                            className="badge rounded-pill d-inline-flex align-items-center justify-content-center gap-1"
                            style={{ 
                              backgroundColor: statusStyle.bg, 
                              color: statusStyle.text,
                              padding: '6px 12px',
                              fontSize: '12px',
                              fontWeight: '600'
                            }}
                          >
                            <span style={{ fontSize: '8px' }}>●</span> {order.status}
                          </span>
                        </td>
                        <td className="text-center">
                          <button 
                            onClick={() => handleInspectClick(order)}
                            className="btn btn-sm shadow-sm d-inline-flex justify-content-center align-items-center"
                            style={{ 
                              backgroundColor: '#FFD129', 
                              color: '#000', 
                              fontSize: '13px', 
                              fontWeight: '700', 
                              borderRadius: '6px', 
                              padding: '6px 16px',
                              minWidth: '80px'
                            }}
                          >
                            ตรวจสอบ
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center text-muted p-5" style={{ fontSize: '14px' }}>
                      ไม่พบข้อมูลคำสั่งซื้อที่ตรงกับเงื่อนไขการค้นหา
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* POPUP MODAL ตรวจสอบออเดอร์ */}
      {isModalOpen && selectedOrder && (
        <div className="position-fixed top-0 start-0 w-100 h-100" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1050 }} onClick={() => setIsModalOpen(false)}>
          <div className="d-flex align-items-center justify-content-center h-100 p-3" onClick={(e) => e.stopPropagation()}>
            <div className="bg-light rounded-4 shadow-lg d-flex flex-column overflow-hidden" style={{ width: '100%', maxWidth: '600px', maxHeight: '90vh' }}>
              
              <div className="text-white p-4 d-flex justify-content-between align-items-start" style={{ backgroundColor: '#B00000' }}>
                <div>
                  <h3 className="fw-bold m-0 mb-2" style={{ fontSize: '18px' }}>
                    รายละเอียดคำสั่งซื้อ <span style={{ color: '#FFD129' }}>ORD-{selectedOrder.id}</span>
                  </h3>
                  <p className="m-0" style={{ fontSize: '12px', color: 'rgba(255, 209, 41, 0.8)' }}>สั่งซื้อเมื่อ: {selectedOrder.date}</p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)} 
                  className="btn-close btn-close-white"
                  aria-label="Close"
                ></button>
              </div>

              <div className="overflow-auto p-4" style={{ flex: 1, backgroundColor: '#F3F4F6' }}>
                <div className="row mb-4 g-3">
                  <div className="col-12 col-md-6">
                    <div className="bg-white p-4 rounded-4 border shadow-sm h-100" style={{ borderColor: '#e9ecef' }}>
                      <span className="fw-bold text-muted d-block mb-2" style={{ fontSize: '13px' }}>ข้อมูลลูกค้า / จัดส่ง</span>
                      <h4 className="fw-bold m-0 mb-2 text-dark" style={{ fontSize: '15px' }}>{selectedOrder.customer}</h4>
                      <p className="text-muted m-0" style={{ fontSize: '13px', lineHeight: '1.6' }}>
                        123/45 หมู่บ้านสุขสันต์ ถ.สุขุมวิท กรุงเทพฯ 10110 <br/>
                        (โทร. 081-xxx-xxxx)
                      </p>
                    </div>
                  </div>

                  <div className="col-12 col-md-6">
                    <div className="bg-white p-4 rounded-4 border shadow-sm h-100" style={{ borderColor: '#e9ecef' }}>
                      <span className="fw-bold text-muted d-block mb-2" style={{ fontSize: '13px' }}>อัปเดตสถานะการจัดส่ง</span>
                      
                      {/* Custom Dropdown อัปเดตสถานะใน Modal */}
                      <div className="position-relative">
                        <div 
                          className="d-flex align-items-center justify-content-between bg-white border shadow-sm user-select-none"
                          style={{ 
                            borderRadius: '8px', 
                            padding: '10px 16px', 
                            cursor: 'pointer',
                            borderColor: isModalStatusOpen ? '#B00000' : '#e9ecef',
                            transition: 'all 0.2s'
                          }}
                          onClick={() => setIsModalStatusOpen(!isModalStatusOpen)}
                        >
                          <div className="d-flex align-items-center gap-2">
                            {modalStatusOptions.find(opt => opt.value === modalStatus)?.icon}
                            <span style={{ fontSize: '14px', fontWeight: '600', color: '#212529' }}>
                              {modalStatus || 'เลือกสถานะ'}
                            </span>
                          </div>
                          <ChevronDown 
                            size={16} 
                            style={{ 
                              color: '#6c757d', 
                              transform: isModalStatusOpen ? 'rotate(180deg)' : 'none', 
                              transition: 'transform 0.3s ease' 
                            }} 
                          />
                        </div>

                        {isModalStatusOpen && (
                          <>
                            <div className="position-fixed top-0 start-0 w-100 h-100" style={{ zIndex: 1060 }} onClick={() => setIsModalStatusOpen(false)}></div>
                            <div 
                              className="position-absolute w-100 bg-white border shadow-lg py-2 mt-1" 
                              style={{ zIndex: 1070, borderRadius: '8px', borderColor: '#e9ecef' }}
                            >
                              {modalStatusOptions.map((opt) => (
                                <div
                                  key={opt.value}
                                  className="d-flex align-items-center gap-2 px-3 py-2 user-select-none"
                                  style={{
                                    fontSize: '14px',
                                    cursor: 'pointer',
                                    backgroundColor: modalStatus === opt.value ? 'rgba(176, 0, 0, 0.05)' : 'transparent',
                                    color: modalStatus === opt.value ? '#B00000' : '#495057',
                                    fontWeight: modalStatus === opt.value ? '600' : '500',
                                    transition: 'background-color 0.15s ease'
                                  }}
                                  onMouseEnter={(e) => { if(modalStatus !== opt.value) e.currentTarget.style.backgroundColor = '#f8f9fa' }}
                                  onMouseLeave={(e) => { if(modalStatus !== opt.value) e.currentTarget.style.backgroundColor = 'transparent' }}
                                  onClick={() => {
                                    setModalStatus(opt.value);
                                    setIsModalStatusOpen(false);
                                  }}
                                >
                                  {opt.icon}
                                  {opt.label}
                                </div>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <span className="fw-bold text-muted d-block mb-2" style={{ fontSize: '13px' }}>รายการสินค้า</span>
                  <div className="bg-white rounded-4 border shadow-sm overflow-hidden" style={{ borderColor: '#e9ecef' }}>
                    <table className="table m-0" style={{ fontSize: '14px' }}>
                      <thead className="bg-light text-muted fw-medium">
                        <tr>
                          <th className="p-3">รายการสินค้า</th>
                          <th className="p-3 w-20 text-center">จำนวน</th>
                          <th className="p-3 w-32 text-end">ราคาต่อชิ้น (บาท)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedOrder.items && selectedOrder.items.map((item, index) => (
                          <tr key={index} style={{ borderBottom: '1px solid #f8f9fa' }}>
                            <td className="p-3">
                              <div className="d-flex align-items-center gap-3">
                                <div className="bg-light d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '48px', height: '48px', borderRadius: '8px', border: '1px solid #e9ecef', overflow: 'hidden' }}>
                                  <img 
                                    src={item.image} 
                                    alt={item.name} 
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                  />
                                </div>
                                <div>
                                  <div className="fw-bold text-dark" style={{ fontSize: '14px' }}>{item.name}</div>
                                  <div className="text-muted" style={{ fontSize: '12px' }}>
                                    {item.storage && `ความจุ: ${item.storage}`} {item.color && `| สี: ${item.color}`}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="p-3 text-center text-muted" style={{ fontSize: '14px' }}>{item.qty} ชิ้น</td>
                            <td className="p-3 text-end fw-bold text-dark" style={{ fontSize: '14px' }}>
                              {String(item.price).replace('.-', '')} บาท
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    
                    <div className="bg-light p-4 d-flex justify-content-between align-items-center border-top" style={{ borderTopColor: '#e9ecef' }}>
                      <span className="fw-bold text-dark">ยอดสุทธิรวมทั้งหมด:</span>
                      <span className="fw-bold" style={{ fontSize: '18px', color: '#B00000' }}>
                        {String(selectedOrder.price).replace('.-', '')} บาท
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3 border-top bg-white d-flex justify-content-end align-items-center gap-3 rounded-bottom-4" style={{ borderTopColor: '#e9ecef' }}>
                <button onClick={() => setIsModalOpen(false)} className="btn btn-link text-muted text-decoration-none fw-bold" style={{ fontSize: '14px' }}>ปิด</button>
                <button onClick={() => setShowConfirm(true)} className="btn shadow-sm text-dark" style={{ backgroundColor: '#FFD129', fontWeight: 'bold', fontSize: '14px', borderRadius: '8px', padding: '10px 24px' }}>บันทึกการเปลี่ยนแปลง</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="position-fixed top-0 start-0 w-100 h-100" style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)', zIndex: 1060 }} onClick={() => setShowConfirm(false)}>
          <div className="d-flex align-items-center justify-content-center h-100 p-3" onClick={(e) => e.stopPropagation()}>
            <div className="bg-white rounded-4 shadow-lg p-5 text-center" style={{ width: '100%', maxWidth: '400px' }}>
              <div className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3 shadow-sm" style={{ width: '56px', height: '56px', backgroundColor: '#fff3cd', color: '#ff9800' }}>
                <svg className="w-6 h-6" style={{ stroke: 'currentColor', fill: 'none', strokeWidth: '2.5', width: '28px', height: '28px' }} viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" /></svg>
              </div>
              <h4 className="fw-bold text-dark mb-2" style={{ fontSize: '18px' }}>ยืนยันการบันทึกข้อมูล?</h4>
              <p className="text-muted mb-4" style={{ fontSize: '14px' }}>คุณต้องการบันทึกการเปลี่ยนสถานะเป็น <span className="fw-bold text-dark">"{modalStatus}"</span> ใช่หรือไม่?</p>
              <div className="d-flex gap-3 justify-content-center mt-2">
                <button onClick={() => setShowConfirm(false)} className="btn btn-light fw-bold shadow-sm" style={{ fontSize: '14px', padding: '10px 24px', borderRadius: '8px' }}>ยกเลิก</button>
                <button onClick={handleSaveChanges} className="btn text-white shadow-sm" style={{ backgroundColor: '#B00000', fontSize: '14px', fontWeight: 'bold', padding: '10px 24px', borderRadius: '8px' }}>ยืนยันบันทึก</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}