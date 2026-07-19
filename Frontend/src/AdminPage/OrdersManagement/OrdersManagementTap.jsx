import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, ListFilter, CheckCircle2, Clock, Package, Truck, XCircle, RefreshCw } from 'lucide-react';
import { getOrders, updateOrderStatus } from '../services/api';
import axios from 'axios';

// 1. แผนผังสำหรับจัดการแปลงค่า Status ระหว่างหน้าบ้าน (ไทย) และหลังบ้าน DB (อังกฤษ)
const STATUS_MAP = {
  'pending': { label: 'รอดำเนินการ', bg: '#FFF8E1', text: '#F57F17', icon: <Clock size={16} color="#F57F17" /> },
  'paid': { label: 'ชำระเงินแล้ว', bg: '#E8F5E9', text: '#2E7D32', icon: <CheckCircle2 size={16} color="#2E7D32" /> },
  'shipping': { label: 'กำลังเตรียมจัดส่ง', bg: '#E3F2FD', text: '#1565C0', icon: <Package size={16} color="#1565C0" /> },
  'delivered': { label: 'จัดส่งแล้ว', bg: '#F3E5F5', text: '#7B1FA2', icon: <Truck size={16} color="#7B1FA2" /> },
  'canceled': { label: 'ยกเลิกแล้ว', bg: '#FFEBEE', text: '#C62828', icon: <XCircle size={16} color="#C62828" /> },
  'refunded': { label: 'คืนเงินแล้ว', bg: '#ECEFF1', text: '#37474F', icon: <RefreshCw size={16} color="#37474F" /> }
};

