import React, { useState } from 'react';

const theme = {
  primary: '#B00000',
  background: '#FAFAFA',
  accent: '#FFD129',
  fontFamily: "'Kanit', sans-serif"
};

// ข้อมูลจำลองของสินค้า
const mockProducts = [
  { 
    id: 1, 
    name: 'iPhone 17 Pro Max (256 GB)', 
    price: 44900, 
    img: '/images/iphon17pro.webp', 
    category: 'apple',
    specs: {
      screenSize: '6.9 นิ้ว',
      chipset: 'A19 Pro',
      cameraZoom: 'Optical 8x',
      batteryLife: '32 ชั่วโมงขึ้นไป (32 ชม.+)'
    }
  },
  { 
    id: 2, 
    name: 'iPhone 17', 
    price: 39000, 
    img: '/images/iphone17.webp', 
    category: 'apple',
    specs: {
      screenSize: '6.3 นิ้ว',
      chipset: 'A18',
      cameraZoom: 'Optical 2x',
      batteryLife: '26 ชั่วโมงขึ้นไป (26 ชม.+)'
    }
  },
  { id: 3, name: 'iPhone 16 Pro max', price: 32900, img: '/images/iPhone16promax.webp', category: 'apple' },
  { id: 4, name: 'iPhone 15 Pro', price: 35000, img: '/images/iphone16pro.jpg', category: 'apple' },
  { id: 5, name: 'Samsung Galaxy S26 Ultra', price: 46900, img: '/images/samsunggalaxys26.jpg', category: 'samsung' },
  { id: 6, name: 'Samsung Galaxy A56 5G', price: 15900, img: '/images/SamsungGalaxyA565G.jpg', category: 'samsung' },
  { id: 7, name: 'Vivo X200 Pro', price: 32990, img: '/images/VivoX200Pro.jpg', category: 'vivo' },
  { id: 8, name: 'Oppo Find X8 Pro', price: 34990, img: '/images/OppoFindX8Pro.jpeg', category: 'oppo' },
  { id: 9, name: 'Xiaomi 16 Ultra', price: 38990, img: '/images/Xiaomi16Ultra.webp', category: 'xiaomi' },
];

// แก้ไขสีพื้นหลังให้เห็นวงกลมสีขาวชัดเจนและเท่ากันทุกอัน
const categories = [
  { id: 'all', name: 'ทั้งหมด', color: '#ffffff', img: '/images/togetherdotai-mono.svg' },
  { id: 'apple', name: 'Apple', color: '#ffffff', img: '/images/apple-light.svg' },
  { id: 'samsung', name: 'Samsung', color: '#ffffff', img: '/images/samsung.svg' },
  { id: 'vivo', name: 'Vivo', color: '#ffffff', img: '/images/vivo.svg' },
  { id: 'oppo', name: 'Oppo', color: '#ffffff', img: '/images/oppo.svg' },
  { id: 'xiaomi', name: 'Xiaomi', color: '#ffffff', img: '/images/xiaomi.svg' },
];

