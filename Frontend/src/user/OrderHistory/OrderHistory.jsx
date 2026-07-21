import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './OrderHistory.css';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'sonner';

// ข้อมูลจำลองประวัติออเดอร์
const mockOrders = [
  {
    id: 'ORD-0000001',
    createdAt: '12/07/2026 13:00',
    items: [
      {
        ProductBrand: 'Apple',
        ProductImg: 'https://houkandbank.com/cdn/shop/files/iPhone_17_Pro_Max_Cosmic_Orange_PDP_Image_Position_1_Cosmic_Orange_Color__TH-EN-square_medium_fa0a0f89-ddf7-4c3e-9fa0-9a19b35ddae3.jpg?v=1775296901&width=1946',
        ProductModel: 'iPhone 17 Pro Max',
        Variation: 'สีส้ม, 1TB',
        Quantity: '1',
        Price: '39,000.00',
      }
    ],
    total: '39,000.00',
    paidAt: '12/07/2026 13:01',
    customerName: 'Khanit Jumjod',
    customerPhone: '0987576567',
    deliveryAddress: 'พีระมิด เลขที่ 88 ซอย พหลโยธิน 50 แขวงคลองถนน เขตสายไหม จังหวัดกรุงเทพมหานคร 10220',
    status: 'delivered',
    startShippingAt: '15/07/2026 10:00',
    shipperName: 'Flash Express',
    trackNo: 'TH20934627836',
    deliveryManName: 'John Doe',
    deliveryManPhone: '0987654321',
    deliveredAt: '15/07/2026 15:00',
  },
  {
    id: 'ORD-0000002',
    createdAt: '15/07/2026 13:00',
    items: [
      {
        ProductBrand: 'Infinix',
        ProductImg: 'https://images.priceoye.pk/infinix-note-10-pro-pakistan-priceoye-2vq1d-500x500.webp',
        ProductModel: 'Infinix Note 10 Pro',
        Variation: 'สีดำ, 128GB',
        Quantity: '1',
        Price: '6,500.00',
      },
      {
        ProductBrand: 'Unknown',
        ProductImg: 'https://down-th.img.susercontent.com/file/527b9fd3857cc55bbfbae2815b952a2e',
        ProductModel: 'เคสใส กันกระแทก',
        Variation: 'Infinix Note 10 Pro, สีดำ',
        Quantity: '1',
        Price: '999.00',
      }
    ],
    total: '39,000.00',
    paidAt: '15/07/2026 13:01',
    customerName: 'Khanit Jumjod',
    customerPhone: '0987576567',
    deliveryAddress: 'พีระมิด เลขที่ 88 ซอย พหลโยธิน 50 แขวงคลองถนน เขตสายไหม จังหวัดกรุงเทพมหานคร 10220',
    status: 'shipping',
    startShippingAt: '17/07/2026 10:00',
    shipperName: 'Flash Express',
    trackNo: 'TH20934627836',
    deliveryManName: 'John Doe',
    deliveryManPhone: '0987654321',
    deliveredAt: '17/07/2026 15:00',
  },
];

