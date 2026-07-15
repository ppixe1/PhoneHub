import React, { useState, useEffect } from 'react';
import axios from 'axios'; // ติดตั้ง axios ก่อนใช้งาน: npm install axios

const theme = {
  primary: '#B00000',
  background: '#FAFAFA',
  accent: '#FFD129',
  fontFamily: "'Kanit', sans-serif"
};

// URL สำหรับเชื่อมต่อ API (ให้เพื่อนที่ทำ backend มาปรับตรงนี้)
const API_BASE_URL = 'http://localhost:5000/api';

const mockProducts = [
     { 
       id: 1, 
       name: 'iPhone 17 Pro Max', 
       brand: 'Apple',
       img: '/images/iphon17pro.webp', // รูปหลัก (เมื่อยังไม่ได้เลือกสี)
       category: 'apple',
       // รายการสเปกที่มีให้เลือกกด และราคาจะเปลี่ยนตามสเปกที่เลือก
       variants: [
         { id: 'v1_1', ram: '8', rom: '256', price: 44900, promoPrice: 42900, stock: 15 },
         { id: 'v1_2', ram: '12', rom: '512', price: 48900, promoPrice: 46900, stock: 8 },
         { id: 'v1_3', ram: '16', rom: '1TB', price: 56900, promoPrice: null, stock: 2 }
       ],
       specs: {
         screenSize: '6.9 นิ้ว',
         screenType: 'Super Retina XDR OLED',
         refreshRate: '120 Hz',
         chipset: 'A19 Pro',
         backCamera: '48MP + 48MP + 12MP',
         frontCamera: '12MP',
         batteryLife: '4685 mAh (32 ชม.+)',
         fastCharge: '45W',
         os: 'iOS 19',
         connection: '5G, Wi-Fi 7, USB-C'
       },
       colors: [
         { name: 'Titanium Blue', hex: '#3b5166', stock: 15, img: '/images/ipone17blu.webp' },
         { name: 'Natural Titanium', hex: '#bebeb6', stock: 5, img: '/images/iphon17pro.webp' },
         { name: 'Dark Black', hex: '#232426', stock: 0, img: '/images/iphone17promax-black.webp' }
       ],
       highlights: 'ซูม Optical 8 เท่า, บอดี้ไทเทเนียมน้ำหนักเบา, ชิปเซ็ตประมวลผล AI อัจฉริยะ',
       description: 'ที่สุดของสมาร์ทโฟนระดับโปร iPhone 17 Pro Max มาพร้อมดีไซน์บอดี้ไทเทเนียมโฉมใหม่ แข็งแกร่งและเบากว่าเดิม ขับเคลื่อนด้วยขุมพลังชิป A19 Pro และระบบกล้องหลังระดับโปรที่รองรับการซูมแบบออพติคัลได้ไกลถึง 8 เท่า พร้อมแบตเตอรี่ที่ใช้งานได้ยาวนานที่สุดเท่าที่เคยมีมา'
     },
     { 
       id: 2, 
       name: 'iPhone 17', 
       brand: 'Apple',
       img: '/images/iphone17.webp', 
       category: 'apple',
       variants: [
         { id: 'v2_1', ram: '8', rom: '128', price: 39000, promoPrice: null, stock: 10 },
         { id: 'v2_2', ram: '8', rom: '256', price: 43000, promoPrice: 41500, stock: 5 }
       ],
       privilege: 'แถมเคสและฟิล์มกระจกฟรี',
       specs: {
         screenSize: '6.3 นิ้ว',
         screenType: 'AMOLED',
         refreshRate: '120 Hz',
         chipset: 'A18',
         backCamera: '48MP + 12MP Ultra-wide',
         frontCamera: '12MP',
         batteryLife: '3561 mAh (26 ชม.+)',
         fastCharge: '25W',
         os: 'iOS 19',
         connection: '5G, Wi-Fi 6E, USB-C'
       },
       colors: [
         { name: 'Green', hex: '#D1E8E2', stock: 10, img: '/images/iPhone17green.webp' },
         { name: 'Blue', hex: '#d1e1ec', stock: 8, img: '/images/iphone17blue.webp' },
         { name: 'Purple', hex: '#D8BFFF', stock: 12, img: '/images/iphone17.webp' }
       ],
       description: 'สัมผัสประสบการณ์ความสนุกสไตล์ใหม่กับ iPhone 17 หน้าจอขนาด 6.3 นิ้วสีสันสดใส และดีไซน์กระจกหลังแต่งสีสุดพรีเมียม ขับเคลื่อนด้วยชิป A18 ทรงพลัง ถ่ายภาพสวยคมชัดในทุกสถานการณ์ด้วยกล้องคู่ 48MP พร้อมสีสันพาสเทลให้เลือกสรรตามสไตล์คุณ'
     },
     { 
       id: 3, 
       name: 'iPhone 16 Pro Max', 
       brand: 'Apple',
       img: '/images/iPhone16promax.webp', 
       category: 'apple',
       variants: [
         { id: 'v3_1', ram: '8', rom: '256', price: 32900, promoPrice: null, stock: 11 },
         { id: 'v3_2', ram: '8', rom: '512', price: 36900, promoPrice: 34900, stock: 3 }
       ],
       specs: {
         screenSize: '6.9 นิ้ว',
         screenType: 'Super Retina XDR OLED',
         refreshRate: '120 Hz',
         chipset: 'A18 Pro',
         backCamera: '48MP + 48MP + 12MP',
         frontCamera: '12MP',
         batteryLife: '4685 mAh',
         fastCharge: '30W',
         os: 'iOS 18',
         connection: '5G, Wi-Fi 7, USB-C'
       },
       colors: [
         { name: 'Desert Titanium', hex: '#c2b2a2', stock: 4, img: '/images/iPhone16promax.webp' },
         { name: 'Black Titanium', hex: '#3c3d3a', stock: 7, img: '/images/ipone16promaxblak.jpeg' }
       ],
       description: 'ปลดล็อกขีดจำกัดการทำงานด้วย iPhone 16 Pro Max หน้าจอกว้างเต็มตา 6.9 นิ้ว ขอบจอบางเฉียบเป็นพิเศษ อัดแน่นด้วยคุณสมบัติ Apple Intelligence ที่ชาญฉลาดและรวดเร็ว ถ่ายวิดีโอระดับภาพยนตร์ได้อย่างลื่นไหลด้วยปุ่ม Camera Control ใหม่ล่าสุดบนตัวเครื่อง'
     },
     { 
       id: 4, 
       name: 'iPhone 15 Pro', 
       brand: 'Apple',
       img: '/images/iphone15pro.jpg', 
       category: 'apple',
       variants: [
         { id: 'v4_1', ram: '8', rom: '128', price: 35000, promoPrice: null, stock: 5 }
       ],
       specs: {
         screenSize: '6.1 นิ้ว',
         screenType: 'Super Retina XDR OLED',
         refreshRate: '120 Hz',
         chipset: 'A17 Pro',
         backCamera: '48MP + 12MP + 12MP',
         frontCamera: '12MP',
         batteryLife: '3274 mAh',
         fastCharge: '25W',
         os: 'iOS 17',
         connection: '5G, Wi-Fi 6E, USB-C'
       },
       colors: [
         { name: 'Black Titanium', hex: '#3b3c3e', stock: 3, img: '/images/ipone15promaxblak.jpeg' },
         { name: 'White Titanium', hex: '#f2f1ed', stock: 2, img: '/images/iphone15pro.jpg' }
       ],
       description: 'ดีไซน์วัสดุไทเทเนียมเกรดเดียวกับที่ใช้ในอุตสาหกรรมอวกาศทำให้ iPhone 15 Pro เป็นรุ่นโปรที่เบาที่สุด ขับเคลื่อนด้วยชิปเซ็ตระดับปฏิวัติวงการ A17 Pro พร้อมปุ่ม Action ที่ปรับแต่งการใช้งานได้ตามใจชอบ และระบบพอร์ตเชื่อมต่อ USB-C ที่โอนถ่ายข้อมูลได้อย่างรวดเร็ว'
     },
     { 
       id: 5, 
       name: 'Samsung Galaxy S26 Ultra', 
       brand: 'Samsung',
       img: '/images/samsunggalaxys26.jpg', 
       category: 'samsung',
       variants: [
         { id: 'v5_1', ram: '12', rom: '256', price: 42900, promoPrice: null, stock: 10 },
         { id: 'v5_2', ram: '12', rom: '512', price: 46900, promoPrice: 44900, stock: 14 }
       ],
       privilege: 'รับประกันหน้าจอแตกฟรี 1 ปี',
       specs: {
         screenSize: '6.8 นิ้ว',
         screenType: 'Dynamic AMOLED 2X',
         refreshRate: '120 Hz',
         chipset: 'Snapdragon 8 Gen 5',
         backCamera: '200MP + 50MP + 12MP + 10MP',
         frontCamera: '12MP',
         batteryLife: '5000 mAh',
         fastCharge: '45W',
         os: 'Android 16',
         connection: '5G, Wi-Fi 7, Bluetooth 5.4'
       },
       colors: [
         { name: 'Cobalt Violet', hex: '#4C3A69', stock: 9, img: '/images/samsungviolet.jpg' },
         { name: 'Sky Blue', hex: '#89CFF0', stock: 5, img: '/images/samsunggalaxys26.jpg' }
       ],
       highlights: 'ปากกา S Pen ในตัว, ซูมออปติคอลสูงสุด 10 เท่า, AI ทรานสเลทแบบออฟไลน์',
       description: 'ก้าวข้ามทุกขีดจำกัดด้วย Samsung Galaxy S26 Ultra ขับเคลื่อนด้วย Galaxy AI อัจฉริยะโฉมใหม่ มาพร้อมปากกา S Pen ในตัวเครื่องที่เขียนได้อย่างเป็นธรรมชาติ กล้องหลังความละเอียดสูงพิเศษ 200 ล้านพิกเซล เก็บรายละเอียดคมชัดแม้ในที่แสงน้อยที่สุด'
     },
     { 
       id: 6, 
       name: 'Samsung Galaxy A56 5G', 
       brand: 'Samsung',
       img: '/images/SamsungGalaxyA565G.jpg', 
       category: 'samsung',
       variants: [
         { id: 'v6_1', ram: '8', rom: '128', price: 15900, promoPrice: null, stock: 35 }
       ],
       specs: {
         screenSize: '6.6 นิ้ว',
         screenType: 'Super AMOLED',
         refreshRate: '120 Hz',
         chipset: 'Exynos 1580',
         backCamera: '50MP + 12MP + 5MP',
         frontCamera: '32MP',
         batteryLife: '5000 mAh',
         fastCharge: '25W',
         os: 'Android 15',
         connection: '5G, Wi-Fi 6, USB-C'
       },
       colors: [
         { name: 'Awesome Pink', hex: '#FBC7D4', stock: 20, img: '/images/SamsungGalaxyA565G.jpg' },
         { name: 'Awesome Black', hex: '#212529', stock: 15, img: '/images/Samsung-Galaxy-A56-5G-Awesome-Graphite-1-1600x2000.webp' }
       ],
       description: 'สมาร์ทโฟนสเปกคุ้มค่าราคาสบายกระเป๋า Samsung Galaxy A56 5G ตอบโจทย์ทุกการใช้งานทั่วไปและการเล่นเกมลื่นไหลด้วยหน้าจอ Super AMOLED 120Hz พร้อมกล้องหลัง 3 เลนส์ความละเอียด 50MP ถ่ายรูปสวยงามคมชัดมีมิติ และแบตเตอรี่ใหญ่จุใจ 5000 mAh'
     },
     { 
       id: 7, 
       name: 'Vivo X200 Pro', 
       brand: 'Vivo',
       img: '/images/VivoX200Pro.jpg', 
       category: 'vivo',
       variants: [
         { id: 'v7_1', ram: '16', rom: '512', price: 32990, promoPrice: null, stock: 20 }
       ],
       specs: {
         screenSize: '6.78 นิ้ว',
         screenType: 'AMOLED',
         refreshRate: '120 Hz',
         chipset: 'Dimensity 9400',
         backCamera: '50MP + 200MP Zeiss + 50MP',
         frontCamera: '32MP',
         batteryLife: '6000 mAh',
         fastCharge: '90W',
         os: 'Funtouch OS 15 (Android 15)',
         connection: '5G, Wi-Fi 7, Bluetooth 5.4'
       },
       colors: [
         { name: 'Sakura Pink', hex: '#FFC5D3', stock: 12, img: '/images/VivoX200Pro.jpg' },
         { name: 'Champagne Gold', hex: '#E6C79C', stock: 8, img: '/images/vivogold.png' }
       ],
       highlights: 'เลนส์กล้องร่วมพัฒนากับ Zeiss, แบตเตอรี่ซิลิคอนคาร์บอนความจุสูงพิเศษ 6000 mAh',
       description: 'นิยามใหม่แห่งการถ่ายภาพระดับมืออาชีพ Vivo X200 Pro ร่วมพัฒนาระบบกล้องกับ Zeiss ติดตั้งกล้องซูเปอร์เทเลโฟโต้ความละเอียดสูงถึง 200 ล้านพิกเซล และขับเคลื่อนประสิทธิภาพด้วยชิปเซ็ต Dimensity 9400 มอบความลื่นไหลระดับสูงสุดในทุกด้าน'
     },
     { 
       id: 8, 
       name: 'Oppo Find X8 Pro', 
       brand: 'Oppo',
       img: '/images/OppoFindX8Pro.jpeg', 
       category: 'oppo',
       variants: [
         { id: 'v8_1', ram: '16', rom: '512', price: 34990, promoPrice: null, stock: 20 }
       ],
       specs: {
         screenSize: '6.78 นิ้ว',
         screenType: 'AMOLED',
         refreshRate: '120 Hz',
         chipset: 'Dimensity 9400',
         backCamera: '50MP + 50MP + 50MP + 50MP Hasselblad',
         frontCamera: '32MP',
         batteryLife: '5910 mAh',
         fastCharge: '80W SUPERVOOC',
         os: 'ColorOS 15 (Android 15)',
         connection: '5G, Wi-Fi 7, NFC'
       },
       colors: [
         { name: 'Pearl White', hex: '#eaecee', stock: 6, img: '/images/OppoFindX8Pro.jpeg' },
         { name: 'Space Black', hex: '#202224', stock: 14, img: '/images/OPPOBlack.jpg' }
       ],
       highlights: 'กล้อง Hasselblad 4 เลนส์หลัก, ถ่ายภาพ Portrait ระดับสตูดิโอ',
       description: 'Oppo Find X8 Pro ยกระดับการถ่ายภาพบุคคลขึ้นไปอีกขั้นด้วยเทคโนโลยีสีสันที่เป็นเอกลักษณ์จาก Hasselblad มาพร้อมหน้าจอกระจกโค้งรับอุ้งมือ และขุมพลังแบตเตอรี่ความจุเยอะจุใจที่รองรับระบบชาร์จไวสุดแรง 80W SUPERVOOC'
     },
     { 
       id: 9, 
       name: 'Xiaomi 16 Ultra', 
       brand: 'Xiaomi',
       img: '/images/Xiaomi16Ultra.webp', 
       category: 'xiaomi',
       variants: [
         { id: 'v9_1', ram: '16', rom: '512', price: 38990, promoPrice: null, stock: 9 }
       ],
       specs: {
         screenSize: '6.73 นิ้ว',
         screenType: 'AMOLED',
         refreshRate: '120 Hz',
         chipset: 'Snapdragon 8 Gen 5',
         backCamera: '50MP + 50MP + 50MP + 50MP Leica',
         frontCamera: '32MP',
         batteryLife: '5300 mAh',
         fastCharge: '90W HyperCharge',
         os: 'Xiaomi HyperOS 2.0',
         connection: '5G, Wi-Fi 7, Bluetooth 5.4'
       },
       colors: [
         { name: 'Cosmic Purple', hex: '#8B7AA3', stock: 5, img: '/images/Xiaomi16Ultra.webp' },
         { name: 'Ceramic White', hex: '#F9F9F9', stock: 4, img: '/images/xiaomi-l1600.webp' }
       ],
       highlights: 'ระบบเลนส์แสงระดับ Leica Summilux, เซ็นเซอร์กล้องขนาดใหญ่พิเศษ 1 นิ้ว',
       description: 'ที่สุดของกล้องถ่ายภาพบนโทรศัพท์มือถือ Xiaomi 16 Ultra สานต่อความร่วมมือกับ Leica ติดตั้งเซ็นเซอร์รับภาพขนาดใหญ่พิเศษ 1 นิ้ว และเลนส์คุณภาพสูง Summilux เพื่อภาพถ่ายที่สมบูรณ์แบบเสมือนถ่ายด้วยกล้องใหญ่ในทุกช่วงเวลา'
     }
   ];

