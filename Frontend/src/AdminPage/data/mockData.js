// ข้อมูลเดิมของคุณที่มีอยู่แล้ว...
export const inventoryData = [
  { id: "101", name: "iPhone 15 Pro Max", storage: "256GB", brand: "Apple", price: "48,900.-", image: "https://images.unsplash.com/photo-1696446701796-da61225697cc?w=150&q=80", colors: [{ name: "Titanium Blue", stock: 8 }, { name: "Natural Titanium", stock: 4 }] },
  { id: "102", name: "iPhone 15", storage: "128GB", brand: "Apple", price: "32,900.-", image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=150&q=80", colors: [{ name: "Pink", stock: 0 }, { name: "Black", stock: 0 }] },
  { id: "103", name: "Galaxy S24 Ultra", storage: "256GB", brand: "Samsung", price: "46,900.-", image: "https://images.unsplash.com/photo-1610945265064-3234eb3bf34f?w=150&q=80", colors: [{ name: "Titanium Gray", stock: 8 }] },
  { id: "104", name: "OPPO Find N3 Flip", storage: "256GB", brand: "Oppo", price: "34,990.-", image: "https://images.unsplash.com/photo-1598327105666-5b8935134703?w=150&q=80", colors: [{ name: "Cream Gold", stock: 2 }, { name: "Sleek Black", stock: 3 }] },
  { id: "105", name: "Redmi Note 13", storage: "256GB", brand: "Xiaomi", price: "7,990.-", image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=150&q=80", colors: [{ name: "Midnight Black", stock: 20 }, { name: "Mint Green", stock: 22 }] }
];

export const initialNotifications = [
  { id: 1, title: "🛒 มีคำสั่งซื้อใหม่ #ORD-1002", time: "15 นาทีที่แล้ว", read: false },
  { id: 2, title: "⚠️ สินค้า iPhone 15 (Pink) ใกล้หมดสต็อก", time: "2 ชั่วโมงที่แล้ว", read: false },
  { id: 3, title: "✅ ออเดอร์ #ORD-1001 จัดส่งสำเร็จ", time: "4 ชั่วโมงที่แล้ว", read: false },
  { id: 4, title: "ระบบอัปเดตเวอร์ชันใหม่เรียบร้อย", time: "1 วันที่แล้ว", read: true },
];

export const dashboardDatabase = {
  today: {
    summary: { visitors: "1,240", totalSales: "193,600.-", pendingOrders: "12", successOrders: "108", topProduct: "iPhone 15 Pro Max" },
    logistics: [
      { title: "ที่ต้องจัดส่ง", value: "12", icon: "Package", color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
      { title: "รอเข้ารับสินค้า", value: "5", icon: "Truck", color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100" },
      { title: "จัดส่งสำเร็จ", value: "108", icon: "CheckCircle2", color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
      { title: "ถูกปฏิเสธ / ตีกลับ", value: "2", icon: "XCircle", color: "text-red-600", bg: "bg-red-50", border: "border-red-100" },
    ],
    topSellers: [
      { rank: 1, name: "iPhone 15 Pro Max", qty: "24 ชิ้น", total: "1,173,600.-" },
      { rank: 2, name: "OPPO Find N3 Flip", qty: "18 ชิ้น", total: "718,200.-" },
      { rank: 3, name: "Redmi Note 13", qty: "15 ชิ้น", total: "119,850.-" },
      { rank: 4, name: "Galaxy S24 Ultra", qty: "8 ชิ้น", total: "375,200.-" },
    ]
  },
  '7days': {
    summary: { visitors: "9,420", totalSales: "1,204,500.-", pendingOrders: "45", successOrders: "820", topProduct: "OPPO Find N3 Flip" },
    logistics: [
      { title: "ที่ต้องจัดส่ง", value: "45", icon: "Package", color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
      { title: "รอเข้ารับสินค้า", value: "18", icon: "Truck", color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100" },
      { title: "จัดส่งสำเร็จ", value: "820", icon: "CheckCircle2", color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
      { title: "ถูกปฏิเสธ / ตีกลับ", value: "12", icon: "XCircle", color: "text-red-600", bg: "bg-red-50", border: "border-red-100" },
    ],
    topSellers: [
      { rank: 1, name: "OPPO Find N3 Flip", qty: "142 ชิ้น", total: "5,665,800.-" },
      { rank: 2, name: "iPhone 15 Pro Max", qty: "115 ชิ้น", total: "5,623,500.-" },
      { rank: 3, name: "Galaxy S24 Ultra", qty: "98 ชิ้น", total: "4,596,200.-" },
      { rank: 4, name: "Redmi Note 13", qty: "85 ชิ้น", total: "679,150.-" },
    ]
  }
};

export const ordersData = [
  { 
    id: '1001', 
    date: '2026-07-13 10:30', 
    customer: 'สมชาย ใจดี', 
    price: '114,790.-', 
    status: 'เสร็จสิ้น',
    // ในอนาคตเมื่อดึงจาก API ข้อมูลจะมาในรูปแบบ Array ของ Product Objects แบบนี้เลย
    items: [
      { 
        prodId: '101', 
        name: 'iPhone 15 Pro Max', 
        storage: '256GB', 
        color: 'Titanium Blue', 
        price: '48,900', 
        qty: 1, 
        image: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?w=150&q=80' 
      },
      { 
        prodId: '105', 
        name: 'Redmi Note 13', 
        storage: '256GB', 
        color: 'Mint Green', 
        price: '7,990', 
        qty: 2, 
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=150&q=80' 
      }
    ]
  },
  { 
    id: '1002', 
    date: '2026-07-13 11:15', 
    customer: 'สมหญิง รักเรียน', 
    price: '7,990.-', 
    status: 'รอดำเนินการ',
    items: [
      { 
        prodId: '105', 
        name: 'Redmi Note 13', 
        storage: '256GB', 
        color: 'Midnight Black', 
        price: '7,990', 
        qty: 1, 
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=150&q=80' 
      }
    ]
  },
  { 
    id: '1003', 
    date: '2026-07-13 14:20', 
    customer: 'สมศักดิ์ มั่งมี', 
    price: '46,900.-', 
    status: 'เสร็จสิ้น',
    items: [
      { 
        prodId: '103', 
        name: 'Galaxy S24 Ultra', 
        storage: '256GB', 
        color: 'Titanium Gray', 
        price: '46,900', 
        qty: 1, 
        image: 'https://images.unsplash.com/photo-1610945265064-3234eb3bf34f?w=150&q=80' 
      }
    ]
  }
];