import { useState, useEffect } from 'react';
import { 
  Users, BadgeDollarSign, Clock, ShoppingCart, Sparkles, Truck, 
  CheckCircle2, XCircle, Road, Package, TrendingUp, Medal, 
  ChevronDown, Calendar, Check 
} from 'lucide-react';
// สังเกตว่าเราลบการดึง mockData ออกไปแล้ว และใช้แค่ api อย่างเดียว
import { getDashboardData } from '../services/api';

export default function DashboardTab() {
  const [timeframe, setTimeframe] = useState("today");
  const [isTimeframeOpen, setIsTimeframeOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // กำหนดโครงสร้างข้อมูลว่างๆ ไว้ป้องกันหน้าเว็บพังระหว่างรอ Backend ส่งข้อมูลมาให้
  const [dashboardData, setDashboardData] = useState({});

  useEffect(() => {
    let active = true;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await getDashboardData(timeframe);
        if (active && data) {
          setDashboardData(data);
        }
      } catch (err) {
        if (err) console.error("Dashboard data fetch error:", err);
      } finally {
        if (active) setIsLoading(false);
      }
    };

    fetchData();
    return () => { active = false; };
  }, [timeframe]);

  const timeOptions = [
    { value: "today", label: "วันนี้" },
    { value: "last7days", label: "7 วันล่าสุด" },
    { value: "last30days", label: "1 เดือนล่าสุด" },
    { value: "all", label: "ทั้งหมด" }
  ];

  const selectedLabel = timeOptions.find(opt => opt.value === timeframe)?.label;

  const totalOrdersCount = dashboardData.logistics?.reduce((sum, item) => {
    const valueNumber = Number(String(item.value).replace(/\D/g, ""));
    return sum + (Number.isNaN(valueNumber) ? 0 : valueNumber);
  }, 0) || 0;

  const logisticsStyles = [
    { bg: '#EFF6FF', color: '#3B82F6', icon: <Package style={{ width: '24px', height: '24px' }} /> },
    { bg: '#FFF7ED', color: '#F97316', icon: <Truck style={{ width: '24px', height: '24px' }} /> },
    { bg: '#F0FDF4', color: '#22C55E', icon: <CheckCircle2 style={{ width: '24px', height: '24px' }} /> },
    { bg: '#FEF2F2', color: '#EF4444', icon: <XCircle style={{ width: '24px', height: '24px' }} /> },
  ];

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '2rem' }}>
      <div className="rounded-4 overflow-hidden shadow-sm border mb-3" style={{ borderColor: '#e9ecef' }}>
        <div className="text-white p-4" style={{ backgroundColor: '#B00000' }}>
          <h2 className="fw-bold mb-2" style={{ fontSize: '24px', borderLeft: '12px solid #FFD129', paddingLeft: '12px' }}>ภาพรวมระบบ (Dashboard)</h2>
          <p className="m-0 text-white-50" style={{ fontSize: '14px', paddingLeft: '18px' }}>สรุปสถานะธุรกิจและยอดขาย</p>
        </div>
      </div>

      <div className="d-flex justify-content-end mb-4">
        <div className="d-flex align-items-center gap-2">
          <span className="text-muted" style={{ fontSize: '14px' }}>แสดงข้อมูล:</span>
          <div className="position-relative" style={{ width: '150px' }}>
            <button 
              onClick={() => setIsTimeframeOpen(!isTimeframeOpen)}
              className="btn bg-white w-100 d-flex align-items-center justify-content-between text-start shadow-sm"
              style={{ fontSize: '14px', fontWeight: '600', color: '#B00000', border: '1px solid #e9ecef', borderRadius: '50px', padding: '0.4rem 1rem' }}
            >
              <div className="d-flex align-items-center gap-2">
                <Calendar style={{ width: '16px', height: '16px', color: '#B00000' }} />
                <span>{selectedLabel}</span>
              </div>
              <ChevronDown style={{ width: '16px', height: '16px', transform: isTimeframeOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }} />
            </button>
            {isTimeframeOpen && <div className="position-fixed top-0 start-0 w-100 h-100" style={{ zIndex: 40 }} onClick={() => setIsTimeframeOpen(false)}></div>}
            {isTimeframeOpen && (
              <div className="position-absolute w-100 bg-white border rounded-3 shadow-lg" style={{ top: '100%', marginTop: '0.5rem', zIndex: 50 }}>
                <div className="p-2">
                  {timeOptions.map((opt) => (
                    <div 
                      key={opt.value}
                      className="d-flex align-items-center justify-content-between px-3 py-2 rounded-2"
                      style={{ fontSize: '14px', fontWeight: '500', backgroundColor: timeframe === opt.value ? 'rgba(176, 0, 0, 0.05)' : 'transparent', color: timeframe === opt.value ? '#B00000' : '#495057', cursor: 'pointer' }}
                      onClick={() => { setTimeframe(opt.value); setIsTimeframeOpen(false); }}
                    >
                      <span>{opt.label}</span>
                      {timeframe === opt.value && <Check style={{ width: '16px', height: '16px', color: '#B00000' }} />}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mb-5" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
        <div className="bg-white p-4 rounded-4 shadow-sm border d-flex align-items-center gap-3">
          <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '50px', height: '50px', backgroundColor: '#FEE2E2', color: '#B00000' }}><Users style={{ width: '24px', height: '24px' }} /></div>
          <div><p className="fw-semibold text-muted mb-1" style={{ fontSize: '12px' }}>คนเข้าชมสินค้า (ทั้งหมด)</p><h3 className="fw-bold m-0" style={{ fontSize: '22px' }}>{dashboardData.totalView}</h3></div>
        </div>
        <div className="bg-white p-4 rounded-4 shadow-sm border d-flex align-items-center gap-3">
          <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '50px', height: '50px', backgroundColor: '#FEF3C7', color: '#B00000' }}><BadgeDollarSign style={{ width: '24px', height: '24px' }} /></div>
          <div><p className="fw-semibold text-muted mb-1" style={{ fontSize: '12px' }}>ยอดขาย (บาท)</p><h3 className="fw-bold m-0" style={{ fontSize: '22px' }}>{dashboardData.totalPrice?.toLocaleString()}</h3></div>
        </div>
        <div className="bg-white p-4 rounded-4 shadow-sm border d-flex align-items-center gap-3">
          <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '50px', height: '50px', backgroundColor: '#FEE2E2', color: '#B00000' }}><Clock style={{ width: '24px', height: '24px' }} /></div>
          <div><p className="fw-semibold text-muted mb-1" style={{ fontSize: '12px' }}>ออเดอร์ใหม่</p><h3 className="fw-bold m-0" style={{ fontSize: '22px' }}>{dashboardData.pendingOrders}</h3></div>
        </div>
        <div className="bg-white p-4 rounded-4 shadow-sm border d-flex align-items-center gap-3">
          <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '50px', height: '50px', backgroundColor: '#FEE2E2', color: '#B00000' }}><ShoppingCart style={{ width: '24px', height: '24px' }} /></div>
          <div><p className="fw-semibold text-muted mb-1" style={{ fontSize: '12px' }}>ออเดอร์ทั้งหมด</p><h3 className="fw-bold m-0" style={{ fontSize: '22px' }}>{dashboardData.totalOrders}</h3></div>
        </div>
        <div className="bg-white p-4 rounded-4 shadow-sm border d-flex align-items-center gap-3">
          <div className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '50px', height: '50px', backgroundColor: '#FEF3C7', color: '#B00000' }}><Sparkles style={{ width: '24px', height: '24px' }} /></div>
          <div><p className="fw-semibold text-muted mb-1" style={{ fontSize: '12px' }}>สินค้าขายดีสุด</p><h3 className="fw-bold m-0 text-truncate" style={{ fontSize: '16px', maxWidth: '120px' }} title={dashboardData.topProductsList?.[0]?.name || '-'}>{dashboardData.topProductsList?.[0]?.name || '-'}</h3></div>
        </div>
      </div>

      <div className="mb-5">
        <h3 className="d-flex align-items-center gap-2 fw-bold mb-4" style={{ fontSize: '18px' }}><Truck style={{ width: '22px', height: '22px', color: '#B00000' }} /> ภาพรวมการจัดส่ง (Logistics)</h3>
        <div className="w-100 d-flex justify-content-between align-items-center gap-4">

          <div className="w-100">
            <div className="bg-white p-4 rounded-4 shadow-sm border text-center h-100">
              <div className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '60px', height: '60px', backgroundColor: '#EFF6FF', color: '#3B82F6' }}><Package style={{ width: '24px', height: '24px' }} /></div>
              <h4 className="fw-bold m-0 mb-2" style={{ fontSize: '28px' }}>{dashboardData.pendingOrders}</h4>
              <p className="fw-semibold text-muted m-0" style={{ fontSize: '14px' }}>ที่ต้องจัดส่ง</p>
            </div>
          </div>

          <div className="w-100">
            <div className="bg-white p-4 rounded-4 shadow-sm border text-center h-100">
              <div className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '60px', height: '60px', backgroundColor: '#fffaed', color: '#f1c70c' }}><Truck style={{ width: '24px', height: '24px' }} /></div>
              <h4 className="fw-bold m-0 mb-2" style={{ fontSize: '28px' }}>{dashboardData.waitingToShipOrders}</h4>
              <p className="fw-semibold text-muted m-0" style={{ fontSize: '14px' }}>รอเข้ารับ</p>
            </div>
          </div>

          <div className="w-100">
            <div className="bg-white p-4 rounded-4 shadow-sm border text-center h-100">
              <div className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '60px', height: '60px', backgroundColor: '#FFF7ED', color: '#F97316' }}><Road style={{ width: '24px', height: '24px' }} /></div>
              <h4 className="fw-bold m-0 mb-2" style={{ fontSize: '28px' }}>{dashboardData.shippingOrders}</h4>
              <p className="fw-semibold text-muted m-0" style={{ fontSize: '14px' }}>อยู่ระหว่างการจัดส่ง</p>
            </div>
          </div>

          <div className="w-100">
            <div className="bg-white p-4 rounded-4 shadow-sm border text-center h-100">
              <div className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '60px', height: '60px', backgroundColor: '#F0FDF4', color: '#22C55E' }}><CheckCircle2 style={{ width: '24px', height: '24px' }} /></div>
              <h4 className="fw-bold m-0 mb-2" style={{ fontSize: '28px' }}>{dashboardData.completedOrders}</h4>
              <p className="fw-semibold text-muted m-0" style={{ fontSize: '14px' }}>จัดส่งสำเร็จ</p>
            </div>
          </div>

          <div className="w-100">
            <div className="bg-white p-4 rounded-4 shadow-sm border text-center h-100">
              <div className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '60px', height: '60px', backgroundColor: '#FEF2F2', color: '#EF4444' }}><XCircle style={{ width: '24px', height: '24px' }} /></div>
              <h4 className="fw-bold m-0 mb-2" style={{ fontSize: '28px' }}>{dashboardData.canceledOrders}</h4>
              <p className="fw-semibold text-muted m-0" style={{ fontSize: '14px' }}>สินค้าตีกลับ</p>
            </div>
          </div>

        </div>
      </div>

      <div className="bg-white rounded-4 shadow-sm border overflow-hidden">
        <div className="p-4 bg-white border-bottom">
          <h3 className="d-flex align-items-center gap-2 fw-bold m-0" style={{ fontSize: '18px' }}><TrendingUp style={{ width: '22px', height: '22px', color: '#B00000' }} /> จัดอันดับสินค้าขายดี</h3>
        </div>
        <div className="table-responsive p-3">
          <table className="table table-borderless table-hover m-0 align-middle">
            <thead>
              <tr style={{ backgroundColor: '#B00000', color: 'white' }}>
                <th className="text-center py-3 rounded-start" style={{ fontSize: '14px', width: '15%' }}>อันดับ</th>
                <th className="py-3" style={{ fontSize: '14px', width: '40%' }}>ชื่อสินค้า</th>
                <th className="text-center py-3" style={{ fontSize: '14px', width: '20%' }}>จำนวนที่ขายได้</th>
                <th className="text-end py-3 rounded-end pe-4" style={{ fontSize: '14px', width: '25%' }}>ยอดขายรวม (บาท)</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.topProductsList?.map((item) => (
                <tr key={item.rank} style={{ fontSize: '15px', borderBottom: '1px solid #f8f9fa' }}>
                  <td className="text-center py-3">
                    {item.rank === 1 ? <Medal style={{ width: '28px', height: '28px', color: '#F59E0B' }} /> : 
                     item.rank === 2 ? <Medal style={{ width: '28px', height: '28px', color: '#9CA3AF' }} /> : 
                     item.rank === 3 ? <Medal style={{ width: '28px', height: '28px', color: '#D97706' }} /> : 
                     <span className="fw-bold text-muted">{item.rank}</span>}
                  </td>
                  <td className="fw-bold text-dark py-3">{item.name}</td>
                  <td className="text-center fw-semibold py-3">{item.soldQuantity} ชิ้น</td>
                  <td className="text-end fw-bold py-3 pe-4" style={{ color: '#10B981' }}>{item.totalSales?.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}