const categories = [
  { id: 'all', name: 'ทั้งหมด', color: '#ffffff', img: '/images/togetherdotai-mono.svg' },
  { id: 'apple', name: 'Apple', color: '#ffffff', img: '/images/apple-light.svg' },
  { id: 'samsung', name: 'Samsung', color: '#ffffff', img: '/images/samsung.svg' },
  { id: 'vivo', name: 'Vivo', color: '#ffffff', img: '/images/vivo.svg' },
  { id: 'oppo', name: 'Oppo', color: '#ffffff', img: '/images/oppo.svg' },
  { id: 'xiaomi', name: 'Xiaomi', color: '#ffffff', img: '/images/xiaomi.svg' },
];

export default function Products({ onAddToCart, cartCount = 0, onViewCart, onLogout }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedColor, setSelectedColor] = useState(null); 
  const [selectedVariant, setSelectedVariant] = useState(null); 
  
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  // ดึงข้อมูลสินค้าจาก API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/products`);
        setProducts(response.data);
        setError(null);
      } catch (err) {
        console.error('เชื่อมต่อหลังบ้านไม่สำเร็จ, กำลังดึงข้อมูล mockup...', err);
        if (typeof mockProducts !== 'undefined') {
          setProducts(mockProducts);
        } else {
          setError('ไม่สามารถดึงข้อมูลสินค้าได้');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // ตั้งค่า Default Variant เมื่อเปิดดูหน้ารายละเอียดสินค้า
  useEffect(() => {
    if (selectedProduct) {
      if (selectedProduct.variants && selectedProduct.variants.length > 0) {
        setSelectedVariant(selectedProduct.variants[0]);
      } else {
        setSelectedVariant(null);
      }
    }
  }, [selectedProduct]);

  const handleClearFilter = () => {
    setMinPrice('');
    setMaxPrice('');
    setSearchTerm('');
    setSelectedCategory('all');
  };

  const filteredProducts = products.filter(p => {
    const productName = p.name || '';
    const matchesSearch = productName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    
    const productPrice = p.variants && p.variants.length > 0 
      ? (p.variants[0].promoPrice || p.variants[0].price) 
      : (p.promoPrice || p.price || 0);

    const matchesMinPrice = minPrice === '' || productPrice >= Number(minPrice);
    const matchesMaxPrice = maxPrice === '' || productPrice <= Number(maxPrice);

    return matchesSearch && matchesCategory && matchesMinPrice && matchesMaxPrice;
  });

  const Header = () => (
    <div style={{ backgroundColor: theme.primary, color: '#fff', padding: '15px 5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h1 
        style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', fontFamily: theme.fontFamily }} 
        onClick={() => { setSelectedProduct(null); setSelectedColor(null); setSelectedVariant(null); handleClearFilter(); }}
      >
        <span style={{ color: '#ffffff', fontFamily: theme.fontFamily }}>PHONE</span>
        <span style={{ color: '#ffd700', fontFamily: theme.fontFamily }}>HUB</span>
      </h1>

      <div style={{ display: 'flex', gap: '25px', fontSize: '16px', fontFamily: theme.fontFamily, alignItems: 'center' }}>
        <span style={{ cursor: 'pointer', fontFamily: theme.fontFamily }} onClick={() => { setSelectedProduct(null); setSelectedColor(null); setSelectedVariant(null); handleClearFilter(); }}>หน้าแรก</span>
        
        {/* ไอคอนตะกร้าสินค้า */}
        <div onClick={onViewCart} style={{ position: 'relative', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px' }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
          {cartCount > 0 && (
            <span style={{ position: 'absolute', top: '-6px', right: '-8px', backgroundColor: '#ffd700', color: '#000000', borderRadius: '50%', padding: '2px 6px', fontSize: '11px', fontWeight: 'bold', fontFamily: theme.fontFamily, lineHeight: 1, border: `1px solid ${theme.primary}` }}>
              {cartCount}
            </span>
          )}
        </div>

        {/* ปุ่มและไอคอน Logout (ขวาสุด) */}
        <div 
          onClick={onLogout || (() => alert('ออกจากระบบเรียบร้อย!'))} 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px', 
            cursor: 'pointer', 
            padding: '6px 12px', 
            borderRadius: '20px',
            border: '1.5px solid rgba(255, 255, 255, 0.4)',
            transition: 'all 0.2s ease',
            backgroundColor: 'transparent'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
            e.currentTarget.style.borderColor = '#ffffff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)';
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          <span style={{ fontSize: '14px', fontWeight: '500', fontFamily: theme.fontFamily }}>ออกจากระบบ</span>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: theme.fontFamily }}>
        {/* CSS Keyframes สำหรับแอนิเมชันตอนโหลดสินค้า */}
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
        <div style={{ textAlign: 'center' }}>
          <div style={{ border: `4px solid ${theme.background}`, borderTop: `4px solid ${theme.primary}`, borderRadius: '50%', width: '50px', height: '50px', animation: 'spin 1s linear infinite', margin: '0 auto 20px auto' }}></div>
          <p>กำลังโหลดข้อมูลสินค้าจากเซิร์ฟเวอร์...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: theme.fontFamily }}>
        <div style={{ textAlign: 'center', color: theme.primary }}>
          <p>{error}</p>
          <button onClick={() => window.location.reload()} style={{ padding: '10px 20px', backgroundColor: theme.primary, color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>ลองอีกครั้ง</button>
        </div>
      </div>
    );
  }

  if (selectedProduct) {
    const displayImage = (selectedColor && selectedColor.img) ? selectedColor.img : selectedProduct.img;
    const currentPrice = selectedVariant ? selectedVariant.price : (selectedProduct.price || 0);
    const currentPromoPrice = selectedVariant ? selectedVariant.promoPrice : selectedProduct.promoPrice;
    const currentStock = selectedVariant ? selectedVariant.stock : null;

    return (
      <div style={{ fontFamily: theme.fontFamily, backgroundColor: theme.background, minHeight: '100vh' }}>
        <Header />
        <div style={{ padding: '40px 5%', maxWidth: '1200px', margin: '0 auto' }}>
          <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px', cursor: 'pointer', fontFamily: theme.fontFamily }} onClick={() => { setSelectedProduct(null); setSelectedColor(null); setSelectedVariant(null); }}>
            หน้าแรก &gt; {selectedProduct.name}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '40px', backgroundColor: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            
            {/* ฝั่งซ้าย: รูปภาพสินค้า */}
            <div style={{ height: '450px', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', border: '1px solid #f0f0f0', borderRadius: '8px', padding: '10px' }}>
              <img src={displayImage} alt={selectedProduct.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', transition: 'all 0.3s ease' }} />
            </div>

            {/* ฝั่งขวา: ข้อมูลการเลือกซื้อและสเปก */}
            <div>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                <span style={{ backgroundColor: '#f0f0f0', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', color: '#555' }}>
                  {selectedProduct.brand || 'สมาร์ทโฟน'}
                </span>
                {selectedVariant ? (
                  <span style={{ backgroundColor: `${theme.primary}15`, padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', color: theme.primary }}>
                    RAM {selectedVariant.ram}GB / ROM {selectedVariant.rom}GB
                  </span>
                ) : (
                  selectedProduct.rom && (
                    <span style={{ backgroundColor: `${theme.primary}15`, padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', color: theme.primary }}>
                      RAM {selectedProduct.ram || '-'}GB / ROM {selectedProduct.rom}GB
                    </span>
                  )
                )}
              </div>

              <h2 style={{ fontSize: '26px', fontWeight: '700', margin: '0 0 10px 0', fontFamily: theme.fontFamily, color: '#333' }}>
                {selectedProduct.name} {selectedVariant && `(${selectedVariant.ram}GB / ${selectedVariant.rom}GB)`}
              </h2>
              
              {/* ราคาอัปเดตตาม Variant */}
              <div style={{ margin: '0 0 15px 0', display: 'flex', alignItems: 'baseline', gap: '12px' }}>
                {currentPromoPrice ? (
                  <>
                    <span style={{ fontSize: '26px', fontWeight: 'bold', color: theme.primary, fontFamily: theme.fontFamily }}>
                      ฿{currentPromoPrice.toLocaleString()}
                    </span>
                    <span style={{ fontSize: '16px', color: '#aaa', textDecoration: 'line-through', fontFamily: theme.fontFamily }}>
                      ฿{currentPrice.toLocaleString()}
                    </span>
                  </>
                ) : (
                  <span style={{ fontSize: '26px', fontWeight: 'bold', color: theme.primary, fontFamily: theme.fontFamily }}>
                    ฿{currentPrice.toLocaleString()}
                  </span>
                )}
              </div>

              {/* ข้อความสิทธิพิเศษ */}
              {selectedProduct.privilege && (
                <div style={{ backgroundColor: '#FFF9E6', border: '1px solid #FFE0B2', borderRadius: '6px', padding: '8px 12px', fontSize: '13px', color: '#E65100', marginBottom: '20px', display: 'inline-block' }}>
                  ★ {selectedProduct.privilege}
                </div>
              )}
              
              {/* ตัวเลือกสี */}
              {selectedProduct.colors && selectedProduct.colors.length > 0 && (
                <div style={{ marginBottom: '20px', borderTop: '1px solid #f0f0f0', paddingTop: '15px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 'bold', display: 'block', marginBottom: '10px', fontFamily: theme.fontFamily }}>
                    ตัวเลือกสี: {selectedColor ? <strong style={{ color: theme.primary }}>{selectedColor.name} (คลังสีนี้: {selectedColor.stock} ชิ้น)</strong> : 'โปรดเลือกสี'}
                  </span>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {selectedProduct.colors.map((color, index) => {
                      const isOutOfStock = color.stock === 0;
                      return (
                        <button
                          key={index}
                          disabled={isOutOfStock}
                          onClick={() => setSelectedColor(color)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '6px 12px',
                            border: selectedColor?.name === color.name ? `2px solid ${theme.primary}` : '1.5px solid #ddd',
                            borderRadius: '20px',
                            backgroundColor: isOutOfStock ? '#f5f5f5' : '#fff',
                            cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                            opacity: isOutOfStock ? 0.5 : 1,
                            outline: 'none'
                          }}
                        >
                          <span style={{ display: 'inline-block', width: '16px', height: '16px', borderRadius: '50%', backgroundColor: color.hex, border: '1px solid #ddd' }}></span>
                          <span style={{ fontSize: '12px', fontFamily: theme.fontFamily }}>{color.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ตัวเลือกสเปกเครื่อง (ความจุ RAM/ROM) */}
              {selectedProduct.variants && selectedProduct.variants.length > 0 && (
                <div style={{ marginBottom: '25px', borderTop: '1px solid #f0f0f0', paddingTop: '15px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 'bold', display: 'block', marginBottom: '10px', fontFamily: theme.fontFamily }}>
                    สเปกเครื่อง (ความจุ): {selectedVariant ? <strong style={{ color: theme.primary }}>RAM {selectedVariant.ram}GB / ROM {selectedVariant.rom}GB {currentStock !== null && `(คลังสเปกนี้: ${currentStock} ชิ้น)`}</strong> : 'โปรดเลือกสเปก'}
                  </span>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {selectedProduct.variants.map((v) => {
                      const isSelected = selectedVariant?.id === v.id;
                      const isOutOfStock = v.stock === 0;
                      return (
                        <button
                          key={v.id}
                          disabled={isOutOfStock}
                          onClick={() => setSelectedVariant(v)}
                          style={{
                            padding: '8px 16px',
                            border: isSelected ? `2px solid ${theme.primary}` : '1.5px solid #ddd',
                            borderRadius: '8px',
                            backgroundColor: isOutOfStock ? '#f5f5f5' : isSelected ? `${theme.primary}08` : '#fff',
                            cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                            color: isSelected ? theme.primary : '#333',
                            fontWeight: isSelected ? 'bold' : 'normal',
                            opacity: isOutOfStock ? 0.5 : 1,
                            outline: 'none',
                            transition: 'all 0.2s',
                            fontFamily: theme.fontFamily
                          }}
                        >
                          RAM {v.ram}GB / ROM {v.rom}GB
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <button 
                onClick={() => { 
                  if (selectedProduct.colors && selectedProduct.colors.length > 0 && !selectedColor) {
                    alert('กรุณาเลือกสีก่อนเพิ่มลงตะกร้าครับ');
                    return;
                  }
                  if (selectedProduct.variants && selectedProduct.variants.length > 0 && !selectedVariant) {
                    alert('กรุณาเลือกสเปกเครื่องก่อนเพิ่มลงตะกร้าครับ');
                    return;
                  }

                  onAddToCart({ 
                    ...selectedProduct, 
                    price: currentPrice,
                    promoPrice: currentPromoPrice,
                    selectedColor: selectedColor?.name,
                    selectedVariant: selectedVariant ? `RAM ${selectedVariant.ram}GB / ROM ${selectedVariant.rom}GB` : null
                  }); 
                  alert('เพิ่มลงตะกร้าเรียบร้อย!'); 
                }}
                style={{ backgroundColor: theme.primary, color: '#fff', border: 'none', width: '100%', padding: '14px 30px', fontSize: '16px', fontWeight: '600', borderRadius: '8px', cursor: 'pointer', fontFamily: theme.fontFamily }}
              >
                เพิ่มลงตะกร้า
              </button>
            </div>
          </div>

          {/* รายละเอียดเพิ่มเติม */}
          <div style={{ marginTop: '30px', backgroundColor: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', borderBottom: '1.5px solid #eee', paddingBottom: '12px', fontFamily: theme.fontFamily, color: '#222' }}>รายละเอียดสินค้าเพิ่มเติม</h3>
            
            {/* สเปกทางเทคนิค */}
            {selectedProduct.specs && (
               <div style={{ margin: '0 0 25px 0', padding: '20px', backgroundColor: '#fdfdfd', borderRadius: '8px', border: '1px solid #eef2f5' }}>
               <h4 style={{ margin: '0 0 12px 0', fontSize: '15px', fontWeight: 'bold', color: '#444' }}>สเปกทางเทคนิค</h4>
               <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px 20px', fontSize: '16px', color: '#555' }}>
               <div><strong>ขนาดหน้าจอ:</strong> {selectedProduct.specs.screenSize || '-'}</div>
               <div><strong>ประเภทหน้าจอ:</strong> {selectedProduct.specs.screenType || '-'}</div>
               <div><strong>Refresh Rate:</strong> {selectedProduct.specs.refreshRate || '-'}</div>
               <div><strong>ชิปเซ็ต (CPU):</strong> {selectedProduct.specs.chipset || '-'}</div>
               <div><strong>กล้องหลัง:</strong> {selectedProduct.specs.backCamera || '-'}</div>
               <div><strong>กล้องหน้า:</strong> {selectedProduct.specs.frontCamera || '-'}</div>
               <div><strong>ความจุแบตเตอรี่:</strong> {selectedProduct.specs.batteryLife || '-'}</div>
               <div><strong>รองรับชาร์จไว:</strong> {selectedProduct.specs.fastCharge || '-'}</div>
               <div><strong>ระบบปฏิบัติการ (OS):</strong> {selectedProduct.specs.os || '-'}</div>
               <div><strong>การเชื่อมต่อ:</strong> {selectedProduct.specs.connection || '-'}</div>
               </div>
               </div>
          )}

            {selectedProduct.highlights && (
              <div style={{ margin: '15px 0', padding: '15px', backgroundColor: '#F5F9FF', borderRadius: '6px', borderLeft: `4px solid #1E88E5` }}>
                <strong style={{ fontSize: '14px', color: '#0D47A1', display: 'block', marginBottom: '5px' }}>จุดเด่น / ฟีเจอร์พิเศษ:</strong>
                <p style={{ margin: 0, fontSize: '14px', color: '#333', lineHeight: 1.5 }}>{selectedProduct.highlights}</p>
              </div>
            )}
            
            <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.8', fontFamily: theme.fontFamily }}>
              {selectedProduct.description || 'สัมผัสประสบการณ์การใช้งานสมาร์ทโฟนประสิทธิภาพสูงที่ได้รับการออกแบบมาอย่างลงตัว ทั้งความแรง ลื่นไหล และกล้องที่คมชัดตอบโจทย์การถ่ายรูปทุกมิติ แบตเตอรี่อึดทนทานรองรับการชาร์จไว มั่นใจได้ในความแข็งแกร่งและการรับประกันศูนย์บริการทั่วประเทศ'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // หน้าแสดง Catalog สินค้าปกติ
  return (
    <div style={{ fontFamily: theme.fontFamily, backgroundColor: theme.background, minHeight: '100vh' }}>
      <Header />
      
      {/* Banner */}
      <div style={{ padding: '30px 5% 10px 5%' }}>
        <div style={{ background: 'linear-gradient(135deg, #800000 0%, #B00000 50%, #D32F2F 100%)', borderRadius: '16px', padding: '40px 60px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#fff', minHeight: '260px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ zIndex: 2, maxWidth: '50%' }}>
            <p style={{ fontSize: '14px', letterSpacing: '1px', textTransform: 'uppercase', opacity: 0.9, margin: '0 0 10px 0', fontFamily: theme.fontFamily }}>— New Arrivals</p>
            <h2 style={{ fontSize: '42px', fontWeight: 'bold', lineHeight: '1.2', margin: '0 0 15px 0', fontFamily: theme.fontFamily }}>SMARTPHONE<br/>MID YEAR SALE</h2>
            <p style={{ fontSize: '16px', opacity: 0.8, margin: '0 0 25px 0', fontFamily: theme.fontFamily }}>พบกับสมาร์ทโฟนรุ่นใหม่ล่าสุดพร้อมส่วนลดพิเศษต้อนรับซีซั่นนี้</p>
            <button style={{ backgroundColor: '#fff', color: theme.primary, border: 'none', padding: '12px 25px', borderRadius: '25px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px', fontFamily: theme.fontFamily }}>ช้อปเลยตอนนี้ →</button>
          </div>
          <div style={{ position: 'relative', width: '250px', height: '250px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ position: 'absolute', width: '200px', height: '200px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.1)', top: '10px' }}></div>
            <img src="/images/iphon17pro.webp" alt="Banner Feature" style={{ width: '180px', height: 'auto', zIndex: 2, transform: 'rotate(-15deg)', filter: 'drop-shadow(0px 10px 20px rgba(0,0,0,0.3))' }} onError={(e) => { e.target.style.display = 'none'; }} />
          </div>
        </div>
      </div>

      {/* Categories */}
      <div style={{ padding: '30px 5% 10px 5%' }}>
        <h2 style={{ fontSize: '22px', fontWeight: '600', marginBottom: '20px', fontFamily: theme.fontFamily }}>หมวดหมู่สินค้ายอดนิยม</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '15px' }}>
          {categories.map(cat => (
            <div 
              key={cat.id} 
              onClick={() => setSelectedCategory(cat.id)} 
              style={{ 
                backgroundColor: cat.color, 
                padding: '20px 10px', 
                borderRadius: '12px', 
                textAlign: 'center', 
                cursor: 'pointer', 
                border: selectedCategory === cat.id ? `2px solid ${theme.primary}` : '2px solid transparent', 
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)', 
                transition: 'all 0.2s ease' 
              }}
            >
              <div style={{ 
                width: '90px', 
                height: '90px', 
                backgroundColor: '#fff', 
                borderRadius: '50%', 
                margin: '0 auto 12px auto', 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                overflow: 'hidden'
              }}>
                <img 
                  src={cat.img} 
                  alt={cat.name} 
                  style={{ width: '80%', height: '80%', objectFit: 'contain' }} 
                  onError={(e) => { 
                    e.target.style.display = 'none';
                    if (e.target.nextSibling) {
                      e.target.nextSibling.style.display = 'block';
                    }
                  }} 
                />
                <span style={{ display: 'none', fontWeight: 'bold', color: '#555', fontSize: '12px', fontFamily: theme.fontFamily }}>
                  {cat.name.substring(0, 2).toUpperCase()}
                </span>
              </div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#333', fontFamily: theme.fontFamily }}>{cat.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter panel */}
      <div style={{ margin: '20px 5% 0 5%', padding: '16px 24px', backgroundColor: '#ffffff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
        
        {/* ฝั่งซ้าย: แสดงหมวดหมู่ที่เลือก */}
        <div style={{ fontSize: '15px', color: '#333', fontFamily: theme.fontFamily, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontWeight: 'bold', color: theme.primary }}>ตัวกรองสินค้า</span>
          <span style={{ color: '#888' }}>|</span>
          <span>หมวดหมู่: <strong style={{ color: '#000' }}>{categories.find(c => c.id === selectedCategory)?.name}</strong></span>
        </div>

        {/* ตรงกลาง: ช่องค้นหาสินค้า */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', minWidth: '250px', maxWidth: '400px' }}>
          <input 
            type="text" 
            placeholder="ค้นหาสินค้าที่ต้องการ..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '8px 15px', border: '1.5px solid #ccc', borderRadius: '6px', fontSize: '14px', fontFamily: theme.fontFamily, outline: 'none' }}
          />
        </div>

        {/* ฝั่งขวา: ช่วงราคา และปุ่มล้างตัวกรอง */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '14px', color: '#555', fontFamily: theme.fontFamily }}>ช่วงราคา (บาท):</span>
          <input type="number" placeholder="ต่ำสุด" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} style={{ width: '100px', padding: '8px 12px', border: '1px solid #ccc', borderRadius: '6px', fontSize: '14px', fontFamily: theme.fontFamily, outline: 'none' }} />
          <span style={{ color: '#ccc' }}>—</span>
          <input type="number" placeholder="สูงสุด" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} style={{ width: '100px', padding: '8px 12px', border: '1px solid #ccc', borderRadius: '6px', fontSize: '14px', fontFamily: theme.fontFamily, outline: 'none' }} />
          {(minPrice || maxPrice || selectedCategory !== 'all' || searchTerm) && (
            <button onClick={handleClearFilter} style={{ padding: '8px 14px', backgroundColor: '#f5f5f5', color: '#666', border: '1px solid #ddd', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '500', fontFamily: theme.fontFamily }}>ล้างตัวกรอง</button>
          )}
        </div>
      </div>

      {/* Products Grid */}
      <div style={{ padding: '20px 5% 40px 5%' }}>
        <h2 style={{ fontSize: '22px', fontWeight: '600', marginBottom: '20px', fontFamily: theme.fontFamily }}>สินค้าทั้งหมด</h2>
        {filteredProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px 20px', color: '#666', backgroundColor: '#fff', borderRadius: '8px', border: '1px dashed #ccc', fontFamily: theme.fontFamily, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="8" y1="11" x2="14" y2="11" /></svg>
            <span style={{ fontSize: '15px', color: '#666' }}>ไม่พบสินค้าที่ตรงกับเงื่อนไขราคาหรือตัวกรองของคุณ</span>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
            {filteredProducts.map(product => {
              const defaultVariant = product.variants && product.variants.length > 0 ? product.variants[0] : null;
              const actualPrice = defaultVariant 
                ? (defaultVariant.promoPrice || defaultVariant.price) 
                : (product.promoPrice || product.price || 0);
              
              const originalPrice = defaultVariant ? defaultVariant.price : (product.price || 0);
              const hasPromo = defaultVariant ? !!defaultVariant.promoPrice : !!product.promoPrice;

              return (
                <div key={product.id} onClick={() => setSelectedProduct(product)} style={{ backgroundColor: '#fff', border: '1px solid #eee', padding: '15px', borderRadius: '8px', cursor: 'pointer', boxShadow: '0 2px 10px rgba(0,0,0,0.03)', transition: 'transform 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                  <div style={{ height: '180px', marginBottom: '15px', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
                    <img src={product.img} alt={product.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} onError={(e) => { e.target.src = 'https://via.placeholder.com/180x180?text=No+Image'; }} />
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', height: '40px', overflow: 'hidden', color: '#333', fontFamily: theme.fontFamily }}>{product.name}</div>
                  
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'baseline' }}>
                    <div style={{ fontSize: '15px', color: theme.primary, fontWeight: 'bold', fontFamily: theme.fontFamily }}>
                      ฿{actualPrice.toLocaleString()}.-
                    </div>
                    {hasPromo && (
                      <span style={{ fontSize: '11px', color: '#999', textDecoration: 'line-through', fontFamily: theme.fontFamily }}>
                        ฿{originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}