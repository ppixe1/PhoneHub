import React, { useState } from 'react';
import './OrderHistory.css';

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
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [modal, setModal] = useState('close');

  const FilteredOrders = mockOrders
    .filter((order) => {
      if (filter === 'all') return true;
      return order.status === filter;
    })
    .filter((order) => {
      const searchTerm = search.toLowerCase();
      const matchOrderId = order.id.toLowerCase().includes(searchTerm);
      const matchProductModel = order.items.some((item) =>
        item.ProductModel.toLowerCase().includes(searchTerm)
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

  return (
    <div className='w-100 bg-color-secondary'>
      <div className='bg-color-primary text-white px-5 py-3 position-sticky top-0 z-3'>
        <h2 className='ps-3' style={{ borderLeft:'12px solid #FFD129'}}>ประวัติการสั่งซื้อของฉัน</h2>
      </div>
      
      <div className='w-75 h-auto mx-auto py-4'>
        <div className='w-100 d-flex justify-content-between align-items-center bg-white br-primary position-sticky z-2' style={{top:'8%'}}>
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
                      <p className='mb-0'>{item.ProductBrand}</p>
                      <i className="bi bi-patch-check-fill text-color-primary ms-2" title='เครื่องหมายการันตีจาก PhoneHub'></i>
                    </div>
                    <div className='w-100 d-flex justify-content-between align-items-start gap-2'>
                      <div className='bg-white d-flex justify-content-center align-items-center' style={{width:'100px', height:'100px'}}>
                        <img className='w-100 h-100 object-fit-contain' src={item.ProductImg} />
                      </div>
                      <div className='flex-grow-1 d-flex flex-column justify-content-start align-items-start overflow-hidden'>
                        <p className='w-100 mb-0 b1 text-nowrap overflow-hidden' style={{textOverflow:'ellipsis'}}>{item.ProductModel}</p>
                        <p className='w-100 mb-0 b2 text-secondary text-nowrap overflow-hidden' style={{textOverflow:'ellipsis'}}>ตัวเลือกสินค้า: {item.Variation}</p>
                        <p className='w-100 mb-0 b1'>x{item.Quantity}</p>
                      </div>
                    </div>
                  </div>
                  <div className='w-25 d-flex justify-content-end align-items-center'>
                    <p className='mb-0 b1 text-color-primary'>&#3647;{item.Price}</p>
                  </div>
                </div>
              ))}

              <div className='w-100 d-flex flex-column justify-content-end align-items-center mt-2'>
                { order.status !== 'refunded' && 
                  <div className='w-100 h-50 d-flex justify-content-end align-items-center py-4'>
                    <p className='b1 mb-0'>ยอดรวมสุทธิ: <span className='ms-2 text-color-primary' style={{fontSize:'24px'}}>&#3647;{order.total}</span></p>
                  </div> 
                }
                <div className='w-100 h-50 d-flex justify-content-between align-items-end'>
                  <p className='b1 mb-0'>รหัสคำสั่งซื้อ: {order.id}</p>

                  {order.status === 'delivered' ? (
                    <div>
                      <button className='btn btn-outline-secondary me-2' type='button'>ซื้ออีกครั้ง</button>
                      <button className='btn btn-outline-secondary' type='button'>ขอคืนเงิน</button>
                    </div>
                  ) : order.status === 'shipping' ? (
                    <button className='btn btn-outline-secondary' type='button'>ยกเลิก</button>
                  ) : order.status === 'canceled' ? (
                    <button className='btn btn-outline-secondary' type='button'>ซื้ออีกครั้ง</button>
                  ) : (
                    <p className='b1 mb-0'>เงินคืนทั้งหมด: <span className='ms-2 text-color-primary' style={{fontSize:'24px'}}>&#3647;{order.total}</span></p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* ########### Modal ########### */}
      {selectedOrder && (
        <div className={`modal-follow-order-${modal}`}>
          <div key={selectedOrder.id} className='w-50 h-auto mx-auto d-flex flex-column justify-content-between align-items-center bg-white br-modal p-4'>
            <div className='w-100 d-flex justify-content-between align-items-center pb-2' style={{borderBottom:'1px solid #e8e8e8'}}>
              <div className='flex-grow-1 d-flex justify-content-start align-items-center'>
                <div className='bg-white d-flex justify-content-center align-items-center me-2' style={{width:'50px', height:'50px'}}>
                  <img className='w-100 h-100 object-fit-contain' src={selectedOrder.items[0].ProductImg} />
                </div>
                <h3 className='mb-0 text-color-primary d-flex justify-content-start align-items-center gap-3'>{selectedOrder.items[0].ProductModel}
                  {(selectedOrder.items).length > 1 && <span className='rounded-pill px-2 py-1 b3 bg-warning text-black'>+อีก {(selectedOrder.items).length - 1} รายการ</span>}
                </h3>
              </div>
              <div className='d-flex justify-content-end align-items-center gap-4'>
                <p className='b2 mb-0'>รหัสคำสั่งซื้อ: {selectedOrder.id}</p>
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
                      <p className='b2 mb-0'>{selectedOrder.status === 'delivered' ? selectedOrder.createdAt : selectedOrder.status === 'shipping' ? selectedOrder.createdAt : selectedOrder.status === 'paid' ? selectedOrder.createdAt : selectedOrder.status === 'pending' ? selectedOrder.createdAt : 'กำลังดำเนินการ'}</p>
                    </div>
                    <div className='d-flex flex-column justify-content-center align-items-center'>
                      <i className={`bi bi-cash-stack fs-1 rounded-circle status${selectedOrder.status === 'delivered' ? '-' : selectedOrder.status === 'shipping' ? '-' : selectedOrder.status === 'paid' ? '-' : '-not-'}success`}></i>
                      <p className='b1 mb-0'>ชำระเงินแล้ว</p>
                      <p className='b2 mb-0'>{selectedOrder.status === 'delivered' ? selectedOrder.paidAt : selectedOrder.status === 'shipping' ? selectedOrder.paidAt : selectedOrder.status === 'paid' ? selectedOrder.paidAt : 'กำลังดำเนินการ'}</p>
                    </div>
                    <div className='d-flex flex-column justify-content-center align-items-center'>
                      <i className={`bi bi-truck fs-1 rounded-circle status${selectedOrder.status === 'delivered' ? '-' : selectedOrder.status === 'shipping' ? '-' : '-not-'}success`}></i>
                      <p className='b1 mb-0'>อยู่ระหว่างการจัดส่ง</p>
                      <p className='b2 mb-0'>{selectedOrder.status === 'delivered' ? selectedOrder.startShippingAt : selectedOrder.status === 'shipping' ? selectedOrder.startShippingAt : 'กำลังดำเนินการ'}</p>
                    </div>
                    <div className='d-flex flex-column justify-content-center align-items-center'>
                      <i className={`bi bi-geo-alt fs-1 rounded-circle status${selectedOrder.status === 'delivered' ? '-' : '-not-'}success`}></i>
                      <p className='b1 mb-0'>จัดส่งสำเร็จ</p>
                      <p className='b2 mb-0'>{selectedOrder.status === 'delivered' ? selectedOrder.deliveredAt : 'กำลังดำเนินการ'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className='w-100 d-flex justify-content-between align-items-start pt-2'>
              <div className='w-50 d-flex flex-column justify-content-start align-items-start pe-1'>
                <h3 className='text-color-primary'>Delivery Address</h3>
                <p className="b1 mb-0">{selectedOrder.customerName} {selectedOrder.customerPhone}</p>
                <p className="b1 mb-0">
                  {selectedOrder.deliveryAddress}
                </p>
              </div>
              <div className='w-50 d-flex flex-column justify-content-start align-items-end ps-1'>
                <h3 className='text-color-primary'>{selectedOrder.shipperName}</h3>
                <p className="b2 mb-0">{selectedOrder.trackNo}</p>
                <p className="b1 mb-0">พนักงานส่งมอบ: {selectedOrder.deliveryManName}, {selectedOrder.deliveryManPhone}</p>
                <p className='b1 mb-0'>ยอดรวมสุทธิ: <span className='ms-2 text-color-primary' style={{fontSize:'24px'}}>&#3647;{selectedOrder.total}</span></p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderTracking;