function OrderTracking() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [modal, setModal] = useState('close');
  const navigate = useNavigate();

  const getOrders = async () => {
    const token = sessionStorage.getItem('token');
    if (!token) return toast.error('คุณไม่มี Token กรุณาเข้าสู่ระบบใหม่อีกครั้ง');

    try {
      const token = sessionStorage.getItem('token');
      if (!token) return toast.error('คุณไม่มี Token กรุณาเข้าสู่ระบบใหม่อีกครั้ง');

      const data = jwtDecode(token);

      const res = await axios.get('http://localhost:3000/order')
      setOrders((res.data.orders).filter((order) => order.user_id === data.user_id));
    } catch (error) {
      if (error.response.status === 400 || error.response.status === 500) {
        toast.error(error.response.data.msg);
      }
    }
  }

  useEffect(() => {
    getOrders();
  }, []);

  const FilteredOrders = orders
    .filter((order) => {
      if (filter === 'all') return true;
      return order.status === filter;
    })
    .filter((order) => {
      const searchTerm = search.toLowerCase();
      const matchOrderId = String(order.id).toLowerCase().includes(searchTerm);
      const matchProductModel = order.items.some((item) =>
        item.product_model.toLowerCase().includes(searchTerm)
      );
    return matchOrderId || matchProductModel;
  });


  const [selectedOrder, setSelectedOrder] = useState(null);

  const openModal = (order) => {
    setSelectedOrder(order);
    setModal('open');
  }

  const closeModal = () => {
    setModal('close');
    setSelectedOrder(null);
  }

  const onBack = () => {
    navigate('/home');
  };

  const updateStatus = (action, order_id) => {
    axios.put(`http://localhost:3000/order/${action}/${order_id}`)
    .then(() => {
      getOrders();
    })
    .catch((error) => {
      console.error('Error updating order:', error);
    });
  }

  return (
    <div className='w-100 bg-color-secondary'>
      <div className='bg-color-primary text-white px-5 py-3 position-sticky top-0 z-3 d-flex align-items-center gap-3' style={{maxHeight:'60px'}}>
        <div 
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

        <h3 className='ps-3' style={{ borderLeft:'12px solid #FFD129'}}>ประวัติการสั่งซื้อของฉัน</h3>
      </div>
      
      <div className='w-75 h-auto mx-auto py-4'>
        <div className='w-100 d-flex justify-content-between align-items-center bg-white br-primary position-sticky z-2' style={{top:'6%'}}>
          <button className='w-100 py-3 b1 bg-white btn-order-history rounded-start-2' onClick={() => setFilter('all')} style={filter === 'all' ? { borderBottom:'2px solid #B00000', color:'#B00000'} : { borderBottom:'2px solid #e8e8e8'}} type='button'>ทั้งหมด</button>
          <button className='w-100 py-3 b1 bg-white btn-order-history' onClick={() => setFilter('shipping')} style={filter === 'shipping' ? { borderBottom:'2px solid #B00000', color:'#B00000'} : { borderBottom:'2px solid #e8e8e8'}} type='button'>อยู่ระหว่างการจัดส่ง</button>
          <button className='w-100 py-3 b1 bg-white btn-order-history' onClick={() => setFilter('delivered')} style={filter === 'delivered' ? { borderBottom:'2px solid #B00000', color:'#B00000'} : { borderBottom:'2px solid #e8e8e8'}} type='button'>จัดส่งสำเร็จ</button>
          <button className='w-100 py-3 b1 bg-white btn-order-history' onClick={() => setFilter('canceled')} style={filter === 'canceled' ? { borderBottom:'2px solid #B00000', color:'#B00000'} : { borderBottom:'2px solid #e8e8e8'}} type='button'>ยกเลิกแล้ว</button>
          <button className='w-100 py-3 b1 bg-white btn-order-history rounded-end-2' onClick={() => setFilter('refunded')} style={filter === 'refunded' ? { borderBottom:'2px solid #B00000', color:'#B00000'} : { borderBottom:'2px solid #e8e8e8'}} type='button'>คืนเงินสำเร็จ</button>
        </div>

        <div className='w-100 px-4 d-flex justify-content-start align-items-center my-2 br-primary' style={{backgroundColor:'#e8e8e8'}}>
          <i className="bi bi-search fs-5"></i>
          <input className='w-100 px-4 py-2 border-0' style={{outline:'none', backgroundColor:'#e8e8e8'}} type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder='คุณสามารถค้นหาด้วยชื่อสินค้า หรือ รหัสคำสั่งซื้อ' />
        </div>

        <div className='w-100 d-flex flex-column justify-content-start align-items-start gap-2'>
          {FilteredOrders.toReversed().map((order, index) => (
            <div key={index} className='w-100 d-flex flex-column justify-content-between align-items-center p-4 bg-white br-primary'>
              <div className='w-100 d-flex justify-content-end align-items-start'>
                {order.status === 'delivered' ? (
                  <p className='text-white mb-0 bg-success fw-bold b2 rounded-pill ps-1 pe-2' onClick={() => openModal(order)} style={{cursor:'pointer'}}><i className="bi bi-dot"></i>จัดส่งสำเร็จ</p>
                ) : order.status === 'shipping' ? (
                  <p className='text-black mb-0 bg-color-accent fw-bold b2 rounded-pill ps-1 pe-2' onClick={() => openModal(order)} style={{cursor:'pointer'}}><i className="bi bi-dot"></i>อยู่ระหว่างการจัดส่ง</p>
                ) : order.status === 'paid' ? (
                  <p className='text-black mb-0 bg-info fw-bold b2 rounded-pill ps-1 pe-2' onClick={() => openModal(order)} style={{cursor:'pointer'}}><i className="bi bi-dot"></i>ชำระเงินแล้ว</p>
                ) : order.status === 'pending' ? (
                  <p className='text-black mb-0 bg-info fw-bold b2 rounded-pill ps-1 pe-2' onClick={() => openModal(order)} style={{cursor:'pointer'}}><i className="bi bi-dot"></i>รอการชำระเงิน</p>
                ) :order.status === 'canceled' ? (
                  <p className='text-white mb-0 bg-secondary fw-bold b2 rounded-pill ps-1 pe-2'><i className="bi bi-dot"></i>ยกเลิกแล้ว</p>
                ) : (
                  <p className='text-black mb-0 bg-info fw-bold b2 rounded-pill ps-1 pe-2'><i className="bi bi-dot"></i>คืนเงินสำเร็จ</p>
                )}
              </div>

              {order.items.map((item, index) => (
                <div key={index} className='w-100 d-flex justify-content-between align-items-center py-2' style={{cursor:'pointer', borderBottom:'1px solid #e8e8e8'}} onClick={() => openModal(order)}>
                  <div className='w-75 d-flex flex-column justify-content-between align-items-start'>
                    <div className='w-100 d-flex justify-content-start align-items-end b1'>
                      <p className='mb-0'>{item.product_brand}</p>
                      <i className="bi bi-patch-check-fill text-color-primary ms-2" title='เครื่องหมายการันตีจาก PhoneHub'></i>
                    </div>
                    <div className='w-100 d-flex justify-content-between align-items-start gap-2'>
                      <div className='bg-white d-flex justify-content-center align-items-center' style={{width:'100px', height:'100px'}}>
                        <img className='w-100 h-100 object-fit-contain' src={JSON.parse(item.product_img)} />
                      </div>
                      <div className='flex-grow-1 d-flex flex-column justify-content-start align-items-start overflow-hidden'>
                        <p className='w-100 mb-0 b1 text-nowrap overflow-hidden' style={{textOverflow:'ellipsis'}}>{item.product_model}</p>
                        <p className='w-100 mb-0 b2 text-secondary text-nowrap overflow-hidden' style={{textOverflow:'ellipsis'}}>สี: {JSON.parse(item.variation)[0].color} ความจุ: {JSON.parse(item.variation)[0].storage}</p>
                        <p className='w-100 mb-0 b1'>x{item.quantity}</p>
                      </div>
                    </div>
                  </div>
                  <div className='w-25 d-flex justify-content-end align-items-center'>
                    <p className='mb-0 b1 text-color-primary'>&#3647;{Number(item.price_at_purchase).toLocaleString()}</p>
                  </div>
                </div>
              ))}

              <div className='w-100 d-flex flex-column justify-content-end align-items-center mt-2'>
                { order.status !== 'refunded' && 
                  <div className='w-100 h-50 d-flex justify-content-end align-items-center py-4'>
                    <p className='b1 mb-0'>ยอดรวมสุทธิ: <span className='ms-2 text-color-primary' style={{fontSize:'24px'}}>&#3647;{Number(order.total_price).toLocaleString()}</span></p>
                  </div> 
                }
                <div className='w-100 h-50 d-flex justify-content-between align-items-end'>
                  <p className='b1 mb-0'>รหัสคำสั่งซื้อ: ORD-{order.id.toString().padStart(6, '0')}</p>

                  {order.status === 'delivered' ? (
                    <div>
                      {/* <button className='btn btn-outline-secondary me-2' type='button'>ซื้ออีกครั้ง</button> */}
                      <button className='btn btn-outline-secondary' type='button' onClick={() => updateStatus('refunded', order.id)}>ขอคืนเงิน</button>
                    </div>
                  ) : order.status === 'shipping' ? (
                    <button className='btn btn-outline-secondary' type='button' onClick={() => updateStatus('canceled', order.id)}>ยกเลิก</button>
                  ) : order.status === 'canceled' ? (
                    // <button className='btn btn-outline-secondary' type='button'>ซื้ออีกครั้ง</button>
                    ''
                  ) : (
                    <p className='b1 mb-0'>เงินคืนทั้งหมด: <span className='ms-2 text-color-primary' style={{fontSize:'24px'}}>&#3647;{Number(order.total_price).toLocaleString()}</span></p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* ########### Modal ########### */}
      {selectedOrder && (
        <div className={`modal-follow-order-${modal}`} onClick={closeModal}>
          <div key={selectedOrder.id} onClick={e => e.stopPropagation()} className='modal-con w-50 h-auto mx-auto d-flex flex-column justify-content-between align-items-center bg-white br-modal p-4'>
            <div className='w-100 d-flex justify-content-between align-items-center pb-2' style={{borderBottom:'1px solid #e8e8e8'}}>
              <div className='flex-grow-1 d-flex justify-content-start align-items-center'>
                <div className='bg-white d-flex justify-content-center align-items-center me-2' style={{width:'50px', height:'50px'}}>
                  <img className='w-100 h-100 object-fit-contain' src={JSON.parse(selectedOrder.items[0].product_img)} />
                </div>
                <h3 className='mb-0 text-color-primary d-flex justify-content-start align-items-center gap-3'>{selectedOrder.items[0].product_model}
                  {(selectedOrder.items).length > 1 && <span className='rounded-pill px-2 py-1 b3 bg-warning text-black' title={selectedOrder.items.map((item) => `${item.product_brand} ${item.product_model} x${item.quantity}\n`)}>+อีก {(selectedOrder.items).length - 1} รายการ</span>}
                </h3>
              </div>
              <div className='d-flex justify-content-end align-items-center gap-4'>
                <p className='b2 mb-0'>รหัสคำสั่งซื้อ: ORD-{selectedOrder.id.toString().padStart(6, '0')}</p>
                <i className="bi bi-x btn btn-danger p-0 px-2 fs-2" onClick={closeModal}></i>
              </div>
            </div>

            <div className='w-100 d-flex flex-column justify-content-center align-items-center' style={{height:'250px'}}>
              <div className='w-100 h-100 d-flex flex-column justify-content-center align-items-center'>
                <div className='w-75 mx-auto position-relative z-1' style={{padding:'0 75px', top:'60px'}}>
                  <div className='py-3 rounded-pill progressbar' style={{width: selectedOrder.status === 'delivered' ? '100%' : selectedOrder.status === 'shipping' ? '100%' : selectedOrder.status === 'paid' ? '75%' : '25%', backgroundColor:'#2dc258'}}></div>
                </div>
                <div className='w-75 mx-auto z-2'>
                  <div className='w-100 d-flex justify-content-between align-items-center'>
                    <div className='d-flex flex-column justify-content-center align-items-center'>
                      <i className={`bi bi-receipt fs-1 rounded-circle status${selectedOrder.status === 'delivered' ? '-' : selectedOrder.status === 'shipping' ? '-' : selectedOrder.status === 'paid' ? '-' : selectedOrder.status === 'pending' ? '-' : '-not-'}success`}></i>
                      <p className='b1 mb-0'>สั่งซื้อสินค้าแล้ว</p>
                      <p className='b2 mb-0'>{selectedOrder.status === 'delivered' ? selectedOrder.created_at : selectedOrder.status === 'shipping' ? selectedOrder.created_at : selectedOrder.status === 'paid' ? selectedOrder.created_at : selectedOrder.status === 'pending' ? selectedOrder.created_at : 'กำลังดำเนินการ'}</p>
                    </div>
                    <div className='d-flex flex-column justify-content-center align-items-center'>
                      <i className={`bi bi-cash-stack fs-1 rounded-circle status${selectedOrder.status === 'delivered' ? '-' : selectedOrder.status === 'shipping' ? '-' : selectedOrder.status === 'paid' ? '-' : '-not-'}success`}></i>
                      <p className='b1 mb-0'>ชำระเงินแล้ว</p>
                      <p className='b2 mb-0'>{selectedOrder.status === 'delivered' ? selectedOrder.paid_at : selectedOrder.status === 'shipping' ? selectedOrder.paid_at : selectedOrder.status === 'paid' ? selectedOrder.paid_at : 'กำลังดำเนินการ'}</p>
                    </div>
                    <div className='d-flex flex-column justify-content-center align-items-center'>
                      <i className={`bi bi-truck fs-1 rounded-circle status${selectedOrder.status === 'delivered' ? '-' : selectedOrder.status === 'shipping' ? '-' : '-not-'}success`}></i>
                      <p className='b1 mb-0'>อยู่ระหว่างการจัดส่ง</p>
                      <p className='b2 mb-0'>{selectedOrder.status === 'delivered' ? selectedOrder.start_shipping_at : selectedOrder.status === 'shipping' ? selectedOrder.start_shipping_at : 'กำลังดำเนินการ'}</p>
                    </div>
                    <div className='d-flex flex-column justify-content-center align-items-center'>
                      <i className={`bi bi-geo-alt fs-1 rounded-circle status${selectedOrder.status === 'delivered' ? '-' : '-not-'}success`}></i>
                      <p className='b1 mb-0'>จัดส่งสำเร็จ</p>
                      <p className='b2 mb-0'>{selectedOrder.status === 'delivered' ? selectedOrder.delivered_at : 'กำลังดำเนินการ'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className='w-100 d-flex justify-content-between align-items-start pt-2'>
              <div className='w-50 d-flex flex-column justify-content-start align-items-start pe-1'>
                <h3 className='text-color-primary'>Delivery Address</h3>
                {/* <p className="b1 mb-0">{selectedOrder.customer_name} {selectedOrder.customer_phone}</p> */}
                <p className="b1 mb-0">
                  {selectedOrder.shipping_address}
                </p>
              </div>
              <div className='w-50 d-flex flex-column justify-content-start align-items-end ps-1'>
                <h3 className='text-color-primary'>{selectedOrder.shipper_name}</h3>
                <p className="b2 mb-0">{selectedOrder.tracking_no}</p>
                <p className="b1 mb-0">พนักงานส่งมอบ: {selectedOrder.delivery_person_name}, {selectedOrder.delivery_person_phone}</p>
                <p className='b1 mb-0'>ยอดรวมสุทธิ: <span className='ms-2 text-color-primary' style={{fontSize:'24px'}}>&#3647;{Number(selectedOrder.total_price).toLocaleString()}</span></p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderTracking;