export default function OrdersManagementTap() {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('สถานะทั้งหมด');
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isModalStatusOpen, setIsModalStatusOpen] = useState(false);

  useEffect(() => {
    const loadOrders = async () => {
      setIsLoading(true);
      setFetchError('');
      try {
        const data = await getOrders();
        if (mounted) {
          // ถ้า data ส่งมาเป็น Object { orders: [...] } ให้แตกหยิบเอาเฉพาะ array ด้านใน
          const ordersArray = data && data.orders ? data.orders : (Array.isArray(data) ? data : []);
          setOrders(ordersArray);
        }
      } catch (err) {
        console.error(err);
        if (mounted) setFetchError('ไม่สามารถโหลดคำสั่งซื้อได้');
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    let mounted = true;

    loadOrders();
    return () => { mounted = false; };
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalStatus, setModalStatus] = useState(''); // จะเก็บเป็นค่าภาษาอังกฤษ (DB Value)
  const [showConfirm, setShowConfirm] = useState(false);

  // ฟังก์ชันดึงสไตล์ของป้ายสถานะ
  const getStatusStyle = (status) => {
    return STATUS_MAP[status] || { bg: '#F8F9FA', text: '#6C757D', label: status };
  };

  // รายการสถานะสำหรับตัวกรอง (หน้าบ้าน)
  const statusOptions = [
    { value: 'สถานะทั้งหมด', label: 'สถานะทั้งหมด', icon: <ListFilter size={16} color="#6C757D" /> },
    ...Object.keys(STATUS_MAP).map(key => ({
      value: key,
      label: STATUS_MAP[key].label,
      icon: STATUS_MAP[key].icon
    }))
  ];

  const modalStatusOptions = statusOptions.filter(opt => opt.value !== 'สถานะทั้งหมด');

  const handleInspectClick = (order) => {
    setSelectedOrder(order);
    setModalStatus(order.status); // เก็บสถานะภาษาอังกฤษจาก DB ลงตัวแปรเลือก
    setIsModalOpen(true);
    setShowConfirm(false);
    setIsModalStatusOpen(false);
  };

  const handleSaveChanges = async () => {
    if (!selectedOrder) return;
    setShowConfirm(false);
    setIsSaving(true);

    try {
      // ส่งสถานะที่เป็นภาษาอังกฤษไปยัง API หลังบ้าน
      const updatedOrder = await updateOrderStatus(modalStatus, selectedOrder.id);
      setOrders((prevOrders) =>
        prevOrders.map((ord) =>
          ord.id === selectedOrder.id ? { ...ord, status: updatedOrder?.status ?? modalStatus } : ord
        )
      );
      setIsModalOpen(false);
      setSelectedOrder(null);
      alert('บันทึกสถานะคำสั่งซื้อสําเร็จ');
    } catch (err) {
      console.error(err);
      window.alert('ไม่สามารถบันทึกสถานะคำสั่งซื้อได้ โปรดลองอีกครั้ง');
    } finally {
      setIsSaving(false);
    }
  };

  // ปลอดภัยไว้ก่อน: ตรวจสอบว่าเป็น Array จริง ๆ ก่อนใช้ฟังก์ชัน .filter
  const safeOrders = Array.isArray(orders) ? orders : [];

  const filteredOrders = safeOrders.filter(order => {
    // ป้องกันกรณีที่ order.items ถูกบันทึกมาเป็นรูปแบบ String JSON
    let itemsArray = [];
    try {
      itemsArray = typeof order.items === 'string' ? JSON.parse(order.items) : (order.items || []);
    } catch (e) {
      itemsArray = [];
    }

    const firstItemName = itemsArray.length > 0 ? (itemsArray[0].product_model || itemsArray[0].name || '') : '';
    
    // ตรวจสอบเงื่อนไขค้นหาข้อความ
    const matchesSearch = String(order.id).toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (order.customer_name && order.customer_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          firstItemName.toLowerCase().includes(searchTerm.toLowerCase());
    
    // ตรวจสอบเงื่อนไขคัดกรองสถานะ
    const matchesStatus = statusFilter === 'สถานะทั้งหมด' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // ฟังก์ชันช่วยสำหรับการ parse ข้อมูล JSON ใน Render
  const safeParseJSON = (jsonString, fallback) => {
    try {
      return jsonString ? JSON.parse(jsonString) : fallback;
    } catch (e) {
      return fallback;
    }
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '2rem' }}>
      <div className="rounded-4 overflow-hidden shadow-sm border mb-4" style={{ borderColor: '#e9ecef' }}>
        <div className="text-white p-4" style={{ backgroundColor: '#B00000' }}>
          <h2 className="fw-bold mb-2" style={{ fontSize: '24px', borderLeft: '12px solid #FFD129', paddingLeft: '12px' }}>
            จัดการคำสั่งซื้อ (Orders)
          </h2>
          <p className="m-0 text-white-50" style={{ paddingLeft: '24px' }}>ตรวจสอบออเดอร์ แก้สถานะ และติดตามการจัดส่งทั้งหมดในระบบ</p>
        </div>
      </div>

      <div className="px-1">
        <div className="d-flex flex-column flex-sm-row gap-3 mb-4 w-100">
          <div className="position-relative" style={{ minWidth: '200px' }}>
            <div 
              className="d-flex align-items-center justify-content-between bg-white border shadow-sm user-select-none"
              style={{ borderRadius: '8px', padding: '10px 16px', cursor: 'pointer', borderColor: isFilterOpen ? '#B00000' : '#e9ecef' }}
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <div className="d-flex align-items-center gap-2">
                {statusOptions.find(opt => opt.value === statusFilter)?.icon}
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#495057' }}>
                  {statusOptions.find(opt => opt.value === statusFilter)?.label}
                </span>
              </div>
              <ChevronDown size={16} style={{ color: '#6c757d', transform: isFilterOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s ease' }} />
            </div>

            {isFilterOpen && (
              <>
                <div className="position-fixed top-0 start-0 w-100 h-100" style={{ zIndex: 40 }} onClick={() => setIsFilterOpen(false)}></div>
                <div className="position-absolute w-100 bg-white border shadow-lg py-2 mt-1" style={{ zIndex: 50, borderRadius: '8px', borderColor: '#e9ecef' }}>
                  {statusOptions.map((opt) => (
                    <div
                      key={opt.value}
                      className="d-flex align-items-center gap-2 px-3 py-2 user-select-none"
                      style={{
                        fontSize: '14px', cursor: 'pointer',
                        backgroundColor: statusFilter === opt.value ? 'rgba(176, 0, 0, 0.05)' : 'transparent',
                        color: statusFilter === opt.value ? '#B00000' : '#495057',
                        fontWeight: statusFilter === opt.value ? '600' : '500'
                      }}
                      onClick={() => { setStatusFilter(opt.value); setIsFilterOpen(false); }}
                    >
                      {opt.icon} {opt.label}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="input-group shadow-sm" style={{ maxWidth: '350px', borderRadius: '8px', overflow: 'hidden' }}>
            <span className="input-group-text bg-white border-end-0" style={{ paddingLeft: '16px' }}><Search size={18} style={{ color: "#999" }} /></span>
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

        {fetchError && <div className="alert alert-danger shadow-sm mb-4">{fetchError}</div>}

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
                {isLoading ? (
                  <tr><td colSpan="7" className="text-center text-muted p-5">กำลังโหลดข้อมูลคำสั่งซื้อ...</td></tr>
                ) : filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => {
                    const orderItems = typeof order.items === 'string' ? safeParseJSON(order.items, []) : (order.items || []);
                    const hasItems = orderItems.length > 0;
                    const firstItem = hasItems ? orderItems[0] : null;
                    const extraItemsCount = hasItems ? orderItems.length - 1 : 0;
                    const statusStyle = getStatusStyle(order.status);

                    // แก้การพังตอนแปลงรูปภาพและส่วนย่อยของ Variant ของชิ้นแรก
                    const firstItemImg = firstItem ? safeParseJSON(firstItem.product_img, '') : '';
                    const firstItemVariation = firstItem ? safeParseJSON(firstItem.variation, [{}])[0] : {};

                    return (
                      <tr key={order.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                        <td className="text-center fw-bold" style={{ fontSize: '14px' }}>ORD-{order.id.toString().padStart(6, '0')}</td>
                        <td className="text-center text-muted" style={{ fontSize: '13px' }}>{order.created_at}</td>
                        <td className="py-3">
                          {firstItem ? (
                            <div className="d-flex align-items-center gap-3">
                              <div className="bg-light d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '48px', height: '48px', borderRadius: '8px', border: '1px solid #e9ecef', overflow: 'hidden' }}>
                                <img src={firstItemImg} alt={firstItem.product_model} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              </div>
                              <div style={{ minWidth: 0 }}>
                                <div className="fw-bold text-dark mb-1" style={{ fontSize: '14px' }}>{firstItem.product_model}</div>
                                <div className="text-muted text-truncate" style={{ fontSize: '12px' }}>
                                  สี: {firstItemVariation.color || '-'}, ความจุ: {firstItemVariation.storage || '-'}
                                </div>
                                <div>
                                  <span className="text-muted" style={{ fontSize: '12px' }}>x{firstItem.quantity}</span>
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
                        <td className="text-center fw-medium text-dark" style={{ fontSize: '14px' }}>{order.customer_name}</td>
                        <td className="text-center fw-bold" style={{ fontSize: '15px', color: '#B00000' }}>
                          {String(Number(order.total_price).toLocaleString()).replace('.-', '')} .-
                        </td>
                        <td className="text-center">
                          <span 
                            className="badge rounded-pill d-inline-flex align-items-center justify-content-center gap-1"
                            style={{ backgroundColor: statusStyle.bg, color: statusStyle.text, padding: '6px 12px', fontSize: '12px', fontWeight: '600' }}
                          >
                            <span style={{ fontSize: '8px' }}>●</span> {statusStyle.label}
                          </span>
                        </td>
                        <td className="text-center">
                          <button 
                            onClick={() => handleInspectClick(order)}
                            className="btn btn-sm shadow-sm d-inline-flex justify-content-center align-items-center"
                            style={{ backgroundColor: '#FFD129', color: '#000', fontSize: '13px', fontWeight: '700', borderRadius: '6px', padding: '6px 16px', minWidth: '80px' }}
                          >
                            ตรวจสอบ
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center text-muted p-5" style={{ fontSize: '14px' }}>ไม่พบข้อมูลคำสั่งซื้อที่ตรงกับเงื่อนไขการค้นหา</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isModalOpen && selectedOrder && (
        <div className="position-fixed top-0 start-0 w-100 h-100" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1050 }} onClick={() => setIsModalOpen(false)}>
          <div className="d-flex align-items-center justify-content-center h-100 p-3" onClick={(e) => e.stopPropagation()}>
            <div className="bg-light rounded-4 shadow-lg d-flex flex-column overflow-hidden" style={{ width: '100%', maxWidth: '600px', maxHeight: '90vh' }}>
              <div className="text-white p-4 d-flex justify-content-between align-items-start" style={{ backgroundColor: '#B00000' }}>
                <div>
                  <h3 className="fw-bold m-0 mb-2" style={{ fontSize: '18px' }}>รายละเอียดคำสั่งซื้อ <span style={{ color: '#FFD129' }}>ORD-{selectedOrder.id.toString().padStart(6, '0')}</span></h3>
                  <p className="m-0" style={{ fontSize: '12px', color: 'rgba(255, 209, 41, 0.8)' }}>สั่งซื้อเมื่อ: {selectedOrder.created_at}</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="btn-close btn-close-white"></button>
              </div>

              <div className="overflow-auto p-4" style={{ flex: 1, backgroundColor: '#F3F4F6' }}>
                <div className="row mb-4 g-3">
                  <div className="col-12 col-md-6">
                    <div className="bg-white p-4 rounded-4 border shadow-sm h-100" style={{ borderColor: '#e9ecef' }}>
                      <span className="fw-bold text-muted d-block mb-2" style={{ fontSize: '13px' }}>ข้อมูลลูกค้า / จัดส่ง</span>
                      <h4 className="fw-bold m-0 mb-2 text-dark" style={{ fontSize: '15px' }}>{selectedOrder.customer_name}</h4>
                    </div>
                  </div>

                  <div className="col-12 col-md-6">
                    <div className="bg-white p-4 rounded-4 border shadow-sm h-100" style={{ borderColor: '#e9ecef' }}>
                      <span className="fw-bold text-muted d-block mb-2" style={{ fontSize: '13px' }}>อัปเดตสถานะการจัดส่ง</span>
                      <div className="position-relative">
                        <div 
                          className="d-flex align-items-center justify-content-between bg-white border shadow-sm user-select-none"
                          style={{ borderRadius: '8px', padding: '10px 16px', cursor: 'pointer', borderColor: isModalStatusOpen ? '#B00000' : '#e9ecef' }}
                          onClick={() => setIsModalStatusOpen(!isModalStatusOpen)}
                        >
                          <div className="d-flex align-items-center gap-2">
                            {modalStatusOptions.find(opt => opt.value === modalStatus)?.icon}
                            <span style={{ fontSize: '14px', fontWeight: '600', color: '#212529' }}>
                              {modalStatusOptions.find(opt => opt.value === modalStatus)?.label || 'เลือกสถานะ'}
                            </span>
                          </div>
                          <ChevronDown size={16} style={{ color: '#6c757d', transform: isModalStatusOpen ? 'rotate(180deg)' : 'none' }} />
                        </div>
                        {isModalStatusOpen && (
                          <>
                            <div className="position-fixed top-0 start-0 w-100 h-100" style={{ zIndex: 1060 }} onClick={() => setIsModalStatusOpen(false)}></div>
                            <div className="position-absolute w-100 bg-white border shadow-lg py-2 mt-1" style={{ zIndex: 1070, borderRadius: '8px' }}>
                              {modalStatusOptions.map((opt) => (
                                <div
                                  key={opt.value}
                                  className="d-flex align-items-center gap-2 px-3 py-2 user-select-none"
                                  style={{ fontSize: '14px', cursor: 'pointer', backgroundColor: modalStatus === opt.value ? 'rgba(176, 0, 0, 0.05)' : 'transparent', color: modalStatus === opt.value ? '#B00000' : '#495057', fontWeight: modalStatus === opt.value ? '600' : '500' }}
                                  onClick={() => { setModalStatus(opt.value); setIsModalStatusOpen(false); }}
                                >
                                  {opt.icon} {opt.label}
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
                        {(typeof selectedOrder.items === 'string' ? safeParseJSON(selectedOrder.items, []) : (selectedOrder.items || [])).map((item, index) => {
                          const itemImg = safeParseJSON(item.product_img, '');
                          const itemVariation = safeParseJSON(item.variation, [{}])[0];

                          return (
                            <tr key={index} style={{ borderBottom: '1px solid #f8f9fa' }}>
                              <td className="p-3">
                                <div className="d-flex align-items-center gap-3">
                                  <div className="bg-light d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '48px', height: '48px', borderRadius: '8px', border: '1px solid #e9ecef', overflow: 'hidden' }}>
                                    <img src={itemImg} alt={item.product_model} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                  </div>
                                  <div>
                                    <div className="fw-bold text-dark" style={{ fontSize: '14px' }}>{item.product_model}</div>
                                    <div className="text-muted" style={{ fontSize: '12px' }}>
                                      สี: {itemVariation.color || '-'}, ความจุ: {itemVariation.storage || '-'}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="p-3 text-center text-muted" style={{ fontSize: '14px' }}>{item.quantity}</td>
                              <td className="p-3 text-end fw-bold text-dark" style={{ fontSize: '14px' }}>{String(Number(item.price_at_purchase).toLocaleString()).replace('.-', '')} บาท</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                    <div className="bg-light p-4 d-flex justify-content-between align-items-center border-top">
                      <span className="fw-bold text-dark">ยอดสุทธิรวมทั้งหมด:</span>
                      <span className="fw-bold" style={{ fontSize: '18px', color: '#B00000' }}>{String(Number(selectedOrder.total_price).toLocaleString()).replace('.-', '')} บาท</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3 border-top bg-white d-flex justify-content-end align-items-center gap-3 rounded-bottom-4">
                <button onClick={() => setIsModalOpen(false)} className="btn btn-link text-muted text-decoration-none fw-bold" style={{ fontSize: '14px' }}>ปิด</button>
                <button onClick={() => setShowConfirm(true)} className="btn shadow-sm text-dark" style={{ backgroundColor: '#FFD129', fontWeight: 'bold', fontSize: '14px', borderRadius: '8px', padding: '10px 24px' }}>บันทึกการเปลี่ยนแปลง</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showConfirm && (
        <div className="position-fixed top-0 start-0 w-100 h-100" style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)', zIndex: 1060 }} onClick={() => setShowConfirm(false)}>
          <div className="d-flex align-items-center justify-content-center h-100 p-3" onClick={(e) => e.stopPropagation()}>
            <div className="bg-white rounded-4 shadow-lg p-5 text-center" style={{ width: '100%', maxWidth: '400px' }}>
              <div className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3 shadow-sm" style={{ width: '56px', height: '56px', backgroundColor: '#fff3cd', color: '#ff9800' }}>
                <svg className="w-6 h-6" style={{ stroke: 'currentColor', fill: 'none', strokeWidth: '2.5', width: '28px', height: '28px' }} viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" /></svg>
              </div>
              <h4 className="fw-bold text-dark mb-2" style={{ fontSize: '18px' }}>ยืนยันการบันทึกข้อมูล?</h4>
              <p className="text-muted mb-4" style={{ fontSize: '14px' }}>คุณต้องการบันทึกการเปลี่ยนสถานะเป็น <span className="fw-bold text-dark">"{STATUS_MAP[modalStatus]?.label || modalStatus}"</span> ใช่หรือไม่?</p>
              <div className="d-flex gap-3 justify-content-center mt-2">
                <button onClick={() => setShowConfirm(false)} className="btn btn-light fw-bold shadow-sm" style={{ fontSize: '14px', padding: '10px 24px', borderRadius: '8px' }}>ยกเลิก</button>
                <button onClick={handleSaveChanges} className="btn text-white shadow-sm" style={{ backgroundColor: '#B00000', fontSize: '14px', fontWeight: 'bold', padding: '10px 24px', borderRadius: '8px' }} disabled={isSaving}>{isSaving ? 'กำลังบันทึก...' : 'ยืนยันบันทึก'}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}