export default function Products({ onAddToCart, cartCount = 0, onViewCart }) {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const handleClearFilter = () => {
    setMinPrice('');
    setMaxPrice('');
    setSearchTerm('');
    setSelectedCategory('all');
  };

  const filteredProducts = mockProducts.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesMinPrice = minPrice === '' || p.price >= Number(minPrice);
    const matchesMaxPrice = maxPrice === '' || p.price <= Number(maxPrice);

    return matchesSearch && matchesCategory && matchesMinPrice && matchesMaxPrice;
  });

  const Header = () => (
    <div style={{ backgroundColor: theme.primary, color: '#fff', padding: '15px 5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h1 
        style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', fontFamily: theme.fontFamily }} 
        onClick={() => { setSelectedProduct(null); handleClearFilter(); }}
      >
        <span style={{ color: '#ffffff', fontFamily: theme.fontFamily }}>PHONE</span>
        <span style={{ color: '#ffd700', fontFamily: theme.fontFamily }}>HUB</span>
      </h1>

      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', padding: '0 20px' }}>
        <input 
          type="text" 
          placeholder="ค้นหาสินค้าที่ต้องการ..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '100%', maxWidth: '400px', padding: '10px 15px', border: 'none', borderRadius: '4px', fontSize: '14px', fontFamily: theme.fontFamily }}
        />
      </div>

      <div style={{ display: 'flex', gap: '25px', fontSize: '16px', fontFamily: theme.fontFamily, alignItems: 'center' }}>
        <span style={{ cursor: 'pointer', fontFamily: theme.fontFamily }} onClick={() => { setSelectedProduct(null); handleClearFilter(); }}>หน้าแรก</span>
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
      </div>
    </div>
  );

  if (selectedProduct) {
    return (
      <div style={{ fontFamily: theme.fontFamily, backgroundColor: theme.background, minHeight: '100vh' }}>
        <Header />
        <div style={{ padding: '40px 5%', maxWidth: '1200px', margin: '0 auto' }}>
          <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px', cursor: 'pointer', fontFamily: theme.fontFamily }} onClick={() => setSelectedProduct(null)}>หน้าแรก &gt; {selectedProduct.name}</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', backgroundColor: '#fff', padding: '20px', borderRadius: '4px' }}>
            <div style={{ height: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
              <img src={selectedProduct.img} alt={selectedProduct.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
            </div>

            <div>
              <h2 style={{ fontSize: '24px', fontWeight: '600', margin: '0 0 10px 0', fontFamily: theme.fontFamily }}>{selectedProduct.name}</h2>
              <p style={{ fontSize: '20px', fontWeight: '600', color: theme.primary, margin: '0 0 20px 0', fontFamily: theme.fontFamily }}>ราคา: {selectedProduct.price.toLocaleString()} บาท</p>
              
              <div style={{ marginBottom: '20px' }}>
                <span style={{ fontSize: '14px', display: 'block', marginBottom: '8px', fontFamily: theme.fontFamily }}>ตัวเลือกสี:</span>
                <span style={{ display: 'inline-block', width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#555', marginRight: '8px' }}></span>
                <span style={{ display: 'inline-block', width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#0088cc', marginRight: '8px' }}></span>
                <span style={{ display: 'inline-block', width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#ffd700', marginRight: '8px' }}></span>
              </div>


              {selectedProduct.specs && (
                <div style={{ margin: '0 0 25px 0', padding: '15px', backgroundColor: '#ffffff', borderRadius: '6px', border: '1px solid #eee' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 20px', fontSize: '14px', color: '#333' }}>
                    <div><strong>หน้าจอ:</strong> {selectedProduct.specs.screenSize}</div>
                    <div><strong>ชิปประมวลผล:</strong> {selectedProduct.specs.chipset}</div>
                    <div><strong>การซูม:</strong> {selectedProduct.specs.cameraZoom}</div>
                    <div><strong>แบตเตอรี่:</strong> {selectedProduct.specs.batteryLife}</div>
                  </div>
                </div>
              )}

              <button 
                onClick={() => { onAddToCart(selectedProduct); alert('เพิ่มลงตะกร้าเรียบร้อย!'); }}
                style={{ backgroundColor: theme.primary, color: '#fff', border: 'none', padding: '12px 30px', fontSize: '16px', fontWeight: '600', borderRadius: '4px', cursor: 'pointer', fontFamily: theme.fontFamily }}
              >
                เพิ่มลงตะกร้า
              </button>
            </div>
          </div>
          <div style={{ marginTop: '30px', backgroundColor: '#fff', padding: '20px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '600', borderBottom: '1px solid #ddd', paddingBottom: '10px', fontFamily: theme.fontFamily }}>รายละเอียดสินค้าเพิ่มเติม</h3>
            <p style={{ fontSize: '14px', color: '#555', lineHeight: '1.6', fontFamily: theme.fontFamily }}>สมาร์ทโฟนประสิทธิภาพสูง กล้องคมชัด แบตเตอรี่อึดทนนาน รองรับการใช้งานทุกรูปแบบอย่างลื่นไหล</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: theme.fontFamily, backgroundColor: theme.background, minHeight: '100vh' }}>
      <Header />
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

      {/* หมวดหมู่สินค้ายอดนิยม */}
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
              {/* ปรับขนาดบล็อกวงกลมให้คงที่ที่ 60px เท่ากันทุกลูก */}
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
                  style={{ 
                    width: '80%', 
                    height: '80%', 
                    objectFit: 'contain' 
                  }} 
                  onError={(e) => { 
                    e.target.style.display = 'none';
                    if (e.target.nextSibling) {
                      e.target.nextSibling.style.display = 'block';
                    }
                  }} 
                />
                <span style={{ 
                  display: 'none', 
                  fontWeight: 'bold', 
                  color: '#555', 
                  fontSize: '12px', 
                  fontFamily: theme.fontFamily 
                }}>
                  {cat.name.substring(0, 2).toUpperCase()}
                </span>
              </div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#333', fontFamily: theme.fontFamily }}>{cat.name}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ margin: '20px 5% 0 5%', padding: '16px 24px', backgroundColor: '#ffffff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', border: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
        <div style={{ fontSize: '15px', color: '#333', fontFamily: theme.fontFamily, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontWeight: 'bold', color: theme.primary }}>ตัวกรองสินค้า</span>
          <span style={{ color: '#888' }}>|</span>
          <span>หมวดหมู่: <strong style={{ color: '#000' }}>{categories.find(c => c.id === selectedCategory)?.name}</strong></span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '14px', color: '#555', fontFamily: theme.fontFamily }}>ช่วงราคา (บาท):</span>
          <input type="number" placeholder="ต่ำสุด" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} style={{ width: '100px', padding: '8px 12px', border: '1px solid #ccc', borderRadius: '6px', fontSize: '14px', fontFamily: theme.fontFamily, outline: 'none' }} />
          <span style={{ color: '#ccc' }}>—</span>
          <input type="number" placeholder="สูงสุด" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} style={{ width: '100px', padding: '8px 12px', border: '1px solid #ccc', borderRadius: '6px', fontSize: '14px', fontFamily: theme.fontFamily, outline: 'none' }} />
          {(minPrice || maxPrice || selectedCategory !== 'all' || searchTerm) && (
            <button onClick={handleClearFilter} style={{ padding: '8px 14px', backgroundColor: '#f5f5f5', color: '#666', border: '1px solid #ddd', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '500', fontFamily: theme.fontFamily, transition: 'all 0.2s' }}>ล้างตัวกรอง</button>
          )}
        </div>
      </div>

      <div style={{ padding: '20px 5% 40px 5%' }}>
        <h2 style={{ fontSize: '22px', fontWeight: '600', marginBottom: '20px', fontFamily: theme.fontFamily }}>สินค้าทั้งหมด</h2>
        {filteredProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px 20px', color: '#666', backgroundColor: '#fff', borderRadius: '8px', border: '1px dashed #ccc', fontFamily: theme.fontFamily, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="8" y1="11" x2="14" y2="11" /></svg>
            <span style={{ fontSize: '15px', color: '#666' }}>ไม่พบสินค้าที่ตรงกับเงื่อนไขราคาหรือตัวกรองของคุณ</span>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
            {filteredProducts.map(product => (
              <div key={product.id} onClick={() => setSelectedProduct(product)} style={{ backgroundColor: '#fff', border: '1px solid #eee', padding: '15px', borderRadius: '8px', cursor: 'pointer', boxShadow: '0 2px 10px rgba(0,0,0,0.03)', transition: 'transform 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                <div style={{ height: '180px', marginBottom: '15px', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
                  <img src={product.img} alt={product.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} onError={(e) => { e.target.src = 'https://via.placeholder.com/180x180?text=No+Image'; }} />
                </div>
                <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', height: '40px', overflow: 'hidden', color: '#333', fontFamily: theme.fontFamily }}>{product.name}</div>
                <div style={{ fontSize: '15px', color: theme.primary, fontWeight: 'bold', fontFamily: theme.fontFamily }}>ราคา {product.price.toLocaleString()}.-</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}